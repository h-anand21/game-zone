// ============================================================
// GameHub — Don't Tap Wrong Pure Logic
// ============================================================

import type { GridTileItem } from './types';

export function generateTileGrid(gridSize = 9): GridTileItem[] {
  const correctCount = Math.floor(Math.random() * 2) + 2; // 2-3 green
  const wrongCount = Math.floor(Math.random() * 2) + 1;   // 1-2 red

  const tiles: GridTileItem[] = Array.from({ length: gridSize }).map((_, idx) => ({
    id: idx,
    type: 'empty',
  }));

  const availableIndices = Array.from({ length: gridSize }).map((_, i) => i).sort(() => Math.random() - 0.5);

  for (let i = 0; i < correctCount; i++) {
    tiles[availableIndices.pop()!] = { id: i, type: 'correct' };
  }

  for (let i = 0; i < wrongCount; i++) {
    tiles[availableIndices.pop()!] = { id: i, type: 'wrong' };
  }

  return tiles;
}
