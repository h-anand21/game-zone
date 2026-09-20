// ============================================================
// GameHub — Tic Tac Toe Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const TIC_TAC_TOE_CONFIG: GameConfig = {
  id: 'tic-tac-toe',
  name: 'Tic Tac Toe',
  category: 'party',
  offline: true,
  multiplayer: true,
  route: '/games/tic-tac-toe',
  icon: '❌',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 1,
    minDuration: 2,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Classic 3x3 grid game. Play against AI or a local friend.',
};
