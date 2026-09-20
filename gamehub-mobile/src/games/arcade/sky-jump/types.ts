// ============================================================
// GameHub — Sky Jump Types
// ============================================================

export interface PlatformItem {
  id: number;
  x: number; // percentage
  y: number; // percentage from bottom
  width: number;
}

export interface SkyJumpState {
  playerX: number;
  playerY: number;
  vy: number;
  score: number;
  platforms: PlatformItem[];
  gameOver: boolean;
}
