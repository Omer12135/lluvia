/*
  # Basic Plan Support Migration

  This migration adds support for Basic Plan:
  - Updates plan constraints to include 'basic'
  - Updates functions to handle basic plan
  - Sets basic plan limits: 10 automations, 100 AI messages
*/

-- Update the CHECK constraint to allow 'basic' plan
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_plan_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_plan_check CHECK (plan IN ('free', 'basic', 'pro'));

-- Create function to upgrade user to basic plan
CREATE OR REPLACE FUNCTION upgrade_to_basic_plan(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    plan = 'basic',
    automations_limit = 10,
    ai_messages_limit = 100,
    updated_at = NOW()
  WHERE user_id = user_uuid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the upgrade_to_pro_plan function to handle all plan types
CREATE OR REPLACE FUNCTION upgrade_to_pro_plan(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    plan = 'pro',
    automations_limit = 50,
    ai_messages_limit = 1000,
    updated_at = NOW()
  WHERE user_id = user_uuid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the can_create_automation function to handle basic plan
CREATE OR REPLACE FUNCTION can_create_automation(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  current_usage INTEGER;
  automation_limit INTEGER;
BEGIN
  SELECT plan, automations_used, automations_limit
  INTO user_plan, current_usage, automation_limit
  FROM user_profiles
  WHERE user_id = user_uuid;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- For free plan, check monthly usage
  IF user_plan = 'free' THEN
    SELECT current_month_automations_used
    INTO current_usage
    FROM user_profiles
    WHERE user_id = user_uuid;
  END IF;
  
  RETURN current_usage < automation_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the increment_automation_usage function to handle basic plan
CREATE OR REPLACE FUNCTION increment_automation_usage(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  current_usage INTEGER;
  automation_limit INTEGER;
BEGIN
  SELECT plan, automations_used, automations_limit
  INTO user_plan, current_usage, automation_limit
  FROM user_profiles
  WHERE user_id = user_uuid;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user can create more automations
  IF NOT can_create_automation(user_uuid) THEN
    RETURN FALSE;
  END IF;
  
  -- Increment usage based on plan
  IF user_plan = 'free' THEN
    UPDATE user_profiles 
    SET 
      current_month_automations_used = current_month_automations_used + 1,
      monthly_automations_used = monthly_automations_used + 1,
      updated_at = NOW()
    WHERE user_id = user_uuid;
  ELSE
    -- For basic and pro plans, increment total usage
    UPDATE user_profiles 
    SET 
      automations_used = automations_used + 1,
      updated_at = NOW()
    WHERE user_id = user_uuid;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION upgrade_to_basic_plan(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION upgrade_to_pro_plan(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_create_automation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_automation_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reset_monthly_usage() TO service_role;
