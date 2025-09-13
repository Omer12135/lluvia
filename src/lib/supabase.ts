import { createClient } from '@supabase/supabase-js';

// Supabase bağlantı bilgileri - .env dosyasından alınacak
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('Supabase Configuration:');
console.log('Raw URL from env:', import.meta.env.VITE_SUPABASE_URL);
console.log('Raw Key from env:', import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Processed URL:', supabaseUrl);
console.log('Processed Key exists:', !!supabaseAnonKey);
console.log('Processed Key length:', supabaseAnonKey?.length);
console.log('All env vars:', import.meta.env);

// Supabase client oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Auth persistence ayarları
    persistSession: true,
    storageKey: 'lluvia-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Yeni eklemeler:
    flowType: 'pkce',
    debug: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          name: string;
          plan: 'free' | 'pro' | 'custom';
          automations_used: number;
          automations_limit: number;
          ai_messages_used: number;
          ai_messages_limit: number;
          current_month_automations_used: number;
          last_reset_date: string;
          monthly_automations_used: number;
          phone?: string;
          country?: string;
          email_verified: boolean;
          two_factor_enabled: boolean;
          status: 'active' | 'suspended' | 'pending';
          auth_provider: 'email' | 'google' | 'github';
          avatar_url?: string;
          preferences?: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          name: string;
          plan?: 'free' | 'basic' | 'pro' | 'custom';
          automations_used?: number;
          automations_limit?: number;
          ai_messages_used?: number;
          ai_messages_limit?: number;
          current_month_automations_used?: number;
          last_reset_date?: string;
          monthly_automations_used?: number;
          phone?: string;
          country?: string;
          email_verified?: boolean;
          two_factor_enabled?: boolean;
          status?: 'active' | 'suspended' | 'pending';
          auth_provider?: 'email' | 'google' | 'github';
          avatar_url?: string;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          name?: string;
          plan?: 'free' | 'basic' | 'pro' | 'custom';
          automations_used?: number;
          automations_limit?: number;
          ai_messages_used?: number;
          ai_messages_limit?: number;
          current_month_automations_used?: number;
          last_reset_date?: string;
          monthly_automations_used?: number;
          phone?: string;
          country?: string;
          email_verified?: boolean;
          two_factor_enabled?: boolean;
          status?: 'active' | 'suspended' | 'pending';
          auth_provider?: 'email' | 'google' | 'github';
          avatar_url?: string;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
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
      automation_usage_history: {
        Row: {
          id: string;
          user_id: string;
          month_year: string;
          automations_used: number;
          automations_limit: number;
          plan_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          month_year: string;
          automations_used?: number;
          automations_limit: number;
          plan_type: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          month_year?: string;
          automations_used?: number;
          automations_limit?: number;
          plan_type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string;
          author_id: string;
          author_name: string;
          image_url?: string;
          category: string;
          tags: string[];
          status: 'draft' | 'published';
          read_time: number;
          views: number;
          likes: number;
          meta_title?: string;
          meta_description?: string;
          meta_keywords: string[];
          published_at?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string;
          content: string;
          excerpt?: string;
          author_id: string;
          author_name: string;
          image_url?: string;
          category: string;
          tags?: string[];
          status?: 'draft' | 'published';
          read_time?: number;
          views?: number;
          likes?: number;
          meta_title?: string;
          meta_description?: string;
          meta_keywords?: string[];
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          author_id?: string;
          author_name?: string;
          image_url?: string;
          category?: string;
          tags?: string[];
          status?: 'draft' | 'published';
          read_time?: number;
          views?: number;
          likes?: number;
          meta_title?: string;
          meta_description?: string;
          meta_keywords?: string[];
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Kullanıcı yönetimi fonksiyonları
export const userService = {
  // Tüm kullanıcıları getir
  async getAllUsers() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data;
  },

  // Kullanıcıyı ID ile getir
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }

    return data;
  },

  // Kullanıcıyı email ile getir
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }

    return data;
  },

  // Yeni kullanıcı oluştur
  async createUser(userData: Database['public']['Tables']['user_profiles']['Insert']) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  },

  // Kullanıcı güncelle
  async updateUser(userId: string, updates: Partial<Database['public']['Tables']['user_profiles']['Update']>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return data;
  },

  // Kullanıcı sil
  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    return true;
  },

  // Kullanıcı istatistiklerini getir
  async getUserStats() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('plan, status, auth_provider, email_verified, two_factor_enabled');

    if (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }

    const stats = {
      totalUsers: data.length,
      activeUsers: data.filter(u => u.status === 'active').length,
      suspendedUsers: data.filter(u => u.status === 'suspended').length,
      pendingUsers: data.filter(u => u.status === 'pending').length,
      freeUsers: data.filter(u => u.plan === 'free').length,
      proUsers: data.filter(u => u.plan === 'pro').length,
      customUsers: data.filter(u => u.plan === 'custom').length,
      emailUsers: data.filter(u => u.auth_provider === 'email').length,
      googleUsers: data.filter(u => u.auth_provider === 'google').length,
      githubUsers: data.filter(u => u.auth_provider === 'github').length,
      verifiedUsers: data.filter(u => u.email_verified).length,
      twoFactorUsers: data.filter(u => u.two_factor_enabled).length,
    };

    return stats;
  },

  // Kullanıcı kullanım verilerini getir
  async getUserUsage(userId: string) {
    const { data, error } = await supabase
      .from('automation_usage_history')
      .select('*')
      .eq('user_id', userId)
      .order('month_year', { ascending: false });

    if (error) {
      console.error('Error fetching user usage:', error);
      throw error;
    }

    return data;
  }
};

// Otomasyon yönetimi fonksiyonları
export const automationService = {
  // Kullanıcının otomasyonlarını getir
  async getUserAutomations(userId: string) {
    const { data, error } = await supabase
      .from('automation_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user automations:', error);
      throw error;
    }

    return data;
  },

  // Tüm otomasyonları getir (admin için)
  async getAllAutomations() {
    const { data, error } = await supabase
      .from('automation_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all automations:', error);
      throw error;
    }

    return data;
  },

  // Otomasyon oluştur
  async createAutomation(automationData: Database['public']['Tables']['automation_requests']['Insert']) {
    const { data, error } = await supabase
      .from('automation_requests')
      .insert(automationData)
      .select()
      .single();

    if (error) {
      console.error('Error creating automation:', error);
      throw error;
    }

    return data;
  },

  // Otomasyon güncelle
  async updateAutomation(automationId: string, updates: Partial<Database['public']['Tables']['automation_requests']['Update']>) {
    const { data, error } = await supabase
      .from('automation_requests')
      .update(updates)
      .eq('id', automationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating automation:', error);
      throw error;
    }

    return data;
  },

  // Otomasyon kullanımını artır
  async incrementAutomationUsage(userId: string) {
    const { data, error } = await supabase.rpc('increment_automation_usage', {
      user_uuid: userId
    });

    if (error) {
      console.error('Error incrementing automation usage:', error);
      throw error;
    }

    return data;
  },

  // Kalan otomasyon hakkını getir
  async getRemainingAutomations(userId: string) {
    const { data, error } = await supabase.rpc('get_remaining_automations', {
      user_uuid: userId
    });

    if (error) {
      console.error('Error getting remaining automations:', error);
      throw error;
    }

    return data;
  }
};

// Blog yönetimi fonksiyonları
export const blogService = {
  // Tüm blog yazılarını getir
  async getAllPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    return data;
  },

  // Yayınlanmış blog yazılarını getir
  async getPublishedPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching published posts:', error);
      throw error;
    }

    return data;
  },

  // Blog yazısı oluştur
  async createPost(postData: Database['public']['Tables']['blog_posts']['Insert']) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }

    return data;
  },

  // Blog yazısı güncelle
  async updatePost(postId: string, updates: Partial<Database['public']['Tables']['blog_posts']['Update']>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }

    return data;
  },

  // Blog yazısı sil
  async deletePost(postId: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }

    return true;
  }
};

// Session sync fonksiyonu - Email confirmation sonrası auth state'i güncellemek için
export const syncAuthSession = async () => {
  try {
    console.log('Syncing auth session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session sync error:', error);
      return null;
    }
    
    if (session) {
      console.log('Session synced successfully:', session.user.email);
      // Auth state change event'i tetikle
      await supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state change event triggered:', event);
      });
    }
    
    return session;
  } catch (error) {
    console.error('Session sync failed:', error);
    return null;
  }
};

// Email confirmation sonrası auth state'i güncellemek için
export const refreshAuthState = async () => {
  try {
    console.log('Refreshing auth state...');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth state refresh error:', error);
      return null;
    }
    
    if (user) {
      console.log('Auth state refreshed successfully:', user.email);
      // Session'ı yenile
      await supabase.auth.refreshSession();
    }
    
    return user;
  } catch (error) {
    console.error('Auth state refresh failed:', error);
    return null;
  }
};