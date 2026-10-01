// ============================================================
// MEMORY RUSH — Master TypeScript Data Models & Types
// ============================================================

export type GameMode =
  | 'memoryGrid'
  | 'sequenceRush'
  | 'numberShift'
  | 'missingNumber'
  | 'fusionRush';

export type GameModeId = GameMode;
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type DifficultyId = GameDifficulty;
export type TabType = 'home' | 'daily' | 'stats' | 'settings' | 'challenge';

export interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type RoundType = 'memoryGrid' | 'sequenceRush' | 'numberShift' | 'missingNumber';

export type TileState =
  | 'default'
  | 'preview'
  | 'hidden'
  | 'selected'
  | 'correct'
  | 'wrong'
  | 'disabled';

export type InGamePhase =
  | 'idle'
  | 'countdown'
  | 'preview'
  | 'hide'
  | 'question'
  | 'answering'
  | 'validation'
  | 'roundResult'
  | 'finalResult';

export type AppNavScreen =
  | 'splash'
  | 'home'
  | 'modes'
  | 'difficulty'
  | 'tutorial'
  | 'countdown'
  | 'gameplay'
  | 'roundResult'
  | 'finalResult'
  | 'stats'
  | 'daily'
  | 'settings';

export type PowerUpType = 'freeze' | 'reveal' | 'secondChance';

export interface GridPos {
  row: number;
  col: number;
}

export interface NumberTileData {
  id: string;
  value: number;
  originalValue?: number;
  row: number;
  col: number;
  state: TileState;
  isChanged?: boolean;
  isMissing?: boolean;
  sequenceStep?: number;
}

export interface RoundConfig {
  roundNumber: number;
  mode: GameMode;
  actualType: RoundType;
  gridRows: number;
  gridCols: number;
  previewDurationMs: number;
  timerDurationMs: number;
  targetValue?: number;
  targetPos?: GridPos;
  sequenceOrder?: number[];
  sequenceTileIds?: string[];
  changedTileId?: string;
  changedOriginalValue?: number;
  changedNewValue?: number;
  vanishedValue?: number;
  missingOptions?: number[];
  questionPrompt: string;
}

export interface PerformanceRun {
  id: string;
  date: string;
  score: number;
  accuracy: number;
  mode: GameMode;
  difficulty: GameDifficulty;
}

export interface PlayerStats {
  bestScore: number;
  bestStreak: number;
  accuracy: number;
  gamesPlayed: number;
  avgReactionTimeMs: number;
  modeAccuracy: Record<GameMode, number>;
  recentRuns: PerformanceRun[];
}

export interface DailyChallengeState {
  completed: boolean;
  roundsCleared: number;
  totalRounds: number;
  rewardXp: number;
  score: number;
  accuracy: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  animationsEnabled: boolean;
  smartDifficulty: boolean;
  highContrast: boolean;
  largeNumbers: boolean;
  reducedMotion: boolean;
}

export interface PowerUpInventory {
  freeze: number;
  reveal: number;
  secondChance: number;
}
