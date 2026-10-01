// ============================================================
// Number Rush — Design System & Theme Tokens
// ============================================================

export const NRTheme = {
  colors: {
    // Backgrounds
    bgDark: '#071324',
    bgDarker: '#040B16',
    bgJungle: '#081D14',
    bgNavy: '#0B1D35',
    bgCard: '#102744',
    bgCardLight: '#18365D',
    bgOverlay: 'rgba(4, 11, 22, 0.85)',
    bgGlass: 'rgba(255, 255, 255, 0.08)',
    bgGlassHighlight: 'rgba(255, 255, 255, 0.18)',

    // Primary Accents
    gold: '#FFC107',
    goldLight: '#FFE082',
    goldDark: '#C67C00',
    amber: '#FF9800',
    orange: '#FF6D00',

    // Category / Mode Accents
    rushBlue: '#1E90FF',
    rushBlueLight: '#70A1FF',
    rushBlueDark: '#0C4CB0',

    thinkOrange: '#FF793F',
    thinkOrangeLight: '#FFB142',
    thinkOrangeDark: '#CD6133',

    observeGreen: '#2ED573',
    observeGreenLight: '#7BED9F',
    observeGreenDark: '#1E824C',

    puzzlePurple: '#A55EEA',
    puzzlePurpleLight: '#D2B4DE',
    puzzlePurpleDark: '#672D85',

    // Feedback
    correctGreen: '#26DE81',
    wrongRed: '#FF4757',
    comboFire: '#FF4B2B',
    starGold: '#FFD700',
    gemCyan: '#00E5FF',

    // Text
    textWhite: '#FFFFFF',
    textDim: '#8CA0BA',
    textMuted: '#5C7491',
    textGold: '#FFE57F',
    textShadow: 'rgba(0, 0, 0, 0.45)',

    // Borders
    borderSubtle: 'rgba(255, 255, 255, 0.12)',
    borderGold: '#FFD700',
    borderWood: '#6E3A1A',
  },

  // 2.5D Button Themes
  buttonThemes: {
    green: {
      face: '#2ED573',
      highlight: '#7BED9F',
      bevel: '#26AF5F',
      shadow: '#1E824C',
      text: '#FFFFFF',
    },
    gold: {
      face: '#FFC107',
      highlight: '#FFE082',
      bevel: '#FFA000',
      shadow: '#C67C00',
      text: '#3D2400',
    },
    blue: {
      face: '#1E90FF',
      highlight: '#70A1FF',
      bevel: '#1472D0',
      shadow: '#0C4CB0',
      text: '#FFFFFF',
    },
    purple: {
      face: '#A55EEA',
      highlight: '#D2B4DE',
      bevel: '#8854D0',
      shadow: '#5F27CD',
      text: '#FFFFFF',
    },
    red: {
      face: '#E50914',
      highlight: '#FF6B6B',
      bevel: '#B80000',
      shadow: '#7A0000',
      text: '#FFFFFF',
    },
    wood: {
      face: '#9C582B',
      highlight: '#C47D4C',
      bevel: '#7C3F1B',
      shadow: '#54260D',
      text: '#FFE9C8',
    },
    glass: {
      face: 'rgba(255, 255, 255, 0.14)',
      highlight: 'rgba(255, 255, 255, 0.28)',
      bevel: 'rgba(255, 255, 255, 0.08)',
      shadow: 'rgba(0, 0, 0, 0.35)',
      text: '#FFFFFF',
    },
  },

  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 8,
    },
    glowGreen: {
      shadowColor: '#00E676',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.85,
      shadowRadius: 14,
      elevation: 12,
    },
    glowRed: {
      shadowColor: '#FF1744',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 16,
      elevation: 14,
    },
    glowGold: {
      shadowColor: '#FFC107',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 14,
      elevation: 12,
    },
    glowBlue: {
      shadowColor: '#1E90FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 12,
      elevation: 10,
    },
  },

  radius: {
    xs: 8,
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
    pill: 9999,
  },
};
