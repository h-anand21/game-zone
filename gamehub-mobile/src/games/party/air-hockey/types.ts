// ============================================================
// GameHub — Air Hockey Types
// ============================================================

export interface AirHockeyState {
  playerX: number;
  playerY: number;
  aiX: number;
  aiY: number;
  puckX: number;
  puckY: number;
  puckVx: number;
  puckVy: number;
  playerScore: number;
  aiScore: number;
  gameOver: boolean;
}
