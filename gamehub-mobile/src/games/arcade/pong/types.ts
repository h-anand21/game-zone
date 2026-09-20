// ============================================================
// GameHub — Pong Types
// ============================================================

export interface PongState {
  playerY: number; // 0 to 100%
  aiY: number;     // 0 to 100%
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  playerScore: number;
  aiScore: number;
  gameOver: boolean;
}
