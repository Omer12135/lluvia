import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session completed:', session.id);
  
  if (session.mode === 'subscription' && session.subscription) {
    await updateUserPlanFromSubscription(session.customer as string, session.subscription as string);
  } else if (session.mode === 'payment') {
    await updateUserPlanFromPayment(session);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription updated:', subscription.id);
  await updateUserPlanFromSubscription(subscription.customer as string, subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deleted:', subscription.id);
  
  // Downgrade user to free plan
  const { data: customerData } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('customer_id', subscription.customer)
    .single();

  if (customerData) {
    await supabase
      .from('user_profiles')
      .update({
        plan: 'free',
        automations_limit: 1,
        ai_messages_limit: 0,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', customerData.user_id);

    console.log(`User ${customerData.user_id} downgraded to free plan`);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment succeeded:', invoice.id);
  
  if (invoice.subscription) {
    await updateUserPlanFromSubscription(invoice.customer as string, invoice.subscription as string);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment failed:', invoice.id);
  
  // Handle failed payment - could send notification, suspend account, etc.
  const { data: customerData } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('customer_id', invoice.customer)
    .single();

  if (customerData) {
    // You could implement logic here to handle failed payments
    // For now, we'll just log it
    console.log(`Payment failed for user ${customerData.user_id}`);
  }
}

async function updateUserPlanFromSubscription(customerId: string, subscriptionId: string) {
  try {
    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Find user by customer ID
    const { data: customerData } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('customer_id', customerId)
      .single();

    if (!customerData) {
      console.error('Customer not found:', customerId);
      return;
    }

    let newPlan: 'free' | 'basic' | 'pro' = 'free';
    let automationsLimit = 1;
    let aiMessagesLimit = 0;

    // Determine plan based on subscription status and price
    if (subscription.status === 'active') {
      const priceId = subscription.items.data[0].price.id;
      
      // Pro plan price ID
      if (priceId === 'price_1Rs2mPK4TeoPEcnVVGOmeNcs') {
        newPlan = 'pro';
        automationsLimit = 50;
        aiMessagesLimit = 1000;
      }
    }

    // Update user profile
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        plan: newPlan,
        automations_limit: automationsLimit,
        ai_messages_limit: aiMessagesLimit,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', customerData.user_id);

    if (updateError) {
      console.error('Error updating user plan:', updateError);
      return;
    }

    // Update subscription data in our database
    await supabase
      .from('stripe_subscriptions')
      .upsert({
        customer_id: customerId,
        subscription_id: subscriptionId,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        status: subscription.status as any,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'customer_id'
      });

    console.log(`User ${customerData.user_id} plan updated to ${newPlan} with ${automationsLimit} automations limit`);
  } catch (error) {
    console.error('Error in updateUserPlanFromSubscription:', error);
  }
}

async function updateUserPlanFromPayment(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing payment session:', session.id);
    
    // First try to find user by customer ID
    let customerData = null;
    if (session.customer) {
      const { data } = await supabase
        .from('stripe_customers')
        .select('user_id')
        .eq('customer_id', session.customer)
        .single();
      customerData = data;
    }

    // If not found by customer ID, try to find by email
    if (!customerData && session.customer_email) {
      console.log('Customer not found by ID, trying to find by email:', session.customer_email);
      
      // Find user by email in user_profiles
      const { data: userData } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('email', session.customer_email)
        .single();
      
      if (userData) {
        customerData = { user_id: userData.user_id };
        console.log('Found user by email:', session.customer_email);
      }
    }

    if (!customerData) {
      console.error('Customer not found by ID or email:', session.customer, session.customer_email);
      return;
    }

    // Get line items to determine the plan
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;
    
    console.log('Payment session details:', {
      sessionId: session.id,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      priceId: priceId,
      url: session.url
    });

    let newPlan: 'free' | 'basic' | 'pro' = 'free';
    let automationsLimit = 1;
    let aiMessagesLimit = 0;

    // Determine plan based on price ID
    // Basic Plan - yeni product ID ile
    if (priceId === 'price_1QJ8XxK4TeoPEcnV1234567890' || 
        priceId === 'price_basic_plan' ||
        session.url?.includes('7sY4gAd6S2dE7DDb5qfEk03') ||
        session.amount_total === 100 || // $1.00 = 100 cents
        lineItems.data[0]?.price?.product === 'prod_T2eC5v6BDh4AFg') {
      newPlan = 'basic';
      automationsLimit = 10;
      aiMessagesLimit = 100;
      console.log('Basic Plan detected - amount:', session.amount_total, 'priceId:', priceId, 'productId:', lineItems.data[0]?.price?.product);
    } else if (priceId === 'price_1Rs2mPK4TeoPEcnVVGOmeNcs') {
      newPlan = 'pro';
      automationsLimit = 50;
      aiMessagesLimit = 1000;
    }

    // Update user profile
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        plan: newPlan,
        automations_limit: automationsLimit,
        ai_messages_limit: aiMessagesLimit,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', customerData.user_id);

    if (updateError) {
      console.error('Error updating user plan:', updateError);
      return;
    }

    console.log(`User ${customerData.user_id} plan updated to ${newPlan} with ${automationsLimit} automations limit`);
  } catch (error) {
    console.error('Error in updateUserPlanFromPayment:', error);
  }
}

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};
