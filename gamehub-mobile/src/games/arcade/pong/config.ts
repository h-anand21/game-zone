// ============================================================
// GameHub — Woodland Bubble Shooter Config (Pong Slot)
// Replaces Pong while preserving /games/pong route compatibility
// ============================================================

import type { GameConfig } from '@/constants/types';

export const PONG_CONFIG: GameConfig = {
  id: 'pong',
  name: 'Woodland Bubble Shooter',
  category: 'arcade',
  offline: true,
  multiplayer: false,
  route: '/games/pong',
  icon: '🫧',
  status: 'available',
  gameVersion: '2.0.0',
  scoreVersion: 'v2',
  validation: {
    maxScore: 999999999,
    minDuration: 3,
    maxDuration: 14400,
  },
  saveSupport: 'background',
  description:
    'Aim bank shots in a carved wooden forest! Match glowing crystal bubbles, rescue trapped fireflies, drop spiked iron stones, and blast unlimited levels with Fireball & Lightning orbs!',
};
