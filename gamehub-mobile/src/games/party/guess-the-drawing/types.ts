// ============================================================
// GameHub — Guess the Drawing Types
// ============================================================

export interface DrawPoint {
  x: number;
  y: number;
}

export interface DrawLine {
  points: DrawPoint[];
  color: string;
}
