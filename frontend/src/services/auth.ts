import { AUTH_SERVICE_URL } from '../config/env.js';
import type { AuthUser } from '@project-template/shared';

let activeRefreshPromise: Promise<boolean> | null = null;

const REDIRECT_COUNT_KEY = 'auth_redirect_count';
const REDIRECT_TIMESTAMP_KEY = 'auth_redirect_timestamp';
const REDIRECT_LOOP_KEY = 'auth_loop_detected';

export function isAuthLoopDetected(): boolean {
  try {
    return sessionStorage.getItem(REDIRECT_LOOP_KEY) === 'true';
  } catch {
    return false;
  }
}

export function clearAuthLoop(): void {
  try {
    sessionStorage.removeItem(REDIRECT_COUNT_KEY);
    sessionStorage.removeItem(REDIRECT_TIMESTAMP_KEY);
    sessionStorage.removeItem(REDIRECT_LOOP_KEY);
  } catch {
    // Ignore storage issues
  }
}

export class AuthConnectionError extends Error {
  constructor(message = 'Unable to connect to authentication service. Please check your network or try again later.') {
    super(message);
    this.name = 'AuthConnectionError';
  }
}

export function sanitizeReturnUrl(url?: string): string {
  if (!url) return window.location.href;

  // Allow root-relative paths like "/dashboard" or "/settings" (block protocol-relative "//evil.com" or "/\\")
  if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
    return `${window.location.origin}${url}`;
  }

  try {
    const parsed = new URL(url);
    // Allow exact same-origin
    if (parsed.origin === window.location.origin) {
      return parsed.href;
    }

    // Allow subdomains sharing the same parent domain
    const currentHost = window.location.hostname;
    const parts = currentHost.split('.');
    if (parts.length >= 2) {
      const parentDomain = parts.slice(-2).join('.');
      if (parsed.hostname === parentDomain || parsed.hostname.endsWith(`.${parentDomain}`)) {
        if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
          return parsed.href;
        }
      }
    }
  } catch {
    // Malformed URL, fall back to safe current page
  }

  return window.location.href;
}

export function buildLoginUrl(nextUrl?: string): string {
  const returnTarget = sanitizeReturnUrl(nextUrl);
  return `${AUTH_SERVICE_URL}/login?next=${encodeURIComponent(returnTarget)}`;
}

export function redirectToLogin(nextUrl?: string): boolean {
  try {
    const now = Date.now();
    const lastTimestamp = Number(sessionStorage.getItem(REDIRECT_TIMESTAMP_KEY) || '0');
    let count = Number(sessionStorage.getItem(REDIRECT_COUNT_KEY) || '0');

    // If another redirect attempt occurs within 15 seconds, increment counter
    if (now - lastTimestamp < 15000) {
      count += 1;
    } else {
      count = 1;
    }

    sessionStorage.setItem(REDIRECT_TIMESTAMP_KEY, String(now));
    sessionStorage.setItem(REDIRECT_COUNT_KEY, String(count));

    // Halt redirect if more than 2 redirects happen within 15 seconds without a session
    if (count > 2) {
      sessionStorage.setItem(REDIRECT_LOOP_KEY, 'true');
      console.error(
        '[Auth] Redirect loop detected. Halting redirection to prevent an infinite browser loop. Ensure cookies are permitted across subdomains.'
      );
      return false;
    }
  } catch {
    // If sessionStorage is restricted, proceed with standard navigation
  }

  window.location.href = buildLoginUrl(nextUrl);
  return true;
}

export function buildRegisterUrl(nextUrl?: string): string {
  const returnTarget = sanitizeReturnUrl(nextUrl);
  return `${AUTH_SERVICE_URL}/register?next=${encodeURIComponent(returnTarget)}`;
}

export function redirectToRegister(nextUrl?: string): void {
  window.location.href = buildRegisterUrl(nextUrl);
}

export async function fetchCurrentUser(signal?: AbortSignal): Promise<AuthUser | null> {
  let response: Response;
  try {
    response = await fetch(`${AUTH_SERVICE_URL}/api/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });
  } catch (err) {
    if (signal?.aborted) {
      return null;
    }
    // Network failure, DNS issue, or connection refused
    throw new AuthConnectionError();
  }

  if (response.status >= 500) {
    throw new AuthConnectionError(`Authentication service error (${response.status}).`);
  }

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const rawUser = data?.user || data?.data || data;

  if (!rawUser || !rawUser.id) {
    return null;
  }

  // Successfully verified user session — reset any redirect loop state
  clearAuthLoop();

  return {
    id: String(rawUser.id),
    email: String(rawUser.email || ''),
    name: rawUser.name ? String(rawUser.name) : undefined,
    createdAt: rawUser.createdAt ? String(rawUser.createdAt) : undefined,
  };
}


export async function refreshSession(signal?: AbortSignal): Promise<boolean> {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
        signal,
      });

      return response.ok;
    } catch {
      return false;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

export async function logoutSession(): Promise<void> {
  try {
    await fetch(`${AUTH_SERVICE_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch {
    // Ignore network error during logout
  }
}
