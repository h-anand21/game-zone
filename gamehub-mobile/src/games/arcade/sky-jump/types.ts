// ============================================================
// Wood Screw: Nuts & Bolts Puzzle — Core Types & Constants
// ============================================================

export const BOARD_W = 320;
export const BOARD_H = 420;
export const DEFAULT_PLANK_THICKNESS = 24;
export const HOLE_RADIUS = 8.5;
export const SCREW_RADIUS = 10.5;
export const PIN_SNAP_TOLERANCE = 6;
export const SOLID_BLOCK_MARGIN = 3.5;

export type PlankColor = 'green' | 'amber' | 'sienna' | 'walnut' | 'caramel';

export interface BoardHole {
  id: string;
  x: number;
  y: number;
}

export interface PlankHole {
  id: string;
  localX: number;
  pinnedHoleId: string | null;
}

export type PlankStatus = 'pinned' | 'swinging' | 'falling' | 'cleared';

export interface WoodPlank {
  id: string;
  color: PlankColor;
  layer: number;
  x: number;
  y: number;
  angle: number; // degrees, clockwise from +X
  length: number;
  thickness: number;
  holes: PlankHole[];
  vx: number;
  vy: number;
  angularVel: number;
  status: PlankStatus;
}

export interface ScrewItem {
  id: string;
  holeId: string;
}

export interface WoodLevelData {
  levelNumber: number;
  title: string;
  timeLimitSeconds: number;
  holes: BoardHole[];
  planks: WoodPlank[];
  screws: ScrewItem[];
}

export interface UndoSnapshot {
  planks: WoodPlank[];
  screws: ScrewItem[];
}

export type GameStatus = 'playing' | 'paused' | 'won' | 'lost_time' | 'lost_jam';

export interface WoodSaveState {
  currentLevel: number;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  hearts: number;
  freezeCount: number;
  screwdriverCount: number;
  undoCount: number;
}
