// ============================================================
// GameHub — Carrom Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const CARROM_CONFIG: GameConfig = {
  id: 'carrom',
  name: 'Carrom',
  category: 'classic',
  offline: true,
  multiplayer: false,
  route: '/games/carrom',
  icon: '⚪',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 1000,
    minDuration: 30,
    maxDuration: 1800,
  },
  saveSupport: 'none',
  description: 'Flick the striker to pocket white and black coins into the corner pockets!',
};
