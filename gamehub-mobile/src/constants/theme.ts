// ============================================================
// GameHub — Design Theme
// ============================================================

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  // Primary palette — deep electric purple
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#4A3BC2',

  // Accent — vibrant coral
  accent: '#FF6B6B',
  accentLight: '#FF8E8E',
  accentDark: '#E84545',

  // Success / Warning / Error
  success: '#00D2A0',
  warning: '#FDCB6E',
  error: '#FF4757',

  // Neutrals — dark mode first
  background: '#0D0D1A',
  surface: '#1A1A2E',
  surfaceLight: '#252540',
  surfaceElevated: '#2D2D4A',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0CC',
  textMuted: '#6C6C8A',
  textInverse: '#0D0D1A',

  // Borders
  border: '#2D2D4A',
  borderLight: '#3D3D5C',

  // Category colors
  categoryBrain: '#6C5CE7',
  categoryReflex: '#FF6B6B',
  categoryArcade: '#00D2A0',
  categoryClassic: '#FDCB6E',
  categoryBattle: '#FF4757',
  categoryParty: '#A29BFE',

  // Gradients (start → end)
  gradientPrimary: ['#6C5CE7', '#A29BFE'] as const,
  gradientAccent: ['#FF6B6B', '#FF8E8E'] as const,
  gradientDark: ['#0D0D1A', '#1A1A2E'] as const,
  gradientSuccess: ['#00D2A0', '#00E6B0'] as const,

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Legacy compat — light/dark for any Expo template components
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#0D0D1A',
    backgroundElement: '#1A1A2E',
    backgroundSelected: '#252540',
    textSecondary: '#B0B0CC',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  // Legacy compat
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const Typography = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,

  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
} as const;

export const CATEGORY_COLORS: Record<string, string> = {
  brain: Colors.categoryBrain,
  reflex: Colors.categoryReflex,
  arcade: Colors.categoryArcade,
  classic: Colors.categoryClassic,
  battle: Colors.categoryBattle,
  party: Colors.categoryParty,
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
