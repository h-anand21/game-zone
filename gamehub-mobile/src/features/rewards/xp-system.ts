// ============================================================
// GameHub — XP & Level Engine
// ============================================================

/**
 * Calculates level from total XP.
 * Standard exponential curve: Level N requires 100 * N^1.5 total XP.
 */
export function getLevelFromXP(xp: number): number {
  if (xp <= 0) return 1;
  let level = 1;
  while (getXPForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

/**
 * Total XP required to reach a given level.
 */
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

/**
 * XP progress towards next level: { current, required, percent }
 */
export function getLevelProgress(xp: number): {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpRequiredForNext: number;
  progressPercent: number;
} {
  const currentLevel = getLevelFromXP(xp);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);

  const xpInCurrentLevel = xp - currentLevelXP;
  const xpRequiredForNext = nextLevelXP - currentLevelXP;
  const progressPercent = Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNext) * 100));

  return {
    currentLevel,
    xpInCurrentLevel,
    xpRequiredForNext,
    progressPercent,
  };
}

/**
 * Calculates XP earned from a completed game session.
 */
export function calculateGameXP(
  score: number,
  durationSeconds: number,
  won: boolean
): number {
  let baseXP = won ? 50 : 20;

  // Additional XP for score
  const scoreBonus = Math.floor(score / 10);

  // Time bonus (up to 30 XP max)
  const timeBonus = Math.min(30, Math.floor(durationSeconds / 5));

  return Math.max(10, baseXP + scoreBonus + timeBonus);
}
