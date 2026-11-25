// ============================================================
// Wood Screw: Nuts & Bolts Puzzle — Wooden UI Palette & Textures
// Warm oak, cedar, forest green, honey amber, sienna & walnut stains
// ============================================================

import type { PlankColor } from './types';

export interface PlankPalette {
  top: string;
  bottom: string;
  bevel: string;
  outline: string;
  grain: string;
  shadow: string;
}

export const PLANK_PALETTES: Record<PlankColor, PlankPalette> = {
  green: {
    top: '#52C41F',
    bottom: '#328A0E',
    bevel: '#8AF053',
    outline: '#1F4B08',
    grain: 'rgba(20, 62, 5, 0.28)',
    shadow: 'rgba(18, 45, 5, 0.45)',
  },
  amber: {
    top: '#FBA224',
    bottom: '#D77209',
    bevel: '#FFD06E',
    outline: '#4D2508',
    grain: 'rgba(128, 56, 4, 0.25)',
    shadow: 'rgba(46, 20, 4, 0.4)',
  },
  sienna: {
    top: '#DC611E',
    bottom: '#AB3B08',
    bevel: '#F79256',
    outline: '#461804',
    grain: 'rgba(88, 22, 3, 0.26)',
    shadow: 'rgba(45, 14, 4, 0.42)',
  },
  walnut: {
    top: '#7F542E',
    bottom: '#563417',
    bevel: '#A7774B',
    outline: '#2C1808',
    grain: 'rgba(32, 15, 4, 0.32)',
    shadow: 'rgba(26, 12, 4, 0.46)',
  },
  caramel: {
    top: '#C47737',
    bottom: '#94501B',
    bevel: '#E69F5C',
    outline: '#3D1E07',
    grain: 'rgba(78, 34, 8, 0.26)',
    shadow: 'rgba(38, 16, 4, 0.42)',
  },
};

export const WOOD_UI_COLORS = {
  // Outer vertical wood wall
  wallBg: '#C86D25',
  wallPlankEven: '#D2752A',
  wallPlankOdd: '#BC611D',
  wallSeam: '#94440D',
  wallGrain: 'rgba(105, 38, 6, 0.16)',

  // Light oak inner backing board
  boardTop: '#F7D29A',
  boardBottom: '#E6AB61',
  boardBevelTop: '#FEE9C8',
  boardBorder: '#BD7A34',
  boardShadow: '#73330A',
  boardGrain: 'rgba(162, 92, 32, 0.14)',

  // Drilled empty screw holes
  holeFill: '#4D250C',
  holeInnerShadow: '#2B1304',
  holeRimBottom: '#FCE0B4',
  holeOutline: '#381906',

  // Gold-cream Phillips screw heads
  screwRim: '#3E1D08',
  screwTop: '#FCE8A4',
  screwBottom: '#DCA83F',
  screwInnerRing: '#B57D1E',
  screwCross: '#4E270D',
  screwSelectedGlow: '#00D4FF',

  // Top HUD & Cartoon Wood Buttons
  hudText: '#FFFFFF',
  hudTextStroke: '#4A2208',
  hudPillBg: '#6B3614',
  hudPillBorder: '#3B1A06',
  progressTrack: '#5C2D10',
  progressGreen: '#78E81E',
  progressGreenGloss: '#BBFC76',

  // Golden-amber 3D cartoon buttons
  amberBtnTop: '#FFB745',
  amberBtnBottom: '#E07F14',
  amberBtnLip: '#9E4D04',
  btnOutline: '#421F07',

  // Silver-gray Undo 3D button
  silverBtnTop: '#CED5DF',
  silverBtnBottom: '#939EAE',
  silverBtnLip: '#5B6473',

  // Badges & Status accents
  heartRed: '#EF4444',
  plusGreen: '#4ADE1A',
  freezeCyan: '#00D4FF',
  freezeIce: '#BAE6FD',
  dangerRed: '#F87171',
  goldStar: '#FBBF24',
};
