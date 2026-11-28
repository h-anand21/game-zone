// ============================================================
// Worms Zone 3D Arena — 3D Skins, Food Catalog & Milestones
// ============================================================

import type { FoodKind, WormSkinConfig, WormSkinId } from './types';

export const WORM_SKINS: Record<WormSkinId, WormSkinConfig> = {
  violet: {
    id: 'violet',
    name: 'Royal Violet',
    cost: 0,
    primary: '#9352E5',
    highlight: '#C9A2FF',
    shadow: '#4F2392',
    stripeColor: '#7D3ED0',
    stripeEvery: 2,
    mouthColor: '#DC2626',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Striker',
    cost: 150,
    primary: '#EF4444',
    highlight: '#FCA5A5',
    shadow: '#7F1D1D',
    stripeColor: '#450A0A',
    stripeEvery: 2,
    mouthColor: '#991B1B',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Shadow Racer',
    cost: 300,
    primary: '#1E293B',
    highlight: '#64748B',
    shadow: '#090D16',
    stripeColor: '#FACC15',
    stripeEvery: 3,
    mouthColor: '#EF4444',
  },
  steampunk: {
    id: 'steampunk',
    name: 'Steampunk Gear',
    cost: 500,
    primary: '#D97706',
    highlight: '#FDE68A',
    shadow: '#78350F',
    stripeColor: '#94A3B8',
    stripeEvery: 2,
    mouthColor: '#B91C1C',
    isMetallic: true,
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Viper',
    cost: 750,
    primary: '#22C55E',
    highlight: '#86EFAC',
    shadow: '#14532D',
    stripeColor: '#15803D',
    stripeEvery: 2,
    mouthColor: '#DC2626',
  },
  gold: {
    id: 'gold',
    name: 'Golden Emperor',
    cost: 1200,
    primary: '#F59E0B',
    highlight: '#FEF9C3',
    shadow: '#92400E',
    stripeColor: '#FBBF24',
    stripeEvery: 2,
    mouthColor: '#DC2626',
    isMetallic: true,
  },
};

export const ALL_SKIN_IDS: WormSkinId[] = [
  'violet',
  'crimson',
  'obsidian',
  'steampunk',
  'emerald',
  'gold',
];

export interface FoodMetadata {
  kind: FoodKind;
  weightValue: number;
  coinValue: number;
  scale: number;
}

export const NATURAL_FOOD_POOL: FoodMetadata[] = [
  { kind: 'cherry', weightValue: 10, coinValue: 0, scale: 0.92 },
  { kind: 'apple', weightValue: 12, coinValue: 0, scale: 1.04 },
  { kind: 'corn', weightValue: 15, coinValue: 0, scale: 1.0 },
  { kind: 'broccoli', weightValue: 15, coinValue: 0, scale: 0.98 },
  { kind: 'tomato', weightValue: 18, coinValue: 0, scale: 1.06 },
  { kind: 'mushroom', weightValue: 20, coinValue: 0, scale: 1.0 },
  { kind: 'kiwi', weightValue: 22, coinValue: 0, scale: 0.98 },
  { kind: 'cheese', weightValue: 25, coinValue: 0, scale: 1.06 },
  { kind: 'pumpkin', weightValue: 40, coinValue: 0, scale: 1.15 },
];

export const LOOT_FEAST_POOL: FoodMetadata[] = [
  { kind: 'cake', weightValue: 50, coinValue: 0, scale: 1.18 },
  { kind: 'sandwich', weightValue: 65, coinValue: 0, scale: 1.24 },
  { kind: 'cheese', weightValue: 35, coinValue: 0, scale: 1.14 },
  { kind: 'pumpkin', weightValue: 45, coinValue: 0, scale: 1.16 },
  { kind: 'apple', weightValue: 28, coinValue: 0, scale: 1.1 },
  { kind: 'cherry', weightValue: 24, coinValue: 0, scale: 1.08 },
];

export const WEIGHT_MILESTONES = [
  500,
  1500,
  4000,
  10000,
  25000,
  50000,
  80000,
  150000,
  300000,
];

/**
 * Returns next progressive Treasure Chest weight target for any tier index (0..∞)
 */
export function getWeightGoalForTier(tierIndex: number): number {
  if (tierIndex < WEIGHT_MILESTONES.length) {
    return WEIGHT_MILESTONES[tierIndex];
  }
  const extraSteps = tierIndex - WEIGHT_MILESTONES.length + 1;
  return 300000 * Math.pow(2, extraSteps);
}

export const BOOSTER_PRICES = {
  magnet: 40,
  turbo: 50,
  scope: 35,
} as const;
