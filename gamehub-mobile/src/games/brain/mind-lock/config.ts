// ============================================================
// GameHub — Mind Lock Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const MIND_LOCK_CONFIG: GameConfig = {
  id: 'mind-lock',
  name: 'Mind Lock',
  category: 'brain',
  offline: true,
  multiplayer: false,
  route: '/games/mind-lock',
  icon: '🧠',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 3,
    maxDuration: 600,
  },
  saveSupport: 'background',
  description: 'Simon-like sequence memory game. Remember the pattern of glowing pads and repeat it.',
};
