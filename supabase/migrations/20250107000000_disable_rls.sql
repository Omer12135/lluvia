/*
  # Disable RLS Migration
  
  This migration temporarily disables RLS for testing purposes
*/

-- Disable RLS on user_profiles table
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- Test insert without RLS
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
