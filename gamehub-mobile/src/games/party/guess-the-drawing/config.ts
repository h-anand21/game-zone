// ============================================================
// GameHub — Guess the Drawing Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const GUESS_THE_DRAWING_CONFIG: GameConfig = {
  id: 'guess-the-drawing',
  name: 'Guess the Drawing',
  category: 'party',
  offline: true,
  multiplayer: true,
  route: '/games/guess-the-drawing',
  icon: '🎨',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 10000,
    minDuration: 10,
    maxDuration: 300,
  },
  saveSupport: 'none',
  description: 'Draw prompt words on the canvas and guess drawings in this creative party game!',
};
