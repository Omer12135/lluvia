/*
  # Pro Plan Automation Credits Migration

  This migration ensures that pro plan users get 50 automation credits:
  - Updates existing pro plan users to have 50 automation limit
  - Updates the trigger function to create pro plan users with 50 automations
  - Adds function to upgrade user to pro plan with 50 automations
*/

-- Update existing pro plan users to have 50 automation limit
UPDATE user_profiles 
SET automations_limit = 50, ai_messages_limit = 1000
WHERE plan = 'pro' AND automations_limit < 50;

-- Update the trigger function to create pro plan users with 50 automations
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, name, plan, automations_limit, ai_messages_limit)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'free',
    1,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to upgrade user to pro plan
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

-- Create function to check if user can create automation
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

-- Create function to increment automation usage
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
    UPDATE user_profiles 
    SET 
      automations_used = automations_used + 1,
      updated_at = NOW()
    WHERE user_id = user_uuid;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset monthly usage for free plan users
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    current_month_automations_used = 0,
    last_reset_date = NOW(),
    updated_at = NOW()
  WHERE plan = 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION upgrade_to_pro_plan(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_create_automation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_automation_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reset_monthly_usage() TO service_role;
