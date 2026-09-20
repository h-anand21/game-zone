// ============================================================
// GameHub — Bagh-Bakri Pure Logic
// ============================================================

import type { BaghBakriBoard, BaghBakriState } from './types';

export function getInitialBaghBakriBoard(): BaghBakriBoard {
  const board: BaghBakriBoard = Array(25).fill(null);
  // 4 Tigers at 4 corners
  board[0] = 'tiger';
  board[4] = 'tiger';
  board[20] = 'tiger';
  board[24] = 'tiger';
  return board;
}
