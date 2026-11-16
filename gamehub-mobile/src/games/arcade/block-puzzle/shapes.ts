// ============================================================
// GameHub — Falling Jewel Blast Tetromino Shapes & Palettes
// ============================================================

import type { BlockColor, ColorTheme, TetrominoShape, TetrominoType } from './types';

export const JEWEL_COLORS: Record<BlockColor, ColorTheme> = {
  cyan: {
    name: 'cyan',
    main: '#00E5FF',
    gradient: ['#80F3FF', '#0091EA'],
    shadow: '#005FB8',
    highlight: 'rgba(255, 255, 255, 0.65)',
    glow: 'rgba(0, 229, 255, 0.5)',
  },
  amber: {
    name: 'amber',
    main: '#FFD600',
    gradient: ['#FFE57F', '#FF9100'],
    shadow: '#B26500',
    highlight: 'rgba(255, 255, 255, 0.65)',
    glow: 'rgba(255, 214, 0, 0.5)',
  },
  ruby: {
    name: 'ruby',
    main: '#FF2A55',
    gradient: ['#FF708D', '#D50032'],
    shadow: '#8C0020',
    highlight: 'rgba(255, 255, 255, 0.65)',
    glow: 'rgba(255, 42, 85, 0.5)',
  },
  green: {
    name: 'green',
    main: '#00E676',
    gradient: ['#B9F6CA', '#00A344'],
    shadow: '#00662A',
    highlight: 'rgba(255, 255, 255, 0.65)',
    glow: 'rgba(0, 230, 118, 0.5)',
  },
  purple: {
    name: 'purple',
    main: '#D500F9',
    gradient: ['#EA80FC', '#8E24AA'],
    shadow: '#59007A',
    highlight: 'rgba(255, 255, 255, 0.65)',
    glow: 'rgba(213, 0, 249, 0.5)',
  },
  orange: {
    name: 'orange',
    main: '#FF9100',
    gradient: ['#FFB74D', '#E65100'],
    shadow: '#993300',
    highlight: 'rgba(255, 255, 255, 0.65)',
    glow: 'rgba(255, 145, 0, 0.5)',
  },
  blue: {
    name: 'blue',
    main: '#2979FF',
    gradient: ['#82B1FF', '#1565C0'],
    shadow: '#0D47A1',
    highlight: 'rgba(255, 255, 255, 0.65)',
    glow: 'rgba(41, 121, 255, 0.5)',
  },
};

export const TETROMINOES: Record<TetrominoType, TetrominoShape> = {
  // ── 1. I-Bar (Cyan) ──
  I: {
    type: 'I',
    name: 'I-Bar',
    colorKey: 'cyan',
    rotations: [
      [
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
        [false, false, false, false],
      ],
      [
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false],
      ],
      [
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
      ],
      [
        [false, true, false, false],
        [false, true, false, false],
        [false, true, false, false],
        [false, true, false, false],
      ],
    ],
  },

  // ── 2. O-Square (Amber) ──
  O: {
    type: 'O',
    name: 'Square',
    colorKey: 'amber',
    rotations: [
      [
        [true, true],
        [true, true],
      ],
      [
        [true, true],
        [true, true],
      ],
      [
        [true, true],
        [true, true],
      ],
      [
        [true, true],
        [true, true],
      ],
    ],
  },

  // ── 3. T-Shape (Purple) ──
  T: {
    type: 'T',
    name: 'T-Shape',
    colorKey: 'purple',
    rotations: [
      [
        [false, true, false],
        [true, true, true],
        [false, false, false],
      ],
      [
        [false, true, false],
        [false, true, true],
        [false, true, false],
      ],
      [
        [false, false, false],
        [true, true, true],
        [false, true, false],
      ],
      [
        [false, true, false],
        [true, true, false],
        [false, true, false],
      ],
    ],
  },

  // ── 4. S-Shape (Green) ──
  S: {
    type: 'S',
    name: 'S-Shape',
    colorKey: 'green',
    rotations: [
      [
        [false, true, true],
        [true, true, false],
        [false, false, false],
      ],
      [
        [false, true, false],
        [false, true, true],
        [false, false, true],
      ],
      [
        [false, false, false],
        [false, true, true],
        [true, true, false],
      ],
      [
        [true, false, false],
        [true, true, false],
        [false, true, false],
      ],
    ],
  },

  // ── 5. Z-Shape (Ruby) ──
  Z: {
    type: 'Z',
    name: 'Z-Shape',
    colorKey: 'ruby',
    rotations: [
      [
        [true, true, false],
        [false, true, true],
        [false, false, false],
      ],
      [
        [false, false, true],
        [false, true, true],
        [false, true, false],
      ],
      [
        [false, false, false],
        [true, true, false],
        [false, true, true],
      ],
      [
        [false, true, false],
        [true, true, false],
        [true, false, false],
      ],
    ],
  },

  // ── 6. J-Shape (Blue) ──
  J: {
    type: 'J',
    name: 'J-Shape',
    colorKey: 'blue',
    rotations: [
      [
        [true, false, false],
        [true, true, true],
        [false, false, false],
      ],
      [
        [false, true, true],
        [false, true, false],
        [false, true, false],
      ],
      [
        [false, false, false],
        [true, true, true],
        [false, false, true],
      ],
      [
        [false, true, false],
        [false, true, false],
        [true, true, false],
      ],
    ],
  },

  // ── 7. L-Shape (Orange) ──
  L: {
    type: 'L',
    name: 'L-Shape',
    colorKey: 'orange',
    rotations: [
      [
        [false, false, true],
        [true, true, true],
        [false, false, false],
      ],
      [
        [false, true, false],
        [false, true, false],
        [false, true, true],
      ],
      [
        [false, false, false],
        [true, true, true],
        [true, false, false],
      ],
      [
        [true, true, false],
        [false, true, false],
        [false, true, false],
      ],
    ],
  },
};

export const ALL_TETROMINO_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
