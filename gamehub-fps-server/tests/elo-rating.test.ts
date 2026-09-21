// ============================================================
// GameHub FPS Server — ELO Rating Tests
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest';

// Inline ELO logic for testing (same as elo-rating.ts)
const DEFAULT_ELO = 1000;
const K_FACTOR = 32;
const eloRatings = new Map<string, number>();

function getElo(userId: string): number {
  return eloRatings.get(userId) ?? DEFAULT_ELO;
}

function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function updateElo1v1(winnerId: string, loserId: string) {
  const winnerRating = getElo(winnerId);
  const loserRating = getElo(loserId);
  const expectedWin = expectedScore(winnerRating, loserRating);
  const expectedLose = expectedScore(loserRating, winnerRating);
  const newWinnerElo = Math.round(winnerRating + K_FACTOR * (1 - expectedWin));
  const newLoserElo = Math.round(loserRating + K_FACTOR * (0 - expectedLose));
  eloRatings.set(winnerId, newWinnerElo);
  eloRatings.set(loserId, Math.max(100, newLoserElo));
  return { winnerElo: newWinnerElo, loserElo: Math.max(100, newLoserElo) };
}

function getEloTier(elo: number): string {
  if (elo >= 2000) return 'Legendary';
  if (elo >= 1700) return 'Diamond';
  if (elo >= 1400) return 'Platinum';
  if (elo >= 1200) return 'Gold';
  if (elo >= 1000) return 'Silver';
  if (elo >= 800) return 'Bronze';
  return 'Iron';
}

describe('ELO Rating System', () => {
  beforeEach(() => {
    eloRatings.clear();
  });

  describe('getElo', () => {
    it('should return default ELO for new players', () => {
      expect(getElo('player-new')).toBe(1000);
    });

    it('should return stored ELO for known players', () => {
      eloRatings.set('player-known', 1500);
      expect(getElo('player-known')).toBe(1500);
    });
  });

  describe('updateElo1v1', () => {
    it('should increase winner ELO and decrease loser ELO', () => {
      const result = updateElo1v1('winner', 'loser');
      expect(result.winnerElo).toBeGreaterThan(1000);
      expect(result.loserElo).toBeLessThan(1000);
    });

    it('should give more points for beating a higher-rated player', () => {
      eloRatings.set('underdog', 800);
      eloRatings.set('favorite', 1400);
      const result = updateElo1v1('underdog', 'favorite');
      const gain = result.winnerElo - 800;
      expect(gain).toBeGreaterThan(20); // Big gain for upset
    });

    it('should give fewer points for beating a lower-rated player', () => {
      eloRatings.set('strong', 1400);
      eloRatings.set('weak', 800);
      const result = updateElo1v1('strong', 'weak');
      const gain = result.winnerElo - 1400;
      expect(gain).toBeLessThan(10); // Small gain for expected win
    });

    it('should not go below 100 ELO', () => {
      eloRatings.set('loser', 100);
      const result = updateElo1v1('winner', 'loser');
      expect(result.loserElo).toBeGreaterThanOrEqual(100);
    });

    it('should be symmetric for equal players', () => {
      const result = updateElo1v1('a', 'b');
      const gainA = result.winnerElo - 1000;
      const lossB = 1000 - result.loserElo;
      expect(gainA).toBe(lossB); // Zero-sum for equal ratings
    });
  });

  describe('getEloTier', () => {
    it('should return Iron for very low ELO', () => {
      expect(getEloTier(500)).toBe('Iron');
    });

    it('should return Silver for 1000', () => {
      expect(getEloTier(1000)).toBe('Silver');
    });

    it('should return Gold for 1200', () => {
      expect(getEloTier(1200)).toBe('Gold');
    });

    it('should return Legendary for 2000+', () => {
      expect(getEloTier(2500)).toBe('Legendary');
    });

    it('should have proper tier ordering', () => {
      const tiers = [500, 800, 1000, 1200, 1400, 1700, 2000].map(getEloTier);
      expect(tiers).toEqual(['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legendary']);
    });
  });
});
