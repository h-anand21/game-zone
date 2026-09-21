// ============================================================
// GameHub — Game History Tests
// ============================================================

import {
  addGameHistory,
  getRecentGames,
  getGameHistory,
  getGameStats,
  getGlobalStats,
  clearGameHistory,
  formatPlayTime,
} from '../game-history';
import type { GameHistoryEntry } from '../game-history';

function createEntry(overrides: Partial<GameHistoryEntry> = {}): GameHistoryEntry {
  return {
    id: `test-${Math.random().toString(36).substr(2, 6)}`,
    gameId: 'tic-tac-toe',
    gameName: 'Tic Tac Toe',
    category: 'party',
    score: 100,
    duration: 60,
    result: 'win',
    difficulty: 'normal',
    xpEarned: 15,
    coinsEarned: 5,
    achievementsUnlocked: [],
    playedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('Game History', () => {
  beforeEach(() => {
    clearGameHistory();
  });

  describe('addGameHistory', () => {
    it('should add entries', () => {
      addGameHistory(createEntry());
      expect(getRecentGames(10).length).toBe(1);
    });

    it('should prepend (newest first)', () => {
      addGameHistory(createEntry({ score: 100 }));
      addGameHistory(createEntry({ score: 200 }));
      const recent = getRecentGames(10);
      expect(recent[0].score).toBe(200);
    });
  });

  describe('getRecentGames', () => {
    it('should respect limit', () => {
      for (let i = 0; i < 10; i++) addGameHistory(createEntry());
      expect(getRecentGames(5).length).toBe(5);
    });

    it('should support offset', () => {
      for (let i = 0; i < 10; i++) addGameHistory(createEntry({ score: i }));
      const page2 = getRecentGames(5, 5);
      expect(page2.length).toBe(5);
    });
  });

  describe('getGameHistory', () => {
    it('should filter by gameId', () => {
      addGameHistory(createEntry({ gameId: 'tic-tac-toe' }));
      addGameHistory(createEntry({ gameId: 'chess' }));
      addGameHistory(createEntry({ gameId: 'tic-tac-toe' }));

      const tttHistory = getGameHistory('tic-tac-toe');
      expect(tttHistory.length).toBe(2);
      expect(tttHistory.every((e) => e.gameId === 'tic-tac-toe')).toBe(true);
    });
  });

  describe('getGameStats', () => {
    it('should aggregate stats correctly', () => {
      addGameHistory(createEntry({ result: 'win', score: 100 }));
      addGameHistory(createEntry({ result: 'loss', score: 50 }));
      addGameHistory(createEntry({ result: 'win', score: 150 }));

      const stats = getGameStats('tic-tac-toe');
      expect(stats).not.toBeNull();
      expect(stats!.totalGamesPlayed).toBe(3);
      expect(stats!.totalWins).toBe(2);
      expect(stats!.totalLosses).toBe(1);
      expect(stats!.winRate).toBe(67);
      expect(stats!.bestScore).toBe(150);
    });

    it('should return null for unknown game', () => {
      expect(getGameStats('nonexistent')).toBeNull();
    });
  });

  describe('getGlobalStats', () => {
    it('should aggregate across all games', () => {
      addGameHistory(createEntry({ gameId: 'ttt', xpEarned: 10, coinsEarned: 5 }));
      addGameHistory(createEntry({ gameId: 'chess', xpEarned: 20, coinsEarned: 10 }));

      const global = getGlobalStats();
      expect(global.totalGames).toBe(2);
      expect(global.totalXP).toBe(30);
      expect(global.totalCoins).toBe(15);
    });
  });

  describe('formatPlayTime', () => {
    it('should format seconds', () => {
      expect(formatPlayTime(30)).toBe('30s');
    });

    it('should format minutes', () => {
      expect(formatPlayTime(120)).toBe('2m');
    });

    it('should format hours', () => {
      expect(formatPlayTime(3661)).toBe('1h 1m');
    });
  });
});
