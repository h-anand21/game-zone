// ============================================================
// DON'T TAP WRONG — Core Logic Entry
// Backward-compatible re-exports and board generation
// ============================================================

export * from './engine/boardGenerator';
export * from './engine/gameEngine';

import { generateBoard } from './engine/boardGenerator';
import type { GameModeConfig, TileItem } from './types';

export function generateBoardTiles(
  mode: GameModeConfig,
  currentScore = 0,
  _gridSize = 9
): TileItem[] {
  return generateBoard(mode, currentScore).tiles;
}
