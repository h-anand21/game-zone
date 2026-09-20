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
  icon: '📦',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 200,
    minDuration: 3,
    maxDuration: 300,
  },
  saveSupport: 'none',
  description: 'Stack moving blocks on top of each other. Overhanging parts get chopped off!',
};
