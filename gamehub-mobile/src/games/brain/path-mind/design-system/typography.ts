// ============================================================
// PATH MIND — Design System: Typography
// Two-level strategy: Display (Heavy game arcade) + UI (Clean sans-serif)
// ============================================================

import { TextStyle } from 'react-native';
import { pmColors } from './colors';

export const pmTypography: Record<string, TextStyle> = {
  // Display Titles (Heavy arcade/fantasy game titles)
  displayHero: {
    fontSize: 28,
    fontWeight: '900',
    color: pmColors.textGold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  displayTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: pmColors.textGold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  displaySection: {
    fontSize: 18,
    fontWeight: '800',
    color: pmColors.textCyan,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  displaySub: {
    fontSize: 13,
    fontWeight: '800',
    color: pmColors.goldBright,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Button Typography
  buttonLarge: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  buttonMedium: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  buttonSmall: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // UI & Body Typography (Clean, readable sans-serif)
  bodyLarge: {
    fontSize: 15,
    fontWeight: '600',
    color: pmColors.textPrimary,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 13,
    fontWeight: '500',
    color: pmColors.textSecondary,
    lineHeight: 18,
  },
  bodySmall: {
    fontSize: 11,
    fontWeight: '500',
    color: pmColors.textMuted,
    lineHeight: 15,
  },
  caption: {
    fontSize: 10,
    fontWeight: '700',
    color: pmColors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  hudValue: {
    fontSize: 14,
    fontWeight: '900',
    color: pmColors.textGold,
    letterSpacing: 0.5,
  },
};
