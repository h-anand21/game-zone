// ============================================================
// GameHub — 1v1 Duel Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const DUEL_CONFIG: GameConfig = {
  id: 'fps-duel',
  name: '1v1 Duel',
  category: 'battle',
  offline: false,
  multiplayer: true,
  route: '/games/fps-duel',
  icon: '🤺',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 20,
    minDuration: 30,
    maxDuration: 300,
  },
  saveSupport: 'none',
  description: 'High Stakes 1-on-1 Showdown! Best of 5 Rounds against Elite AI Duelist ("Shadow_Sniper"). First to 3 round wins!',
};
