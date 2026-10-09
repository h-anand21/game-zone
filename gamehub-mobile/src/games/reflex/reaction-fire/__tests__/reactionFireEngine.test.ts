// ============================================================
// REACTION FIRE — Unit Tests for Core Timing, Engine & Persistence
// ============================================================

import {
  getMonotonicNow,
  getRandomDelayMs,
  formatMs,
} from '../logic/timing';
import {
  getClassification,
  getMean,
  getMedian,
  calculateReactionScore,
  evaluateRunResult,
} from '../logic/reactionEngine';
import {
  getTodayDateString,
  createInitialDailyState,
  DEFAULT_DAILY_CHALLENGE,
} from '../logic/dailyChallenge';
import {
  calculateLevel,
  evaluateMissionsAndAchievements,
  INITIAL_MISSIONS,
  INITIAL_ACHIEVEMENTS,
} from '../logic/missions';
import { DEFAULT_STATS } from '../storage/reactionStorage';

describe('Reaction Fire: Timing Logic', () => {
  it('returns valid monotonic timestamps', () => {
    const t1 = getMonotonicNow();
    expect(typeof t1).toBe('number');
    expect(t1).toBeGreaterThanOrEqual(0);
  });

  it('generates random delays strictly within the 1000-4000ms bounds', () => {
    for (let i = 0; i < 50; i++) {
      const delay = getRandomDelayMs(1000, 4000);
      expect(delay).toBeGreaterThanOrEqual(1000);
      expect(delay).toBeLessThanOrEqual(4000);
    }
  });

  it('formats reaction time in milliseconds correctly', () => {
    expect(formatMs(null)).toBe('-- ms');
    expect(formatMs(248)).toBe('248 ms');
    expect(formatMs(0)).toBe('0 ms');
  });
});

describe('Reaction Fire: Performance Classifications & Math', () => {
  it('classifies reaction times according to exact specification rules', () => {
    expect(getClassification(null)).toBe('Keep Training');
    expect(getClassification(-10)).toBe('Keep Training');
    expect(getClassification(200)).toBe('Lightning Fast');
    expect(getClassification(249)).toBe('Lightning Fast');
    expect(getClassification(250)).toBe('Fast / Great');
    expect(getClassification(349)).toBe('Fast / Great');
    expect(getClassification(350)).toBe('Good');
    expect(getClassification(499)).toBe('Good');
    expect(getClassification(500)).toBe('Normal');
    expect(getClassification(699)).toBe('Normal');
    expect(getClassification(700)).toBe('Keep Training');
    expect(getClassification(950)).toBe('Keep Training');
  });

  it('calculates arithmetic mean correctly', () => {
    expect(getMean([])).toBe(0);
    expect(getMean([200, 300, 400])).toBe(300);
    expect(getMean([250, 260])).toBe(255);
  });

  it('calculates statistical median correctly for odd and even sets', () => {
    expect(getMedian([])).toBe(0);
    expect(getMedian([210, 250, 300])).toBe(250);
    expect(getMedian([300, 210, 250])).toBe(250); // unsorted input test
    expect(getMedian([200, 220, 280, 300])).toBe(250); // even length (220+280)/2
  });

  it('computes arcade score with higher points for faster reactions', () => {
    const fastScore = calculateReactionScore(180);
    const midScore = calculateReactionScore(320);
    const slowScore = calculateReactionScore(600);

    expect(fastScore).toBeGreaterThan(midScore);
    expect(midScore).toBeGreaterThan(slowScore);
    expect(calculateReactionScore(-5)).toBe(0);
  });
});

describe('Reaction Fire: Run Result Evaluation', () => {
  it('evaluates Classic mode victory target (<350ms with 0 false starts)', () => {
    const successResult = evaluateRunResult({
      mode: 'classic',
      roundTimes: [290],
      falseStartsCount: 0,
      previousBestMs: 350,
    });

    expect(successResult.targetReached).toBe(true);
    expect(successResult.reactionTimeMs).toBe(290);
    expect(successResult.classification).toBe('Fast / Great');
    expect(successResult.isNewBest).toBe(true);

    const falseStartResult = evaluateRunResult({
      mode: 'classic',
      roundTimes: [],
      falseStartsCount: 1,
      previousBestMs: 300,
    });

    expect(falseStartResult.targetReached).toBe(false);
    expect(falseStartResult.reactionTimeMs).toBeNull();
    expect(falseStartResult.classification).toBe('Keep Training');
    expect(falseStartResult.isNewBest).toBe(false);
  });

  it('evaluates Five-Round mode calculating both mean and median', () => {
    const rounds = [240, 260, 280, 250, 270];
    const result = evaluateRunResult({
      mode: 'five-round',
      roundTimes: rounds,
      falseStartsCount: 0,
      previousBestMs: null,
    });

    expect(result.meanTimeMs).toBe(260);
    expect(result.medianTimeMs).toBe(260);
    expect(result.totalRoundsCompleted).toBe(5);
    expect(result.targetReached).toBe(true); // target is 350ms
  });

  it('evaluates Endurance mode tracking valid hits and score', () => {
    const result = evaluateRunResult({
      mode: 'endurance',
      roundTimes: [230, 240, 250],
      falseStartsCount: 1,
      previousBestMs: null,
      totalValidHits: 12,
      timeSurvivedSeconds: 30,
    });

    expect(result.totalValidHits).toBe(12);
    expect(result.score).toBe(1200); // 12 * 100
  });
});

describe('Reaction Fire: Daily Challenge & Missions', () => {
  it('initializes daily challenge state with 5 attempts', () => {
    const dateStr = getTodayDateString();
    const state = createInitialDailyState(dateStr);

    expect(state.date).toBe(dateStr);
    expect(state.attemptsLeft).toBe(DEFAULT_DAILY_CHALLENGE.maxAttempts);
    expect(state.completed).toBe(false);
    expect(state.bestTimeMs).toBeNull();
  });

  it('calculates player levels from earned XP', () => {
    expect(calculateLevel(0)).toEqual({ level: 1, currentXp: 0, nextLevelXp: 500 });
    expect(calculateLevel(499)).toEqual({ level: 1, currentXp: 499, nextLevelXp: 500 });
    expect(calculateLevel(500)).toEqual({ level: 2, currentXp: 0, nextLevelXp: 500 });
    expect(calculateLevel(1250)).toEqual({ level: 3, currentXp: 250, nextLevelXp: 500 });
  });

  it('evaluates and advances missions and achievements upon achievements', () => {
    const testStats = {
      ...DEFAULT_STATS,
      completedGames: 3,
      bestTimeMs: 230,
    };

    const { updatedMissions, updatedAchievements } = evaluateMissionsAndAchievements(
      INITIAL_MISSIONS,
      INITIAL_ACHIEVEMENTS,
      testStats,
      undefined,
      true // dailyCompleted
    );

    // Warm Up Reflexes mission (3 games)
    const play3 = updatedMissions.find((m) => m.id === 'm-play-3');
    expect(play3?.completed).toBe(true);

    // Lightning Reflex mission (sub 250ms)
    const fast250 = updatedMissions.find((m) => m.id === 'm-fast-250');
    expect(fast250?.completed).toBe(true);

    // Lightning Fast achievement (< 250ms)
    const achFast = updatedAchievements.find((a) => a.id === 'ach-sub-250');
    expect(achFast?.unlocked).toBe(true);

    // Daily master achievement
    const achDaily = updatedAchievements.find((a) => a.id === 'ach-daily-master');
    expect(achDaily?.unlocked).toBe(true);
  });
});
