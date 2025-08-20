import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'pro';
  automationsUsed: number;
  automationsLimit: number;
  aiMessagesUsed: number;
  aiMessagesLimit: number;
  subscription?: {
    status: string;
    priceId: string;
    currentPeriodEnd: number;
  };
}

export interface SystemStats {
  totalUsers: number;
  activeAutomations: number;
  monthlyRevenue: number;
  systemUptime: number;
}

export interface AuthContextType {
  user: User | null;
  users: User[];
  systemStats: SystemStats;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Demo users for testing
  const demoUsers: User[] = [
    {
      id: '1',
      email: 'demo@lluvia.ai',
      name: 'Demo User',
      plan: 'free',
      automationsUsed: 1,
      automationsLimit: 2,
      aiMessagesUsed: 0,
      aiMessagesLimit: 0
    },
    {
      id: '2',
      email: 'starter@lluvia.ai',
      name: 'Starter User',
      plan: 'starter',
      automationsUsed: 8,
      automationsLimit: 15,
      aiMessagesUsed: 45,
      aiMessagesLimit: 100
    },
    {
      id: '3',
      email: 'pro@lluvia.ai',
      name: 'Pro User',
      plan: 'pro',
      automationsUsed: 23,
      automationsLimit: 50,
      aiMessagesUsed: 234,
      aiMessagesLimit: 1000
    }
  ];

  // Mock system stats for demo
  const systemStats: SystemStats = {
    totalUsers: demoUsers.length,
    activeAutomations: demoUsers.reduce((sum, u) => sum + u.automationsUsed, 0),
    monthlyRevenue: demoUsers.filter(u => u.plan !== 'free').length * 50,
    systemUptime: 99.9
  };

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('lluvia_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setUsers(demoUsers);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('lluvia_user');
      }
    }
    setUsers(demoUsers);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find demo user or create new one
      let userData = demoUsers.find(u => u.email === email);
      
      if (!userData) {
        // Create new user for any email/password combination
        userData = {
          id: Date.now().toString(),
          email: email,
          name: email.split('@')[0],
          plan: 'free',
          automationsUsed: 0,
          automationsLimit: 2,
          aiMessagesUsed: 0,
          aiMessagesLimit: 0
        };
      }

      // Store user session
      localStorage.setItem('lluvia_user', JSON.stringify(userData));
      setUser(userData);
      
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user
      const userData: User = {
        id: Date.now().toString(),
        email: email,
        name: name,
        plan: 'free',
        automationsUsed: 0,
        automationsLimit: 2, // Free plan gets 2 automations
        aiMessagesUsed: 0,
        aiMessagesLimit: 0
      };
      // Store user session
      localStorage.setItem('lluvia_user', JSON.stringify(userData));
      setUser(userData);
      
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('lluvia_user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, systemStats, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};