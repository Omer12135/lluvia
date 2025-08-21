/*
  # Create automation requests and user profiles tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text)
      - `name` (text)
      - `plan` (text, default 'free')
      - `automations_used` (integer, default 0)
      - `automations_limit` (integer, default 2)
      - `ai_messages_used` (integer, default 0)
      - `ai_messages_limit` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `automation_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `automation_name` (text)
      - `automation_description` (text)
      - `webhook_payload` (jsonb)
      - `webhook_response` (jsonb)
      - `status` (text, default 'pending')
      - `n8n_execution_id` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for admin access to all data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  automations_used integer DEFAULT 0,
  automations_limit integer DEFAULT 2,
  ai_messages_used integer DEFAULT 0,
  ai_messages_limit integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create automation_requests table
CREATE TABLE IF NOT EXISTS automation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  automation_name text NOT NULL,
  automation_description text NOT NULL,
  webhook_payload jsonb NOT NULL,
  webhook_response jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'completed', 'failed')),
  n8n_execution_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_requests ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

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

-- Admin policies (assuming admin users have a specific role or are identified differently)
-- For now, we'll use a simple approach where certain email domains have admin access
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_automation_requests_user_id ON automation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_requests_status ON automation_requests(status);
CREATE INDEX IF NOT EXISTS idx_automation_requests_created_at ON automation_requests(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_automation_requests_updated_at ON automation_requests;
CREATE TRIGGER update_automation_requests_updated_at
    BEFORE UPDATE ON automation_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();