// ============================================================
// GameHub — Block Blast Shapes & Polyomino Definitions
// ============================================================

import type { BlockColor, ColorTheme, ShapePiece } from './types';

export const JEWEL_COLORS: Record<BlockColor, ColorTheme> = {
  cyan: {
    name: 'cyan',
    main: '#00E5FF',
    gradient: ['#69F0AE', '#00B0FF'],
    shadow: '#0070BA',
    highlight: 'rgba(255, 255, 255, 0.45)',
    glow: 'rgba(0, 229, 255, 0.5)',
  },
  amber: {
    name: 'amber',
    main: '#FFD600',
    gradient: ['#FFE57F', '#FF9100'],
    shadow: '#C46200',
    highlight: 'rgba(255, 255, 255, 0.5)',
    glow: 'rgba(255, 214, 0, 0.5)',
  },
  ruby: {
    name: 'ruby',
    main: '#FF2A55',
    gradient: ['#FF6E85', '#D50032'],
    shadow: '#8C0020',
    highlight: 'rgba(255, 255, 255, 0.45)',
    glow: 'rgba(255, 42, 85, 0.5)',
  },
  green: {
    name: 'green',
    main: '#00E676',
    gradient: ['#B9F6CA', '#00A344'],
    shadow: '#00662A',
    highlight: 'rgba(255, 255, 255, 0.45)',
    glow: 'rgba(0, 230, 118, 0.5)',
  },
  purple: {
    name: 'purple',
    main: '#D500F9',
    gradient: ['#EA80FC', '#8E24AA'],
    shadow: '#59007A',
    highlight: 'rgba(255, 255, 255, 0.45)',
    glow: 'rgba(213, 0, 249, 0.5)',
  },
  orange: {
    name: 'orange',
    main: '#FF9100',
    gradient: ['#FFB74D', '#E65100'],
    shadow: '#993300',
    highlight: 'rgba(255, 255, 255, 0.45)',
    glow: 'rgba(255, 145, 0, 0.5)',
  },
  blue: {
    name: 'blue',
    main: '#2979FF',
    gradient: ['#82B1FF', '#1565C0'],
    shadow: '#0D47A1',
    highlight: 'rgba(255, 255, 255, 0.45)',
    glow: 'rgba(41, 121, 255, 0.5)',
  },
};

export interface RawShapeDef {
  shapeId: string;
  name: string;
  matrix: boolean[][];
  defaultColor: BlockColor;
  weight: number; // probability weight
  difficulty: 'easy' | 'medium' | 'hard';
}

export const SHAPE_DEFINITIONS: RawShapeDef[] = [
  // ── 1. Single Dot (Safety rescue piece) ──
  {
    shapeId: 'dot-1',
    name: 'Single Dot',
    matrix: [[true]],
    defaultColor: 'amber',
    weight: 8,
    difficulty: 'easy',
  },

  // ── 2. Straight Bars (2, 3, 4, 5) ──
  {
    shapeId: 'bar-2-h',
    name: '2-Bar H',
    matrix: [[true, true]],
    defaultColor: 'cyan',
    weight: 10,
    difficulty: 'easy',
  },
  {
    shapeId: 'bar-2-v',
    name: '2-Bar V',
    matrix: [[true], [true]],
    defaultColor: 'cyan',
    weight: 10,
    difficulty: 'easy',
  },
  {
    shapeId: 'bar-3-h',
    name: '3-Bar H',
    matrix: [[true, true, true]],
    defaultColor: 'green',
    weight: 9,
    difficulty: 'easy',
  },
  {
    shapeId: 'bar-3-v',
    name: '3-Bar V',
    matrix: [[true], [true], [true]],
    defaultColor: 'green',
    weight: 9,
    difficulty: 'easy',
  },
  {
    shapeId: 'bar-4-h',
    name: '4-Bar H',
    matrix: [[true, true, true, true]],
    defaultColor: 'blue',
    weight: 7,
    difficulty: 'medium',
  },
  {
    shapeId: 'bar-4-v',
    name: '4-Bar V',
    matrix: [[true], [true], [true], [true]],
    defaultColor: 'blue',
    weight: 7,
    difficulty: 'medium',
  },
  {
    shapeId: 'bar-5-h',
    name: '5-Bar H',
    matrix: [[true, true, true, true, true]],
    defaultColor: 'purple',
    weight: 4,
    difficulty: 'hard',
  },
  {
    shapeId: 'bar-5-v',
    name: '5-Bar V',
    matrix: [[true], [true], [true], [true], [true]],
    defaultColor: 'purple',
    weight: 4,
    difficulty: 'hard',
  },

  // ── 3. Squares ──
  {
    shapeId: 'sq-2',
    name: 'Square 2x2',
    matrix: [
      [true, true],
      [true, true],
    ],
    defaultColor: 'amber',
    weight: 10,
    difficulty: 'easy',
  },
  {
    shapeId: 'sq-3',
    name: 'Giant Square 3x3',
    matrix: [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ],
    defaultColor: 'ruby',
    weight: 3,
    difficulty: 'hard',
  },

  // ── 4. Mini Corners (3 cells) ──
  {
    shapeId: 'corner-tl',
    name: 'Corner Top-Left',
    matrix: [
      [true, true],
      [true, false],
    ],
    defaultColor: 'orange',
    weight: 9,
    difficulty: 'easy',
  },
  {
    shapeId: 'corner-tr',
    name: 'Corner Top-Right',
    matrix: [
      [true, true],
      [false, true],
    ],
    defaultColor: 'orange',
    weight: 9,
    difficulty: 'easy',
  },
  {
    shapeId: 'corner-bl',
    name: 'Corner Bottom-Left',
    matrix: [
      [true, false],
      [true, true],
    ],
    defaultColor: 'orange',
    weight: 9,
    difficulty: 'easy',
  },
  {
    shapeId: 'corner-br',
    name: 'Corner Bottom-Right',
    matrix: [
      [false, true],
      [true, true],
    ],
    defaultColor: 'orange',
    weight: 9,
    difficulty: 'easy',
  },

  // ── 5. Classic 4-Cell L-Shapes (3x2 or 2x3) ──
  {
    shapeId: 'l-down-right',
    name: 'L-Shape Down-Right',
    matrix: [
      [true, false],
      [true, false],
      [true, true],
    ],
    defaultColor: 'blue',
    weight: 8,
    difficulty: 'medium',
  },
  {
    shapeId: 'l-down-left',
    name: 'L-Shape Down-Left',
    matrix: [
      [false, true],
      [false, true],
      [true, true],
    ],
    defaultColor: 'blue',
    weight: 8,
    difficulty: 'medium',
  },
  {
    shapeId: 'l-up-right',
    name: 'L-Shape Up-Right',
    matrix: [
      [true, true],
      [true, false],
      [true, false],
    ],
    defaultColor: 'blue',
    weight: 8,
    difficulty: 'medium',
  },
  {
    shapeId: 'l-up-left',
    name: 'L-Shape Up-Left',
    matrix: [
      [true, true],
      [false, true],
      [false, true],
    ],
    defaultColor: 'blue',
    weight: 8,
    difficulty: 'medium',
  },

  // ── 6. T-Shapes (4 cells) ──
  {
    shapeId: 't-down',
    name: 'T-Shape Down',
    matrix: [
      [true, true, true],
      [false, true, false],
    ],
    defaultColor: 'purple',
    weight: 8,
    difficulty: 'medium',
  },
  {
    shapeId: 't-up',
    name: 'T-Shape Up',
    matrix: [
      [false, true, false],
      [true, true, true],
    ],
    defaultColor: 'purple',
    weight: 8,
    difficulty: 'medium',
  },
  {
    shapeId: 't-right',
    name: 'T-Shape Right',
    matrix: [
      [true, false],
      [true, true],
      [true, false],
    ],
    defaultColor: 'purple',
    weight: 8,
    difficulty: 'medium',
  },
  {
    shapeId: 't-left',
    name: 'T-Shape Left',
    matrix: [
      [false, true],
      [true, true],
      [false, true],
    ],
    defaultColor: 'purple',
    weight: 8,
    difficulty: 'medium',
  },

  // ── 7. Z and S Shapes (4 cells) ──
  {
    shapeId: 'z-h',
    name: 'Z-Shape H',
    matrix: [
      [true, true, false],
      [false, true, true],
    ],
    defaultColor: 'ruby',
    weight: 7,
    difficulty: 'medium',
  },
  {
    shapeId: 's-h',
    name: 'S-Shape H',
    matrix: [
      [false, true, true],
      [true, true, false],
    ],
    defaultColor: 'green',
    weight: 7,
    difficulty: 'medium',
  },

  // ── 8. Giant 5-Cell L-Shapes (3x3) ──
  {
    shapeId: 'big-l-br',
    name: 'Big L Corner',
    matrix: [
      [true, false, false],
      [true, false, false],
      [true, true, true],
    ],
    defaultColor: 'cyan',
    weight: 5,
    difficulty: 'hard',
  },
  {
    shapeId: 'big-l-bl',
    name: 'Big L Mirror Corner',
    matrix: [
      [false, false, true],
      [false, false, true],
      [true, true, true],
    ],
    defaultColor: 'cyan',
    weight: 5,
    difficulty: 'hard',
  },

  // ── 9. Plus / Cross Shape (5 cells) ──
  {
    shapeId: 'plus-5',
    name: 'Plus Cross',
    matrix: [
      [false, true, false],
      [true, true, true],
      [false, true, false],
    ],
    defaultColor: 'amber',
    weight: 4,
    difficulty: 'hard',
  },
];

/**
 * Creates a playable ShapePiece instance from a raw definition
 */
export function createShapePiece(def: RawShapeDef, instanceId?: string): ShapePiece {
  const theme = JEWEL_COLORS[def.defaultColor];
  const rowCount = def.matrix.length;
  const colCount = Math.max(...def.matrix.map((r) => r.length));
  let cellCount = 0;
  for (const row of def.matrix) {
    for (const cell of row) {
      if (cell) cellCount++;
    }
  }

  return {
    id: instanceId || `${def.shapeId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    shapeId: def.shapeId,
    name: def.name,
    matrix: def.matrix,
    colorKey: def.defaultColor,
    color: theme.main,
    gradient: theme.gradient,
    shadow: theme.shadow,
    highlight: theme.highlight,
    rowCount,
    colCount,
    cellCount,
  };
}
