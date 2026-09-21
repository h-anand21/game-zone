// ============================================================
// GameHub — Free For All (FFA) Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const FFA_CONFIG: GameConfig = {
  id: 'fps-ffa',
  name: 'Free For All',
  category: 'battle',
  offline: false,
  multiplayer: true,
  route: '/games/fps-ffa',
  icon: '⚔️',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 30,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: '8-player FFA Deathmatch. Eliminate everyone in sight. First to 15 kills wins!',
};
