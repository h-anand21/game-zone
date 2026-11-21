// ============================================================
// Block Blast — Handcrafted Puzzle Levels & Pre-laid Layouts
// Every level features a unique pre-laid jewel block arrangement,
// specific line clear goals, and escalating drop speeds.
// ============================================================

import type { FallingGrid, BlockColor } from './types';
import { GRID_ROWS, GRID_COLS, createEmptyGrid } from './logic';

export interface LevelConfig {
  level: number;
  name: string;
  targetLines: number;
  dropSpeed: number; // fall interval in ms
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
    targetLines: 3,
    dropSpeed: 560,
    description: 'Fill the single gaps to trigger your first line blasts!',
    layoutRows: [
      'CCCC.CCCCC', // Gap at col 4
      '.AAAAAAAAA', // Gap at col 0
    ],
  },
  {
    level: 2,
    name: 'Twin Pillars',
    targetLines: 4,
    dropSpeed: 530,
    description: 'Navigate jewel columns on the flanks.',
    layoutRows: [
      'GG......GG',
      'GG......GG',
      'GG..PP..GG',
      'GG..PP..GG',
    ],
  },
  {
    level: 3,
    name: 'Amber Steps',
    targetLines: 5,
    dropSpeed: 500,
    description: 'Staircase of golden jewels ascending right.',
    layoutRows: [
      '........AA',
      '......AAAA',
      '....AAAAAA',
      '..AAAAAAAA',
    ],
  },
  {
    level: 4,
    name: 'Castle Bastion',
    targetLines: 6,
    dropSpeed: 470,
    description: 'Fortress towers guarding the jewel vault.',
    layoutRows: [
      'B..B..B..B',
      'B..B..B..B',
      'BB.BB.BB.B',
      'BBBB..BBBB',
      'BBBB..BBBB',
    ],
  },
  {
    level: 5,
    name: 'Ruby Diamond',
    targetLines: 6,
    dropSpeed: 440,
    description: 'Clear the diamond jewel formation in the center.',
    layoutRows: [
      '....RR....',
      '...RRRR...',
      '..RR..RR..',
      '...RRRR...',
      '....RR....',
    ],
  },
  {
    level: 6,
    name: 'Zig-Zag Canyon',
    targetLines: 7,
    dropSpeed: 420,
    description: 'A winding diagonal path down to the foundation.',
    layoutRows: [
      'OO........',
      '..OO......',
      '....OO....',
      '......OO..',
      '........OO',
      'GGGG..GGGG',
    ],
  },
  {
    level: 7,
    name: 'Sapphire Matrix',
    targetLines: 8,
    dropSpeed: 390,
    description: 'Checkerboard jewel grid testing your precision placement.',
    layoutRows: [
      'C.C.C.C.C.',
      '.C.C.C.C.C',
      'C.C.C.C.C.',
      'BBBB..BBBB',
      'AAAA..AAAA',
    ],
  },
  {
    level: 8,
    name: 'Dual Pyramids',
    targetLines: 8,
    dropSpeed: 370,
    description: 'Two purple peaks rising above an emerald floor.',
    layoutRows: [
      '.P......P.',
      'PPP....PPP',
      'PPPPP..PPP',
      'GGGGGG..GG',
      'GGGGGG..GG',
    ],
  },
  {
    level: 9,
    name: 'Royal Gate',
    targetLines: 9,
    dropSpeed: 350,
    description: 'Flanked by towering ruby pillars with amber core.',
    layoutRows: [
      'RR......RR',
      'RR......RR',
      'RR..AA..RR',
      'RR..AA..RR',
      'RR..AA..RR',
      'RR..AA..RR',
    ],
  },
  {
    level: 10,
    name: 'Emerald Cross',
    targetLines: 10,
    dropSpeed: 330,
    description: 'Massive glowing cross requiring strategic row completions.',
    layoutRows: [
      '....GG....',
      '....GG....',
      '..GGGGGG..',
      '..GGGGGG..',
      '....GG....',
      '....GG....',
    ],
  },
  {
    level: 11,
    name: 'The Labyrinth',
    targetLines: 10,
    dropSpeed: 310,
    description: 'Interlocking orange corridors requiring swift rotations.',
    layoutRows: [
      'OOOO.OOOO.',
      '....O....O',
      '.OOOO.OOOO',
      'O....O....',
      'BBBB..BBBB',
      'CCCC..CCCC',
    ],
  },
  {
    level: 12,
    name: 'Fortress Core',
    targetLines: 12,
    dropSpeed: 290,
    description: 'Multi-tiered defense with purple towers and ruby foundation.',
    layoutRows: [
      'P..P..P..P',
      '.PP.PP.PP.',
      'P..P..P..P',
      'RRRR..RRRR',
      'AAAA..AAAA',
      'GGGG..GGGG',
    ],
  },
  {
    level: 13,
    name: 'Jewel Cascade',
    targetLines: 12,
    dropSpeed: 270,
    description: 'High density spectrum of alternating jewel tiers.',
    layoutRows: [
      'C.C.C.C.C.',
      '.A.A.A.A.A',
      'R.R.R.R.R.',
      '.G.G.G.G.G',
      'P.P.P.P.P.',
      'BBBB..BBBB',
    ],
  },
  {
    level: 14,
    name: 'Dragon Teeth',
    targetLines: 14,
    dropSpeed: 250,
    description: 'Sharp jagged obstacles demanding rapid hard-drops.',
    layoutRows: [
      'R...R...R.',
      'RR..RR..RR',
      'RRR.RRR.RR',
      'O...O...O.',
      'OO..OO..OO',
      'CCCCCCCC..',
      '..CCCCCCCC',
    ],
  },
  {
    level: 15,
    name: 'Grand Jewel Master',
    targetLines: 15,
    dropSpeed: 220,
    description: 'The pinnacle challenge: 7 tiers of dense pre-laid jewel blocks!',
    layoutRows: [
      '..P....P..',
      '.PPP..PPP.',
      'CCCCC..CCC',
      'RRRRR..RRR',
      'AAAAA..AAA',
      'GGGGG..GGG',
      'BBBBB..BBB',
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
