// ============================================================
// PATTERN BREAKER — Design Tokens & Color System
// 3D Cognitive Adventure: Sci-Fi Ruins & Floating Island Observatory
// ============================================================

export const PBColors = {
  // Backgrounds
  backgroundDark: '#061018',
  background: '#08131A',
  backgroundElevated: '#0B1720',

  // Surfaces (Controlled Sci-Fi Tech Stone)
  surface: '#10232C',
  surfaceCard: '#132832',
  surfaceElevated: '#182F39',
  surfaceLight: '#203A46',

  // Core Brand Accents
  primary: '#19D3FF', // Cyan Neon Energy
  primaryGlow: 'rgba(25, 211, 255, 0.45)',
  primaryMuted: 'rgba(25, 211, 255, 0.15)',

  accent: '#FFD54A', // Warm Amber Energy
  accentGlow: 'rgba(255, 213, 74, 0.45)',
  accentMuted: 'rgba(255, 213, 74, 0.15)',

  // Feedback & States
  positive: '#38E58C', // Success / Perfect
  positiveGlow: 'rgba(56, 229, 140, 0.40)',
  danger: '#FF5C61',   // Wrong / Penalty
  dangerGlow: 'rgba(255, 92, 97, 0.40)',

  // Typography
  textPrimary: '#F7FAFC',
  textSecondary: '#A9BBC5',
  textMuted: '#6D818B',
  textDisabled: '#42535C',

  // Borders & Accents
  border: 'rgba(25, 211, 255, 0.22)',
  borderMuted: 'rgba(169, 187, 197, 0.18)',
  borderGold: 'rgba(255, 213, 74, 0.35)',

  // Ancient Tech Tile Colors
  tileDefault: ['#1A2C37', '#101F28'] as const,
  tilePressed: ['#122029', '#0A151C'] as const,
  tileCorrect: ['#1F5C44', '#103828'] as const,
  tileWrong: ['#5C2428', '#381014'] as const,
  tileHighlighted: ['#1F4F68', '#123040'] as const,
  tileBreakerHint: ['#524317', '#332909'] as const,

  // Category Color Badges
  categoryNumber: '#19D3FF',
  categoryShape: '#FFD54A',
  categoryColor: '#FF6EA7',
  categoryCount: '#38E58C',
  categoryDirection: '#A78BFA',
  categoryMixed: '#FB923C',
};
