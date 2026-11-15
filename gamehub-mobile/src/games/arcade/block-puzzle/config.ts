// ============================================================
// GameHub — Block Blast Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const BLOCK_PUZZLE_CONFIG: GameConfig = {
  id: 'block-puzzle',
  name: 'Block Blast',
  category: 'arcade',
  offline: true,
  multiplayer: false,
  route: '/games/block-puzzle',
  icon: '🧩',
  status: 'available',
  gameVersion: '2.0.0',
  scoreVersion: 'v2',
  validation: {
    maxScore: 500000,
    minDuration: 5,
    maxDuration: 14400,
  },
  saveSupport: 'background',
  description:
    'Drag jewel blocks onto the 8x8 grid. Blast full rows & columns to trigger explosive combo streaks and set high scores!',
};
