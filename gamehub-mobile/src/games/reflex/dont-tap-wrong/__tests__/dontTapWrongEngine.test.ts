// ============================================================
// DON'T TAP WRONG — Core Engine Unit Tests
// Tests board generation, deterministic seeding, scoring, and telemetry
// ============================================================

import {
  generateBoard,
  generatePracticeBoard,
  getDailySeed,
  generateTileGrid,
} from '../engine/boardGenerator';
import {
  calculateAccuracy,
  getStreakMilestone,
  getGradeForScore,
  evaluateRunTelemetry,
} from '../engine/gameEngine';
import { DTW_MODES } from '../config';

describe("Don't Tap Wrong — Engine & Rules", () => {
  describe('Board Generation', () => {
    it('generates a 3x3 board containing exactly 9 tiles with unique keys', () => {
      const mode = DTW_MODES.classic;
      const { tiles, revision } = generateBoard(mode);

      expect(tiles).toHaveLength(9);
      expect(revision).toBeGreaterThan(0);

      const keys = new Set(tiles.map((t) => t.key));
      expect(keys.size).toBe(9);
    });

    it('always guarantees at least 1 safe green tile and at least 1 danger red tile', () => {
      const mode = DTW_MODES.classic;

      for (let i = 0; i < 50; i++) {
        const { tiles } = generateBoard(mode);
        const safeCount = tiles.filter((t) => t.type === 'safe').length;
        const dangerCount = tiles.filter((t) => t.type === 'danger').length;

        expect(safeCount).toBeGreaterThanOrEqual(1);
        expect(dangerCount).toBeGreaterThanOrEqual(1);
        expect(safeCount + dangerCount).toBeLessThanOrEqual(9);
      }
    });

    it('generates identical board sequence when using the same daily seed', () => {
      const seed = getDailySeed('2026-10-09');
      const mode = DTW_MODES.daily;

      const boardA = generateBoard(mode, 0, seed, 0);
      const boardB = generateBoard(mode, 0, seed, 0);

      const typesA = boardA.tiles.map((t) => t.type);
      const typesB = boardB.tiles.map((t) => t.type);

      expect(typesA).toEqual(typesB);
    });

    it('supports practice board generation for steps 1, 2, and 3', () => {
      const step1 = generatePracticeBoard(1);
      expect(step1).toHaveLength(9);
      expect(step1[4].type).toBe('safe'); // Center tile

      const step2 = generatePracticeBoard(2);
      expect(step2).toHaveLength(9);
      expect(step2.some((t) => t.type === 'safe')).toBe(true);
      expect(step2.some((t) => t.type === 'danger')).toBe(true);

      const step3 = generatePracticeBoard(3);
      expect(step3).toHaveLength(9);
      expect(step3.filter((t) => t.type === 'safe').length).toBe(2);
      expect(step3.filter((t) => t.type === 'danger').length).toBe(2);
    });

    it('supports backward-compatible generateTileGrid', () => {
      const grid = generateTileGrid(9);
      expect(grid).toHaveLength(9);
      expect(grid.some((t) => t.type === 'correct')).toBe(true);
      expect(grid.some((t) => t.type === 'wrong')).toBe(true);
    });
  });

  describe('Scoring & Accuracy', () => {
    it('calculates accuracy percentage accurately', () => {
      expect(calculateAccuracy(0, 0)).toBe(100); // 0 taps default
      expect(calculateAccuracy(10, 0)).toBe(100);
      expect(calculateAccuracy(9, 1)).toBe(90);
      expect(calculateAccuracy(15, 5)).toBe(75);
    });

    it('detects streak milestones correctly', () => {
      expect(getStreakMilestone(4)).toBeNull();
      expect(getStreakMilestone(5)).toContain('5 STREAK');
      expect(getStreakMilestone(10)).toContain('10 STREAK');
      expect(getStreakMilestone(15)).toContain('UNSTOPPABLE');
      expect(getStreakMilestone(20)).toContain('GODLIKE');
      expect(getStreakMilestone(25)).toContain('25 ULTRA STREAK');
    });

    it('assigns performance grades correctly', () => {
      expect(getGradeForScore(25, 'classic').grade).toBe('S+');
      expect(getGradeForScore(20, 'classic').grade).toBe('S');
      expect(getGradeForScore(15, 'classic').grade).toBe('A');
      expect(getGradeForScore(10, 'classic').grade).toBe('B');
      expect(getGradeForScore(5, 'classic').grade).toBe('C');
    });
  });

  describe('Telemetry Evaluation', () => {
    it('evaluates target reached when score >= 15 with zero red taps in Classic', () => {
      const modeConfig = DTW_MODES.classic;

      const winningRun = evaluateRunTelemetry({
        mode: 'classic',
        modeConfig,
        score: 16,
        bestStreak: 16,
        currentStreak: 16,
        safeTaps: 16,
        dangerTaps: 0,
        durationElapsedSeconds: 20,
        reason: 'time_up',
        previousHighScore: 14,
      });

      expect(winningRun.targetReached).toBe(true);
      expect(winningRun.isNewBest).toBe(true);
      expect(winningRun.accuracy).toBe(100);
    });

    it('evaluates target failed when a danger red tile is tapped', () => {
      const modeConfig = DTW_MODES.classic;

      const failedRun = evaluateRunTelemetry({
        mode: 'classic',
        modeConfig,
        score: 12,
        bestStreak: 12,
        currentStreak: 0,
        safeTaps: 12,
        dangerTaps: 1,
        durationElapsedSeconds: 14.5,
        reason: 'danger_tap',
        previousHighScore: 15,
      });

      expect(failedRun.targetReached).toBe(false);
      expect(failedRun.isNewBest).toBe(false);
      expect(failedRun.reason).toBe('danger_tap');
      expect(failedRun.accuracy).toBe(92);
    });
  });
});
