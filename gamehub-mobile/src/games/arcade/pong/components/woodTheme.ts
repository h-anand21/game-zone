// ============================================================
// Woodland Bubble Shooter — Pure Wooden & Forest Theme Palette
// Strictly ZERO purple UI elements; warm caramel oak, bamboo,
// dark espresso trays, golden honey, and vibrant nature bubbles.
// ============================================================

import type { BubbleColor } from './types';

export interface BubbleVisualTheme {
  label: string;
  primary: string;
  light: string;
  dark: string;
  rim: string;
  glow: string;
}

export const BUBBLE_COLOR_THEMES: Record<BubbleColor, BubbleVisualTheme> = {
  red: {
    label: 'Ruby Cherry',
    primary: '#EF4444',
    light: '#FCA5A5',
    dark: '#991B1B',
    rim: '#FECACA',
    glow: 'rgba(239, 68, 68, 0.55)',
  },
  green: {
    label: 'Emerald Leaf',
    primary: '#22C55E',
    light: '#86EFAC',
    dark: '#166534',
    rim: '#DCFCE7',
    glow: 'rgba(34, 197, 94, 0.55)',
  },
  blue: {
    label: 'Sapphire Sky',
    primary: '#2563EB',
    light: '#93C5FD',
    dark: '#1E3A8A',
    rim: '#DBEAFE',
    glow: 'rgba(37, 99, 235, 0.55)',
  },
  gold: {
    label: 'Honey Sun',
    primary: '#F59E0B',
    light: '#FDE68A',
    dark: '#B45309',
    rim: '#FEF3C7',
    glow: 'rgba(245, 158, 11, 0.58)',
  },
  teal: {
    label: 'Jade Clover',
    primary: '#0D9488',
    light: '#5EEAD4',
    dark: '#115E59',
    rim: '#CCFBF1',
    glow: 'rgba(20, 184, 166, 0.55)',
  },
  orange: {
    label: 'Citrus Amber',
    primary: '#F97316',
    light: '#FDBA74',
    dark: '#9A3412',
    rim: '#FFEDD5',
    glow: 'rgba(249, 115, 22, 0.55)',
  },
};

export const WOOD_SHOOTER_PALETTE = {
  // Warm Forest + Oak Frame Backdrops
  frameOuterBg: '#8E5121',
  frameBevelLight: '#E09B56',
  frameBevelDark: '#4D270B',
  forestBgGradient: ['#C9833F', '#9E5E24', '#6E3E14'] as const,
  arenaCanopyGradient: ['#2B411E', '#3A5326', '#263819'] as const,
  arenaDeepShade: 'rgba(24, 38, 15, 0.55)',

  // Side Wooden Pillars (Wall-bounce borders)
  pillarGradient: ['#B87233', '#8A4E1D', '#B87233'] as const,
  pillarBorder: '#472108',
  pillarHighlight: '#F2B872',

  // Carved Wood Controls & HUD Panels
  hudGradient: ['#7A4219', '#51280C'] as const,
  hudBorder: '#3C1B05',
  pillDarkBg: '#3D1D07',
  pillDarkBorder: '#9A5B25',
  oakBtnGradient: ['#F4B566', '#D17E32'] as const,
  oakBtnBorder: '#4A2207',
  oakBtnHighlight: '#FFE4AD',

  // Primary Honey-Gold CTA
  goldCtaGradient: ['#FFE785', '#F4B62E', '#D58714'] as const,
  goldCtaBorder: '#572B08',
  goldCtaText: '#3A1904',

  // Wood Deck & Shooter Pedestal
  deckGradient: ['#80471B', '#52290C'] as const,
  deckBorder: '#3A1B06',
  cannonRingBg: '#46230B',
  cannonRingBorder: '#FCD34D',
  aimLaserColor: '#FEF08A',
  dangerLineColor: '#F87171',

  // Typography
  textLight: '#FFFDF7',
  textCream: '#FDE6C4',
  textGold: '#FFD54F',
  textMuted: '#D6AC82',
  textGreenLight: '#A7F3D0',
  textOutline: '#3D1B05',

  // Modals
  modalOverlay: 'rgba(22, 10, 2, 0.80)',
  modalCardGradient: ['#7A431B', '#4B250B'] as const,
  modalBorder: '#BE7838',

  // Power-Up Specific Accents
  fireballGlow: '#FF6B1A',
  lightningGlow: '#38BDF8',
  rainbowColors: ['#EF4444', '#F59E0B', '#22C55E', '#38BDF8'] as const,
  stoneMain: '#64748B',
  stoneLight: '#CBD5E1',
  stoneDark: '#1E293B',
} as const;
