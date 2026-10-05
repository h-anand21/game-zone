// ============================================================
// PATH MIND — Design System: Typography
// Minecraft-Style Blocky Pixel Game Typography & UI Tokens
// ============================================================

import { TextStyle, Platform } from 'react-native';
import { pmColors } from './colors';

// Minecraft pixel gaming font family
const PIXEL_FONT = Platform.select({
  ios: 'Courier New',
  android: 'monospace',
  default: 'monospace',
});

export const pmTypography: Record<string, TextStyle> = {
  // Display Titles (Blocky Minecraft pixel game titles with sharp 3D extrusion)
  displayHero: {
    fontFamily: PIXEL_FONT,
    fontSize: 26,
    fontWeight: '900',
    color: pmColors.textGold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2.5 },
    textShadowRadius: 1,
  },
  displayTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: 20,
    fontWeight: '900',
    color: pmColors.textGold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1.5, height: 2 },
    textShadowRadius: 1,
  },
  displaySection: {
    fontFamily: PIXEL_FONT,
    fontSize: 16,
    fontWeight: '900',
    color: pmColors.textCyan,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1,
  },
  displaySub: {
    fontFamily: PIXEL_FONT,
    fontSize: 12,
    fontWeight: '900',
    color: pmColors.goldBright,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0.5,
  },

  // Button Typography (Minecraft-style blocky button labels)
  buttonLarge: {
    fontFamily: PIXEL_FONT,
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1.5, height: 2 },
    textShadowRadius: 1,
  },
  buttonMedium: {
    fontFamily: PIXEL_FONT,
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1,
  },
  buttonSmall: {
    fontFamily: PIXEL_FONT,
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0.5,
  },

  // UI & Body Typography (Minecraft blocky pixel accents with clean readability)
  bodyLarge: {
    fontFamily: PIXEL_FONT,
    fontSize: 14,
    fontWeight: '700',
    color: pmColors.textPrimary,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: PIXEL_FONT,
    fontSize: 12,
    fontWeight: '600',
    color: pmColors.textSecondary,
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  bodySmall: {
    fontFamily: PIXEL_FONT,
    fontSize: 10.5,
    fontWeight: '600',
    color: pmColors.textMuted,
    lineHeight: 15,
    letterSpacing: 0.3,
  },
  caption: {
    fontFamily: PIXEL_FONT,
    fontSize: 9.5,
    fontWeight: '800',
    color: pmColors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  hudValue: {
    fontFamily: PIXEL_FONT,
    fontSize: 14,
    fontWeight: '900',
    color: pmColors.textGold,
    letterSpacing: 0.8,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0.5,
  },
};
