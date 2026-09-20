// ============================================================
// GameHub — Remote Config Service API
// ============================================================

import apiClient from './client';

export interface RemoteConfigResponse {
  success: boolean;
  data?: {
    games: Record<string, { enabled: boolean; reward_xp?: number; reward_coins?: number }>;
    features: Record<string, boolean>;
    version: { min_supported: string; latest: string };
  };
  error?: {
    message: string;
  };
}

export async function fetchRemoteConfigApi(): Promise<RemoteConfigResponse> {
  return apiClient.get<RemoteConfigResponse>('/api/v1/config');
}
