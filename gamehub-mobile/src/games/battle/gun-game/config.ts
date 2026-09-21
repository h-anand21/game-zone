// ============================================================
// GameHub — Gun Game Config
// ============================================================

import type { GameConfig } from '@/constants/types';

export const GUN_GAME_CONFIG: GameConfig = {
  id: 'fps-gun-game',
  name: 'Gun Game',
  category: 'battle',
  offline: false,
  multiplayer: true,
  route: '/games/fps-gun-game',
  icon: '🔫',
  status: 'available',
  gameVersion: '1.0.0',
  scoreVersion: 'v1',
  validation: {
    maxScore: 100,
    minDuration: 30,
    maxDuration: 600,
  },
  saveSupport: 'none',
  description: 'Weapon Progression Ladder! 6 Tiers: Pistol ➔ SMG ➔ Shotgun ➔ Rifle ➔ Sniper ➔ Golden Knife 🗡️',
};
