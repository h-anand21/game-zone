// ============================================================
// GameHub — Ludo Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const LUDO_CONFIG: GameConfig = {
  id: 'ludo',
  name: 'Ludo',
  category: 'classic',
  offline: true,
  multiplayer: true,
  route: '/games/ludo',
  icon: '🎲',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 1000,
    minDuration: 30,
    maxDuration: 3600,
  },
  saveSupport: 'full',
  description: 'Classic Ludo board game. Roll dice, move tokens, and reach home before AI opponents!',
};
