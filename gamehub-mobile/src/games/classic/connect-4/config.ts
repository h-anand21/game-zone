// ============================================================
// GameHub — Connect 4 Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const CONNECT_4_CONFIG: GameConfig = {
  id: 'connect-4',
  name: 'Connect 4',
  category: 'classic',
  offline: true,
  multiplayer: false,
  route: '/games/connect-4',
  icon: '🔴',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 1000,
    minDuration: 10,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Drop colored chips into the 7-column grid to connect 4 in a row before the AI!',
};
