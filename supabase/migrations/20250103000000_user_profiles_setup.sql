/*
  # User Profiles Setup Migration

  This migration creates:
  1. user_profiles table with comprehensive user data
  2. RLS policies for secure access
  3. Helper functions for user management
  4. Indexes for better performance
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email text NOT NULL,
  name text NOT NULL,
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'custom')),
  automations_used integer DEFAULT 0,
  automations_limit integer DEFAULT 1,
  ai_messages_used integer DEFAULT 0,
  ai_messages_limit integer DEFAULT 0,
  current_month_automations_used integer DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,
  monthly_automations_used integer DEFAULT 0,
  phone text,
  country text,
  email_verified boolean DEFAULT false,
  two_factor_enabled boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'pending')),
  auth_provider text DEFAULT 'email' CHECK (auth_provider IN ('email', 'google', 'github')),
  avatar_url text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admin policies (for users with admin email domains)
CREATE POLICY "Admin can manage all user profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%@admin.lluvia.ai' OR auth.users.email = 'admin@lluvia.ai')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_plan ON user_profiles(plan);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_provider ON user_profiles(auth_provider);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_updated_at ON user_profiles(updated_at);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, name, auth_provider, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN NEW.raw_user_meta_data->>'provider' = 'google' THEN 'google'
      WHEN NEW.raw_user_meta_data->>'provider' = 'github' THEN 'github'
      ELSE 'email'
    END,
    'pending'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
  total_users bigint,
  active_users bigint,
  suspended_users bigint,
  pending_users bigint,
  free_users bigint,
  pro_users bigint,
  custom_users bigint,
  email_users bigint,
  google_users bigint,
  github_users bigint,
  verified_users bigint,
  two_factor_users bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE status = 'active') as active_users,
    COUNT(*) FILTER (WHERE status = 'suspended') as suspended_users,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_users,
    COUNT(*) FILTER (WHERE plan = 'free') as free_users,
    COUNT(*) FILTER (WHERE plan = 'pro') as pro_users,
    COUNT(*) FILTER (WHERE plan = 'custom') as custom_users,
    COUNT(*) FILTER (WHERE auth_provider = 'email') as email_users,
    COUNT(*) FILTER (WHERE auth_provider = 'google') as google_users,
    COUNT(*) FILTER (WHERE auth_provider = 'github') as github_users,
    COUNT(*) FILTER (WHERE email_verified = true) as verified_users,
    COUNT(*) FILTER (WHERE two_factor_enabled = true) as two_factor_users
  FROM user_profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user plan limits
CREATE OR REPLACE FUNCTION update_user_plan_limits(user_uuid uuid, new_plan text)
RETURNS boolean AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    plan = new_plan,
    automations_limit = CASE 
      WHEN new_plan = 'free' THEN 1
      WHEN new_plan = 'pro' THEN 50
      WHEN new_plan = 'custom' THEN -1
      ELSE automations_limit
    END,
    ai_messages_limit = CASE 
      WHEN new_plan = 'free' THEN 0
      WHEN new_plan = 'pro' THEN 500
      WHEN new_plan = 'custom' THEN -1
      ELSE ai_messages_limit
    END,
    updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly usage for free users
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    current_month_automations_used = 0,
    last_reset_date = CURRENT_DATE
  WHERE plan = 'free' 
    AND (last_reset_date IS NULL OR DATE_TRUNC('month', last_reset_date) < DATE_TRUNC('month', CURRENT_DATE));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample users for testing
INSERT INTO user_profiles (user_id, email, name, plan, status, auth_provider, email_verified, automations_used, automations_limit, created_at) VALUES
(
  gen_random_uuid(),
  'demo@lluvia.ai',
  'Demo User',
  'free',
  'active',
  'email',
  true,
  1,
  1,
  now() - interval '5 days'
),
(
  gen_random_uuid(),
  'pro@lluvia.ai',
  'Pro User',
  'pro',
  'active',
  'google',
  true,
  25,
  50,
  now() - interval '10 days'
),
(
  gen_random_uuid(),
  'enterprise@lluvia.ai',
  'Enterprise User',
  'custom',
  'active',
  'email',
  true,
  150,
  -1,
  now() - interval '15 days'
),
(
  gen_random_uuid(),
  'suspended@lluvia.ai',
  'Suspended User',
  'free',
  'suspended',
  'email',
  false,
  0,
  1,
  now() - interval '3 days'
),
(
  gen_random_uuid(),
  'pending@lluvia.ai',
  'Pending User',
  'free',
  'pending',
  'github',
  false,
  0,
  1,
  now() - interval '1 day'
);
