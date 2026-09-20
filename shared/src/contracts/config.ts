// ============================================================
// GameHub — Shared Contracts: Remote Config
// ============================================================

/** Per-game remote configuration. */
export interface GameRemoteConfig {
  enabled: boolean;
  maintenance: boolean;
  maintenanceMessage?: string;
  rewardXp: number;
  rewardCoins: number;
}

/** Feature flags. */
export interface FeatureFlags {
  fpsEnabled: boolean;
  onlineMultiplayerEnabled: boolean;
  dailyChallengesEnabled: boolean;
  friendsEnabled: boolean;
  quizBattleEnabled: boolean;
  guessTheDrawingEnabled: boolean;
}

/** Full remote config response. */
export interface RemoteConfigResponse {
  games: Record<string, GameRemoteConfig>;
  features: FeatureFlags;
  version: {
    minSupported: string;
    latest: string;
  };
}
