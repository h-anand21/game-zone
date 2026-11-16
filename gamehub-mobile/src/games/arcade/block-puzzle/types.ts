// ============================================================
// GameHub — Falling Jewel Blast Types & Interfaces
// ============================================================

export type BlockColor =
  | 'cyan'
  | 'amber'
  | 'ruby'
  | 'green'
  | 'purple'
  | 'orange'
  | 'blue';

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface ColorTheme {
  name: BlockColor;
  main: string;
  gradient: [string, string];
  shadow: string;
  highlight: string;
  glow: string;
}

export interface TetrominoShape {
  type: TetrominoType;
  name: string;
  rotations: boolean[][][]; // 4 rotation states
  colorKey: BlockColor;
}

export interface ActivePiece {
  type: TetrominoType;
  rotationIndex: number;
  matrix: boolean[][];
  colorKey: BlockColor;
  row: number; // Current board row (top-left)
  col: number; // Current board col (top-left)
}

export interface GridCellData {
  filled: boolean;
  colorKey?: BlockColor;
  isClearing?: boolean;
}

export type FallingGrid = GridCellData[][]; // 20 rows x 10 cols

export interface LineClearResult {
  newGrid: FallingGrid;
  linesCleared: number;
  clearedRowIndices: number[];
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
  totalLines: number;
}
