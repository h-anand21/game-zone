// ============================================================
// GameHub — Stack Master Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const STACK_MASTER_CONFIG: GameConfig = {
  id: 'stack-master',
  name: 'Stack Master',
  category: 'reflex',
  offline: true,
  multiplayer: false,
  route: '/games/stack-master',
  icon: '🏰',
  status: 'available',
  gameVersion: '2.0.0',
  scoreVersion: 'v2',
  validation: {
    maxScore: 10000,
    minDuration: 3,
    maxDuration: 1800,
  },
  saveSupport: 'full',
  description: 'Precision 3D fantasy stacking arcade. Time your drops, slice the overhangs, and climb the skylands spires!',
};
