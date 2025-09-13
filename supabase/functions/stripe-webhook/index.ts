import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // get the signature from the header
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    // get the raw body
    const body = await req.text();

    // verify the webhook signature
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  if (!('customer' in stripeData)) {
    return;
  }

  // for one time payments, we only listen for the checkout.session.completed event
  if (event.type === 'payment_intent.succeeded' && event.data.object.invoice === null) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
  } else {
    let isSubscription = true;

    if (event.type === 'checkout.session.completed') {
      const { mode } = stripeData as Stripe.Checkout.Session;

      isSubscription = mode === 'subscription';

      console.info(`Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout session`);
    }

    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;

    if (isSubscription) {
      console.info(`Starting subscription sync for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    } else if (mode === 'payment' && payment_status === 'paid') {
      try {
        // Extract the necessary information from the session
        const {
          id: checkout_session_id,
          payment_intent,
          amount_subtotal,
          amount_total,
          currency,
          customer_email,
        } = stripeData as Stripe.Checkout.Session;

        // Insert the order into the stripe_orders table
        const { error: orderError } = await supabase.from('stripe_orders').insert({
          checkout_session_id,
          payment_intent_id: payment_intent,
          customer_id: customerId,
          amount_subtotal,
          amount_total,
          currency,
          payment_status,
          status: 'completed', // assuming we want to mark it as completed since payment is successful
        });

        if (orderError) {
          console.error('Error inserting order:', orderError);
          return;
        }

        // Process email-based plan upgrade
        await processEmailBasedPlanUpgrade(customerId, customer_email, amount_total, checkout_session_id);

        console.info(`Successfully processed one-time payment for session: ${checkout_session_id}`);
      } catch (error) {
        console.error('Error processing one-time payment:', error);
      }
    }
  }
}

// based on the excellent https://github.com/t3dotgg/stripe-recommendations
async function syncCustomerFromStripe(customerId: string) {
  try {
    // fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    // TODO verify if needed
    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          subscription_status: 'not_started',
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }
    }

    // assumes that a customer can only have a single subscription
    const subscription = subscriptions.data[0];

    // store subscription state
    const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
      },
      {
        onConflict: 'customer_id',
      },
    );

    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }

    // Kullanıcının planını güncelle
    await updateUserPlanFromSubscription(customerId, subscription);
    
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}

// Email tabanlı plan yükseltme işlemi - Geliştirilmiş versiyon
async function processEmailBasedPlanUpgrade(customerId: string, customerEmail: string | null, amountTotal: number, checkoutSessionId: string) {
  try {
    console.log(`Processing email-based plan upgrade for customer: ${customerId}, email: ${customerEmail}, amount: ${amountTotal}`);

    if (!customerEmail) {
      console.error('No customer email provided for plan upgrade');
      return;
    }

    // Önce email ile mevcut kullanıcıyı bul
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('user_id, email, plan')
      .eq('email', customerEmail)
      .single();

    let userId: string;
    let isNewUser = false;

    if (userError || !userData) {
      console.log('User not found with email, creating new user:', customerEmail);
      
      // Kullanıcı bulunamadı, yeni kullanıcı oluştur
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true, // Email'i otomatik onayla
        user_metadata: {
          name: customerEmail.split('@')[0], // Email'den isim oluştur
          source: 'stripe_payment'
        }
      });

      if (authError || !authUser.user) {
        console.error('Error creating new user:', authError);
        return;
      }

      userId = authUser.user.id;
      isNewUser = true;
      console.log(`New user created with ID: ${userId} for email: ${customerEmail}`);
    } else {
      userId = userData.user_id;
      console.log(`Existing user found with ID: ${userId} for email: ${customerEmail}`);
    }

    // Plan belirleme - daha esnek fiyat kontrolü
    let newPlan: 'free' | 'basic' | 'pro' = 'free';
    let automationsLimit = 1;
    let aiMessagesLimit = 0;
    let priceId = '';

    // Fiyat kontrolü - daha geniş aralık
    if (amountTotal >= 50 && amountTotal <= 200) { // $0.50 - $2.00 (Basic Plan)
      newPlan = 'basic';
      automationsLimit = 10;
      aiMessagesLimit = 100;
      priceId = 'price_basic_plan';
      console.log('Basic Plan detected - amount:', amountTotal);
    } else if (amountTotal >= 3000 && amountTotal <= 5000) { // $30.00 - $50.00 (Pro Plan)
      newPlan = 'pro';
      automationsLimit = 50;
      aiMessagesLimit = 1000;
      priceId = 'price_1Rs2mPK4TeoPEcnVVGOmeNcs';
      console.log('Pro Plan detected - amount:', amountTotal);
    } else {
      console.log('Unknown plan amount, defaulting to basic plan:', amountTotal);
      // Bilinmeyen fiyat için varsayılan olarak basic plan ver
      newPlan = 'basic';
      automationsLimit = 10;
      aiMessagesLimit = 100;
      priceId = 'price_basic_plan';
    }

    // Kullanıcı profilini oluştur veya güncelle
    if (isNewUser) {
      // Yeni kullanıcı için profil oluştur
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email: customerEmail,
          name: customerEmail.split('@')[0],
          plan: newPlan,
          automations_limit: automationsLimit,
          ai_messages_limit: aiMessagesLimit,
          automations_used: 0,
          ai_messages_used: 0,
          status: 'active',
          auth_provider: 'email',
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return;
      }
    } else {
      // Mevcut kullanıcı için planı güncelle
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          plan: newPlan,
          automations_limit: automationsLimit,
          ai_messages_limit: aiMessagesLimit,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating user plan:', updateError);
        return;
      }
    }

    // Stripe customer kaydını oluştur veya güncelle
    await supabase
      .from('stripe_customers')
      .upsert({
        user_id: userId,
        customer_id: customerId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    // Stripe subscription kaydını oluştur veya güncelle
    const subscriptionData = {
      customer_id: customerId,
      subscription_id: null, // One-time payment için subscription_id yok
      price_id: priceId,
      current_period_start: Math.floor(Date.now() / 1000), // Şu anki zaman
      current_period_end: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 yıl sonra
      cancel_at_period_end: false,
      payment_method_brand: null,
      payment_method_last4: null,
      status: 'active' as any, // One-time payment için active status
      updated_at: new Date().toISOString()
    };

    await supabase
      .from('stripe_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'customer_id'
      });

    console.log(`${isNewUser ? 'New user' : 'User'} ${userId} (${customerEmail}) plan ${isNewUser ? 'set to' : 'upgraded to'} ${newPlan} with ${automationsLimit} automations limit via email-based payment`);
    console.log(`Subscription record created for customer ${customerId} with status: active`);
    
    // Başarılı işlem log'u
    console.log(`✅ Stripe payment processed successfully:
      - Customer ID: ${customerId}
      - Email: ${customerEmail}
      - Amount: ${amountTotal} cents
      - Plan: ${newPlan}
      - User ID: ${userId}
      - New User: ${isNewUser}
      - Session ID: ${checkoutSessionId}`);
      
  } catch (error) {
    console.error('Error in processEmailBasedPlanUpgrade:', error);
  }
}

// Kullanıcının planını subscription durumuna göre güncelle
async function updateUserPlanFromSubscription(customerId: string, subscription: Stripe.Subscription) {
  try {
    // Customer ID'den user_id'yi bul
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('customer_id', customerId)
      .single();

    if (customerError || !customerData) {
      console.error('Error finding user for customer:', customerError);
      return;
    }

    const userId = customerData.user_id;
    let newPlan: 'free' | 'basic' | 'pro' = 'free';
    let automationsLimit = 1; // Free plan default
    let aiMessagesLimit = 0; // Free plan default

    // Subscription durumuna göre plan belirle
    if (subscription.status === 'active') {
      const priceId = subscription.items.data[0].price.id;
      
      // Pro plan price ID'si
      if (priceId === 'price_1Rs2mPK4TeoPEcnVVGOmeNcs') {
        newPlan = 'pro';
        automationsLimit = 50;
        aiMessagesLimit = 1000;
      }
    }

    // Kullanıcı profilini güncelle
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        plan: newPlan,
        automations_limit: automationsLimit,
        ai_messages_limit: aiMessagesLimit,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user plan:', updateError);
      return;
    }

    // Stripe subscription tablosunu güncelle
    const subscriptionData = {
      customer_id: customerId,
      subscription_id: subscription.id,
      price_id: subscription.items.data[0].price.id,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      payment_method_brand: subscription.default_payment_method && typeof subscription.default_payment_method !== 'string' 
        ? subscription.default_payment_method.card?.brand ?? null 
        : null,
      payment_method_last4: subscription.default_payment_method && typeof subscription.default_payment_method !== 'string' 
        ? subscription.default_payment_method.card?.last4 ?? null 
        : null,
      status: subscription.status as any,
      updated_at: new Date().toISOString()
    };

    await supabase
      .from('stripe_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'customer_id'
      });

    console.log(`User ${userId} plan updated to ${newPlan} with ${automationsLimit} automations limit`);
    console.log(`Subscription record updated for customer ${customerId} with status: ${subscription.status}`);
  } catch (error) {
    console.error('Error in updateUserPlanFromSubscription:', error);
  }
}