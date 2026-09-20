// ============================================================
// GameHub — Don't Tap Wrong Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const DONT_TAP_WRONG_CONFIG: GameConfig = {
  id: 'dont-tap-wrong',
  name: "Don't Tap Wrong",
  category: 'reflex',
  offline: true,
  multiplayer: false,
  route: '/games/dont-tap-wrong',
  icon: '🚫',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 200,
    minDuration: 3,
    maxDuration: 120,
  },
  saveSupport: 'none',
  description: 'Tap correct green targets, avoid tapping red wrong ones!',
};
