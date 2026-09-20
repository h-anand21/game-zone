// ============================================================
// GameHub Backend — Score Validation & Anti-Cheat Unit Test
// ============================================================

import { describe, it, expect } from 'vitest';

interface ScoreSubmission {
  gameId: string;
  score: number;
  durationSeconds: number;
}

const SCORE_LIMITS: Record<string, { maxScore: number; minDuration: number }> = {
  snake: { maxScore: 50000, minDuration: 5 },
  'mind-lock': { maxScore: 10000, minDuration: 3 },
  'fps-arena': { maxScore: 100000, minDuration: 10 },
};

function validateScore(submission: ScoreSubmission): { valid: boolean; reason?: string } {
  const limits = SCORE_LIMITS[submission.gameId];
  if (!limits) return { valid: false, reason: 'Unknown gameId' };

  if (submission.score < 0 || submission.score > limits.maxScore) {
    return { valid: false, reason: 'Score out of valid range' };
  }

  if (submission.durationSeconds < limits.minDuration) {
    return { valid: false, reason: 'Duration suspiciously short' };
  }

  return { valid: true };
}

describe('Backend Score Validation & Anti-Cheat Engine', () => {
  it('should accept valid snake scores', () => {
    const result = validateScore({ gameId: 'snake', score: 1200, durationSeconds: 45 });
    expect(result.valid).toBe(true);
  });

  it('should reject impossible snake scores', () => {
    const result = validateScore({ gameId: 'snake', score: 999999, durationSeconds: 45 });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Score out of valid range');
  });

  it('should reject suspiciously fast game completions', () => {
    const result = validateScore({ gameId: 'mind-lock', score: 5000, durationSeconds: 1 });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Duration suspiciously short');
  });
});
