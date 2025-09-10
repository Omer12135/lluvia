/*
  # User Profiles Setup Migration

  This migration creates:
  1. user_profiles table with comprehensive user data
  2. RLS policies for security
  3. Functions for user management
  4. Triggers for automatic profile creation
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  automations_used integer DEFAULT 0,
  automations_limit integer DEFAULT 1,
  ai_messages_used integer DEFAULT 0,
  ai_messages_limit integer DEFAULT 0,
  current_month_automations_used integer DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,
  monthly_automations_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles (using IF NOT EXISTS to avoid conflicts)
DO $$
BEGIN
  -- Users can view own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Users can update own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Users can insert own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON user_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Admin can view all user profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Admin can view all user profiles'
  ) THEN
    CREATE POLICY "Admin can view all user profiles"
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
  END IF;
END $$;

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_plan ON user_profiles(plan);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup (creates profile automatically)
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

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
  total_users bigint,
  free_users bigint,
  pro_users bigint,
  total_automations bigint,
  total_ai_messages bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE plan = 'free') as free_users,
    COUNT(*) FILTER (WHERE plan = 'pro') as pro_users,
    SUM(automations_used) as total_automations,
    SUM(ai_messages_used) as total_ai_messages
  FROM user_profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user plan limits
CREATE OR REPLACE FUNCTION update_user_plan_limits(
  user_uuid uuid,
  new_plan text CHECK (new_plan IN ('free', 'pro')),
  new_automations_limit integer,
  new_ai_messages_limit integer
)
RETURNS boolean AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    plan = new_plan,
    automations_limit = new_automations_limit,
    ai_messages_limit = new_ai_messages_limit,
    updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly usage for all users
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    current_month_automations_used = 0,
    last_reset_date = CURRENT_DATE,
    updated_at = now()
  WHERE plan = 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
