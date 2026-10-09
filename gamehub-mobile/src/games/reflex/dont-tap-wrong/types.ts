// ============================================================
// DON'T TAP WRONG — Comprehensive Type Definitions
// ============================================================

export type ScreenState =
  | 'splash'
  | 'home'
  | 'mode_select'
  | 'how_to_play'
  | 'practice'
  | 'countdown'
  | 'playing'
  | 'result'
  | 'stats'
  | 'settings'
  | 'daily_challenge';

export type GameModeId = 'classic' | 'rush' | 'survival' | 'daily';
export type GameMode = GameModeId; // Convenience alias

export interface GameModeConfig {
  id: GameModeId;
  name: string;
  tagline: string;
  description: string;
  durationSeconds: number; // 0 means untimed / survival
  targetScore: number;
  bonusTimePerStreak: number; // seconds added per streak milestone
  dangerTileRange: [number, number]; // [min, max]
  safeTileRange: [number, number];   // [min, max]
  icon: string;
  badgeColor: string;
}

export type TileType = 'safe' | 'danger' | 'empty';

export interface TileItem {
  id: number;          // 0 to 8
  type: TileType;
  key: string;         // Unique instance key for animations
  pressed?: boolean;
}

export type RunEndReason = 'time_up' | 'danger_tap' | 'survived' | 'quit';

export interface RunTelemetry {
  mode: GameModeId;
  score: number;
  bestStreak: number;
  currentStreak: number;
  safeTaps: number;
  dangerTaps: number;
  totalTaps: number;
  accuracy: number;
  durationElapsedSeconds: number;
  reason: RunEndReason;
  targetReached: boolean;
  isNewBest: boolean;
  timestamp: number;
}

export interface UserProfile {
  classicHighScore: number;
  rushHighScore: number;
  survivalHighScore: number;
  dailyHighScore: number;
  bestStreak: number;
  totalRuns: number;
  totalSafeTaps: number;
  totalDangerTaps: number;
  totalTimePlayedSeconds: number;
  dailyRunsCompleted: number;
  lastDailyDate: string;
}

// Alias for legacy components
export type PlayerRecord = UserProfile;

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  graphicsQuality: 'high' | 'low';
}

// Session state during live play
export interface GameSessionState {
  mode: GameModeId;
  score: number;
  streak: number;
  bestStreak: number;
  safeTaps: number;
  dangerTaps: number;
  timeRemaining: number;
  totalDuration: number;
  tiles: TileItem[];
  boardRevision: number;
  isPaused: boolean;
  isGameOver: boolean;
}

// Compatibility with GameHub registry & engine
export interface GridTileItem {
  id: number;
  type: 'correct' | 'wrong' | 'empty';
}
