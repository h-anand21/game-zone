// ============================================================
// GameHub — Bagh-Bakri Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const BAGH_BAKRI_CONFIG: GameConfig = {
  id: 'bagh-bakri',
  name: 'Bagh-Bakri',
  category: 'classic',
  offline: true,
  multiplayer: false,
  route: '/games/bagh-bakri',
  icon: '🐅',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 1000,
    minDuration: 30,
    maxDuration: 1800,
  },
  saveSupport: 'full',
  description: 'Traditional Tigers & Goats strategy game. Goats try to trap the 4 Tigers while Tigers try to capture Goats!',
};
