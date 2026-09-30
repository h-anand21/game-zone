// ============================================================
// Find One — Typography Tokens
// ============================================================

import { TextStyle } from 'react-native';
import { FOColors } from './colors';

export const FOTypography: Record<string, TextStyle> = {
  logoTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: FOColors.textLight,
    letterSpacing: 1.5,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: FOColors.textCream,
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: FOColors.textLight,
  },
  buttonLarge: {
    fontSize: 22,
    fontWeight: '900',
    color: FOColors.textDark,
    letterSpacing: 1,
  },
  buttonMedium: {
    fontSize: 16,
    fontWeight: '800',
    color: FOColors.textLight,
    letterSpacing: 0.5,
  },
  statValueLarge: {
    fontSize: 48,
    fontWeight: '900',
    color: FOColors.primary,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: FOColors.textLight,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: FOColors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 14,
    fontWeight: '600',
    color: FOColors.textMuted,
    lineHeight: 20,
  },
  bubble: {
    fontSize: 13,
    fontWeight: '800',
    color: FOColors.textLight,
  },
};
