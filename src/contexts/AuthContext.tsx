import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthUser } from '@/services/authService';
import { login as authLogin, getCurrentUser, logout as authLogout, hasPermission, storeToken } from '@/services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (resource: string, action: string) => boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authLogin(email, password);
      if (result) {
        setUser(result.user);
        storeToken(result.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    window.location.href = '/login';
  }, []);

  const checkPermission = useCallback((resource: string, action: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, resource, action);
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkPermission,
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
