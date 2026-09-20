// ============================================================
// GameHub — Feature Flags (Local Defaults)
// ============================================================

import type { FeatureFlags } from './types';

/**
 * Default feature flags — used when offline or remote config unavailable.
 * These will be overridden by remote config from the backend (Phase 7+).
 */
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  fpsEnabled: false,
  onlineMultiplayerEnabled: false,
  dailyChallengesEnabled: false,
  friendsEnabled: false,
  quizBattleEnabled: false,
  guessTheDrawingEnabled: false,
};
