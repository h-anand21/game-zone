// ============================================================
// GameHub — Rock Paper Scissors Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const ROCK_PAPER_SCISSORS_CONFIG: GameConfig = {
  id: 'rock-paper-scissors',
  name: 'Rock Paper Scissors',
  category: 'party',
  offline: true,
  multiplayer: true,
  route: '/games/rock-paper-scissors',
  icon: '✊',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 3,
    maxDuration: 120,
  },
  saveSupport: 'none',
  description: 'Classic Rock Paper Scissors Lizard Spock showdown vs AI or local friend!',
};
