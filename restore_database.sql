-- Database Restore Script
-- This script recreates all tables and data that were accidentally deleted
-- Run this in your Supabase SQL editor

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 3: Create utility function for generating UUIDs
CREATE OR REPLACE FUNCTION gen_random_uuid()
RETURNS uuid AS $$
BEGIN
    RETURN uuid_generate_v4();
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'custom')),
  automations_used integer DEFAULT 0,
  automations_limit integer DEFAULT 2,
  ai_messages_used integer DEFAULT 0,
  ai_messages_limit integer DEFAULT 0,
  current_month_automations_used integer DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,
  monthly_automations_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Step 5: Create automation_requests table
CREATE TABLE IF NOT EXISTS automation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  automation_type text NOT NULL,
  complexity text DEFAULT 'simple' CHECK (complexity IN ('simple', 'medium', 'complex')),
  estimated_hours integer DEFAULT 1,
  budget_range text DEFAULT 'under_500' CHECK (budget_range IN ('under_500', '500_1000', '1000_2000', 'over_2000')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  deadline date,
  additional_requirements text,
  contact_preference text DEFAULT 'email' CHECK (contact_preference IN ('email', 'phone', 'meeting')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 6: Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  featured_image_url text,
  tags text[],
  meta_description text,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 7: Create automation_usage_logs table
CREATE TABLE IF NOT EXISTS automation_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  automation_id text NOT NULL,
  action text NOT NULL,
  details jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Step 8: Create ai_message_logs table
CREATE TABLE IF NOT EXISTS ai_message_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text,
  tokens_used integer DEFAULT 0,
  model_used text DEFAULT 'gpt-3.5-turbo',
  timestamp timestamptz DEFAULT now()
);

-- Step 9: Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE,
  plan text NOT NULL CHECK (plan IN ('free', 'pro', 'custom')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 10: Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Step 11: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_plan ON user_profiles(plan);

CREATE INDEX IF NOT EXISTS idx_automation_requests_user_id ON automation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_requests_status ON automation_requests(status);
CREATE INDEX IF NOT EXISTS idx_automation_requests_created_at ON automation_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

CREATE INDEX IF NOT EXISTS idx_automation_usage_logs_user_id ON automation_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_usage_logs_timestamp ON automation_usage_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_ai_message_logs_user_id ON ai_message_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_message_logs_timestamp ON ai_message_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- Step 12: Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_requests_updated_at
  BEFORE UPDATE ON automation_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 13: Create RPC functions
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
    COUNT(*)::bigint as total_users,
    COUNT(CASE WHEN plan = 'free' THEN 1 END)::bigint as free_users,
    COUNT(CASE WHEN plan = 'pro' THEN 1 END)::bigint as pro_users,
    COUNT(CASE WHEN automations_used > 0 THEN 1 END)::bigint as total_automations,
    COUNT(CASE WHEN ai_messages_used > 0 THEN 1 END)::bigint as total_ai_messages
  FROM user_profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 14: Insert sample data (optional)
INSERT INTO blog_posts (title, slug, content, excerpt, status, published_at, tags, meta_description) VALUES
('Welcome to LLUVIA AI', 'welcome-to-lluvia-ai', 'Welcome to the future of automation...', 'Discover how LLUVIA AI is revolutionizing business automation', 'published', now(), ARRAY['automation', 'ai', 'business'], 'Learn about LLUVIA AI automation platform'),
('Getting Started with Automation', 'getting-started-automation', 'Automation can seem overwhelming at first...', 'A beginner guide to business automation', 'published', now(), ARRAY['automation', 'beginners', 'guide'], 'Start your automation journey with this comprehensive guide');

-- Step 15: Verify tables were created
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database restore completed successfully! All tables have been recreated.';
END $$;
