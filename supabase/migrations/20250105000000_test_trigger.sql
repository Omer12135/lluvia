/*
  # Test Trigger Migration
  
  This migration tests if the handle_new_user trigger is working correctly
*/

-- First, let's check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if the function exists
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check current auth.users
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Check current user_profiles
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

-- Check if there are users in auth.users but not in user_profiles
SELECT 
  au.id,
  au.email,
  au.created_at,
  CASE WHEN up.user_id IS NULL THEN 'MISSING PROFILE' ELSE 'HAS PROFILE' END as profile_status
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
ORDER BY au.created_at DESC;
