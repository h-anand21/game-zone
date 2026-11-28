// ============================================================
// GameHub — Worms Zone 3D Arena Config (Snake Slot)
// Upgrades Snake into a 3D Worm Arena while preserving /games/snake
// ============================================================

import type { GameConfig } from '@/constants/types';

export const SNAKE_CONFIG: GameConfig = {
  id: 'snake',
  name: 'Worms Zone 3D',
  category: 'arcade',
  offline: true,
  multiplayer: false,
  route: '/games/snake',
  icon: '🪱',
  status: 'available',
  gameVersion: '2.0.0',
  scoreVersion: 'v2',
  validation: {
    maxScore: 999999999,
    minDuration: 2,
    maxDuration: 14400,
  },
  saveSupport: 'background',
  description:
    'Slither through a huge 3D arena! Eat gourmet food, cut off rival worms for glowing loot feasts, collect coins, unlock 3D skins & activate Magnet, Turbo & Scope boosters!',
};
