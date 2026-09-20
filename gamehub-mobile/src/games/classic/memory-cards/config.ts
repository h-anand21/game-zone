// ============================================================
// GameHub — Memory Cards Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const MEMORY_CARDS_CONFIG: GameConfig = {
  id: 'memory-cards',
  name: 'Memory Cards',
  category: 'classic',
  offline: true,
  multiplayer: false,
  route: '/games/memory-cards',
  icon: '🃏',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 10000,
    minDuration: 10,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Classic card matching puzzle. Flip cards and pair all hidden symbols!',
};
