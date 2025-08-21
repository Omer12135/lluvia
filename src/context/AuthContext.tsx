import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'custom';
  automationsUsed: number;
  automationsLimit: number;
  aiMessagesUsed: number;
  aiMessagesLimit: number;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  authProvider: 'email' | 'google' | 'github';
  phone?: string;
  country?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  status: 'active' | 'suspended' | 'pending';
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
  };
}

export interface SystemStats {
  totalUsers: number;
  activeAutomations: number;
  monthlyRevenue: number;
  systemUptime: number;
  googleUsers: number;
  emailUsers: number;
  verifiedUsers: number;
  twoFactorUsers: number;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  systemStats: SystemStats;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  verifyResetCode: (email: string, code: string, newPassword: string) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  suspendUser: (userId: string) => void;
  activateUser: (userId: string) => void;
  sendVerificationEmail: (email: string) => Promise<void>;
  enableTwoFactor: (userId: string) => Promise<void>;
  disableTwoFactor: (userId: string) => Promise<void>;
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

  // Enhanced demo users with more detailed information
  const demoUsers: User[] = [
    {
      id: '1',
      email: 'demo@lluvia.ai',
      name: 'Demo User',
      plan: 'free',
      automationsUsed: 1,
      automationsLimit: 2,
      aiMessagesUsed: 0,
      aiMessagesLimit: 0,
      createdAt: '2024-01-15T10:30:00Z',
      lastLogin: '2024-01-20T14:45:00Z',
      isActive: true,
      authProvider: 'email',
      phone: '+1 (555) 123-4567',
      country: 'United States',
      emailVerified: true,
      twoFactorEnabled: false,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      }
    },
    {
      id: '2',
      email: 'pro@lluvia.ai',
      name: 'Pro User',
      plan: 'pro',
      automationsUsed: 25,
      automationsLimit: 50,
      aiMessagesUsed: 200,
      aiMessagesLimit: 500,
      createdAt: '2024-01-10T09:15:00Z',
      lastLogin: '2024-01-21T16:20:00Z',
      isActive: true,
      authProvider: 'google',
      phone: '+44 20 7946 0958',
      country: 'United Kingdom',
      emailVerified: true,
      twoFactorEnabled: true,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      preferences: {
        theme: 'auto',
        notifications: true,
        language: 'en'
      }
    },
    {
      id: '3',
      email: 'pro@lluvia.ai',
      name: 'Pro User',
      plan: 'pro',
      automationsUsed: 23,
      automationsLimit: 50,
      aiMessagesUsed: 234,
      aiMessagesLimit: 1000,
      createdAt: '2024-01-05T11:00:00Z',
      lastLogin: '2024-01-22T08:30:00Z',
      isActive: true,
      authProvider: 'email',
      phone: '+49 30 12345678',
      country: 'Germany',
      emailVerified: true,
      twoFactorEnabled: true,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      preferences: {
        theme: 'light',
        notifications: false,
        language: 'de'
      }
    },
    {
      id: '4',
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      plan: 'pro',
      automationsUsed: 30,
      automationsLimit: 50,
      aiMessagesUsed: 300,
      aiMessagesLimit: 500,
      createdAt: '2024-01-18T13:45:00Z',
      lastLogin: '2024-01-21T19:15:00Z',
      isActive: true,
      authProvider: 'google',
      phone: '+1 (555) 987-6543',
      country: 'Canada',
      emailVerified: true,
      twoFactorEnabled: false,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      }
    },
    {
      id: '5',
      email: 'suspended@lluvia.ai',
      name: 'Suspended User',
      plan: 'free',
      automationsUsed: 0,
      automationsLimit: 2,
      aiMessagesUsed: 0,
      aiMessagesLimit: 0,
      createdAt: '2024-01-12T15:20:00Z',
      lastLogin: '2024-01-19T10:30:00Z',
      isActive: false,
      authProvider: 'email',
      phone: '+33 1 42 86 87 88',
      country: 'France',
      emailVerified: false,
      twoFactorEnabled: false,
      status: 'suspended',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'fr'
      }
    },
    {
      id: '6',
      email: 'pending@lluvia.ai',
      name: 'Pending User',
      plan: 'free',
      automationsUsed: 0,
      automationsLimit: 2,
      aiMessagesUsed: 0,
      aiMessagesLimit: 0,
      createdAt: '2024-01-22T20:10:00Z',
      lastLogin: '2024-01-22T20:10:00Z',
      isActive: false,
      authProvider: 'email',
      phone: '+81 3-1234-5678',
      country: 'Japan',
      emailVerified: false,
      twoFactorEnabled: false,
      status: 'pending',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      preferences: {
        theme: 'auto',
        notifications: true,
        language: 'ja'
      }
    },
    {
      id: '7',
      email: 'enterprise@lluvia.ai',
      name: 'Enterprise User',
      plan: 'custom',
      automationsUsed: 150,
      automationsLimit: -1, // Unlimited
      aiMessagesUsed: 2500,
      aiMessagesLimit: -1, // Unlimited
      createdAt: '2024-01-05T08:00:00Z',
      lastLogin: '2024-01-22T18:30:00Z',
      isActive: true,
      authProvider: 'email',
      phone: '+1 (555) 999-8888',
      country: 'United States',
      emailVerified: true,
      twoFactorEnabled: true,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      }
    }
  ];

  // Calculate system stats based on current users
  const calculateSystemStats = (currentUsers: User[]): SystemStats => {
    return {
      totalUsers: currentUsers.length,
      activeAutomations: currentUsers.reduce((sum, u) => sum + u.automationsUsed, 0),
      monthlyRevenue: currentUsers.filter(u => u.plan === 'pro').length * 39 + currentUsers.filter(u => u.plan === 'custom').length * 497,
      systemUptime: 99.9,
      googleUsers: currentUsers.filter(u => u.authProvider === 'google').length,
      emailUsers: currentUsers.filter(u => u.authProvider === 'email').length,
      verifiedUsers: currentUsers.filter(u => u.emailVerified).length,
      twoFactorUsers: currentUsers.filter(u => u.twoFactorEnabled).length
    };
  };

  const [systemStats, setSystemStats] = useState<SystemStats>(calculateSystemStats(demoUsers));

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('lluvia_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('lluvia_user');
      }
    }
    
    // Initialize with demo users
    setUsers(demoUsers);
  }, []);

  // Update system stats whenever users change
  useEffect(() => {
    setSystemStats(calculateSystemStats(users));
  }, [users]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = users.find(u => u.email === email);
      if (foundUser && foundUser.authProvider === 'email') {
        // Update last login
        const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
        setUser(updatedUser);
        localStorage.setItem('lluvia_user', JSON.stringify(updatedUser));
        
        // Update user in the list
        setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would handle Google OAuth flow
      const googleUser = users.find(u => u.authProvider === 'google');
      if (googleUser) {
        const updatedUser = { ...googleUser, lastLogin: new Date().toISOString() };
        setUser(updatedUser);
        localStorage.setItem('lluvia_user', JSON.stringify(updatedUser));
        
        // Update user in the list
        setUsers(prev => prev.map(u => u.id === googleUser.id ? updatedUser : u));
      } else {
        throw new Error('Google authentication failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser: User = {
        id: (users.length + 1).toString(),
        email,
        name,
        plan: 'free',
        automationsUsed: 0,
        automationsLimit: 2,
        aiMessagesUsed: 0,
        aiMessagesLimit: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        authProvider: 'email',
        emailVerified: false,
        twoFactorEnabled: false,
        status: 'pending',
        preferences: {
          theme: 'dark',
          notifications: true,
          language: 'en'
        }
      };
      
      // Add new user to the list
      setUsers(prev => [...prev, newUser]);
      
      // Set as current user
      setUser(newUser);
      localStorage.setItem('lluvia_user', JSON.stringify(newUser));
      
      console.log('New user registered:', newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lluvia_user');
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    
    try {
      // Simulate sending reset email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('User not found');
      }
      
      // In real implementation, send reset code to email
      console.log(`Reset code sent to ${email}`);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyResetCode = async (email: string, code: string, newPassword: string) => {
    setLoading(true);
    
    try {
      // Simulate code verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('User not found');
      }
      
      // In real implementation, verify code and update password
      console.log(`Password updated for ${email}`);
    } catch (error) {
      console.error('Code verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    
    // Update current user if it's the same user
    if (user?.id === userId) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
      localStorage.setItem('lluvia_user', JSON.stringify({ ...user, ...updates }));
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Logout if current user is deleted
    if (user?.id === userId) {
      logout();
    }
  };

  const suspendUser = (userId: string) => {
    updateUser(userId, { status: 'suspended', isActive: false });
  };

  const activateUser = (userId: string) => {
    updateUser(userId, { status: 'active', isActive: true });
  };

  const sendVerificationEmail = async (email: string) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Verification email error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const enableTwoFactor = async (userId: string) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(userId, { twoFactorEnabled: true });
    } catch (error) {
      console.error('Enable 2FA error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async (userId: string) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(userId, { twoFactorEnabled: false });
    } catch (error) {
      console.error('Disable 2FA error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      systemStats,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      resetPassword,
      verifyResetCode,
      updateUser,
      deleteUser,
      suspendUser,
      activateUser,
      sendVerificationEmail,
      enableTwoFactor,
      disableTwoFactor
    }}>
      {children}
    </AuthContext.Provider>
  );
};