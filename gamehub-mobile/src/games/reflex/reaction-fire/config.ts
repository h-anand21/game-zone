// ============================================================
// GameHub — Reaction Fire Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const REACTION_FIRE_CONFIG: GameConfig = {
  id: 'reaction-fire',
  name: 'Reaction Fire',
  category: 'reflex',
  offline: true,
  multiplayer: false,
  route: '/games/reaction-fire',
  icon: '🔥',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 1000,
    minDuration: 2,
    maxDuration: 60,
  },
  saveSupport: 'none',
  description: 'Pure reaction speed test. Tap immediately when the screen turns GREEN!',
};
