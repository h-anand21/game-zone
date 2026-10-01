// ============================================================
// REVERSE MIND — Curated Game Design Tokens & Theme
// ============================================================

export const RMTheme = {
  colors: {
    // Deep Cozy Space / Canvas Surfaces
    bgVoid: '#040B16',
    bgDark: '#07111F',
    bgMid: '#09182A',
    bgSurface: '#0D1F34',
    bgCard: '#101B2B',
    bgCardElevated: '#16243A',
    bgCardHover: '#1E3250',
    bgGlass: 'rgba(16, 27, 43, 0.75)',
    bgGlassLight: 'rgba(255, 255, 255, 0.08)',
    bgOverlay: 'rgba(4, 11, 22, 0.88)',

    // Neon Accents
    primaryGold: '#FFD83D',
    goldLight: '#FFF59D',
    goldShadow: '#B28704',
    goldGlow: 'rgba(255, 216, 61, 0.45)',

    cyanNeon: '#4DE7FF',
    cyanLight: '#B2F5EA',
    cyanShadow: '#0097A7',
    cyanGlow: 'rgba(77, 231, 255, 0.45)',

    blueNeon: '#4DA3FF',
    blueShadow: '#1976D2',
    blueGlow: 'rgba(77, 163, 255, 0.45)',

    purpleNeon: '#8D6BFF',
    purpleShadow: '#5E35B1',
    purpleGlow: 'rgba(141, 107, 255, 0.45)',

    orangeNeon: '#FF9800',
    orangeShadow: '#E65100',
    orangeGlow: 'rgba(255, 152, 0, 0.45)',

    emeraldGreen: '#57E389',
    emeraldShadow: '#2E7D32',
    emeraldGlow: 'rgba(87, 227, 137, 0.45)',

    coralRed: '#FF5E6C',
    coralShadow: '#C62828',
    coralGlow: 'rgba(255, 94, 108, 0.45)',

    // Wooden Hanging Signboard
    woodDark: '#2E1505',
    woodMedium: '#5C2D12',
    woodBorder: '#8A451A',
    woodHighlight: '#B5682C',
    woodText: '#FFE082',

    // Text & Utilities
    textWhite: '#FFFFFF',
    textPrimary: '#F0F6FC',
    textSecondary: '#8CA0B8',
    textMuted: '#586E88',
    textGold: '#FFD54F',
    borderMuted: 'rgba(255, 255, 255, 0.10)',
    borderHighlight: 'rgba(255, 255, 255, 0.22)',
    borderCyan: 'rgba(77, 231, 255, 0.4)',
    borderGold: 'rgba(255, 216, 61, 0.4)',
  },

  typography: {
    fontDisplay: 'System',
    displayHuge: 36,
    displayLarge: 28,
    displayMedium: 22,
    heading: 18,
    bodyLarge: 16,
    body: 14,
    caption: 12,
    micro: 10,
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extraBold: '800' as const,
      heavy: '900' as const,
    },
  },

  radii: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 20,
    xl: 26,
    full: 9999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    deep: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
    glowCyan: {
      shadowColor: '#4DE7FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.65,
      shadowRadius: 14,
      elevation: 6,
    },
    glowGold: {
      shadowColor: '#FFD83D',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 14,
      elevation: 6,
    },
    glowEmerald: {
      shadowColor: '#57E389',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.65,
      shadowRadius: 14,
      elevation: 6,
    },
    glowCoral: {
      shadowColor: '#FF5E6C',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.65,
      shadowRadius: 14,
      elevation: 6,
    },
  },
};
