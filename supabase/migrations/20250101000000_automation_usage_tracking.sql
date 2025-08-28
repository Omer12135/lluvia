/*
  # Add automation usage tracking system

  This migration adds:
  1. automation_requests table for storing automation requests
  2. Monthly usage tracking for automations
  3. Reset functionality for Free plan (monthly reset)
  4. Pro plan tracking (monthly limit with rollover)
  5. Usage history table
*/

-- Create automation_requests table
CREATE TABLE IF NOT EXISTS automation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  automation_name text NOT NULL,
  automation_description text NOT NULL,
  webhook_payload jsonb,
  webhook_response jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  n8n_execution_id text
);

-- Enable RLS on automation_requests table
ALTER TABLE automation_requests ENABLE ROW LEVEL SECURITY;

-- Policies for automation_requests
CREATE POLICY "Users can view own automation requests"
  ON automation_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own automation requests"
  ON automation_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own automation requests"
  ON automation_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admin can view all automation requests"
  ON automation_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%@admin.lluvia.ai' OR auth.users.email = 'admin@lluvia.ai')
    )
  );

-- Create indexes for automation_requests
CREATE INDEX IF NOT EXISTS idx_automation_requests_user_id ON automation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_requests_status ON automation_requests(status);
CREATE INDEX IF NOT EXISTS idx_automation_requests_created_at ON automation_requests(created_at);

-- Create trigger for updated_at on automation_requests
DROP TRIGGER IF EXISTS update_automation_requests_updated_at ON automation_requests;
CREATE TRIGGER update_automation_requests_updated_at
    BEFORE UPDATE ON automation_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add monthly usage tracking columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS current_month_automations_used integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reset_date date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS monthly_automations_used integer DEFAULT 0;

-- Create automation_usage_history table
CREATE TABLE IF NOT EXISTS automation_usage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year text NOT NULL, -- Format: 'YYYY-MM'
  automations_used integer DEFAULT 0,
  automations_limit integer NOT NULL,
  plan_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Enable RLS on new table
ALTER TABLE automation_usage_history ENABLE ROW LEVEL SECURITY;

-- Policies for automation_usage_history
CREATE POLICY "Users can view own usage history"
  ON automation_usage_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage history"
  ON automation_usage_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage history"
  ON automation_usage_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admin can view all usage history"
  ON automation_usage_history
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%@admin.lluvia.ai' OR auth.users.email = 'admin@lluvia.ai')
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_automation_usage_history_user_id ON automation_usage_history(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_usage_history_month_year ON automation_usage_history(month_year);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_automation_usage_history_updated_at ON automation_usage_history;
CREATE TRIGGER update_automation_usage_history_updated_at
    BEFORE UPDATE ON automation_usage_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to check and reset monthly usage for Free plan
CREATE OR REPLACE FUNCTION check_and_reset_monthly_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if it's a new month for Free plan users
  IF NEW.plan = 'free' AND (
    NEW.last_reset_date IS NULL OR 
    DATE_TRUNC('month', NEW.last_reset_date) < DATE_TRUNC('month', CURRENT_DATE)
  ) THEN
    -- Reset monthly usage for Free plan
    NEW.current_month_automations_used := 0;
    NEW.last_reset_date := CURRENT_DATE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic monthly reset
DROP TRIGGER IF EXISTS trigger_check_and_reset_monthly_usage ON user_profiles;
CREATE TRIGGER trigger_check_and_reset_monthly_usage
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION check_and_reset_monthly_usage();

-- Function to increment automation usage
CREATE OR REPLACE FUNCTION increment_automation_usage(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
  user_plan text;
  current_usage integer;
  usage_limit integer;
  current_month text;
BEGIN
  -- Get user plan and current usage
  SELECT plan, current_month_automations_used, automations_limit 
  INTO user_plan, current_usage, usage_limit
  FROM user_profiles 
  WHERE user_id = user_uuid;
  
  -- Check if user exists
  IF user_plan IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user has reached limit
  IF user_plan = 'free' THEN
    -- Free plan: check monthly limit
    IF current_usage >= usage_limit THEN
      RETURN false;
    END IF;
  ELSIF user_plan = 'pro' THEN
    -- Pro plan: check monthly limit
    IF current_usage >= usage_limit THEN
      RETURN false;
    END IF;
  END IF;
  
  -- Increment usage
  UPDATE user_profiles 
  SET 
    current_month_automations_used = current_month_automations_used + 1,
    automations_used = automations_used + 1
  WHERE user_id = user_uuid;
  
  -- Update usage history
  current_month := TO_CHAR(CURRENT_DATE, 'YYYY-MM');
  
  INSERT INTO automation_usage_history (user_id, month_year, automations_used, automations_limit, plan_type)
  VALUES (user_uuid, current_month, 1, usage_limit, user_plan)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET 
    automations_used = automation_usage_history.automations_used + 1,
    updated_at = now();
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to get remaining automations for user
CREATE OR REPLACE FUNCTION get_remaining_automations(user_uuid uuid)
RETURNS integer AS $$
DECLARE
  user_plan text;
  current_usage integer;
  usage_limit integer;
BEGIN
  -- Get user plan and current usage
  SELECT plan, current_month_automations_used, automations_limit 
  INTO user_plan, current_usage, usage_limit
  FROM user_profiles 
  WHERE user_id = user_uuid;
  
  -- Check if user exists
  IF user_plan IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Return remaining automations
  RETURN GREATEST(0, usage_limit - current_usage);
END;
$$ LANGUAGE plpgsql;
