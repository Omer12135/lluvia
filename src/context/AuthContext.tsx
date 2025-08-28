import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
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
  created_at: string;
  updated_at: string;
}

export interface SystemStats {
  totalUsers: number;
  activeAutomations: number;
  monthlyRevenue: number;
  systemUptime: number;
  freeUsers: number;
  proUsers: number;
  totalAutomations: number;
  totalAiMessages: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  users: UserProfile[];
  systemStats: SystemStats;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  activateUser: (userId: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    activeAutomations: 0,
    monthlyRevenue: 0,
    systemUptime: 99.9,
    freeUsers: 0,
    proUsers: 0,
    totalAutomations: 0,
    totalAiMessages: 0
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error; // Hata fırlat ki register fonksiyonunda yakalansın
      } else {
        setUserProfile(data);
        return data;
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      throw error; // Hata fırlat ki register fonksiyonunda yakalansın
    }
  };

  // Create user profile
  const createUserProfile = async (userId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
      plan: 'free',
          automations_limit: 2,
          ai_messages_limit: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  // Fetch all users (admin only)
  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
      } catch (error) {
      console.error('Error in fetchAllUsers:', error);
    }
  };

  // Fetch system stats
  const fetchSystemStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_statistics');
      
      if (error) {
        console.error('Error fetching system stats:', error);
      } else if (data && data.length > 0) {
        const stats = data[0];
        setSystemStats({
          totalUsers: Number(stats.total_users) || 0,
          activeAutomations: 0, // Will be calculated from automation_requests
          monthlyRevenue: 0, // Will be calculated from subscriptions
          systemUptime: 99.9,
          freeUsers: Number(stats.free_users) || 0,
          proUsers: Number(stats.pro_users) || 0,
          totalAutomations: Number(stats.total_automations) || 0,
          totalAiMessages: Number(stats.total_ai_messages) || 0
        });
      }
    } catch (error) {
      console.error('Error in fetchSystemStats:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };



  // Register function
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      console.log('Starting registration for:', email);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      console.log('Registration response:', { data, error });

      if (error) {
        console.error('Supabase registration error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User created successfully:', data.user);
        setUser(data.user);
        
        // Try to fetch user profile (trigger should create it)
        try {
          await fetchUserProfile(data.user.id);
        } catch (error) {
          console.log('Profile not found, creating manually...');
          // If profile doesn't exist, create it manually
          await createUserProfile(data.user.id);
        }
      } else {
        console.log('No user data returned');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userProfile.user_id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Update user (admin function)
  const updateUser = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(u => u.user_id === userId ? data : u));
      if (userProfile?.user_id === userId) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  // Delete user (admin function)
  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setUsers(prev => prev.filter(u => u.user_id !== userId));
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  };

  // Suspend user (admin function)
  const suspendUser = async (userId: string) => {
    await updateUser(userId, { plan: 'free' as const });
  };

  // Activate user (admin function)
  const activateUser = async (userId: string) => {
    await updateUser(userId, { plan: 'pro' as const });
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  // Load admin data when user is admin
  useEffect(() => {
    if (user && (user.email?.includes('@admin.lluvia.ai') || user.email === 'admin@lluvia.ai')) {
      fetchAllUsers();
      fetchSystemStats();
    }
  }, [user]);

  const value: AuthContextType = {
      user,
    userProfile,
      users,
      systemStats,
      loading,
      login,
      register,
      logout,
      resetPassword,
      updateUser,
      updateProfile,
      deleteUser,
      suspendUser,
      activateUser,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};