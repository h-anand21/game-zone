// ============================================================
// GameHub — Don't Tap Wrong Types
// ============================================================

export interface GridTileItem {
  id: number;
  type: 'correct' | 'wrong' | 'empty';
}
