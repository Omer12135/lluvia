/*
  # Update Plan Limits Migration

  This migration updates the plan limits:
  - Free plan: 1 automation (was 2)
  - Pro plan: 50 automations (unchanged)
  - Removes custom plan support
*/

-- Update existing free plan users to have 1 automation limit
UPDATE user_profiles 
SET automations_limit = 1 
WHERE plan = 'free' AND automations_limit = 2;

-- Update any custom plan users to free plan with 1 automation limit
UPDATE user_profiles 
SET plan = 'free', automations_limit = 1 
WHERE plan = 'custom';

-- Update the CHECK constraint to only allow 'free' and 'pro' plans
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_plan_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_plan_check CHECK (plan IN ('free', 'pro'));

-- Update the default value for new users
ALTER TABLE user_profiles ALTER COLUMN automations_limit SET DEFAULT 1;

-- Update the trigger function to create users with 1 automation limit
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, name, plan, automations_limit)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'free',
    1
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
