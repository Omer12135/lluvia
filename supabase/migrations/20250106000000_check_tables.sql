/*
  # Check Tables Migration
  
  This migration checks if tables exist and their structure
*/

-- Check if user_profiles table exists
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name = 'user_profiles';

-- Check user_profiles table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Check RLS policies on user_profiles
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Check if we can insert into user_profiles (test)
INSERT INTO user_profiles (user_id, email, name, plan, automations_limit)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Test User',
  'free',
  2
) ON CONFLICT (user_id) DO NOTHING;

-- Show current user_profiles
SELECT 
  id,
  user_id,
  email,
  name,
  plan,
  created_at
FROM user_profiles 
ORDER BY created_at DESC 
LIMIT 5;
