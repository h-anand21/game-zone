// ============================================================
// GameHub — Wood Screw: Nuts & Bolts Puzzle Config
// Replaces Sky Jump while preserving registry route compatibility
// ============================================================

import type { GameConfig } from '@/constants/types';

export const SKY_JUMP_CONFIG: GameConfig = {
  id: 'sky-jump',
  name: 'Wood Screw: Nuts & Bolts',
  category: 'arcade',
  offline: true,
  multiplayer: false,
  route: '/games/sky-jump',
  icon: '🔩',
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
    'Tactile wooden nuts & bolts puzzle! Unscrew bolts into empty holes, let planks swing and drop cleanly, and clear unlimited wooden board levels.',
};
