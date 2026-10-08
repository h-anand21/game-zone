// ============================================================
// ONE TAP: PRECISION GAME — Types
// Strict TypeScript definitions for the entire game architecture
// ============================================================

export type OneTapGameState =
  | 'splash'
  | 'home'
  | 'mode_select'
  | 'how_to_play'
  | 'touch_demo'
  | 'countdown'
  | 'gameplay'
  | 'playing'
  | 'paused'
  | 'result'
  | 'new_best'
  | 'daily'
  | 'stats'
  | 'settings';

export type OneTapScreen = OneTapGameState;

export type GameModeId =
  | 'classic'
  | 'endless'
  | 'rush'
  | 'daily'
  | 'zen'
  | 'hardcore'
  | 'chaos';

export type HitTier = 'perfect' | 'great' | 'good' | 'miss';

export interface GameModeConfig {
  id: GameModeId;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  speedLabel: string;
  totalRounds?: number; // 10 for classic, undefined for endless
  isLocked?: boolean;
  lockRequirement?: string;
  baseSpeed: number; // Oscillation speed in Hz
  targetWidthMultiplier: number;
  dangerZones?: boolean;
  color: string;
}

export interface TargetZoneData {
  start: number; // 0.0 to 1.0 (normalized track position)
  width: number; // 0.08 to 0.30
  center: number; // start + width / 2
  perfectWidth: number; // subzone for perfect
  greatWidth: number; // subzone for great
  goodWidth: number; // subzone for good
}

export interface HitEvaluation {
  tier: HitTier;
  distanceFromCenter: number; // in normalized units
  scorePoints: number;
  comboMultiplier: number;
  feverMultiplier: number;
  totalPointsAwarded: number;
  timestamp: number;
  reactionTimeMs: number;
}

export interface OneTapUserProfile {
  totalRuns: number;
  totalGamesPlayed: number;
  personalBestScore: number;
  previousBestScore: number;
  bestCombo: number;
  maxComboRecorded: number;
  bestAccuracy: number;
  lifetimeAccuracy: number;
  fastestReactionMs: number;
  averageReactionMs: number;
  totalPerfects: number;
  totalPerfectHits: number;
  totalGreats: number;
  totalGoods: number;
  totalMisses: number;
  totalCoins: number;
  coins: number;
  totalXp: number;
  xp: number;
  unlockedModes: GameModeId[];
  tutorialCompleted: boolean;
  dailyChallengeBest: number;
  lastPlayedDate?: string;
}

export interface OneTapSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  visualFxLevel: 'low' | 'medium' | 'high';
}

export interface OneTapRunResult {
  mode: GameModeId;
  finalScore: number;
  isNewPersonalBest?: boolean;
  previousBest?: number;
  scoreDifference?: number;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
  accuracyPercentage: number;
  perfectCount: number;
  greatCount: number;
  goodCount: number;
  missCount: number;
  maxCombo: number;
  totalRoundsPlayed: number;
  totalDurationSeconds?: number;
  timeElapsedSeconds: number;
  averageReactionTimeMs: number;
  earnedCoins: number;
  earnedXp: number;
  earnedStars: number;
}
