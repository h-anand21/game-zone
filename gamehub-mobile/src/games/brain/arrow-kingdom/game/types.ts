// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Core Game Types
// ============================================================

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Cell {
  row: number;
  col: number;
}

export interface ArrowPieceData {
  id: string;
  color: string;
  direction: Direction;
  cells: Cell[];
  removed?: boolean;
}

export interface GameLevel {
  id: number;
  worldId: number;
  worldName: string;
  name: string;
  rows: number;
  cols: number;
  threeStarMoves: number;
  twoStarMoves: number;
  pieces: ArrowPieceData[];
  reward: {
    coins: number;
    gems?: number;
  };
  tutorialText?: string;
}

export type ThemeId = 'neon' | 'forest' | 'ocean' | 'galaxy' | 'candy' | 'lava';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  boardBg: string;
  gridLineColor: string;
  boardBorder: string;
  glowColor: string;
  unlockCoins: number;
  unlockedByDefault: boolean;
  icon: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  goal: number;
  rewardCoins: number;
  rewardGems: number;
}

export type ScreenId =
  | 'splash'
  | 'home'
  | 'world-map'
  | 'level-select'
  | 'gameplay'
  | 'how-to-play'
  | 'themes'
  | 'daily-puzzle'
  | 'achievements'
  | 'shop'
  | 'settings';
