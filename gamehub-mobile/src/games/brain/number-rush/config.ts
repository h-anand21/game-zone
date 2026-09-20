// ============================================================
// GameHub — Number Rush Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const NUMBER_RUSH_CONFIG: GameConfig = {
  id: 'number-rush',
  name: 'Number Rush',
  category: 'brain',
  offline: true,
  multiplayer: false,
  route: '/games/number-rush',
  icon: '🔢',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 200,
    minDuration: 3,
    maxDuration: 300,
  },
  saveSupport: 'none',
  description: 'Rapid-fire mental math. Solve arithmetic questions under time pressure.',
};
