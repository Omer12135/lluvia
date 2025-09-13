import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { stripeProducts } from '../../stripe-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan = 'basic', email, priceId, successUrl, cancelUrl } = req.body;

    // Email validation
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get the product based on plan
    let product;
    if (plan === 'basic') {
      product = stripeProducts.find(p => p.name === 'Basic Plan');
    } else {
      product = stripeProducts.find(p => p.name === 'Pro Plan');
    }
    
    if (!product) {
      return res.status(400).json({ error: `${plan} Plan not found` });
    }

    // Check if email is already in use by another user
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('user_id, plan')
      .eq('email', email)
      .single();

    if (existingUser && existingUser.plan === plan) {
      return res.status(400).json({ error: `Bu email adresi zaten ${plan} planına sahip` });
    }

    // Create Stripe checkout session via Edge Function
    const { data: sessionData, error: sessionError } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        price_id: priceId || product.priceId,
        mode: product.mode,
        customer_email: email,
        success_url: successUrl || `${req.headers.origin}/success?plan=${plan}&email=${encodeURIComponent(email)}`,
        cancel_url: cancelUrl || `${req.headers.origin}/pricing?cancelled=true`
      }
    });

    if (sessionError) {
      console.error('Error creating checkout session:', sessionError);
      return res.status(500).json({ error: 'Failed to create checkout session' });
    }

    return res.status(200).json({
      sessionId: sessionData.sessionId,
      url: sessionData.url
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
