// ============================================================
// GameHub — Level System
// Calculates player level from total XP using exponential curve
// ============================================================

/** XP thresholds for each level (exponential curve) */
const LEVEL_THRESHOLDS: number[] = [];

// Generate thresholds: Level 1 = 0 XP, Level 2 = 100 XP, etc.
// Formula: XP = baseXP * level^exponent
const BASE_XP = 100;
const EXPONENT = 1.5;
const MAX_LEVEL = 100;

for (let lvl = 0; lvl <= MAX_LEVEL; lvl++) {
  LEVEL_THRESHOLDS.push(Math.floor(BASE_XP * Math.pow(lvl, EXPONENT)));
}

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpProgress: number;         // XP earned within current level
  xpNeeded: number;            // XP remaining to next level
  progressPercent: number;     // 0-100 progress to next level
  isMaxLevel: boolean;
}

/**
 * Calculate level info from total XP
 */
export function getLevelFromXP(totalXP: number): LevelInfo {
  let level = 1;

  for (let i = 1; i <= MAX_LEVEL; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i;
    } else {
      break;
    }
  }

  const isMaxLevel = level >= MAX_LEVEL;
  const xpForCurrentLevel = level > 0 ? (LEVEL_THRESHOLDS[level] || 0) : 0;
  const xpFloor = level > 1 ? (LEVEL_THRESHOLDS[level - 1] || 0) : 0;
  const xpForNextLevel = isMaxLevel ? xpForCurrentLevel : (LEVEL_THRESHOLDS[level + 1] || xpForCurrentLevel);
  const xpProgress = Math.max(0, totalXP - xpFloor);
  const xpNeeded = Math.max(0, xpForNextLevel - totalXP);
  const levelRange = xpForCurrentLevel - xpFloor;
  const progressPercent = levelRange > 0 ? Math.max(0, Math.min(100, Math.floor(((totalXP - xpFloor) / levelRange) * 100))) : (totalXP >= xpForCurrentLevel ? 100 : 0);

  return {
    level,
    currentXP: totalXP,
    xpForCurrentLevel,
    xpForNextLevel,
    xpProgress,
    xpNeeded: Math.max(0, xpNeeded),
    progressPercent,
    isMaxLevel,
  };
}

/**
 * Check if adding XP would cause a level up
 */
export function checkLevelUp(currentXP: number, addedXP: number): { leveledUp: boolean; oldLevel: number; newLevel: number; levelsGained: number } {
  const oldInfo = getLevelFromXP(currentXP);
  const newInfo = getLevelFromXP(currentXP + addedXP);
  const levelsGained = newInfo.level - oldInfo.level;

  return {
    leveledUp: levelsGained > 0,
    oldLevel: oldInfo.level,
    newLevel: newInfo.level,
    levelsGained,
  };
}

/**
 * Get XP required to reach a specific level
 */
export function getXPForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level > MAX_LEVEL) return LEVEL_THRESHOLDS[MAX_LEVEL];
  return LEVEL_THRESHOLDS[level];
}

/**
 * Get the level title/rank name
 */
export function getLevelTitle(level: number): string {
  if (level >= 90) return '🏆 Legendary';
  if (level >= 75) return '💎 Diamond';
  if (level >= 60) return '🥇 Platinum';
  if (level >= 45) return '🥈 Gold';
  if (level >= 30) return '🥉 Silver';
  if (level >= 15) return '⚔️ Bronze';
  if (level >= 5) return '🎮 Rookie';
  return '🌱 Beginner';
}

/**
 * Get level rewards for reaching a specific level
 */
export function getLevelReward(level: number): { coins: number; achievement?: string } | null {
  const LEVEL_REWARDS: Record<number, { coins: number; achievement?: string }> = {
    5: { coins: 50, achievement: 'level_5' },
    10: { coins: 100, achievement: 'level_10' },
    15: { coins: 150 },
    20: { coins: 200, achievement: 'level_20' },
    25: { coins: 300 },
    30: { coins: 400, achievement: 'level_30' },
    40: { coins: 500 },
    50: { coins: 750, achievement: 'level_50' },
    75: { coins: 1000, achievement: 'level_75' },
    100: { coins: 2000, achievement: 'level_100' },
  };
  return LEVEL_REWARDS[level] || null;
}
