// ============================================================
// GameHub — Endless Runner Types
// ============================================================

export type Lane = 0 | 1 | 2; // Left, Center, Right

export interface RunnerObstacle {
  id: number;
  lane: Lane;
  y: number; // 0 to 100%
  type: 'obstacle' | 'coin';
}

export interface RunnerState {
  playerLane: Lane;
  score: number;
  coinsCollected: number;
  obstacles: RunnerObstacle[];
  gameOver: boolean;
}
