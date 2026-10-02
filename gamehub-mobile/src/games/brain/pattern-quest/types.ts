// ============================================================
// PATTERN QUEST — Type Definitions
// ============================================================

export type PQScreen =
  | 'splash'
  | 'home'
  | 'world_map'
  | 'mode_select'
  | 'difficulty'
  | 'how_to_play'
  | 'ready'
  | 'gameplay'
  | 'memory_shift'
  | 'rush_mode'
  | 'level_complete'
  | 'final_results'
  | 'achievements'
  | 'profile'
  | 'settings';

export type PQGameMode = 'DISCOVER' | 'THINK' | 'RUSH' | 'MEMORY';

export type PQDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type PQPatternCategory =
  | 'shape'
  | 'rotation'
  | 'color'
  | 'position'
  | 'size'
  | 'movement'
  | 'transformation'
  | 'number'
  | 'mixed';

export type ShapeSymbol =
  | 'circle'
  | 'triangle'
  | 'square'
  | 'diamond'
  | 'star'
  | 'hexagon'
  | 'crescent';

export interface VisualTile {
  id: string;
  shape: ShapeSymbol;
  color: string;
  rotation: number; // 0, 90, 180, 270
  size: 'small' | 'medium' | 'large';
  style: 'filled' | 'outline' | 'half';
  numberValue?: number;
  label?: string;
}

export interface PatternQuestPuzzle {
  id: string;
  category: PQPatternCategory;
  difficulty: PQDifficulty;
  questionPrompt: string; // e.g., "WHAT COMES NEXT?"
  ruleTitle: string;
  ruleExplanation: string;
  sequence: VisualTile[]; // sequence of tiles (with the last or target slot to guess)
  options: VisualTile[]; // 4 choices
  correctOptionIndex: number;
  timeLimitSeconds: number;
}

export interface MapRegion {
  id: string;
  name: string;
  templeNumber: number;
  unlocked: boolean;
  stars: number;
  maxStars: number;
  description: string;
  color: string;
}

export interface PQAchievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardStars: number;
}

export interface UserStats {
  patternsSolved: number;
  totalAttempts: number;
  accuracy: number;
  bestCombo: number;
  hintsUsed: number;
  averageTimeSeconds: number;
  perfectRuns: number;
  skillBreakdown: {
    shape: number;
    rotation: number;
    memory: number;
    position: number;
  };
}
