// ============================================================
// GameHub — Sky Jump Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const SKY_JUMP_CONFIG: GameConfig = {
  id: 'sky-jump',
  name: 'Sky Jump',
  category: 'arcade',
  offline: true,
  multiplayer: false,
  route: '/games/sky-jump',
  icon: '🚀',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100000,
    minDuration: 5,
    maxDuration: 1800,
  },
  saveSupport: 'none',
  description: 'Vertical bouncing platformer. Jump higher and higher to reach new heights!',
};
