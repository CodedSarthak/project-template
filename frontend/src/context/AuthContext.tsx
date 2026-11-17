import {
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
import {
  AuthContext,
  type AuthContextType,
} from './authContextCore.js';

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
    let isMounted = true;

    async function initAuth() {
      try {
        let currentUser = await fetchCurrentUser();

        if (!currentUser) {
          const refreshed = await refreshSession();
          if (refreshed) {
            currentUser = await fetchCurrentUser();
          }
        }

        if (isMounted) {
          setUser(currentUser);

          if (!currentUser && autoRedirect) {
            redirectToLogin();
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void initAuth();

    return () => {
      isMounted = false;
    };
  }, [autoRedirect]);

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
