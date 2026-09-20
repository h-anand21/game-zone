// ============================================================
// GameHub — Core Types
// ============================================================

/** Game category classification. */
export type GameCategory = 'brain' | 'reflex' | 'arcade' | 'classic' | 'battle' | 'party';

/** Save support level for a game. */
export type SaveSupport = 'none' | 'background' | 'full';

/** Game availability status. */
export type GameStatus = 'available' | 'coming-soon' | 'maintenance';

/** Score validation rules for a specific game. */
export interface ScoreValidationRules {
  maxScore: number;
  minDuration: number;
  maxDuration: number;
}

/** Configuration for a single game in the registry. */
export interface GameConfig {
  id: string;
  name: string;
  category: GameCategory;
  offline: boolean;
  multiplayer: boolean;
  route: string;
  icon: string;
  status: GameStatus;
  gameVersion: string;
  scoreVersion: string;
  validation: ScoreValidationRules;
  saveSupport: SaveSupport;
  description: string;
}

/** Local user profile. */
export interface UserProfile {
  id: string;
  guestId: string;
  deviceId: string;
  cloudUserId: string | null;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  coins: number;
  createdAt: string;
  linkedAt: string | null;
}

/** A saved game score. */
export interface GameScore {
  id: string;
  eventId: string;
  gameId: string;
  gameVersion: string;
  scoreVersion: string;
  score: number;
  duration: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

/** Aggregated stats for a user + game. */
export interface GameStats {
  gameId: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  bestScore: number;
  totalScore: number;
}

/** An achievement definition. */
export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}

/** An unlocked achievement for the current user. */
export interface UserAchievement {
  achievementId: string;
  code: string;
  name: string;
  unlockedAt: string;
}

/** The result of a completed game session. */
export interface GameResult {
  gameId: string;
  score: number;
  duration: number;
  won: boolean;
  xpEarned: number;
  coinsEarned: number;
  achievementsUnlocked: string[];
  metadata?: Record<string, unknown>;
}

/** A sync queue item waiting to be uploaded. */
export interface SyncQueueItem {
  id: string;
  eventId: string;
  type: 'score_submit' | 'stats_update' | 'achievement_unlock' | 'profile_update' | 'progress_save';
  payload: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  maxRetries: number;
  createdAt: string;
}

/** Network connectivity state. */
export type NetworkState = 'ONLINE' | 'OFFLINE' | 'CONNECTING' | 'RECONNECTING' | 'SYNCING' | 'SYNC_FAILED';

/** Game lifecycle states. */
export type GameState = 'IDLE' | 'READY' | 'PLAYING' | 'PAUSED' | 'FINISHED' | 'RESULT' | 'SAVE' | 'SYNC';

/** Feature flags with local defaults. */
export interface FeatureFlags {
  fpsEnabled: boolean;
  onlineMultiplayerEnabled: boolean;
  dailyChallengesEnabled: boolean;
  friendsEnabled: boolean;
  quizBattleEnabled: boolean;
  guessTheDrawingEnabled: boolean;
}
