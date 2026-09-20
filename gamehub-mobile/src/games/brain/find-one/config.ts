// ============================================================
// GameHub — Find One Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const FIND_ONE_CONFIG: GameConfig = {
  id: 'find-one',
  name: 'Find One',
  category: 'brain',
  offline: true,
  multiplayer: false,
  route: '/games/find-one',
  icon: '🔍',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 2,
    maxDuration: 300,
  },
  saveSupport: 'none',
  description: 'Odd-one-out perception game. Spot the tile with the slightly different color before time runs out!',
};
