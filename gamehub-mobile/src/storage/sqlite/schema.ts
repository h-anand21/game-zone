// ============================================================
// GameHub — SQLite Table Definitions
// ============================================================
// Canonical reference for all local SQLite tables.
// Used by migrations and repositories.

/**
 * All table names in the local SQLite database.
 */
export const Tables = {
  USERS: 'users',
  GAME_PROGRESS: 'game_progress',
  GAME_SCORES: 'game_scores',
  GAME_STATS: 'game_stats',
  ACHIEVEMENTS: 'achievements',
  USER_ACHIEVEMENTS: 'user_achievements',
  SETTINGS: 'settings',
  DAILY_CHALLENGES: 'daily_challenges',
  DAILY_STREAKS: 'daily_streaks',
  FAVORITE_GAMES: 'favorite_games',
  SYNC_QUEUE: 'sync_queue',
  REMOTE_CONFIG_CACHE: 'remote_config_cache',
  MIGRATIONS: '_migrations',
} as const;

export type TableName = (typeof Tables)[keyof typeof Tables];

// ── Row type definitions ─────────────────────────────────────

export interface UserRow {
  id: string;
  guest_id: string;
  device_id: string;
  cloud_user_id: string | null;
  username: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  coins: number;
  created_at: string;
  linked_at: string | null;
}

export interface GameProgressRow {
  id: string;
  game_id: string;
  game_version: string;
  state_json: string;
  updated_at: string;
}

export interface GameScoreRow {
  id: string;
  event_id: string;
  game_id: string;
  game_version: string;
  score_version: string;
  score: number;
  duration: number;
  metadata: string | null;  // JSON string
  created_at: string;
}

export interface GameStatsRow {
  id: string;
  game_id: string;
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
  best_score: number;
  total_score: number;
  updated_at: string;
}

export interface AchievementRow {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
}

export interface UserAchievementRow {
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface SettingsRow {
  key: string;
  value: string;
}

export interface DailyChallengeRow {
  id: string;
  game_id: string;
  type: string;
  target: number;
  progress: number;
  completed: number;  // 0 or 1 (SQLite boolean)
  date: string;
}

export interface DailyStreakRow {
  id: number;
  current_streak: number;
  longest_streak: number;
  last_played_date: string;
}

export interface FavoriteGameRow {
  game_id: string;
  added_at: string;
}

export interface SyncQueueRow {
  id: string;
  event_id: string;
  type: string;
  payload: string;  // JSON string
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retry_count: number;
  max_retries: number;
  created_at: string;
}

export interface RemoteConfigCacheRow {
  key: string;
  value_json: string;
  fetched_at: string;
}

export interface MigrationRow {
  version: number;
  name: string;
  applied_at: string;
}
