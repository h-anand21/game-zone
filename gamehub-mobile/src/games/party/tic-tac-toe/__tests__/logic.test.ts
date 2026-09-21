// ============================================================
// GameHub — Tic Tac Toe Logic Tests
// ============================================================

import { checkWinner, getAIMove } from '../logic';
import type { Board } from '../types';

describe('Tic Tac Toe Logic', () => {
  describe('checkWinner', () => {
    it('should detect X winning on top row', () => {
      const board: Board = ['X', 'X', 'X', null, null, null, null, null, null];
      const result = checkWinner(board);
      expect(result.winner).toBe('X');
      expect(result.combo).toEqual([0, 1, 2]);
    });

    it('should detect O winning on middle row', () => {
      const board: Board = [null, null, null, 'O', 'O', 'O', null, null, null];
      const result = checkWinner(board);
      expect(result.winner).toBe('O');
      expect(result.combo).toEqual([3, 4, 5]);
    });

    it('should detect X winning on diagonal', () => {
      const board: Board = ['X', null, null, null, 'X', null, null, null, 'X'];
      const result = checkWinner(board);
      expect(result.winner).toBe('X');
      expect(result.combo).toEqual([0, 4, 8]);
    });

    it('should detect anti-diagonal win', () => {
      const board: Board = [null, null, 'O', null, 'O', null, 'O', null, null];
      const result = checkWinner(board);
      expect(result.winner).toBe('O');
      expect(result.combo).toEqual([2, 4, 6]);
    });

    it('should detect a draw', () => {
      const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      const result = checkWinner(board);
      expect(result.winner).toBe('DRAW');
    });

    it('should return null when game is still in progress', () => {
      const board: Board = ['X', null, null, null, 'O', null, null, null, null];
      const result = checkWinner(board);
      expect(result.winner).toBeNull();
    });

    it('should return null for empty board', () => {
      const board: Board = Array(9).fill(null);
      const result = checkWinner(board);
      expect(result.winner).toBeNull();
    });

    it('should detect column wins', () => {
      const board: Board = ['X', null, null, 'X', null, null, 'X', null, null];
      const result = checkWinner(board);
      expect(result.winner).toBe('X');
      expect(result.combo).toEqual([0, 3, 6]);
    });
  });

  describe('getAIMove', () => {
    it('should return a valid empty cell index (easy)', () => {
      const board: Board = ['X', null, null, null, 'O', null, null, null, null];
      const move = getAIMove([...board], 'easy');
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
      expect(board[move]).toBeNull();
    });

    it('should block a winning move (hard)', () => {
      // X has top-left and top-middle, AI should block top-right
      const board: Board = ['X', 'X', null, null, 'O', null, null, null, null];
      const move = getAIMove([...board], 'hard');
      expect(move).toBe(2); // Block the win
    });

    it('should take winning move when available (hard)', () => {
      // O has center and top-left, and can win at bottom-right
      const board: Board = ['O', 'X', null, null, 'O', null, null, 'X', null];
      const move = getAIMove([...board], 'hard');
      expect(move).toBe(8); // Win at bottom-right
    });

    it('should return -1 for full board', () => {
      const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      const move = getAIMove([...board], 'hard');
      expect(move).toBe(-1);
    });

    it('should pick center on first move (hard)', () => {
      const board: Board = ['X', null, null, null, null, null, null, null, null];
      const move = getAIMove([...board], 'hard');
      expect(move).toBe(4); // Center is best response
    });
  });
});
