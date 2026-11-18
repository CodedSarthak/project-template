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
  isAuthLoopDetected,
  clearAuthLoop,
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
  const [authLoopDetected, setAuthLoopDetected] = useState<boolean>(() => isAuthLoopDetected());
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async (signal?: AbortSignal): Promise<AuthUser | null> => {
    setIsLoading(true);

    try {
      let currentUser: AuthUser | null = null;
      try {
        currentUser = await fetchCurrentUser(signal);

        if (!currentUser) {
          const refreshed = await refreshSession(signal);
          if (refreshed) {
            currentUser = await fetchCurrentUser(signal);
          }
        }

        setError(null);
        setUser(currentUser);

        if (currentUser) {
          setAuthLoopDetected(false);
        } else if (autoRedirect) {
          const redirected = redirectToLogin();
          if (!redirected) {
            setAuthLoopDetected(true);
          }
        }
      } catch (err) {
        if (signal?.aborted) return null;
        // Network or server outage: do not force redirect; record error
        const errorMessage = err instanceof Error ? err.message : 'Unable to connect to auth service.';
        setError(errorMessage);
        console.warn('[Auth] Connection error verifying session:', errorMessage);
      }

      return currentUser;
    } finally {
      setIsLoading(false);
    }
  }, [autoRedirect]);

  useEffect(() => {
    const controller = new AbortController();

    void checkAuth(controller.signal);

    return () => {
      controller.abort();
    };
  }, [checkAuth]);

  const login = useCallback((nextUrl?: string) => {
    const redirected = redirectToLogin(nextUrl);
    if (!redirected) {
      setAuthLoopDetected(true);
    }
  }, []);

  const register = useCallback((nextUrl?: string) => {
    redirectToRegister(nextUrl);
  }, []);

  const handleClearAuthLoop = useCallback(() => {
    clearAuthLoop();
    setAuthLoopDetected(false);
  }, []);

  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  const logout = useCallback(async (options: { redirect?: boolean } = { redirect: true }) => {
    setIsLoading(true);
    try {
      await logoutSession();
      setUser(null);
      setError(null);
      handleClearAuthLoop();
      if (options.redirect) {
        redirectToLogin();
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleClearAuthLoop]);

  const refresh = useCallback(async (): Promise<boolean> => {
    try {
      const success = await refreshSession();
      if (success) {
        const updatedUser = await fetchCurrentUser();
        setUser(updatedUser);
        setError(null);
        setAuthLoopDetected(false);
      }
      return success;
    } catch {
      return false;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    authLoopDetected,
    error,
    login,
    register,
    logout,
    refresh,
    checkAuth,
    clearAuthLoop: handleClearAuthLoop,
    clearError: handleClearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
