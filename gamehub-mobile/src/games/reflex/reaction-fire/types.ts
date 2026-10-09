// ============================================================
// REACTION FIRE — Comprehensive TypeScript Type Definitions
// ============================================================

export type ScreenState =
  | 'splash'
  | 'intro'
  | 'home'
  | 'mode_select'
  | 'mode-select'
  | 'how_to_play'
  | 'how-to-play'
  | 'practice'
  | 'practice-arena'
  | 'gameplay'
  | 'result'
  | 'results'
  | 'daily'
  | 'daily-challenge'
  | 'missions'
  | 'stats'
  | 'statistics'
  | 'settings';

export type GameModeId = 'classic' | 'five-round' | 'endurance' | 'fakeout' | 'practice';

export type GameplayState =
  | 'idle'
  | 'countdown'
  | 'waiting'
  | 'go'
  | 'decoy'
  | 'success'
  | 'tooEarly'
  | 'roundTransition'
  | 'paused'
  | 'finished';

// Legacy compatibility
export type ReactionState = 'WAITING' | 'READY_SIGNAL' | 'TOO_EARLY' | 'RESULT';

export type PerformanceClassification =
  | 'Lightning Fast'
  | 'Fast / Great'
  | 'Good'
  | 'Normal'
  | 'Keep Training';

export interface ReactionAttempt {
  id: string;
  mode: GameModeId;
  reactionTimeMs: number | null;
  status: 'success' | 'false-start' | 'cancelled';
  timestamp: number;
  roundNumber?: number;
}

export interface GameModeConfig {
  id: GameModeId;
  name: string;
  tagline: string;
  description: string;
  totalRounds: number;
  durationSeconds: number; // 0 for signal-driven
  targetMs: number;
  icon: string;
  badgeColor: string;
}

export interface ReactionStats {
  bestTimeMs: number | null;
  classicBestMs: number | null;
  fiveRoundBestMs: number | null;
  enduranceBestScore: number;
  fakeoutBestMs: number | null;
  totalAttempts: number;
  successfulAttempts: number;
  falseStarts: number;
  completedGames: number;
  totalValidRounds: number;
  recentAttempts: ReactionAttempt[];
  level: number;
  xp: number;
}

export interface ReactionSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  showReactionTime: boolean;
  showHitEffects: boolean;
  showHelpfulTips: boolean;
}

export interface DailyChallengeState {
  date: string; // YYYY-MM-DD
  attemptsLeft: number;
  completed: boolean;
  bestTimeMs: number | null;
  rewardClaimed: boolean;
}

export interface MissionItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
  type: 'daily' | 'weekly' | 'lifetime';
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progressText: string;
}

export interface RunResult {
  mode: GameModeId;
  reactionTimeMs: number | null;
  classification: PerformanceClassification;
  isNewBest: boolean;
  targetReached: boolean;
  score: number;
  // Multi-round telemetry
  roundTimes: number[];
  meanTimeMs?: number;
  medianTimeMs?: number;
  falseStartsCount: number;
  totalRoundsCompleted: number;
  // Endurance telemetry
  totalValidHits?: number;
  timeSurvivedSeconds?: number;
}
