/*
  # Fix RLS Policies Migration
  
  This migration fixes the RLS policies that are blocking user profile creation
  during the signup process.
*/

-- First, let's check current RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all user profiles" ON user_profiles;

-- Create new, more permissive policies for signup process
-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to insert profiles (for trigger functions)
CREATE POLICY "Service role can insert profiles"
  ON user_profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to view all profiles
CREATE POLICY "Service role can view all profiles"
  ON user_profiles
  FOR SELECT
  TO service_role
  USING (true);

-- Allow service role to update profiles
CREATE POLICY "Service role can update profiles"
  ON user_profiles
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create a more robust trigger function for new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if profile already exists
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = NEW.id
  ) THEN
    -- Insert new profile with service role privileges
    INSERT INTO user_profiles (user_id, email, name, plan, automations_limit, ai_messages_limit)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      'free',
      2,
      0
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE LOG 'Error creating user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create a function to manually create user profile if needed
CREATE OR REPLACE FUNCTION create_user_profile_manually(
  user_uuid uuid,
  user_email text,
  user_name text DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  -- Check if profile already exists
  IF EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = user_uuid
  ) THEN
    RETURN true; -- Profile already exists
  END IF;
  
  -- Create profile with service role privileges
  INSERT INTO user_profiles (user_id, email, name, plan, automations_limit, ai_messages_limit)
  VALUES (
    user_uuid,
    user_email,
    COALESCE(user_name, split_part(user_email, '@', 1)),
    'free',
    2,
    0
  );
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error manually creating user profile for user %: %', user_uuid, SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON user_profiles TO anon, authenticated;
GRANT ALL ON user_profiles TO service_role;

-- Verify the setup
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;
