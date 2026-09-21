// ============================================================
// GameHub — Capture Point Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const CAPTURE_POINT_CONFIG: GameConfig = {
  id: 'fps-capture-point',
  name: 'Capture Point',
  category: 'battle',
  offline: false,
  multiplayer: true,
  route: '/games/fps-capture-point',
  icon: '🚩',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 500,
    minDuration: 30,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Domination Mode! Hold control zones A (Factory), B (Hangar), and C (Helipad). First to 500 Ticket Score wins!',
};
