// ============================================================
// GameHub — Level System Tests
// ============================================================

import { getLevelFromXP, checkLevelUp, getXPForLevel, getLevelTitle, getLevelReward } from '../level-system';

describe('Level System', () => {
  describe('getLevelFromXP', () => {
    it('should return level 1 for 0 XP', () => {
      const info = getLevelFromXP(0);
      expect(info.level).toBe(1);
      expect(info.currentXP).toBe(0);
      expect(info.isMaxLevel).toBe(false);
    });

    it('should return correct level for moderate XP', () => {
      const info = getLevelFromXP(500);
      expect(info.level).toBeGreaterThan(1);
      expect(info.progressPercent).toBeGreaterThanOrEqual(0);
      expect(info.progressPercent).toBeLessThanOrEqual(100);
    });

    it('should have progress between 0-100%', () => {
      for (const xp of [0, 100, 250, 500, 1000, 5000]) {
        const info = getLevelFromXP(xp);
        expect(info.progressPercent).toBeGreaterThanOrEqual(0);
        expect(info.progressPercent).toBeLessThanOrEqual(100);
      }
    });

    it('should return xpNeeded >= 0', () => {
      const info = getLevelFromXP(100);
      expect(info.xpNeeded).toBeGreaterThanOrEqual(0);
    });

    it('should increase level monotonically with XP', () => {
      let prevLevel = 0;
      for (let xp = 0; xp <= 10000; xp += 100) {
        const info = getLevelFromXP(xp);
        expect(info.level).toBeGreaterThanOrEqual(prevLevel);
        prevLevel = info.level;
      }
    });
  });

  describe('checkLevelUp', () => {
    it('should detect level up', () => {
      const result = checkLevelUp(0, 500);
      expect(result.newLevel).toBeGreaterThan(result.oldLevel);
      if (result.levelsGained > 0) {
        expect(result.leveledUp).toBe(true);
      }
    });

    it('should not level up for tiny XP addition', () => {
      const result = checkLevelUp(0, 1);
      expect(result.levelsGained).toBe(0);
      expect(result.leveledUp).toBe(false);
    });
  });

  describe('getXPForLevel', () => {
    it('should return 0 XP for level 0', () => {
      expect(getXPForLevel(0)).toBe(0);
    });

    it('should return increasing XP thresholds', () => {
      let prev = 0;
      for (let lvl = 1; lvl <= 50; lvl++) {
        const xp = getXPForLevel(lvl);
        expect(xp).toBeGreaterThanOrEqual(prev);
        prev = xp;
      }
    });
  });

  describe('getLevelTitle', () => {
    it('should return Beginner for level 1', () => {
      expect(getLevelTitle(1)).toContain('Beginner');
    });

    it('should return Legendary for level 90+', () => {
      expect(getLevelTitle(95)).toContain('Legendary');
    });

    it('should return a string for all levels', () => {
      for (let lvl = 1; lvl <= 100; lvl++) {
        expect(getLevelTitle(lvl)).toBeTruthy();
      }
    });
  });

  describe('getLevelReward', () => {
    it('should return reward at milestone levels', () => {
      const reward5 = getLevelReward(5);
      expect(reward5).not.toBeNull();
      expect(reward5!.coins).toBeGreaterThan(0);
    });

    it('should return null for non-milestone levels', () => {
      expect(getLevelReward(3)).toBeNull();
      expect(getLevelReward(7)).toBeNull();
    });

    it('should have increasing coin rewards', () => {
      const r5 = getLevelReward(5)!.coins;
      const r10 = getLevelReward(10)!.coins;
      const r50 = getLevelReward(50)!.coins;
      expect(r10).toBeGreaterThan(r5);
      expect(r50).toBeGreaterThan(r10);
    });
  });
});
