// ============================================================
// GameHub — Auth Service API
// ============================================================

import apiClient, { setAuthToken } from './client';
import { secureStore } from '../../storage/secure/secure-store';

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      username: string;
      displayName?: string;
      avatarUrl?: string;
      level?: number;
      xp?: number;
    };
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
  };
  message?: string;
  error?: {
    message: string;
  };
}

export async function registerGuestApi(guestId: string, username?: string): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/guest', { guestId, username });

  if (res.success && res.data?.tokens) {
    setAuthToken(res.data.tokens.accessToken);
    await secureStore.setAccessToken(res.data.tokens.accessToken);
    await secureStore.setRefreshToken(res.data.tokens.refreshToken);
  }

  return res;
}

export async function linkAccountApi(username: string, email: string, passwordHash: string): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/link', { username, email, passwordHash });

  if (res.success && res.data?.tokens) {
    setAuthToken(res.data.tokens.accessToken);
    await secureStore.setAccessToken(res.data.tokens.accessToken);
    await secureStore.setRefreshToken(res.data.tokens.refreshToken);
  }

  return res;
}
