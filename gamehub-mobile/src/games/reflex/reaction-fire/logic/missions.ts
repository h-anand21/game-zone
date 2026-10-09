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
