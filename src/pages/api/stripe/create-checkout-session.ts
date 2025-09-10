import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { stripeProducts } from '../../stripe-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan = 'pro' } = req.body;

    // Get the Pro Plan product
    const proProduct = stripeProducts.find(p => p.name === 'Pro Plan');
    if (!proProduct) {
      return res.status(400).json({ error: 'Pro Plan not found' });
    }

    // Get user from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify user with Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user already has Pro Plan
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (profile?.plan === 'pro') {
      return res.status(400).json({ error: 'User already has Pro Plan' });
    }

    // Create or get Stripe customer
    let customerId;
    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.customer_id;
    } else {
      // Create new Stripe customer via Edge Function
      const { data: customerData, error: customerError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: proProduct.priceId,
          mode: 'subscription',
          success_url: `${req.headers.origin}/dashboard?upgrade=success`,
          cancel_url: `${req.headers.origin}/dashboard?upgrade=cancelled`
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (customerError) {
        console.error('Error creating customer:', customerError);
        return res.status(500).json({ error: 'Failed to create customer' });
      }

      return res.status(200).json({
        sessionId: customerData.sessionId,
        url: customerData.url
      });
    }

    // Create checkout session for existing customer
    const { data: sessionData, error: sessionError } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        price_id: proProduct.priceId,
        mode: 'subscription',
        success_url: `${req.headers.origin}/dashboard?upgrade=success`,
        cancel_url: `${req.headers.origin}/dashboard?upgrade=cancelled`
      },
      headers: {
        Authorization: `Bearer ${token}`
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
