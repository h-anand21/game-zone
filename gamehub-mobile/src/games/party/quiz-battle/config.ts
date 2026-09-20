// ============================================================
// GameHub — Quiz Battle Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const QUIZ_BATTLE_CONFIG: GameConfig = {
  id: 'quiz-battle',
  name: 'Quiz Battle',
  category: 'party',
  offline: true,
  multiplayer: true,
  route: '/games/quiz-battle',
  icon: '❓',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 10000,
    minDuration: 10,
    maxDuration: 300,
  },
  saveSupport: 'none',
  description: 'Test your general knowledge across multiple categories under time pressure!',
};
