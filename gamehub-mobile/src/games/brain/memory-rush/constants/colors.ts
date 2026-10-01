// ============================================================
// MEMORY RUSH — 2.5D Arcade Cyber Design Tokens & Theme
// (Inspired by Reverse Mind, Number Rush, Mind Lock & Find One)
// ============================================================

export const MRColors = {
  // Deep Cozy Space / Canvas Surfaces
  bgVoid: '#040B16',
  bgDark: '#07111F',
  surface: '#0D1F34',
  surfaceElevated: '#16243A',
  surfaceGlass: 'rgba(16, 27, 43, 0.85)',
  surfaceGlassLight: 'rgba(255, 255, 255, 0.12)',
  borderSubtle: 'rgba(255, 255, 255, 0.12)',
  borderGlass: 'rgba(77, 231, 255, 0.35)',
  borderHighlight: 'rgba(255, 255, 255, 0.22)',

  // Primary Text & Utilities
  textPrimary: '#F0F6FC',
  textSecondary: '#8CA0B8',
  textMuted: '#586E88',
  textShadow: 'rgba(0, 0, 0, 0.55)',

  // Primary Cyber Gold & Amber Accents (Arcade Master Theme)
  primaryGold: '#FFD83D',
  goldLight: '#FFF59D',
  goldShadow: '#B28704',
  goldGlow: 'rgba(255, 216, 61, 0.55)',
  goldMuted: 'rgba(255, 216, 61, 0.15)',
  yellowStatus: '#FFD83D',

  // Electric Cyan & Teal Highlights (Auxiliary energy sparks)
  primaryCyan: '#00E5FF',
  cyanBright: '#70EFFF',
  cyanShadow: '#0097A7',
  cyanGlow: 'rgba(0, 229, 255, 0.45)',
  cyanMuted: 'rgba(0, 229, 255, 0.12)',

  successGreen: '#57E389',
  emeraldShadow: '#2E7D32',
  emeraldGlow: 'rgba(87, 227, 137, 0.5)',

  dangerRose: '#FF5E6C',
  coralShadow: '#C62828',
  coralGlow: 'rgba(255, 94, 108, 0.5)',

  // Aliases
  backgroundPrimary: '#040B16',
  accent: '#FFD83D',
  warning: '#FFD83D',
  success: '#57E389',
  danger: '#FF5E6C',
};

export const colors = MRColors;

// 2.5D Button Palette (Same structure as Number Rush & Reverse Mind)
export const MRButtonThemes = {
  cyan: {
    face: '#4DE7FF',
    highlight: '#B2F5EA',
    bevel: '#0097A7',
    shadow: '#006064',
    text: '#040B16',
    glow: 'rgba(77, 231, 255, 0.55)',
  },
  gold: {
    face: '#FFD83D',
    highlight: '#FFF59D',
    bevel: '#B28704',
    shadow: '#7A5B00',
    text: '#040B16',
    glow: 'rgba(255, 216, 61, 0.55)',
  },
  emerald: {
    face: '#57E389',
    highlight: '#B7F4C7',
    bevel: '#2E7D32',
    shadow: '#1B5E20',
    text: '#040B16',
    glow: 'rgba(87, 227, 137, 0.55)',
  },
  coral: {
    face: '#FF5E6C',
    highlight: '#FFCDD2',
    bevel: '#C62828',
    shadow: '#7F0000',
    text: '#FFFFFF',
    glow: 'rgba(255, 94, 108, 0.55)',
  },
  glass: {
    face: '#16243A',
    highlight: 'rgba(255, 255, 255, 0.20)',
    bevel: '#0D1F34',
    shadow: '#040B16',
    text: '#F0F6FC',
    glow: 'rgba(77, 231, 255, 0.25)',
  },
};

export const GAME_MODES = [
  { id: 'memoryGrid', title: 'Memory Grid', desc: 'Remember positions' },
  { id: 'sequenceRush', title: 'Sequence Rush', desc: 'Remember order' },
  { id: 'numberShift', title: 'Number Shift', desc: 'Spot the change' },
  { id: 'missingNumber', title: 'Missing Number', desc: 'Find what vanished' },
  { id: 'fusionRush', title: 'Fusion Rush', desc: '4 challenges in one' },
];
