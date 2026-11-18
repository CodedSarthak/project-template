import { createContext } from 'react';
import type { AuthUser } from '@project-template/shared';

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authLoopDetected: boolean;
  error: string | null;
  login: (nextUrl?: string) => void;
  register: (nextUrl?: string) => void;
  logout: (options?: { redirect?: boolean }) => Promise<void>;
  refresh: () => Promise<boolean>;
  checkAuth: () => Promise<AuthUser | null>;
  clearAuthLoop: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
