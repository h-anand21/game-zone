// ============================================================
// GameHub — Pong Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const PONG_CONFIG: GameConfig = {
  id: 'pong',
  name: 'Pong',
  category: 'arcade',
  offline: true,
  multiplayer: false,
  route: '/games/pong',
  icon: '🏓',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 50,
    minDuration: 5,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Classic arcade Pong game. Move your paddle to deflect the ball past the AI opponent!',
};
