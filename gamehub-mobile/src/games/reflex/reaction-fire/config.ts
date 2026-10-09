// ============================================================
// REACTION FIRE — Configuration & Mode Presets
// ============================================================

import type { GameConfig } from '@/constants/types';
import type { GameModeConfig, GameModeId } from './types';
import { RfColors } from './theme';

export const REACTION_FIRE_CONFIG: GameConfig = {
  id: 'reaction-fire',
  name: 'Reaction Fire',
  category: 'reflex',
  offline: true,
  multiplayer: false,
  route: '/games/reaction-fire',
  icon: '⚡',
  status: 'available',
  gameVersion: '2.0.0',
  scoreVersion: 'v2',
  validation: {
    maxScore: 1000,
    minDuration: 1,
    maxDuration: 180,
  },
  saveSupport: 'full',
  description: 'Pure reflex precision! Tap immediately when the electric blue arena bursts into neon LIME!',
};

export const RF_MODES: Record<GameModeId, GameModeConfig> = {
  classic: {
    id: 'classic',
    name: 'CLASSIC TEST',
    tagline: 'One Signal • Benchmark',
    description: 'The definitive reflex test. One signal, random 1–4s wait. Target <350ms, Lightning <250ms!',
    totalRounds: 1,
    durationSeconds: 0,
    targetMs: 350,
    icon: '⚡',
    badgeColor: RfColors.goLime,
  },
  'five-round': {
    id: 'five-round',
    name: 'FIVE-ROUND CHALLENGE',
    tagline: '5 Signals • Consistency',
    description: 'Prove sustained reflex consistency. Measures best, mean, and median reaction across 5 rounds.',
    totalRounds: 5,
    durationSeconds: 0,
    targetMs: 320,
    icon: '🎯',
    badgeColor: RfColors.secondaryCyan,
  },
  endurance: {
    id: 'endurance',
    name: 'ENDURANCE RUSH',
    tagline: '30s Blitz • Score Chase',
    description: 'React to as many signals as possible before the 30-second clock expires. Zero room for hesitation!',
    totalRounds: 99,
    durationSeconds: 30,
    targetMs: 300,
    icon: '🔥',
    badgeColor: RfColors.rewardGold,
  },
  fakeout: {
    id: 'fakeout',
    name: 'FAKEOUT ARENA',
    tagline: 'Decoy Traps • Visual Focus',
    description: 'Decoy signals will test your impulse control. Tap ONLY when true neon LIME appears!',
    totalRounds: 3,
    durationSeconds: 0,
    targetMs: 330,
    icon: '👁️',
    badgeColor: RfColors.primaryBlue,
  },
  practice: {
    id: 'practice',
    name: 'PRACTICE ARENA',
    tagline: '3 Runs • Zero Risk',
    description: 'Learn the timing and tune your hand-eye coordination without impacting your competitive rank.',
    totalRounds: 3,
    durationSeconds: 0,
    targetMs: 350,
    icon: '🛡️',
    badgeColor: RfColors.textSecondary,
  },
};
