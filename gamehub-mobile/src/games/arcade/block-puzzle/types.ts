// ============================================================
// GameHub — Block Puzzle Types
// ============================================================

export type BlockGrid = boolean[][];

export interface ShapePiece {
  id: number;
  matrix: boolean[][];
  color: string;
}
