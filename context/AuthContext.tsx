import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check initial session
    authService.getCurrentUser().then(userData => {
        setUser(userData);
        setLoading(false);
    });

    // 2. Listen for changes (Supabase specific)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
            setUser({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata.full_name || 'User',
                joinedAt: new Date(session.user.created_at).getTime()
            });
        } else {
            setUser(null);
        }
        setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    // State update is handled by onAuthStateChange
    await authService.login(email, pass);
  };

  const signup = async (email: string, pass: string, name: string) => {
     // State update is handled by onAuthStateChange
    await authService.signup(email, pass, name);
  };

  const logout = () => {
    authService.logout();
    // State update is handled by onAuthStateChange
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};