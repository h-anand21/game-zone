// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Gamehub Configuration
// ============================================================

import type { GameConfig } from '@/constants/types';

export const ARROW_KINGDOM_CONFIG: GameConfig = {
  id: 'arrow-kingdom',
  name: 'Arrow Kingdom: Slide Escape',
  category: 'brain',
  offline: true,
  multiplayer: false,
  route: '/games/arrow-kingdom',
  icon: '🏹',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 50000,
    minDuration: 2,
    maxDuration: 1200,
  },
  saveSupport: 'background',
  description: 'Slide neon bent arrows off the kingdom board without hitting blockers',
};

export default ARROW_KINGDOM_CONFIG;
