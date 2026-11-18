import { API_URL } from '../config/env.js';
import { refreshSession, redirectToLogin } from './auth.js';

interface CustomRequestInit extends RequestInit {
  _retry?: boolean;
  disableAuthRedirect?: boolean;
}

export async function apiFetch(
  input: string | URL,
  init?: CustomRequestInit
): Promise<Response> {
  let url = input;
  if (typeof input === 'string' && input.startsWith('/')) {
    url = `${API_URL}${input}`;
  }

  const options: CustomRequestInit = {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  };

  const response = await fetch(url, options);

  if (response.status === 401 && !options._retry) {
    try {
      const refreshed = await refreshSession();

      if (refreshed) {
        return apiFetch(input, {
          ...options,
          _retry: true,
        });
      }

      if (!options.disableAuthRedirect) {
        redirectToLogin();
      }
    } catch (err) {
      // Network outage or 5xx on auth service: avoid kicking the user to login on connection error
      console.warn('[apiFetch] Session refresh encountered connection error:', err);
    }
  }

  return response;
}
