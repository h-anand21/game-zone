// ============================================================
// PATTERN BREAKER — Typography Tokens
// ============================================================

import { TextStyle } from 'react-native';

export const PBTypography = {
  // Game & Hero Title
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 40,
    textTransform: 'uppercase',
  } as TextStyle,

  // Screen Title
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    lineHeight: 28,
    textTransform: 'uppercase',
  } as TextStyle,

  // Section Header
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 22,
    textTransform: 'uppercase',
  } as TextStyle,

  // Card Title
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
    lineHeight: 20,
  } as TextStyle,

  // Body Regular
  body: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  } as TextStyle,

  // Body Small / Description
  bodySmall: {
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 16,
  } as TextStyle,

  // HUD & Badges
  hudLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,

  hudValue: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
  } as TextStyle,

  // Big Score Display
  scoreHuge: {
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: 1,
  } as TextStyle,

  // Action Button Label
  buttonLabel: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  } as TextStyle,
};
