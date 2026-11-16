import { AUTH_SERVICE_URL } from '../config/env.js';
import type { AuthUser } from '@project-template/shared';

let activeRefreshPromise: Promise<boolean> | null = null;

export function buildLoginUrl(nextUrl?: string): string {
  const returnTarget = nextUrl || window.location.href;
  return `${AUTH_SERVICE_URL}/login?next=${encodeURIComponent(returnTarget)}`;
}

export function redirectToLogin(nextUrl?: string): void {
  window.location.href = buildLoginUrl(nextUrl);
}

export function buildRegisterUrl(nextUrl?: string): string {
  const returnTarget = nextUrl || window.location.href;
  return `${AUTH_SERVICE_URL}/register?next=${encodeURIComponent(returnTarget)}`;
}

export function redirectToRegister(nextUrl?: string): void {
  window.location.href = buildRegisterUrl(nextUrl);
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const rawUser = data?.user || data?.data || data;

    if (!rawUser || !rawUser.id) {
      return null;
    }

    return {
      id: String(rawUser.id),
      email: String(rawUser.email || ''),
      name: rawUser.name ? String(rawUser.name) : undefined,
      createdAt: rawUser.createdAt ? String(rawUser.createdAt) : undefined,
    };
  } catch {
    return null;
  }
}


export async function refreshSession(): Promise<boolean> {
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
