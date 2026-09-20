// ============================================================
// GameHub — One Tap Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const ONE_TAP_CONFIG: GameConfig = {
  id: 'one-tap',
  name: 'One Tap',
  category: 'reflex',
  offline: true,
  multiplayer: false,
  route: '/games/one-tap',
  icon: '👆',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 3,
    maxDuration: 120,
  },
  saveSupport: 'none',
  description: 'Single tap timing precision. Tap when the moving indicator hits the center target zone!',
};
