// ============================================================
// PATTERN QUEST — Typography System
// Chunky, dimensional adventure game headers & crisp readable body
// ============================================================

import { TextStyle, Platform } from 'react-native';
import { pqColors } from './colors';

const FONT_FAMILY = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'sans-serif',
});

export const pqTypography = {
  // Dimensional adventure headers
  h1: {
    fontFamily: FONT_FAMILY,
    fontSize: 26,
    fontWeight: '900',
    color: pqColors.textGold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  } as TextStyle,

  h2: {
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontWeight: '800',
    color: pqColors.textPrimary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  } as TextStyle,

  h3: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: '800',
    color: pqColors.turquoiseLight,
    letterSpacing: 0.5,
  } as TextStyle,

  // Button labels
  buttonLarge: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  } as TextStyle,

  buttonMedium: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  } as TextStyle,

  // HUD & Badges
  hudValue: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: '900',
    color: pqColors.goldBright,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  } as TextStyle,

  hudLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: 11,
    fontWeight: '700',
    color: pqColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as TextStyle,

  // Body text
  body: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: '500',
    color: pqColors.textSecondary,
    lineHeight: 20,
  } as TextStyle,

  bodyBold: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: '700',
    color: pqColors.textPrimary,
  } as TextStyle,

  caption: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: '500',
    color: pqColors.textMuted,
  } as TextStyle,
};
