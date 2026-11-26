// ============================================================
// Block Puzzle — Classic Wooden ("Block Crush") Theme Palette
// ============================================================

export const WOOD_PALETTE = {
  // Backdrop caramel oak plank gradients
  bgGradient: ['#CE8844', '#B56E2E', '#8F501C'] as const,
  bgBase: '#B56E2E',

  // Board outer oak bezel & deep espresso tray
  trayOuterBg: '#8E5121',
  trayBevelTop: '#D9944E',
  trayBevelBottom: '#5C2F0D',
  trayInnerGradient: ['#47240E', '#351A09'] as const,
  trayInnerBorder: '#281205',

  // Checkerboard empty cell sockets
  slotLight: '#532B12',
  slotDark: '#44230D',
  slotBorder: '#351908',

  // Signature Honey-Gold Carved Wood Block
  tileGradient: ['#FCE283', '#F0B83D', '#D9961E'] as const,
  tileHighlight: '#FFF6C4',
  tileShadow: '#9B6010',
  tileSeam: '#4A250B',
  tileGrainLight: 'rgba(255, 248, 205, 0.28)',
  tileGrainDark: 'rgba(130, 74, 10, 0.22)',

  // Ghost preview & active line clear glow
  ghostBorder: '#FDE68A',
  ghostFill: 'rgba(251, 191, 36, 0.18)',
  clearGlowGradient: [
    'rgba(255, 245, 180, 0.08)',
    'rgba(255, 232, 130, 0.72)',
    'rgba(255, 245, 180, 0.08)',
  ] as const,

  // Tactile oak buttons & capsules
  oakButtonGradient: ['#F3B363', '#D28135'] as const,
  oakButtonBorder: '#52280B',
  oakButtonHighlight: '#FFE0A3',

  // HUD espresso containers
  hudPanelGradient: ['#6E3B16', '#4E270C'] as const,
  hudPanelBorder: '#3D1C06',
  pillDarkBg: '#46220A',
  pillDarkBorder: '#8D5122',
  comboBorderGlow: '#FCD34D',

  // Primary honey-gold CTA button
  goldCtaGradient: ['#FFE680', '#F5B82E', '#D98A16'] as const,
  goldCtaBorder: '#5C2E09',
  goldCtaText: '#3A1904',

  // Typography
  textLight: '#FFFDF7',
  textCream: '#FDE6C4',
  textGold: '#FFD65C',
  textMuted: '#D9AE84',
  textOutline: '#3D1D06',

  // Danger / Loss accents (warm red-amber)
  dangerText: '#FF8A65',
  modalCardGradient: ['#7A421A', '#4C260B'] as const,
  modalBorder: '#B97335',
  modalOverlay: 'rgba(24, 10, 2, 0.78)',
} as const;
