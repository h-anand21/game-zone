// ============================================================
// GameHub — Block Puzzle Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const BLOCK_PUZZLE_CONFIG: GameConfig = {
  id: 'block-puzzle',
  name: 'Block Puzzle',
  category: 'arcade',
  offline: true,
  multiplayer: false,
  route: '/games/block-puzzle',
  icon: '🟦',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100000,
    minDuration: 10,
    maxDuration: 7200,
  },
  saveSupport: 'background',
  description: 'Place block shapes on the grid. Clear full horizontal or vertical lines to score!',
};
