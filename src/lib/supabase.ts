import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      automation_requests: {
        Row: {
          id: string;
          user_id: string;
          automation_name: string;
          automation_description: string;
          webhook_payload: any;
          webhook_response: any;
          status: 'pending' | 'sent' | 'completed' | 'failed';
          created_at: string;
          updated_at: string;
          n8n_execution_id?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          automation_name: string;
          automation_description: string;
          webhook_payload: any;
          webhook_response?: any;
          status?: 'pending' | 'sent' | 'completed' | 'failed';
          created_at?: string;
          updated_at?: string;
          n8n_execution_id?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          automation_name?: string;
          automation_description?: string;
          webhook_payload?: any;
          webhook_response?: any;
          status?: 'pending' | 'sent' | 'completed' | 'failed';
          created_at?: string;
          updated_at?: string;
          n8n_execution_id?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          name: string;
          plan: 'free' | 'starter' | 'pro';
          automations_used: number;
          automations_limit: number;
          ai_messages_used: number;
          ai_messages_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          name: string;
          plan?: 'free' | 'starter' | 'pro';
          automations_used?: number;
          automations_limit?: number;
          ai_messages_used?: number;
          ai_messages_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          name?: string;
          plan?: 'free' | 'starter' | 'pro';
          automations_used?: number;
          automations_limit?: number;
          ai_messages_used?: number;
          ai_messages_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}