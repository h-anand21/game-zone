// ============================================================
// ONE TAP: PRECISION GAME — Config
// Gameplay tuning, modes, tolerances, scoring and ranks
// ============================================================

import { GameModeConfig, GameModeId } from './types';

export const ONE_TAP_CONFIG = {
  // Classic mode round target
  classicRounds: 10,

  // Base Scoring Points
  goodScore: 10,
  greatScore: 25,
  perfectScore: 50,
  missScore: 0,

  // Timing Tolerances (Normalized to track width [0.0 - 1.0])
  // Distance from center of target zone:
  perfectTolerance: 0.035, // within ~3.5% of center
  greatTolerance: 0.08,    // within ~8% of center
  goodTolerance: 0.14,     // within ~14% of center

  // Target Zone Geometry
  minTargetWidth: 0.12,   // minimum width of target box
  maxTargetWidth: 0.28,   // maximum width on early rounds
  trackSafeMargin: 0.08,  // padding from track edges (8% to 92%)

  // Speed & Movement
  baseTravelDurationMs: 1400, // Time to travel one way across track
  rushTravelDurationMs: 900,  // Faster in Rush mode
  speedProgressionFactor: 0.03, // Speed up per round

  // Perfect Chain & Fever Mode
  perfectChainRequired: 5,    // 5 consecutive perfects triggers Fever
  feverDurationMs: 5000,      // 5 seconds of Fever
  feverScoreMultiplier: 2.0,   // x2 all points during Fever

  // Combo multipliers
  comboMultipliers: [
    { minCombo: 1, multiplier: 1.0 },
    { minCombo: 3, multiplier: 1.2 },
    { minCombo: 5, multiplier: 1.5 },
    { minCombo: 8, multiplier: 1.8 },
    { minCombo: 12, multiplier: 2.0 },
  ],

  // Ranks threshold by Accuracy %
  ranks: {
    S: 90,
    A: 80,
    B: 65,
    C: 50,
    D: 0,
  },
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
