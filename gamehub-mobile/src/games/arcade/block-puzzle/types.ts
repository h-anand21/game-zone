// ============================================================
// GameHub — Block Blast Types & Interfaces
// ============================================================

export type BlockColor =
  | 'cyan'
  | 'amber'
  | 'ruby'
  | 'green'
  | 'purple'
  | 'orange'
  | 'blue';

export interface ColorTheme {
  name: BlockColor;
  main: string;
  gradient: [string, string];
  shadow: string;
  highlight: string;
  glow: string;
}

export interface ShapePiece {
  id: string;
  shapeId: string;
  name: string;
  matrix: boolean[][];
  colorKey: BlockColor;
  color: string;
  gradient: [string, string];
  shadow: string;
  highlight: string;
  rowCount: number;
  colCount: number;
  cellCount: number;
}

export interface GridCellData {
  filled: boolean;
  colorKey?: BlockColor;
  clearing?: boolean;
}

export type BlockGrid = GridCellData[][];

export interface GhostPreview {
  row: number;
  col: number;
  valid: boolean;
  piece: ShapePiece;
}

export interface DragPosition {
  x: number;
  y: number;
}

export interface ClearResult {
  newGrid: BlockGrid;
  linesCleared: number;
  clearedRows: number[];
  clearedCols: number[];
  clearedCellCoordinates: Array<{ row: number; col: number; colorKey?: BlockColor }>;
}

export interface ComboEvent {
  streak: number;
  linesCleared: number;
  bonusPoints: number;
  totalPoints: number;
  title: string;
}

export interface ParticleItem {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export interface BlastGameStats {
  highScore: number;
  bestCombo: number;
  totalGames: number;
  totalLinesCleared: number;
}
