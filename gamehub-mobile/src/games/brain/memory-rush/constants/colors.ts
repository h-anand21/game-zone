// ============================================================
// MEMORY RUSH — 3D Cartoon Jungle Temple Adventure Palette
// Physical Stone, Wood, Parchment, Jungle Green & Gold Accents
// ============================================================

export const MRColors = {
  // World Canvas / Void
  bgVoid: '#0F1A12',
  bgDark: '#16281C',
  surface: '#203627',
  surfaceElevated: '#2A4734',
  surfaceGlass: 'rgba(22, 40, 28, 0.88)',
  surfaceGlassLight: 'rgba(255, 255, 255, 0.12)',

  // Stone Material Tokens
  stoneLight: '#8C9BAE',
  stoneMid: '#4E5D6C',
  stoneDark: '#2B3540',
  stoneBorder: '#607284',
  stoneShadow: '#182028',
  stoneMoss: '#3F5943',
  stoneBevelTop: 'rgba(255, 255, 255, 0.28)',
  stoneBevelBottom: 'rgba(0, 0, 0, 0.55)',

  // Wood Material Tokens
  woodLight: '#9E5D2E',
  woodMid: '#6B3814',
  woodDark: '#431F07',
  woodDeep: '#2A1102',
  woodBorder: '#8A4A1C',
  woodShadow: '#1F0B01',
  woodBevelTop: 'rgba(255, 218, 170, 0.35)',
  woodBevelBottom: 'rgba(0, 0, 0, 0.65)',

  // Parchment Material Tokens
  parchmentLight: '#FFFDF0',
  parchmentMid: '#F6E8C3',
  parchmentDark: '#E2CA92',
  parchmentBorder: '#C9AC6C',
  parchmentText: '#3D250F',
  parchmentTextMuted: '#6E4E2C',

  // Primary Text & Utilities
  textPrimary: '#FFFFFF',
  textCream: '#FFF8E7',
  textSecondary: '#D1DEC8',
  textMuted: '#8BA18B',
  textShadow: 'rgba(0, 0, 0, 0.75)',

  // Gold / Yellow CTA (Tactile 3D Action)
  primaryGold: '#FFD700',
  goldLight: '#FFF275',
  goldMid: '#FFA000',
  goldShadow: '#8F5800',
  goldExtrusion: '#6B3E00',
  goldGlow: 'rgba(255, 215, 0, 0.6)',
  goldMuted: 'rgba(255, 215, 0, 0.16)',
  yellowStatus: '#FFC107',

  // Jungle Emerald Green
  jungleGreen: '#10B981',
  emeraldLight: '#6EE7B7',
  emeraldMid: '#059669',
  emeraldShadow: '#047857',
  emeraldExtrusion: '#064E3B',
  emeraldGlow: 'rgba(16, 185, 129, 0.6)',

  // Coral / Lava Danger Red
  dangerRose: '#EF4444',
  dangerLight: '#FCA5A5',
  dangerMid: '#DC2626',
  dangerShadow: '#B91C1C',
  dangerExtrusion: '#7F1D1D',
  coralShadow: '#7F1D1D',
  coralGlow: 'rgba(239, 68, 68, 0.6)',

  // Sky / Waterfall Blue
  skyBlue: '#38BDF8',
  blueLight: '#BAE6FD',
  blueMid: '#0284C7',
  blueShadow: '#0369A1',
  blueExtrusion: '#0C4A6E',
  blueGlow: 'rgba(56, 189, 248, 0.55)',

  // Mystical Temple Purple
  runicPurple: '#A855F7',
  purpleLight: '#D8B4FE',
  purpleMid: '#7E22CE',
  purpleShadow: '#581C87',
  purpleExtrusion: '#3B0764',
  purpleGlow: 'rgba(168, 85, 247, 0.55)',

  // Common UI Aliases for backward compatibility
  backgroundPrimary: '#0F1A12',
  accent: '#FFD700',
  warning: '#FFA000',
  success: '#10B981',
  danger: '#EF4444',
  borderSubtle: 'rgba(255, 255, 255, 0.14)',
  borderGlass: 'rgba(255, 215, 0, 0.35)',
  borderHighlight: 'rgba(255, 255, 255, 0.28)',
  primaryCyan: '#38BDF8',
  cyanBright: '#BAE6FD',
  cyanShadow: '#0369A1',
  cyanGlow: 'rgba(56, 189, 248, 0.5)',
  cyanMuted: 'rgba(56, 189, 248, 0.15)',
  successGreen: '#10B981',
};

export const colors = MRColors;

// 2.5D Physical Game Button Themes
export const MRButtonThemes = {
  gold: {
    face: '#FFC800',
    highlight: '#FFF6A5',
    bevel: '#FFA000',
    shadow: '#8C5300',
    extrusion: '#5E3600',
    text: '#3D2500',
    glow: 'rgba(255, 200, 0, 0.6)',
  },
  emerald: {
    face: '#10B981',
    highlight: '#A7F3D0',
    bevel: '#059669',
    shadow: '#047857',
    extrusion: '#064E3B',
    text: '#FFFFFF',
    glow: 'rgba(16, 185, 129, 0.6)',
  },
  coral: {
    face: '#EF4444',
    highlight: '#FECACA',
    bevel: '#DC2626',
    shadow: '#B91C1C',
    extrusion: '#7F1D1D',
    text: '#FFFFFF',
    glow: 'rgba(239, 68, 68, 0.6)',
  },
  blue: {
    face: '#0EA5E9',
    highlight: '#BAE6FD',
    bevel: '#0284C7',
    shadow: '#0369A1',
    extrusion: '#0C4A6E',
    text: '#FFFFFF',
    glow: 'rgba(14, 165, 233, 0.55)',
  },
  wood: {
    face: '#8B4513',
    highlight: '#D2955A',
    bevel: '#6B3814',
    shadow: '#431F07',
    extrusion: '#2A1102',
    text: '#FFF8E7',
    glow: 'rgba(139, 69, 19, 0.45)',
  },
  stone: {
    face: '#5A6A7A',
    highlight: '#94A3B8',
    bevel: '#404E5C',
    shadow: '#2A3440',
    extrusion: '#182028',
    text: '#F8FAFC',
    glow: 'rgba(148, 163, 184, 0.35)',
  },
  // Alias for backward compatibility
  cyan: {
    face: '#0EA5E9',
    highlight: '#BAE6FD',
    bevel: '#0284C7',
    shadow: '#0369A1',
    extrusion: '#0C4A6E',
    text: '#FFFFFF',
    glow: 'rgba(14, 165, 233, 0.55)',
  },
  glass: {
    face: '#203627',
    highlight: 'rgba(255, 255, 255, 0.22)',
    bevel: '#16281C',
    shadow: '#0F1A12',
    extrusion: '#070D09',
    text: '#FFF8E7',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
};

export const GAME_MODES = [
  { id: 'memoryGrid', title: 'Memory Grid', desc: 'Remember positions' },
  { id: 'sequenceRush', title: 'Sequence Rush', desc: 'Remember order' },
  { id: 'numberShift', title: 'Number Shift', desc: 'Spot the change' },
  { id: 'missingNumber', title: 'Missing Number', desc: 'Find what vanished' },
  { id: 'fusionRush', title: 'Fusion Rush', desc: '4 challenges in one' },
];
