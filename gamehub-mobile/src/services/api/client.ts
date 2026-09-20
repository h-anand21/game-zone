// ============================================================
// GameHub — API Client
// ============================================================
// Fetch wrapper with timeout, retry, auth, and error handling.
// Does NOT directly access Neon PostgreSQL — all calls go through Express.

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const BASE_DELAY = 2000; // 2 seconds

interface ApiClientConfig {
  baseUrl: string;
  getToken?: () => string | null;
  onTokenExpired?: () => Promise<string | null>;
}

class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries: number = MAX_RETRIES
  ): Promise<Response> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(
          url,
          options,
          DEFAULT_TIMEOUT
        );

        // If 401 and we have a refresh mechanism, try once
        if (response.status === 401 && attempt === 0 && this.config.onTokenExpired) {
          const newToken = await this.config.onTokenExpired();
          if (newToken) {
            const headers = new Headers(options.headers);
            headers.set('Authorization', `Bearer ${newToken}`);
            return this.fetchWithTimeout(url, { ...options, headers }, DEFAULT_TIMEOUT);
          }
        }

        return response;
      } catch (error) {
        lastError = error as Error;

        if (attempt < retries) {
          // Exponential backoff: 2s, 4s, 8s
          const delay = BASE_DELAY * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError ?? new Error('Request failed after retries');
  }

  private getHeaders(idempotencyKey?: string): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.config.getToken?.();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    return headers;
  }

  async get<T>(path: string): Promise<T> {
    const response = await this.fetchWithRetry(
      `${this.config.baseUrl}${path}`,
      { method: 'GET', headers: this.getHeaders() }
    );
    return response.json();
  }

  async post<T>(path: string, body?: unknown, idempotencyKey?: string): Promise<T> {
    const response = await this.fetchWithRetry(
      `${this.config.baseUrl}${path}`,
      {
        method: 'POST',
        headers: this.getHeaders(idempotencyKey),
        body: body ? JSON.stringify(body) : undefined,
      }
    );
    return response.json();
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    const response = await this.fetchWithRetry(
      `${this.config.baseUrl}${path}`,
      {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      }
    );
    return response.json();
  }

  async delete<T>(path: string): Promise<T> {
    const response = await this.fetchWithRetry(
      `${this.config.baseUrl}${path}`,
      { method: 'DELETE', headers: this.getHeaders() }
    );
    return response.json();
  }
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

export const apiClient = new ApiClient({
  baseUrl: API_BASE_URL,
  getToken: () => authToken,
});

export default apiClient;

