// ============================================================
// GameHub — Aim Rush Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const AIM_RUSH_CONFIG: GameConfig = {
  id: 'aim-rush',
  name: 'Aim Rush',
  category: 'reflex',
  offline: true,
  multiplayer: false,
  route: '/games/aim-rush',
  icon: '🎯',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 200,
    minDuration: 3,
    maxDuration: 120,
  },
  saveSupport: 'none',
  description: 'Tap targets as fast as possible to test accuracy and reaction speed!',
};
