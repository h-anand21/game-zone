// ============================================================
// GameHub — Leaderboard Service API
// ============================================================

import apiClient from './client';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  level?: number;
  bestScore: number;
  gamesPlayed: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data?: {
    gameId: string;
    leaderboard: LeaderboardEntry[];
    pagination: {
      page: number;
      limit: number;
      hasMore: boolean;
    };
  };
  error?: {
    message: string;
  };
}

export async function fetchLeaderboardApi(gameId: string, page = 1, limit = 20): Promise<LeaderboardResponse> {
  return apiClient.get<LeaderboardResponse>(`/api/v1/leaderboards/${gameId}?page=${page}&limit=${limit}`);
}
