import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface Admin {
  id: string;
  username: string;
  role: string;
}

interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  adminLogin: (username: string, password: string) => Promise<void>;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const adminLogin = async (username: string, password: string) => {
    setLoading(true);
    
    try {
      // Secure admin credentials check
      // In production, these should be environment variables or from database
      const validCredentials = [
        { username: 'admin', password: 'SecureAdmin2025!' },
        { username: 'superadmin', password: 'SuperSecure2025!' }
      ];
      
      const isValidAdmin = validCredentials.some(
        cred => cred.username === username && cred.password === password
      );
      
      if (isValidAdmin) {
        const adminData = {
          id: '1',
          username: username,
          role: 'admin'
        };
        setAdmin(adminData);
        navigate('/admin');
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = () => {
    setAdmin(null);
    navigate('/admin');
  };

  return (
    <AdminContext.Provider value={{ admin, loading, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};