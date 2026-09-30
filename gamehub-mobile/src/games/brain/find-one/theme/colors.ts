// ============================================================
// Find One — Color Palette Design Tokens
// ============================================================

export const FOColors = {
  // Deep Night Forest Atmosphere
  background: '#07121E',
  backgroundDark: '#040B13',
  backgroundGradient: ['#0A192C', '#07121E', '#03080E'] as const,
  forestAccent: '#143825',
  
  // Card & Panel Surfaces
  surface: '#0E2238',
  surfaceLight: '#142E4B',
  surfaceBorder: '#1F4268',
  surfaceGlow: 'rgba(41, 151, 255, 0.25)',

  // Gold Accents & 2.5D Primary CTA
  primary: '#FFC928',
  primaryDark: '#D49200',
  primaryLight: '#FFE380',
  goldGradient: ['#FFE57F', '#FFC928', '#D49200'] as const,
  goldBorder: '#8A5E00',

  // Secondary Color Accents
  purple: '#8A4BFF',
  purpleDark: '#5E2BB8',
  purpleGradient: ['#A975FF', '#8A4BFF', '#5E2BB8'] as const,

  blue: '#2488FF',
  blueDark: '#1258B8',
  blueGradient: ['#54A6FF', '#2488FF', '#1258B8'] as const,

  cyan: '#29B6F6',
  cyanDark: '#0288D1',

  green: '#3BE35A',
  greenDark: '#20A837',
  greenGradient: ['#65F580', '#3BE35A', '#20A837'] as const,

  red: '#FF4B4B',
  redDark: '#C72424',
  redGradient: ['#FF7373', '#FF4B4B', '#C72424'] as const,

  // Wooden Planks & Nature
  woodFace: '#C27D38',
  woodDark: '#7A4518',
  woodGrain: '#9E5B22',
  woodGradient: ['#D68F4A', '#C27D38', '#8A4B1A'] as const,
  leafGreen: '#45B036',

  // Tile Backgrounds (Creamy 3D Pillows)
  tileBg: '#F5EFE0',
  tileBorder: '#D8CCA8',
  tileShadow: '#B8A87E',
  tileOddGlow: '#FFD700',

  // Text
  textLight: '#FFFFFF',
  textCream: '#FFF5E0',
  textMuted: '#8FA4BC',
  textDark: '#1E1202',
};

export const FORadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  round: 9999,
};

export const FOSpacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
};
