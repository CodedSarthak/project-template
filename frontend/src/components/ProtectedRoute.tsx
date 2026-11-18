import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../context/useAuth.js';
import { Button } from './button.js';

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
  const { isAuthenticated, isLoading, authLoopDetected, error, login, clearAuthLoop, checkAuth } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !authLoopDetected && !error) {
      login(redirectTo);
    }
  }, [isLoading, isAuthenticated, authLoopDetected, error, login, redirectTo]);

  if (authLoopDetected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
        <div className="w-full max-w-md rounded-xl border border-rose-500/20 bg-slate-900/80 p-6 text-center shadow-2xl backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Authentication Loop Detected</h2>
          <p className="mt-2 text-sm text-slate-400">
            We noticed multiple rapid redirects without establishing an active session. Your browser
            may be blocking cross-subdomain cookies, or the session cookie domain is misconfigured.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                clearAuthLoop();
                login(redirectTo);
              }}
            >
              Retry Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
        <div className="w-full max-w-md rounded-xl border border-amber-500/20 bg-slate-900/80 p-6 text-center shadow-2xl backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Authentication Service Unreachable</h2>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                void checkAuth();
              }}
            >
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
