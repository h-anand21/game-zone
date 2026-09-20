// ============================================================
// GameHub — Tic Tac Toe Pure Logic
// ============================================================

import type { Board, PlayerSymbol, AIDifficulty } from './types';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function checkWinner(board: Board): { winner: PlayerSymbol | 'DRAW' | null; combo?: number[] } {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { winner: 'DRAW' };
  }

  return { winner: null };
}

export function getAIMove(board: Board, difficulty: AIDifficulty): number {
  const emptyIndices = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((val): val is number => val !== null);

  if (emptyIndices.length === 0) return -1;

  if (difficulty === 'easy') {
    // Random move
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // Hard AI — Minimax
  let bestScore = -Infinity;
  let bestMove = emptyIndices[0];

  for (const index of emptyIndices) {
    board[index] = 'O';
    const score = minimax(board, 0, false);
    board[index] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
}

function minimax(board: Board, depth: number, isMaximizing: boolean): number {
  const { winner } = checkWinner(board);

  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (winner === 'DRAW') return 0;

  const emptyIndices = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((val): val is number => val !== null);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const index of emptyIndices) {
      board[index] = 'O';
      const score = minimax(board, depth + 1, false);
      board[index] = null;
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const index of emptyIndices) {
      board[index] = 'X';
      const score = minimax(board, depth + 1, true);
      board[index] = null;
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
}
