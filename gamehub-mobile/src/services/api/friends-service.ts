// ============================================================
// GameHub — Friends Service API
// ============================================================

import apiClient from './client';

export interface FriendUser {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  level?: number;
  xp?: number;
}

export interface FriendsResponse {
  success: boolean;
  data?: {
    friends: FriendUser[];
  };
  error?: {
    message: string;
  };
}

export async function fetchFriendsApi(): Promise<FriendsResponse> {
  return apiClient.get<FriendsResponse>('/api/v1/friends');
}

export async function sendFriendRequestApi(targetUsername: string): Promise<any> {
  return apiClient.post('/api/v1/friends/request', { targetUsername });
}

export async function acceptFriendRequestApi(requestId: string): Promise<any> {
  return apiClient.post(`/api/v1/friends/accept/${requestId}`);
}
