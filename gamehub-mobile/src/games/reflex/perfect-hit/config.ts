// ============================================================
// GameHub — Perfect Hit Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const PERFECT_HIT_CONFIG: GameConfig = {
  id: 'perfect-hit',
  name: 'Perfect Hit',
  category: 'reflex',
  offline: true,
  multiplayer: false,
  route: '/games/perfect-hit',
  icon: '💥',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 3,
    maxDuration: 120,
  },
  saveSupport: 'none',
  description: 'Precision timing bar test. Hit the center golden zone for maximum score multiplier!',
};
