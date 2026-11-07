import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi, tokenStore } from '../services/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    const restore = async () => {
      if (!tokenStore.get()) return setLoading(false);
      try { setUser(await authApi.me()); } catch { logout(); } finally { setLoading(false); }
    };
    void restore();
    window.addEventListener('academix:unauthorized', logout);
    return () => window.removeEventListener('academix:unauthorized', logout);
  }, [logout]);

  const login = async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    tokenStore.set(result.access_token);
    setUser(result.user);
    return result.user;
  };

  const register = async (name: string, email: string, password: string) => {
    await authApi.register(name, email, password);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
