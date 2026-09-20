// ============================================================
// GameHub — Mini Chess Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const MINI_CHESS_CONFIG: GameConfig = {
  id: 'mini-chess',
  name: 'Mini Chess',
  category: 'classic',
  offline: true,
  multiplayer: false,
  route: '/games/mini-chess',
  icon: '♟️',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 1000,
    minDuration: 30,
    maxDuration: 3600,
  },
  saveSupport: 'full',
  description: 'Fast-paced Chess on a 5x5 / 6x6 mini board vs Minimax AI!',
};
