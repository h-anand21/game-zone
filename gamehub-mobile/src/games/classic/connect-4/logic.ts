// ============================================================
// GameHub — Connect 4 Pure Logic
// ============================================================

import type { Connect4Board, ChipColor } from './types';

export const ROWS = 6;
export const COLS = 7;

export function getInitialConnect4Board(): Connect4Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export function dropChip(board: Connect4Board, col: number, color: ChipColor): Connect4Board | null {
  const newBoard = board.map((r) => [...r]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!newBoard[r][col]) {
      newBoard[r][col] = color;
      return newBoard;
    }
  }
  return null; // Column full
}

export function checkConnect4Win(board: Connect4Board): ChipColor {
  // Check horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const val = board[r][c];
      if (val && val === board[r][c + 1] && val === board[r][c + 2] && val === board[r][c + 3]) {
        return val;
      }
    }
  }

  // Check vertical
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS; c++) {
      const val = board[r][c];
      if (val && val === board[r + 1][c] && val === board[r + 2][c] && val === board[r + 3][c]) {
        return val;
      }
    }
  }

  // Check diagonal down-right
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const val = board[r][c];
      if (val && val === board[r + 1][c + 1] && val === board[r + 2][c + 2] && val === board[r + 3][c + 3]) {
        return val;
      }
    }
  }

  // Check diagonal up-right
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const val = board[r][c];
      if (val && val === board[r - 1][c + 1] && val === board[r - 2][c + 2] && val === board[r - 3][c + 3]) {
        return val;
      }
    }
  }

  return null;
}
