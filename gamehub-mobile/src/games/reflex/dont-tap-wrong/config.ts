// ============================================================
// DON'T TAP WRONG — Configuration & Mode Presets
// ============================================================

import type { GameConfig } from '@/constants/types';
import type { GameModeConfig, GameModeId } from './types';
import { DtwColors } from './theme/colors';

export const DONT_TAP_WRONG_CONFIG: GameConfig = {
  id: 'dont-tap-wrong',
  name: "Don't Tap Wrong",
  category: 'reflex',
  offline: true,
  multiplayer: false,
  route: '/games/dont-tap-wrong',
  icon: '🚫',
  status: 'available',
  gameVersion: '2.0.0',
  scoreVersion: 'v2',
  validation: {
    maxScore: 250,
    minDuration: 3,
    maxDuration: 180,
  },
  saveSupport: 'local',
  description: 'Pure reflex survival! Tap glowing GREEN tiles, avoid lethal RED targets. 20s blitz!',
};

export const DTW_MODES: Record<GameModeId, GameModeConfig> = {
  classic: {
    id: 'classic',
    name: 'CLASSIC ARENA',
    tagline: '20s Blitz • Target 15',
    description: 'The definitive challenge. Tap green, avoid lethal red. Reach 15 correct taps before time runs out!',
    durationSeconds: 20,
    targetScore: 15,
    bonusTimePerStreak: 0,
    dangerTileRange: [1, 2],
    safeTileRange: [2, 3],
    icon: '⚡',
    badgeColor: DtwColors.safeGreen,
  },
  rush: {
    id: 'rush',
    name: 'STREAK RUSH',
    tagline: '15s • +1s Per 5-Streak',
    description: 'High pressure blitz! Fast clock with time extensions for unbroken streaks. Target 20!',
    durationSeconds: 15,
    targetScore: 20,
    bonusTimePerStreak: 1,
    dangerTileRange: [2, 3],
    safeTileRange: [2, 3],
    icon: '🔥',
    badgeColor: DtwColors.cyanAccent,
  },
  survival: {
    id: 'survival',
    name: 'ENDLESS SURVIVAL',
    tagline: 'Untimed • 1 Life',
    description: 'No countdown timer. The danger multiplies as your score climbs. One red tap ends your run!',
    durationSeconds: 0,
    targetScore: 30,
    bonusTimePerStreak: 0,
    dangerTileRange: [1, 4],
    safeTileRange: [2, 3],
    icon: '💀',
    badgeColor: DtwColors.dangerRed,
  },
  daily: {
    id: 'daily',
    name: 'DAILY SEED',
    tagline: 'Equal Board Sequence',
    description: 'Identical tile sequence for all players today. Test your reflex against the daily benchmark!',
    durationSeconds: 20,
    targetScore: 18,
    bonusTimePerStreak: 0,
    dangerTileRange: [1, 3],
    safeTileRange: [2, 3],
    icon: '🌟',
    badgeColor: DtwColors.streakGold,
  },
};
