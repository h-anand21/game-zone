// ============================================================
// PATTERN BREAKER — Type Definitions
// ============================================================

export type PBScreen =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'play_mode'
  | 'difficulty'
  | 'pattern_type'
  | 'how_to_play'
  | 'countdown'
  | 'gameplay'
  | 'feedback'
  | 'rule_shift'
  | 'pause'
  | 'result'
  | 'progress'
  | 'daily_challenge'
  | 'achievements'
  | 'profile'
  | 'settings';

export type PBPatternType =
  | 'NUMBER'
  | 'SHAPE'
  | 'COLOR'
  | 'COUNT'
  | 'DIRECTION'
  | 'MIXED'
  | 'RANDOM';

export type PBDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type PBPlayMode = 'quick' | 'shift' | 'daily';

export type ShapeKind = 'triangle' | 'circle' | 'square' | 'star' | 'hexagon' | 'diamond';

export interface TileItem {
  id: string;
  type: 'number' | 'shape' | 'color' | 'count' | 'direction' | 'mixed';
  value: string | number;
  color: string;
  shape?: ShapeKind;
  count?: number;
  rotation?: number; // 0, 90, 180, 270
}

export interface PatternPuzzle {
  patternType: PBPatternType;
  difficulty: PBDifficulty;
  ruleTitle: string;
  ruleDescription: string;
  items: TileItem[];
  breakerIndex: number;
  breakerExplanation: string;
  timeLimit: number;
}

export interface PatternQuestion {
  items: (string | number)[];
  breakerIndex: number;
  ruleExplanation: string;
}

export type TileState =
  | 'default'
  | 'pressed'
  | 'correct'
  | 'wrong'
  | 'highlighted'
  | 'disabled'
  | 'revealed'
  | 'breaker';

export type PowerUpType = 'reveal' | 'freeze' | 'scan';

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}
