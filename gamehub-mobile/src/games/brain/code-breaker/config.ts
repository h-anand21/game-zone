// ============================================================
// GameHub — Code Breaker Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const CODE_BREAKER_CONFIG: GameConfig = {
  id: 'code-breaker',
  name: 'Code Breaker',
  category: 'brain',
  offline: true,
  multiplayer: false,
  route: '/games/code-breaker',
  icon: '🔐',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 5,
    maxDuration: 600,
  },
  saveSupport: 'background',
  description: 'Mastermind-style secret digit code breaker. Deduce the 4-digit code using feedback hints.',
};
