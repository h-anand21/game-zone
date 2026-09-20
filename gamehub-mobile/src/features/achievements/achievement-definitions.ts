// ============================================================
// GameHub — Achievement Definitions
// ============================================================

import type { Achievement } from '@/constants/types';

export const ACHIEVEMENTS: Achievement[] = [
  // General & Milestones
  {
    id: 'ach_first_game',
    code: 'FIRST_GAME',
    name: 'First Step',
    description: 'Play your first game on GameHub',
    icon: '🎮',
    xpReward: 50,
  },
  {
    id: 'ach_10_games',
    code: 'GAMES_10',
    name: 'Casual Gamer',
    description: 'Play 10 total games',
    icon: '⭐',
    xpReward: 100,
  },
  {
    id: 'ach_50_games',
    code: 'GAMES_50',
    name: 'Dedicated Player',
    description: 'Play 50 total games',
    icon: '🔥',
    xpReward: 250,
  },
  {
    id: 'ach_level_5',
    code: 'LEVEL_5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '🌟',
    xpReward: 200,
  },

  // Game-Specific Achievements for Phase 3 Games
  {
    id: 'ach_ttt_winner',
    code: 'TTT_WINNER',
    name: 'Grid Master',
    description: 'Win a game of Tic Tac Toe',
    icon: '❌',
    xpReward: 50,
  },
  {
    id: 'ach_snake_100',
    code: 'SNAKE_100',
    name: 'Snake Charmer',
    description: 'Score 100+ points in Snake',
    icon: '🐍',
    xpReward: 100,
  },
  {
    id: 'ach_mindlock_level5',
    code: 'MINDLOCK_5',
    name: 'Memory Prodigy',
    description: 'Reach round 5 in Mind Lock',
    icon: '🧠',
    xpReward: 150,
  },
  {
    id: 'ach_findone_speedster',
    code: 'FINDONE_SPEED',
    name: 'Eagle Eye',
    description: 'Score 10+ points in Find One',
    icon: '🔍',
    xpReward: 100,
  },
  {
    id: 'ach_numberrush_math',
    code: 'NUMBERRUSH_MATH',
    name: 'Human Calculator',
    description: 'Score 15+ points in Number Rush',
    icon: '🔢',
    xpReward: 120,
  },
];
