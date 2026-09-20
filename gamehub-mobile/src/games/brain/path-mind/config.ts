// ============================================================
// GameHub — Path Mind Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const PATH_MIND_CONFIG: GameConfig = {
  id: 'path-mind',
  name: 'Path Mind',
  category: 'brain',
  offline: true,
  multiplayer: false,
  route: '/games/path-mind',
  icon: '🛤️',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 3,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Memorize the glowing path through the grid and retrace it step by step!',
};
