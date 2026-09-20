// ============================================================
// GameHub — Snake Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const SNAKE_CONFIG: GameConfig = {
  id: 'snake',
  name: 'Snake',
  category: 'arcade',
  offline: true,
  multiplayer: false,
  route: '/games/snake',
  icon: '🐍',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 50000,
    minDuration: 3,
    maxDuration: 3600,
  },
  saveSupport: 'background',
  description: 'Classic arcade Snake game. Eat food, grow longer, avoid walls and your tail.',
};
