import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthUser } from '@project-template/shared';
import {
  fetchCurrentUser,
  refreshSession,
  logoutSession,
  redirectToLogin,
  redirectToRegister,
} from '../services/auth.js';

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (nextUrl?: string) => void;
  register: (nextUrl?: string) => void;
  logout: (options?: { redirect?: boolean }) => Promise<void>;
  refresh: () => Promise<boolean>;
  checkAuth: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  autoRedirect?: boolean;
}

export function AuthProvider({ children, autoRedirect = false }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async (): Promise<AuthUser | null> => {
    setIsLoading(true);

    try {
      let currentUser = await fetchCurrentUser();

      if (!currentUser) {
        const refreshed = await refreshSession();
        if (refreshed) {
          currentUser = await fetchCurrentUser();
        }
      }

      setUser(currentUser);

      if (!currentUser && autoRedirect) {
        redirectToLogin();
      }

      return currentUser;
    } finally {
      setIsLoading(false);
    }
  }, [autoRedirect]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((nextUrl?: string) => {
    redirectToLogin(nextUrl);
  }, []);

  const register = useCallback((nextUrl?: string) => {
    redirectToRegister(nextUrl);
  }, []);

  const logout = useCallback(async (options: { redirect?: boolean } = { redirect: true }) => {
    setIsLoading(true);
    try {
      await logoutSession();
      setUser(null);
      if (options.redirect) {
        redirectToLogin();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async (): Promise<boolean> => {
    const success = await refreshSession();
    if (success) {
      const updatedUser = await fetchCurrentUser();
      setUser(updatedUser);
    }
    return success;
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refresh,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
