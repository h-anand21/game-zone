// ============================================================
// Block Blast — Handcrafted Puzzle Levels & Pre-laid Layouts
// Progressive difficulty: Relaxed start, gentle learning curve,
// smooth speed acceleration, and rewarding layout challenges.
// ============================================================

import type { FallingGrid, BlockColor } from './types';
import { GRID_ROWS, GRID_COLS, createEmptyGrid } from './logic';

export interface LevelConfig {
  level: number;
  name: string;
  targetLines: number;
  dropSpeed: number; // base fall interval in ms (relaxed early on)
  description: string;
  layoutRows: string[]; // bottom rows representation (10 chars each)
}

const CHAR_TO_COLOR: Record<string, BlockColor> = {
  C: 'cyan',
  A: 'amber',
  R: 'ruby',
  G: 'green',
  P: 'purple',
  O: 'orange',
  B: 'blue',
};

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: 'Genesis Glade',
    targetLines: 2,
    dropSpeed: 1100, // Very relaxed 1.1s per drop
    description: 'Welcome! Drop any piece into the open center to trigger your first blast.',
    layoutRows: [
      'CCC....CCC', // Wide open 4-cell center opening at bottom
    ],
  },
  {
    level: 2,
    name: 'Amber Gap',
    targetLines: 3,
    dropSpeed: 1000, // 1.0s per drop
    description: 'Fill the single golden gap to clear the foundation.',
    layoutRows: [
      'AAAA.AAAAA', // 1 single gap at col 4
    ],
  },
  {
    level: 3,
    name: 'Twin Corners',
    targetLines: 3,
    dropSpeed: 920,
    description: 'Emerald blocks on both corners guide your drops.',
    layoutRows: [
      'GG......GG',
    ],
  },
  {
    level: 4,
    name: 'Low Pillars',
    targetLines: 4,
    dropSpeed: 850,
    description: 'Small purple pillars framing the playfield.',
    layoutRows: [
      'P........P',
      'PP......PP',
    ],
  },
  {
    level: 5,
    name: 'Gentle Steps',
    targetLines: 4,
    dropSpeed: 790,
    description: 'Gentle golden steps ascending along the right wall.',
    layoutRows: [
      '......AAAA',
      '....AAAAAA',
    ],
  },
  {
    level: 6,
    name: 'Castle Bastion',
    targetLines: 5,
    dropSpeed: 730,
    description: 'Classic fortress foundations with wide accessible slots.',
    layoutRows: [
      'B..B..B..B',
      'BB.BB.BB.B',
    ],
  },
  {
    level: 7,
    name: 'Ruby Diamond',
    targetLines: 5,
    dropSpeed: 670,
    description: 'A modest ruby gem formation in the center.',
    layoutRows: [
      '...RR...',
      '..RRRR..',
      '...RR...',
    ],
  },
  {
    level: 8,
    name: 'Canyon Pass',
    targetLines: 6,
    dropSpeed: 620,
    description: 'A descending diagonal amber pass down to the base.',
    layoutRows: [
      'OO......',
      '..OO....',
      '....OO..',
    ],
  },
  {
    level: 9,
    name: 'Dual Pyramids',
    targetLines: 6,
    dropSpeed: 570,
    description: 'Two purple peaks rising above the foundation.',
    layoutRows: [
      '..P....P..',
      '.PPP..PPP.',
    ],
  },
  {
    level: 10,
    name: 'Sapphire Matrix',
    targetLines: 7,
    dropSpeed: 520,
    description: 'Checkerboard jewel grid testing your precision placement.',
    layoutRows: [
      'C.C.C.C.C.',
      '.C.C.C.C.C',
    ],
  },
  {
    level: 11,
    name: 'Emerald Fortress',
    targetLines: 8,
    dropSpeed: 470,
    description: 'Substantial emerald ramparts requiring multi-line clears.',
    layoutRows: [
      '..GG..GG..',
      '..GG..GG..',
      'GGGG..GGGG',
    ],
  },
  {
    level: 12,
    name: 'Royal Gate',
    targetLines: 8,
    dropSpeed: 430,
    description: 'Towering ruby pillars with an amber core foundation.',
    layoutRows: [
      'RR......RR',
      'RR..AA..RR',
      'RR..AA..RR',
      'RR..AA..RR',
    ],
  },
  {
    level: 13,
    name: 'The Labyrinth',
    targetLines: 9,
    dropSpeed: 390,
    description: 'Winding orange and blue corridors demanding quick rotations.',
    layoutRows: [
      'OOOO.OOOO.',
      '.OOOO.OOOO',
      'BBBB..BBBB',
      'CCCC..CCCC',
    ],
  },
  {
    level: 14,
    name: 'Dragon Teeth',
    targetLines: 10,
    dropSpeed: 350,
    description: 'Jagged obstacles requiring rapid hard-drop mastery.',
    layoutRows: [
      'R...R...R.',
      'RR..RR..RR',
      'RRR.RRR.RR',
      'CCCCCCCC..',
      '..CCCCCCCC',
    ],
  },
  {
    level: 15,
    name: 'Grand Jewel Master',
    targetLines: 12,
    dropSpeed: 310,
    description: 'The ultimate jewel challenge: 5 dense pre-laid tiers!',
    layoutRows: [
      '..P....P..',
      '.PPP..PPP.',
      'CCCCC..CCC',
      'AAAAA..AAA',
      'GGGGG..GGG',
    ],
  },
];

export const TOTAL_LEVELS = LEVELS.length;

/**
 * Returns LevelConfig for a given level number (1-indexed, clamped to available levels)
 */
export function getLevelConfig(levelNumber: number): LevelConfig {
  const safeIndex = Math.max(0, Math.min(levelNumber - 1, LEVELS.length - 1));
  return LEVELS[safeIndex];
}

/**
 * Generates a 20x10 FallingGrid pre-populated with the level's handcrafted layout
 */
export function createGridForLevel(levelNumber: number): FallingGrid {
  const grid = createEmptyGrid();
  const config = getLevelConfig(levelNumber);
  const rows = config.layoutRows;

  if (!rows || rows.length === 0) {
    return grid;
  }

  // Position rows at the bottom of the 20-row grid
  const startRow = Math.max(0, GRID_ROWS - rows.length);

  for (let r = 0; r < rows.length; r++) {
    const gridRow = startRow + r;
    if (gridRow >= GRID_ROWS) break;

    const rowStr = rows[r];
    for (let c = 0; c < Math.min(rowStr.length, GRID_COLS); c++) {
      const char = rowStr[c];
      const colorKey = CHAR_TO_COLOR[char];

      if (colorKey) {
        grid[gridRow][c] = {
          filled: true,
          colorKey,
        };
      }
    }
  }

  return grid;
}
