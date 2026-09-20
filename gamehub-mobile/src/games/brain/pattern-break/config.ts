// ============================================================
// GameHub — Pattern Break Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const PATTERN_BREAK_CONFIG: GameConfig = {
  id: 'pattern-break',
  name: 'Pattern Break',
  category: 'brain',
  offline: true,
  multiplayer: false,
  route: '/games/pattern-break',
  icon: '🧩',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 3,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Identify the rule-breaking element in a sequence or pattern!',
};
