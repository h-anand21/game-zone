// ============================================================
// GameHub — Air Hockey Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const AIR_HOCKEY_CONFIG: GameConfig = {
  id: 'air-hockey',
  name: 'Air Hockey',
  category: 'party',
  offline: true,
  multiplayer: false,
  route: '/games/air-hockey',
  icon: '🏒',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 50,
    minDuration: 10,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Fast-paced touch drag Air Hockey. Deflect the puck past the AI paddle to score!',
};
