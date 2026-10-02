// ============================================================
// PATTERN BREAKER — Spacing, Radii & Shadows
// ============================================================

import { ViewStyle } from 'react-native';
import { PBColors } from './colors';

export const PBSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  screenPadding: 16,
};

export const PBRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const PBShadows = {
  cyanGlow: {
    shadowColor: PBColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,

  amberGlow: {
    shadowColor: PBColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,

  cardElevation: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  } as ViewStyle,

  tileElevation: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  } as ViewStyle,
};
