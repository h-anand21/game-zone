// ============================================================
// GameHub — Reverse Mind Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const REVERSE_MIND_CONFIG: GameConfig = {
  id: 'reverse-mind',
  name: 'Reverse Mind',
  category: 'brain',
  offline: true,
  multiplayer: false,
  route: '/games/reverse-mind',
  icon: '🔄',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 3,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Memorize the sequence of symbols and enter them in reverse order!',
};
