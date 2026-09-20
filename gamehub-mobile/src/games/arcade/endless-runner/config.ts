// ============================================================
// GameHub — Endless Runner Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const ENDLESS_RUNNER_CONFIG: GameConfig = {
  id: 'endless-runner',
  name: 'Endless Runner',
  category: 'arcade',
  offline: true,
  multiplayer: false,
  route: '/games/endless-runner',
  icon: '🏃',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 500000,
    minDuration: 5,
    maxDuration: 3600,
  },
  saveSupport: 'none',
  description: 'Switch lanes to dodge obstacles and collect coins in this fast-paced runner!',
};
