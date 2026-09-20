// ============================================================
// GameHub — Bagh-Bakri Types
// ============================================================

export type PieceType = 'tiger' | 'goat' | null;
export type BaghBakriBoard = PieceType[];

export interface BaghBakriState {
  board: BaghBakriBoard;
  goatsPlaced: number;
  goatsCaptured: number;
  turn: 'goat' | 'tiger';
  selectedIndex: number | null;
  statusText: string;
}
