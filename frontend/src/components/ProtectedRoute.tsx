import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext.js';

export interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login(redirectTo);
    }
  }, [isLoading, isAuthenticated, login, redirectTo]);

  if (isLoading || !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400" />
          <p className="text-sm font-medium text-slate-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
