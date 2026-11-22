// ============================================================
// Color Bloom Sort — Core Types & Interfaces
// Production Ball Sort Puzzle Game Engine
// ============================================================

export type BallColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'amber'
  | 'purple'
  | 'pink'
  | 'cyan'
  | 'orange'
  | 'mint'
  | 'lime';

export const ALL_BALL_COLORS: BallColor[] = [
  'red',
  'blue',
  'green',
  'amber',
  'purple',
  'pink',
  'cyan',
  'orange',
  'mint',
  'lime',
];

export const TUBE_CAPACITY = 4;

export type Tube = BallColor[]; // Bottom-to-top array of balls (0 = bottom, length-1 = top)

export interface MoveRecord {
  fromTube: number;
  toTube: number;
  color: BallColor;
}

export type ThemeId = 'midnight' | 'ocean' | 'sunset' | 'cosmic' | 'pastel';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgGradient: [string, string];
  tubeOutline: string;
  tubeGlass: string;
  tubeHighlight: string;
  accent: string;
  unlocked: boolean;
  price: number;
}

export interface LevelData {
  levelNumber: number;
  tubes: Tube[];
  colorCount: number;
  emptyTubeCount: number;
}

export interface HintMove {
  fromTube: number;
  toTube: number;
  color: BallColor;
}

export interface GameStats {
  currentLevel: number;
  highestLevel: number;
  coins: number;
  totalPuzzlesSolved: number;
  freeUndosRemaining: number;
  selectedTheme: ThemeId;
  unlockedThemes: ThemeId[];
}
