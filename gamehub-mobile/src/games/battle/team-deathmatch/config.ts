// ============================================================
// GameHub — Team Deathmatch (TDM) Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const TDM_CONFIG: GameConfig = {
  id: 'fps-tdm',
  name: 'Team Deathmatch',
  category: 'battle',
  offline: false,
  multiplayer: true,
  route: '/games/fps-tdm',
  icon: '🛡️',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 200,
    minDuration: 30,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: '4v4 Tactical Combat. Team ALPHA (Red) vs Team BRAVO (Blue). First team to 25 kills wins!',
};
