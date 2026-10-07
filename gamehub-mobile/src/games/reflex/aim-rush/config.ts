// ============================================================
// AIM RUSH — TARGET CHAIN: Game Configurations & Modes
// ============================================================

import { GameConfig } from '@/constants/types';
import { GameModeConfig, GameModeId } from './types';
import { ARColors } from './theme/colors';

export const AIM_RUSH_CONFIG: GameConfig = {
  id: 'aim-rush',
  name: 'Aim Rush',
  category: 'reflex',
  offline: true,
  multiplayer: false,
  route: '/games/aim-rush',
  icon: '🎯',
  status: 'available',
  gameVersion: '2.0.0',
  scoreVersion: 'v2',
  validation: {
    maxScore: 2500,
    minDuration: 3,
    maxDuration: 180,
  },
  saveSupport: 'full',
  description: 'Aim Rush — Target Chain: Touch targets directly in a dark futuristic arena with concentric sweet-spot precision!',
};

export const GAME_MODES: Record<GameModeId, GameModeConfig> = {
  classic: {
    id: 'classic',
    title: 'CLASSIC',
    subtitle: 'THE ORIGINAL ARENA',
    badge: '30s RUN',
    description: 'Build your target chain with balanced speed and rising difficulty.',
    durationSeconds: 30,
    initialLives: 3,
    baseRadius: 38,
    speedMultiplier: 1.0,
    dangerChance: 0.08,
    color: ARColors.cyan,
  },
  rush: {
    id: 'rush',
    title: 'RUSH',
    subtitle: 'HYPER-VELOCITY BLITZ',
    badge: 'FAST & HARD',
    description: 'Smaller targets, rapid spawn rates, and intense kinetic motion.',
    durationSeconds: 25,
    initialLives: 3,
    baseRadius: 30,
    speedMultiplier: 1.6,
    dangerChance: 0.16,
    color: ARColors.lime,
  },
  precision: {
    id: 'precision',
    title: 'PRECISION',
    subtitle: 'SWEET SPOT MASTERY',
    badge: 'ACCURACY ×2',
    description: 'Compact targets with 2.5× bonus points for dead-center perfect hits.',
    durationSeconds: 30,
    initialLives: 2,
    baseRadius: 26,
    speedMultiplier: 0.8,
    dangerChance: 0.12,
    color: ARColors.gold,
  },
  daily: {
    id: 'daily',
    title: 'DAILY SEED',
    subtitle: 'GLOBAL BENCHMARK',
    badge: 'DAILY BONUS',
    description: 'Deterministic target sequence generated identically for every player today.',
    durationSeconds: 35,
    initialLives: 3,
    baseRadius: 34,
    speedMultiplier: 1.2,
    dangerChance: 0.10,
    color: '#38BDF8',
  },
};

export const AIM_RUSH_BALANCE = {
  sweetSpotPercent: 0.18,      // 0 - 18% radius = PERFECT
  greatSpotPercent: 0.40,      // 18 - 40% radius = GREAT
  goodSpotPercent: 0.85,       // 40 - 85% radius = GOOD
  missMarginPercent: 1.0,      // > 100% radius = MISS

  basePoints: {
    perfect: 25,
    great: 15,
    good: 10,
    dangerPenalty: -20,
  },

  comboMilestones: [3, 6, 10, 15, 20, 30],
  rushThresholdChain: 8,       // Enters RUSH state at chain >= 8
};
