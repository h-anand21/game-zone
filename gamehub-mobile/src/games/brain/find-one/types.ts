// ============================================================
// GameHub — Find One Types
// ============================================================

export interface GridTile {
  id: number;
  color: string;
  isOdd: boolean;
}

export interface RoundData {
  gridSize: number; // e.g. 2, 3, 4, 5
  tiles: GridTile[];
  oddIndex: number;
}
