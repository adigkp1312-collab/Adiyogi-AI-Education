/**
 * Better Auth Client — Education App
 *
 * Copied from main frontend's betterAuthClient.ts, stripped to essentials.
 * Sessions managed via HTTP-only cookies; JWT tokens for Lambda API auth.
 */

import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';
import { CONFIG } from '../config';
import { authFetchPlugin } from './fetchPlugin';

// sessionStorage keys
const JWT_STORAGE_KEY = 'adiyogi_edu_jwt';
const JWT_EXPIRY_KEY = 'adiyogi_edu_jwt_expiry';

const isValidJwtFormat = (token: string | null): boolean => {
  if (!token) return false;
  return token.startsWith('eyJ') && token.split('.').length === 3;
};

const loadCachedJwt = (): string | null => {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(JWT_STORAGE_KEY);
  if (stored && !isValidJwtFormat(stored)) {
    sessionStorage.removeItem(JWT_STORAGE_KEY);
    sessionStorage.removeItem(JWT_EXPIRY_KEY);
    return null;
  }
  return stored;
};

let cachedJwt: string | null = loadCachedJwt();
let jwtExpiry: number = (typeof window !== 'undefined' && cachedJwt)
  ? Number(sessionStorage.getItem(JWT_EXPIRY_KEY) || 0)
  : 0;
let pendingRequest: Promise<string | null> | null = null;

const persistCache = (token: string | null, expiry: number): void => {
  if (typeof window === 'undefined') return;
  if (token) {
    sessionStorage.setItem(JWT_STORAGE_KEY, token);
    sessionStorage.setItem(JWT_EXPIRY_KEY, expiry.toString());
  } else {
    sessionStorage.removeItem(JWT_STORAGE_KEY);
    sessionStorage.removeItem(JWT_EXPIRY_KEY);
  }
};

const clearCache = (reason: string): void => {
  console.log(`[Auth] Clearing JWT cache: ${reason}`);
  cachedJwt = null;
  jwtExpiry = 0;
  pendingRequest = null;
  persistCache(null, 0);
};

// Auth initialization gate
let authReadyPromise: Promise<void> | null = null;
let authReadyResolve: (() => void) | null = null;

const initAuthReadyPromise = () => {
  if (!authReadyPromise) {
    authReadyPromise = new Promise<void>((resolve) => {
      authReadyResolve = resolve;
    });
  }
};
initAuthReadyPromise();

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    if (authReadyResolve) { authReadyResolve(); authReadyResolve = null; }
  });
}

export const markAuthReady = () => {
  if (authReadyResolve) { authReadyResolve(); authReadyResolve = null; }
};

export const resetAuthReady = () => {
  authReadyPromise = null;
  authReadyResolve = null;
  initAuthReadyPromise();
};

const waitForAuthReady = async (): Promise<void> => {
  if (authReadyPromise) await authReadyPromise;
};

const getAuthBaseURL = (): string => CONFIG.AUTH_URL;

// Lazy auth client
let _authClient: ReturnType<typeof createAuthClient> | null = null;

const createLazyAuthClient = () => {
  if (!_authClient) {
    _authClient = createAuthClient({
      baseURL: getAuthBaseURL(),
      plugins: [jwtClient(), authFetchPlugin()],
      fetchOptions: {
        credentials: 'include' as RequestCredentials,
        onResponse: async ({ response }) => {
          if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
            try {
              const data = await response.clone().json();
              if (data?.token && isValidJwtFormat(data.token)) {
                cachedJwt = data.token;
                jwtExpiry = Date.now() + 15 * 60 * 1000;
                persistCache(cachedJwt, jwtExpiry);
              }
            } catch { /* ignore */ }
          }
        },
      },
    });
  }
  return _authClient;
};

export const authClient = new Proxy({} as ReturnType<typeof createAuthClient>, {
  get(_, prop) {
    const client = createLazyAuthClient();
    const value = client[prop as keyof typeof client];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

// --- JWT token management ---

const fetchJwtInternal = async (): Promise<string | null> => {
  try {
    const now = Date.now();
    if (cachedJwt && !isValidJwtFormat(cachedJwt)) {
      clearCache('invalid token format');
    }
    if (cachedJwt && isValidJwtFormat(cachedJwt) && jwtExpiry > now + 300000) {
      return cachedJwt;
    }
    if (cachedJwt && isValidJwtFormat(cachedJwt) && jwtExpiry > now) {
      return cachedJwt;
    }
    if (pendingRequest) return pendingRequest;

    const fetchURL = `${getAuthBaseURL()}/api/jwt`;

    pendingRequest = (async () => {
      try {
        if (cachedJwt && isValidJwtFormat(cachedJwt) && jwtExpiry > Date.now() + 60000) {
          return cachedJwt;
        }
        const response = await fetch(fetchURL, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) return null;

        const result = await response.json();
        if (result?.token && isValidJwtFormat(result.token)) {
          cachedJwt = result.token;
          jwtExpiry = Date.now() + 15 * 60 * 1000;
          persistCache(cachedJwt, jwtExpiry);
          return cachedJwt;
        }
        return null;
      } catch {
        return null;
      } finally {
        pendingRequest = null;
      }
    })();

    return pendingRequest;
  } catch {
    return null;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  await waitForAuthReady();
  return fetchJwtInternal();
};

export const clearAuthToken = (): void => {
  clearCache('clearAuthToken called');
};

let pendingRefresh: Promise<string | null> | null = null;

export const refreshAuthToken = async (): Promise<string | null> => {
  if (pendingRefresh) return pendingRefresh;

  pendingRefresh = (async () => {
    try {
      const response = await fetch(`${getAuthBaseURL()}/api/jwt`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) return null;

      const result = await response.json();
      if (result?.token && isValidJwtFormat(result.token)) {
        cachedJwt = result.token;
        jwtExpiry = Date.now() + 15 * 60 * 1000;
        persistCache(cachedJwt, jwtExpiry);
        return cachedJwt;
      }
      return null;
    } catch {
      return null;
    } finally {
      pendingRefresh = null;
    }
  })();

  return pendingRefresh;
};

export const prefetchJwt = async (): Promise<string | null> => fetchJwtInternal();

// --- Auth actions (signIn, signUp, signOut, getSession) ---

const getClient = () => createLazyAuthClient();

export const auth = {
  signIn: async (email: string, password: string) => {
    try {
      console.log('[Auth:signIn] Attempting sign in to:', getAuthBaseURL());
      const result = await getClient().signIn.email({ email, password });
      console.log('[Auth:signIn] Result:', { hasData: !!result.data, hasError: !!result.error, error: result.error });
      if (result.error) {
        const msg = result.error.message || (result.error as unknown as Record<string, string>).code || 'Sign in failed';
        return { data: null, error: { message: msg } };
      }
      const responseData = result.data as { token?: string; user?: unknown } | undefined;
      if (responseData?.token && isValidJwtFormat(responseData.token)) {
        cachedJwt = responseData.token;
        jwtExpiry = Date.now() + 15 * 60 * 1000;
        persistCache(cachedJwt, jwtExpiry);
      } else if (responseData?.token) {
        // Session token — fetch real JWT
        try {
          const response = await fetch(`${getAuthBaseURL()}/api/jwt`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.ok) {
            const jwtResult = await response.json();
            if (jwtResult?.token && isValidJwtFormat(jwtResult.token)) {
              cachedJwt = jwtResult.token;
              jwtExpiry = Date.now() + 15 * 60 * 1000;
              persistCache(cachedJwt, jwtExpiry);
            }
          }
        } catch { /* ignore */ }
      }
      return { data: result.data, error: null };
    } catch (error) {
      console.error('[Auth:signIn] Exception:', error);
      const message = error instanceof Error ? error.message : 'Sign in failed';
      return { data: null, error: { message } };
    }
  },

  signUp: async (email: string, password: string, name?: string) => {
    try {
      const result = await getClient().signUp.email({
        email,
        password,
        name: name || email.split('@')[0],
      });
      if (result.error) {
        return { data: null, error: { message: result.error.message || 'Sign up failed' } };
      }
      const responseData = result.data as { token?: string } | undefined;
      if (responseData?.token && isValidJwtFormat(responseData.token)) {
        cachedJwt = responseData.token;
        jwtExpiry = Date.now() + 15 * 60 * 1000;
        persistCache(cachedJwt, jwtExpiry);
      }
      return { data: result.data, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      return { data: null, error: { message } };
    }
  },

  signOut: async () => {
    try {
      await getClient().signOut();
      clearCache('signOut');
      return { error: null };
    } catch (error) {
      clearCache('signOut error');
      const message = error instanceof Error ? error.message : 'Sign out failed';
      return { error: { message } };
    }
  },

  getSession: async () => {
    try {
      const result = await getClient().getSession();
      if (result.error || !result.data?.user) {
        return { data: null, error: null };
      }
      return { data: result.data, error: null };
    } catch {
      return { data: null, error: null };
    }
  },
};
