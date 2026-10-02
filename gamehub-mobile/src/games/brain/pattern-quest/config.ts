// ============================================================
// GameHub — Pattern Quest Game Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const PATTERN_QUEST_CONFIG: GameConfig = {
  id: 'pattern-quest',
  name: 'Pattern Quest',
  category: 'brain',
  offline: true,
  multiplayer: false,
  route: '/games/pattern-quest',
  icon: '🧭',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 50000,
    minDuration: 3,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Find the pattern. Continue the adventure.',
};
