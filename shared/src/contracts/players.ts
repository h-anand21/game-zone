// ============================================================
// GameHub — Shared Contracts: Players / Profiles
// ============================================================

/** Player profile as returned by the API. */
export interface ProfileResponse {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  xp: number;
  level: number;
  coins: number;
  createdAt: string;
}

/** Update profile request. */
export interface UpdateProfileRequest {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
}

/** Friend entry. */
export interface FriendResponse {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  level: number;
  status: string;
  createdAt: string;
}

/** Friend request entry. */
export interface FriendRequestResponse {
  id: string;
  senderId: string;
  senderDisplayName: string;
  senderAvatarUrl: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

/** Achievement definition. */
export interface AchievementResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}

/** User achievement (unlocked). */
export interface UserAchievementResponse {
  achievementId: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt: string;
}

/** Leaderboard entry. */
export interface LeaderboardEntryResponse {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  score: number;
  level: number;
}
