// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Achievements List
// ============================================================

import type { AchievementItem } from '../game/types';

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first_clear',
    title: 'First Escape',
    description: 'Solve your very first puzzle level.',
    icon: '🚩',
    goal: 1,
    rewardCoins: 50,
    rewardGems: 5,
  },
  {
    id: 'puzzle_apprentice',
    title: 'Puzzle Apprentice',
    description: 'Complete 5 puzzle levels successfully.',
    icon: '📜',
    goal: 5,
    rewardCoins: 150,
    rewardGems: 10,
  },
  {
    id: 'forest_master',
    title: 'Forest Conqueror',
    description: 'Clear all 8 levels of Whispering Forest.',
    icon: '🌲',
    goal: 8,
    rewardCoins: 300,
    rewardGems: 20,
  },
  {
    id: 'perfect_tactician',
    title: 'Three-Star Legend',
    description: 'Earn 3 stars on at least 5 different levels.',
    icon: '⭐',
    goal: 5,
    rewardCoins: 250,
    rewardGems: 15,
  },
  {
    id: 'smooth_operator',
    title: 'Zero Collisions',
    description: 'Complete a level of 5+ arrows without any blocked shake.',
    icon: '🎯',
    goal: 1,
    rewardCoins: 100,
    rewardGems: 10,
  },
  {
    id: 'theme_collector',
    title: 'Kingdom Stylist',
    description: 'Unlock 3 distinct kingdom board themes.',
    icon: '🎨',
    goal: 3,
    rewardCoins: 200,
    rewardGems: 15,
  },
  {
    id: 'daily_voyager',
    title: 'Daily Challenger',
    description: 'Solve the Daily Special puzzle.',
    icon: '📅',
    goal: 1,
    rewardCoins: 120,
    rewardGems: 10,
  },
  {
    id: 'grand_archmage',
    title: 'Grand Archmage',
    description: 'Complete all 15 levels across both worlds.',
    icon: '👑',
    goal: 15,
    rewardCoins: 500,
    rewardGems: 50,
  },
];
