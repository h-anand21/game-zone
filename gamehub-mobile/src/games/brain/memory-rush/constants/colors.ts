// ============================================================
// MEMORY RUSH — Strict Premium Dark Color System
// ============================================================

export const MRColors = {
  bgVoid: '#080A0D',
  bgDark: '#0D1116',
  surface: '#11161C',
  surfaceElevated: '#171D24',
  surfaceGlass: 'rgba(23, 29, 36, 0.82)',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderGlass: 'rgba(34, 211, 238, 0.25)',

  textPrimary: '#F5F7FA',
  textSecondary: '#8E9AA7',
  textMuted: '#526070',

  primaryCyan: '#22D3EE',
  cyanBright: '#67E8F9',
  cyanGlow: 'rgba(34, 211, 238, 0.4)',
  cyanMuted: 'rgba(34, 211, 238, 0.12)',

  yellowStatus: '#FACC15', // Small status / reward indicators ONLY
  successGreen: '#4ADE80',
  dangerRose: '#FB7185',

  // Aliases for screen compatibility
  backgroundPrimary: '#080A0D',
  accent: '#22D3EE',
  warning: '#FACC15',
  success: '#4ADE80',
  danger: '#FB7185',
};

export const colors = MRColors;

export const GAME_MODES = [
  { id: 'memoryGrid', title: 'Memory Grid', desc: 'Remember positions' },
  { id: 'sequenceRush', title: 'Sequence Rush', desc: 'Remember order' },
  { id: 'numberShift', title: 'Number Shift', desc: 'Spot the change' },
  { id: 'missingNumber', title: 'Missing Number', desc: 'Find what vanished' },
  { id: 'fusionRush', title: 'Fusion Rush', desc: '4 challenges in one' },
];

