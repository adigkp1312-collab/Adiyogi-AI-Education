/**
 * Education App Configuration
 *
 * Slim config — only what the education frontend needs.
 * URLs come from VITE_* env vars or runtime fetch from Config Proxy.
 */

export type Environment = 'production' | 'staging' | 'development';
export const ENV: Environment = (import.meta.env.VITE_ENV as Environment) || 'development';
export const IS_DEVELOPMENT = ENV === 'development';

const CONFIG_PROXY_URL = import.meta.env.VITE_CONFIG_PROXY_URL ||
  (import.meta.env.VITE_LEGACY_LAMBDA_URL ? `${import.meta.env.VITE_LEGACY_LAMBDA_URL}/config` : '');

let _configInitialized = false;

export const CONFIG = {
  LAMBDA_URL: import.meta.env.VITE_LAMBDA_URL || '',
  AUTH_URL: import.meta.env.VITE_AUTH_URL || '',
  AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL || '',

  TIMEOUTS: {
    SHORT: 30_000,
    STREAMING: 120_000,
  },
} as const;

/**
 * Initialize config from Config Proxy (optional).
 * Falls back to build-time VITE_* env vars.
 */
export async function initializeConfig(): Promise<void> {
  if (_configInitialized) return;

  if (IS_DEVELOPMENT || !CONFIG_PROXY_URL) {
    _configInitialized = true;
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(CONFIG_PROXY_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Config fetch failed: ${response.status}`);

    const remote = await response.json();
    const services = remote?.services as Record<string, string> | undefined;

    if (services?.lambda_url) {
      (CONFIG as Record<string, unknown>).LAMBDA_URL = services.lambda_url;
    }
    if (services?.auth_service_url) {
      (CONFIG as Record<string, unknown>).AUTH_URL = services.auth_service_url;
      (CONFIG as Record<string, unknown>).AUTH_SERVICE_URL = services.auth_service_url;
    }
  } catch (error) {
    console.warn('[Config] Failed to load remote config, using build-time defaults:', error);
  } finally {
    _configInitialized = true;
  }
}
