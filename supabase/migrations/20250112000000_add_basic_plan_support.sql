-- Add support for 'basic' plan type in user_profiles table
-- This migration ensures the 'basic' plan type is properly supported

-- First, let's check if we need to update the plan enum or if it's already text
-- Since the existing schema uses text for plan field, we don't need to alter the type

-- Add a comment to document the plan types
COMMENT ON COLUMN user_profiles.plan IS 'User plan type: free, basic, pro, custom';

-- Update any existing 'custom' plans that should be 'basic' based on automations_limit
-- This is a data migration to ensure consistency
UPDATE user_profiles 
SET plan = 'basic' 
WHERE plan = 'custom' 
  AND automations_limit = 10 
  AND ai_messages_limit = 100;

-- Add an index on plan for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_plan ON user_profiles(plan);

-- Add an index on email for faster lookups during Stripe webhook processing
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Add an index on user_id for faster joins
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Ensure stripe_customers table has proper indexes
CREATE INDEX IF NOT EXISTS idx_stripe_customers_customer_id ON stripe_customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);

-- Ensure stripe_orders table has proper indexes
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_id ON stripe_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_checkout_session_id ON stripe_orders(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_status ON stripe_orders(status);

-- Ensure stripe_subscriptions table has proper indexes
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_id ON stripe_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_status ON stripe_subscriptions(status);
