// ============================================================
// REACTION FIRE — Theme & Design Tokens
// Built strictly according to futuristic arcade reflex specifications
// ============================================================

export const RfColors = {
  // Main backgrounds
  bgMain: '#050914',
  background: '#050914',
  bgElevated: '#091426',
  panel: '#0A1729',
  panelBorder: '#183957',
  panelGlass: 'rgba(10, 23, 41, 0.85)',

  // Brand & State colors
  primaryBlue: '#27B7FF',        // Waiting state & primary accents
  primaryBlueGlow: 'rgba(39, 183, 255, 0.4)',
  primaryBlueDark: '#0A2540',
  secondaryCyan: '#53E1FF',      // Radar rings & technical lines
  secondaryCyanGlow: 'rgba(83, 225, 255, 0.35)',

  // GO Signal
  goLime: '#B7FF3C',             // Real GO signal
  goLimeGlow: 'rgba(183, 255, 60, 0.55)',
  goLimeDark: '#1E3B05',
  goLimeBorder: '#9EE626',

  // Hazard & Warning
  signalRed: '#FF4D63',          // False starts & errors
  signalRedGlow: 'rgba(255, 77, 99, 0.5)',
  signalRedDark: '#3B0F15',
  signalRedBorder: '#E6384E',

  // Decoy (Fakeout mode only)
  decoyYellow: '#FFD043',
  decoyYellowDark: '#3A2E05',

  // Rewards & Trophies
  rewardGold: '#FFC857',
  rewardGoldGlow: 'rgba(255, 200, 87, 0.45)',

  // Typography
  textPrimary: '#F4F8FF',
  textSecondary: '#A6B8D0',
  textMuted: '#54657B',
  textOnLime: '#081702',
  textOnRed: '#FFFFFF',

  // Overlays
  overlayDim: 'rgba(5, 9, 20, 0.88)',
  overlayLight: 'rgba(5, 9, 20, 0.55)',
};

export const RfSpacing = {
  micro: 4,
  compact: 8,
  normal: 12,
  panel: 16,
  section: 20,
  major: 28,
};

export const RfBorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 9999,
};
