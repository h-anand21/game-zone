// ============================================================
// GameHub — Color Bloom Sort Config (Replaces Endless Runner)
// ============================================================

import type { GameConfig } from '@/constants/types';

export const ENDLESS_RUNNER_CONFIG: GameConfig = {
  id: 'endless-runner',
  name: 'Color Bloom Sort',
  category: 'arcade',
  offline: true,
  multiplayer: false,
  route: '/games/endless-runner',
  icon: '🧪',
  status: 'available',
  gameVersion: '2.0.0',
  scoreVersion: 'v2',
  validation: {
    maxScore: 500000,
    minDuration: 2,
    maxDuration: 14400,
  },
  saveSupport: 'background',
  description:
    'Sort vibrant glossy balls into matching glass test tubes! Relaxing, satisfying puzzle with 500+ solvable levels, undo, hint solver, extra tube booster, and customizable themes.',
};
