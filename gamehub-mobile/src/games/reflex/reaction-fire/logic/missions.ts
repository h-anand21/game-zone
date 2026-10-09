// ============================================================
// REACTION FIRE — Missions & Achievements Logic
// ============================================================

import type { MissionItem, AchievementItem, ReactionStats } from '../types';

export const INITIAL_MISSIONS: MissionItem[] = [
  {
    id: 'm-play-3',
    title: 'Warm Up Reflexes',
    description: 'Complete 3 full gameplay sessions in any mode',
    progress: 0,
    target: 3,
    rewardXp: 100,
    completed: false,
    claimed: false,
    type: 'daily',
  },
  {
    id: 'm-fast-250',
    title: 'Lightning Reflex',
    description: 'Record a valid reaction under 250 ms',
    progress: 0,
    target: 1,
    rewardXp: 200,
    completed: false,
    claimed: false,
    type: 'daily',
  },
  {
    id: 'm-try-modes',
    title: 'Mode Explorer',
    description: 'Play at least 2 distinct game modes',
    progress: 0,
    target: 2,
    rewardXp: 150,
    completed: false,
    claimed: false,
    type: 'weekly',
  },
  {
    id: 'm-five-rounds',
    title: 'Consistency Cadet',
    description: 'Finish a complete 5-Round Challenge run',
    progress: 0,
    target: 1,
    rewardXp: 250,
    completed: false,
    claimed: false,
    type: 'weekly',
  },
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-sub-200',
    title: 'Godlike Speed',
    description: 'Achieve a sub-200 ms reaction time',
    icon: '⚡',
    unlocked: false,
    progressText: 'Sub-200 ms required',
  },
  {
    id: 'ach-sub-250',
    title: 'Lightning Fast',
    description: 'Achieve a reaction time under 250 ms',
    icon: '🔥',
    unlocked: false,
    progressText: 'Sub-250 ms required',
  },
  {
    id: 'ach-50-games',
    title: 'Reflex Veteran',
    description: 'Complete 50 competitive games',
    icon: '🛡️',
    unlocked: false,
    progressText: '0 / 50 completed',
  },
  {
    id: 'ach-daily-master',
    title: 'Daily Champion',
    description: 'Conquer the Daily Challenge benchmark',
    icon: '🌟',
    unlocked: false,
    progressText: 'Daily Challenge victory',
  },
];

/**
 * Computes level from XP
 */
export function calculateLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  const xpPerLevel = 500;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentXp = xp % xpPerLevel;
  return { level, currentXp, nextLevelXp: xpPerLevel };
}

/**
 * Evaluates and advances missions & achievements based on player statistics & recent results
 */
export function evaluateMissionsAndAchievements(
  missions: MissionItem[],
  achievements: AchievementItem[],
  stats: ReactionStats,
  lastResult?: RunResult,
  dailyCompleted = false
): { updatedMissions: MissionItem[]; updatedAchievements: AchievementItem[] } {
  const modesPlayed = new Set(stats.recentAttempts.map((a) => a.mode));

  const updatedMissions = missions.map((m) => {
    let progress = m.progress;
    let completed = m.completed;

    if (m.id === 'm-play-3') {
      progress = Math.min(m.target, stats.completedGames);
      if (progress >= m.target) completed = true;
    } else if (m.id === 'm-fast-250') {
      if (stats.bestTimeMs !== null && stats.bestTimeMs <= 250) {
        progress = 1;
        completed = true;
      }
    } else if (m.id === 'm-try-modes') {
      progress = Math.min(m.target, modesPlayed.size);
      if (progress >= m.target) completed = true;
    } else if (m.id === 'm-five-rounds') {
      if (lastResult?.mode === 'five-round' && lastResult.totalRoundsCompleted === 5) {
        progress = 1;
        completed = true;
      }
    }

    return { ...m, progress, completed };
  });

  const updatedAchievements = achievements.map((ach) => {
    let unlocked = ach.unlocked;

    if (ach.id === 'ach-sub-200') {
      if (stats.bestTimeMs !== null && stats.bestTimeMs < 200) unlocked = true;
    } else if (ach.id === 'ach-sub-250') {
      if (stats.bestTimeMs !== null && stats.bestTimeMs < 250) unlocked = true;
    } else if (ach.id === 'ach-50-games') {
      if (stats.completedGames >= 50) unlocked = true;
    } else if (ach.id === 'ach-daily-master') {
      if (dailyCompleted) unlocked = true;
    }

    return { ...ach, unlocked };
  });

  return { updatedMissions, updatedAchievements };
}
