// ============================================================
// GameHub — Memory Rush Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const MEMORY_RUSH_CONFIG: GameConfig = {
  id: 'memory-rush',
  name: 'Memory Rush',
  category: 'brain',
  offline: true,
  multiplayer: false,
  route: '/games/memory-rush',
  icon: '⚡',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 500,
    minDuration: 3,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Flip and match pairs of hidden cards under time pressure!',
};
