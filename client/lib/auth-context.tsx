'use client';

import React, { createContext, useContext as _useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'helper' | 'admin';
  phone?: string;
  address?: string;
  profile_image?: string;
  is_verified: boolean;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; phone?: string; address?: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  verifyEmail: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => {
  return {
    user: null,
    loading: false,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    verifyEmail: async () => {},
    forgotPassword: async () => {},
    resetPassword: async () => {},
    refreshUser: async () => {},
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success) {
        setUser(response.data);
      } else {
        // Token invalid, logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      if (response.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', response.data.token);
        }
        setUser(response.data.user);

        // Redirect based on role
        const role = response.data.user.role;
        if (typeof window !== 'undefined') {
          if (role === 'admin') {
            window.location.href = '/admin/dashboard';
          } else if (role === 'helper') {
            window.location.href = '/helper/dashboard';
          } else {
            window.location.href = '/dashboard';
          }
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; name: string; phone?: string; address?: string; role?: string }) => {
    setLoading(true);
    try {
      const response = await authAPI.register(data);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      // Registration successful, user needs to verify email
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const response = await authAPI.verifyEmail({ email, otp });
      if (response.success) {
        // Verification successful, user can now login
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      setUser(null);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authAPI.forgotPassword({ email });
      if (!response.success) {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await authAPI.resetPassword({ token, password });
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};