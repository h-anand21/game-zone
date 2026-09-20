// ============================================================
// GameHub — Carrom Types
// ============================================================

export interface CarromPuck {
  id: number;
  type: 'white' | 'black' | 'red' | 'striker';
  x: number;
  y: number;
  vx: number;
  vy: number;
  isPocketed: boolean;
}
