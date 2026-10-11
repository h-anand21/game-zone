// ============================================================
// STACK MASTER — Game Modes Definitions
// ============================================================

import type { GameMode } from '../types';

export interface GameModeInfo {
  id: GameMode;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockRequirement: string;
  accentColor: string;
  maxPlacements?: number;
}

export const GAME_MODES: GameModeInfo[] = [
  {
    id: 'classic',
    title: 'CLASSIC TOWER',
    subtitle: 'ENDLESS PRECISION',
    description: 'The definitive stacking test. Every perfect drop keeps width, one miss ends your ascent.',
    icon: '🏰',
    unlocked: true,
    unlockRequirement: 'Available immediately',
    accentColor: '#20D9FF',
  },
  {
    id: 'zen',
    title: 'ZEN REALM',
    subtitle: 'RELAXED & CALM',
    description: 'Gentle, soothing speeds with forgiving boundaries. Perfect for stress-free stacking.',
    icon: '🌸',
    unlocked: true,
    unlockRequirement: 'Reach Height 5 in Classic',
    accentColor: '#54E6AB',
  },
  {
    id: 'rush',
    title: 'SPEED RUSH',
    subtitle: 'HIGH INTENSITY',
    description: 'Rapid movement with multiplier bonuses for bold, lightning-fast timing.',
    icon: '⚡',
    unlocked: true,
    unlockRequirement: 'Reach Height 15 in Classic',
    accentColor: '#FF932F',
  },
  {
    id: 'precision',
    title: 'PRECISION TRIAL',
    subtitle: '20 CHOSEN BLOCKS',
    description: 'Place exactly 20 blocks with maximum alignment to achieve the highest accuracy grade.',
    icon: '🎯',
    unlocked: true,
    unlockRequirement: 'Achieve 5 Perfects in Classic',
    accentColor: '#FF48C8',
    maxPlacements: 20,
  },
  {
    id: 'daily',
    title: 'DAILY CHALLENGE',
    subtitle: 'TODAY’S TRIAL',
    description: 'Unique daily objective with streak bonus crowns and gem rewards.',
    icon: '👑',
    unlocked: true,
    unlockRequirement: 'Play daily to build streak',
    accentColor: '#FFD34E',
  },
];
