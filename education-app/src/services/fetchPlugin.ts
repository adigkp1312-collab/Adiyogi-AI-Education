/**
 * Authenticated Fetch — Education App
 *
 * JWT-authenticated fetch wrapper for Lambda API calls.
 */

import type { BetterAuthClientPlugin } from 'better-auth/client';
import { parseErrorResponse } from './errors';
import { CONFIG } from '../config';
import { getAuthToken, clearAuthToken, refreshAuthToken } from './authClient';

export interface AuthFetchOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

export interface AuthFetchResult<T = unknown> {
  data: T | null;
  error: Error | null;
  status: number;
}

/**
 * Authenticated fetch with automatic token injection and 401 retry
 */
export async function authFetch<T = unknown>(
  url: string,
  options: AuthFetchOptions = {},
): Promise<AuthFetchResult<T>> {
  const { timeout = CONFIG.TIMEOUTS.SHORT, skipAuth = false, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    let token: string | null = null;
    if (!skipAuth) {
      token = await getAuthToken();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string> || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 — retry once with fresh token
    if (response.status === 401 && !skipAuth) {
      const freshToken = await refreshAuthToken();
      if (freshToken) {
        headers['Authorization'] = `Bearer ${freshToken}`;
        const retryResponse = await fetch(url, { ...fetchOptions, headers });
        if (!retryResponse.ok) {
          return { data: null, error: new Error(`HTTP ${retryResponse.status}`), status: retryResponse.status };
        }
        const retryData = await retryResponse.json();
        return { data: retryData as T, error: null, status: retryResponse.status };
      }
    }

    if (!response.ok) {
      const errorMsg = await parseErrorResponse(response);
      return { data: null, error: new Error(errorMsg), status: response.status };
    }

    const data = await response.json();
    return { data: data as T, error: null, status: response.status };
  } catch (error) {
    clearTimeout(timeoutId);
    if ((error as Error).name === 'AbortError') {
      return { data: null, error: new Error('Request timeout'), status: 408 };
    }
    return { data: null, error: error as Error, status: 0 };
  }
}

/**
 * Better Auth Client Plugin
 */
export const authFetchPlugin = () => {
  return {
    id: 'auth-fetch',
    getActions: (_$fetch: unknown) => ({
      fetch: authFetch,
    }),
  } satisfies BetterAuthClientPlugin;
};

export { getAuthToken, clearAuthToken, refreshAuthToken } from './authClient';
