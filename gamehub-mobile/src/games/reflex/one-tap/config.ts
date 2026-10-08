// ============================================================
// ONE TAP: PRECISION GAME — Config
// Master Game Configuration, Modes, Tolerances, Scoring & Profiles
// ============================================================

import { GameConfig } from '@/constants/types';
import {
  GameModeConfig,
  GameModeId,
  OneTapSettings,
  OneTapUserProfile,
} from './types';

// Internal Gameplay Engine Tuning
export const ONE_TAP_GAMEPLAY_CONFIG = {
  classicRounds: 10,
  goodScore: 10,
  greatScore: 25,
  perfectScore: 50,
  missScore: 0,
  perfectTolerance: 0.035,
  greatTolerance: 0.08,
  goodTolerance: 0.14,
  minTargetWidth: 0.12,
  maxTargetWidth: 0.28,
  trackSafeMargin: 0.08,
  baseTravelDurationMs: 1400,
  rushTravelDurationMs: 900,
  speedProgressionFactor: 0.03,
  perfectChainRequired: 5,
  feverDurationMs: 5000,
  feverScoreMultiplier: 2.0,
  comboMultipliers: [
    { minCombo: 1, multiplier: 1.0 },
    { minCombo: 3, multiplier: 1.2 },
    { minCombo: 5, multiplier: 1.5 },
    { minCombo: 8, multiplier: 1.8 },
    { minCombo: 12, multiplier: 2.0 },
  ],
  ranks: {
    S: 90,
    A: 80,
    B: 65,
    C: 50,
    D: 0,
  },
};

// GameHub Central Registry Configuration
export const ONE_TAP_CONFIG: GameConfig & typeof ONE_TAP_GAMEPLAY_CONFIG = {
  id: 'one-tap',
  name: 'One Tap',
  category: 'reflex',
  offline: true,
  multiplayer: false,
  route: '/games/one-tap',
  icon: '⏱️',
  status: 'available',
  gameVersion: '2.0.0',
  scoreVersion: 'v2',
  validation: {
    maxScore: 5000,
    minDuration: 3,
    maxDuration: 180,
  },
  saveSupport: 'full',
  description:
    'One Tap: Precision Game — Tap anywhere with split-second timing as the oscillating needle sweeps across glowing target zones!',
  ...ONE_TAP_GAMEPLAY_CONFIG,
};

export const GAME_MODES: Record<GameModeId, GameModeConfig> = {
  classic: {
    id: 'classic',
    title: 'CLASSIC',
    subtitle: '10 ROUNDS',
    badge: 'BALANCED',
    description: 'The perfect way to start. Test your timing and precision accuracy.',
    speedLabel: 'Balanced Speed',
    totalRounds: 10,
    baseSpeed: 1.0,
    targetWidthMultiplier: 1.0,
    color: '#FFD700', // Gold
  },
  endless: {
    id: 'endless',
    title: 'ENDLESS',
    subtitle: 'NO LIMIT',
    badge: 'ESCALATING',
    description: 'How far can you go? Keep hitting zones and beat your highest score.',
    speedLabel: 'Gradually Increases',
    baseSpeed: 1.1,
    targetWidthMultiplier: 0.9,
    color: '#00E5FF', // Cyan
  },
  rush: {
    id: 'rush',
    title: 'RUSH',
    subtitle: 'SPEED ↑  TARGET ↓',
    badge: 'HIGH SPEED',
    description: 'Faster needle movement and tiny target zones. Built for reaction pros.',
    speedLabel: 'High Speed',
    totalRounds: 15,
    baseSpeed: 1.5,
    targetWidthMultiplier: 0.75,
    color: '#FF4D61', // Red / Crimson
  },
  daily: {
    id: 'daily',
    title: 'DAILY CHALLENGE',
    subtitle: 'MODIFIER ARENA',
    badge: 'DAILY',
    description: 'New daily precision modifier. Compete for today’s master score.',
    speedLabel: 'Seeded Modifier',
    totalRounds: 10,
    baseSpeed: 1.25,
    targetWidthMultiplier: 0.85,
    color: '#C8FF4D', // Lime
  },
  zen: {
    id: 'zen',
    title: 'ZEN',
    subtitle: 'RELAXED FLOW',
    badge: 'LOCKED',
    description: 'Bigger target zones, peaceful tempo, zero combo pressure.',
    speedLabel: 'Gentle Flow',
    isLocked: true,
    lockRequirement: 'Play 20 games to unlock',
    baseSpeed: 0.8,
    targetWidthMultiplier: 1.3,
    color: '#A0AEC0',
  },
  hardcore: {
    id: 'hardcore',
    title: 'HARDCORE',
    subtitle: 'SURVIVAL',
    badge: 'LOCKED',
    description: 'Single miss ends the run immediately. Razor thin perfect sweetspot.',
    speedLabel: 'Extreme Speed',
    isLocked: true,
    lockRequirement: 'Score 500+ in Classic',
    baseSpeed: 1.8,
    targetWidthMultiplier: 0.6,
    color: '#A0AEC0',
  },
  chaos: {
    id: 'chaos',
    title: 'CHAOS',
    subtitle: 'SHIFTING ZONES',
    badge: 'LOCKED',
    description: 'Target zones change location and dimensions in real time.',
    speedLabel: 'Erratic Trajectory',
    isLocked: true,
    lockRequirement: 'Complete Rush mode',
    baseSpeed: 1.4,
    targetWidthMultiplier: 0.8,
    color: '#A0AEC0',
  },
};

export const DEFAULT_SETTINGS: OneTapSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  visualFxLevel: 'high',
};

export const DEFAULT_USER_PROFILE: OneTapUserProfile = {
  totalRuns: 0,
  totalGamesPlayed: 0,
  personalBestScore: 0,
  previousBestScore: 0,
  bestCombo: 0,
  maxComboRecorded: 0,
  bestAccuracy: 0,
  lifetimeAccuracy: 0,
  fastestReactionMs: 0,
  averageReactionMs: 0,
  totalPerfects: 0,
  totalPerfectHits: 0,
  totalGreats: 0,
  totalGoods: 0,
  totalMisses: 0,
  totalCoins: 100,
  coins: 100,
  totalXp: 0,
  xp: 0,
  unlockedModes: ['classic', 'endless', 'rush', 'daily'],
  tutorialCompleted: false,
  dailyChallengeBest: 0,
};
