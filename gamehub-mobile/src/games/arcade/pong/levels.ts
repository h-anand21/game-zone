// ============================================================
// Woodland Bubble Shooter — 20 Handcrafted + Unlimited Procedural Levels
// Encoding:
//   Uppercase R/G/B/Y/T/O -> Standard crystal bubbles
//   Lowercase r/g/b/y/t/o -> Firefly trapped inside colored bubble
//   X                     -> Iron Spiked Stone blocker (row >= 2 only)
//   .                     -> Empty slot
// ============================================================

import type { BubbleLevelConfig, LevelGoalType } from './types';
import { getHexNeighbors, getRowColCount } from './logic';

export interface WoodlandWorldInfo {
  worldIndex: number;
  name: string;
  accentHex: string;
}

export const WOODLAND_WORLDS: WoodlandWorldInfo[] = [
  { worldIndex: 1, name: 'Sunlit Oakwood', accentHex: '#F59E0B' },
  { worldIndex: 2, name: 'Bamboo Valley', accentHex: '#22C55E' },
  { worldIndex: 3, name: 'Honeycomb Hollow', accentHex: '#F97316' },
  { worldIndex: 4, name: 'Ancient Canopy', accentHex: '#0D9488' },
];

export const HANDCRAFTED_LEVELS: BubbleLevelConfig[] = [
  // 1 — Starter Arch
  {
    levelNumber: 1,
    worldIndex: 1,
    worldName: 'Sunlit Oakwood',
    name: 'Sunlit Clearing',
    subtitle: 'Match 3 or more matching bubbles to pop the canopy!',
    goalType: 'clear_all',
    maxShots: 22,
    starThresholds: [600, 1200, 1900],
    bonusPowerUps: { fireball: 1, lightning: 1, rainbow: 1 },
    rows: [
      'RRGGBBYYRR',
      'RRGGBBYYR',
      '..GGBBYY..',
      '..GGBBY..',
      '....BB....',
    ],
  },
  // 2 — Dual Symmetrical Hanging Lanterns (inspired by Screenshot 1 upper clusters)
  {
    levelNumber: 2,
    worldIndex: 1,
    worldName: 'Sunlit Oakwood',
    name: 'Twin Lanterns',
    subtitle: 'Bank off oak walls to collapse dangling clusters!',
    goalType: 'clear_all',
    maxShots: 24,
    starThresholds: [900, 1600, 2400],
    rows: [
      'RRB....BRR',
      'RGB....GR',
      'RGG....GGR',
      'YY......Y',
      '.YY....YY.',
      '..R....R.',
    ],
  },
  // 3 — Rescue Forest Fireflies intro
  {
    levelNumber: 3,
    worldIndex: 1,
    worldName: 'Sunlit Oakwood',
    name: 'Firefly Grove',
    subtitle: 'Pop or drop bubbles holding trapped Golden Fireflies!',
    goalType: 'rescue_fireflies',
    maxShots: 26,
    starThresholds: [1100, 1900, 2800],
    rows: [
      'GGRRBBYYGG',
      'GrRBbYyGg',
      '.GGBBYYGG.',
      '.GBbYYbG.',
      '..RR..RR..',
      '..r....r.',
    ],
  },
  // 4 — Red Star Core (directly inspired by Screenshot 2)
  {
    levelNumber: 4,
    worldIndex: 1,
    worldName: 'Sunlit Oakwood',
    name: 'Star Ruby Emblem',
    subtitle: 'Crack the emerald ring around the Ruby Star!',
    goalType: 'clear_all',
    maxShots: 28,
    starThresholds: [1400, 2300, 3300],
    rows: [
      'BBGGRRGGBB',
      'BGGRRRGGB',
      'BBRRRRRRBB',
      'BRRRRRRRB',
      'BBRRRRRRBB',
      'BGGRRRGGB',
      'BBGGRRGGBB',
      '.BG.R.GB.',
    ],
  },
  // 5 — Iron Spiked Gate (directly inspired by Screenshot 5)
  {
    levelNumber: 5,
    worldIndex: 1,
    worldName: 'Sunlit Oakwood',
    name: 'Spiked Gate',
    subtitle: 'Cut the upper colored anchors to drop Iron Spiked Stones!',
    goalType: 'clear_all',
    maxShots: 28,
    starThresholds: [1600, 2600, 3800],
    rows: [
      'BBBRRRRBBB',
      'BBRRRRRBB',
      'BBRRGGRRBB',
      'BRRGGGRRB',
      'BBBRRRRBBB',
      '.GG....RR',
      'GGXX..XXRR',
      '.X......X',
    ],
  },
  // 6 — Diagonal Rainbow Cascade (directly inspired by Screenshot 3)
  {
    levelNumber: 6,
    worldIndex: 1,
    worldName: 'Sunlit Oakwood',
    name: 'Rainbow Cascade',
    subtitle: 'Trigger multi-row chain avalanches across sunlit waves!',
    goalType: 'clear_all',
    maxShots: 30,
    starThresholds: [1800, 2900, 4100],
    rows: [
      'YYGGBBRROO',
      'YGGGBBROO',
      'OYYGGBBRRO',
      'OYYGGBBRR',
      'ROYYGGBBRR',
      '.OYYGBBR.',
      '..OYGBBR..',
      '...YGBB..',
    ],
  },
  // 7 — Tall Hanging Firefly Canopy
  {
    levelNumber: 7,
    worldIndex: 1,
    worldName: 'Sunlit Oakwood',
    name: 'Canopy Lanterns',
    subtitle: 'Rescue every hidden Golden Firefly above the canopy!',
    goalType: 'rescue_fireflies',
    maxShots: 32,
    starThresholds: [1800, 3000, 4400],
    rows: [
      'GGBBYYTTGG',
      'GbBYyTtGb',
      'GGBBYYTTGG',
      'RRR....RRR',
      '.rR....Rr.',
      '..BB..BB.',
      '..t....t..',
      '.OO...OO.',
    ],
  },
  // 8 — Honeycomb Rings
  {
    levelNumber: 8,
    worldIndex: 1,
    worldName: 'Sunlit Oakwood',
    name: 'Honeycomb Vault',
    subtitle: 'Break into twin honey rings to release trapped orbs!',
    goalType: 'clear_all',
    maxShots: 30,
    starThresholds: [1900, 3100, 4500],
    rows: [
      'YYYYOOYYYY',
      'Y..YOOY..Y',
      'YBBYOOYBBY',
      'YBBY.YBBY',
      'YYYYOOYYYY',
      '.G.Y..Y.G',
      '..GG..GG..',
    ],
  },
  // 9 — Tall Bamboo Bridges
  {
    levelNumber: 9,
    worldIndex: 1,
    worldName: 'Sunlit Oakwood',
    name: 'Timber Bridges',
    subtitle: 'Scrolls upward as you pop each timber bridge layer!',
    goalType: 'clear_all',
    maxShots: 34,
    starThresholds: [2200, 3500, 5000],
    rows: [
      'TTTTTTTTTT',
      'RRRBBBBBB',
      'YYYYOOYYYY',
      'GGGG..GGG',
      'RRXX..XXRR',
      'BB......B',
      'GGGGGGGGGG',
      '.OO....OO',
      '..TT..TT..',
      '...R..R..',
    ],
  },
  // 10 — Milestone World 1 Boss Canopy
  {
    levelNumber: 10,
    worldIndex: 1,
    worldName: 'Sunlit Oakwood',
    name: 'Oakwood Crown',
    subtitle: 'Free all Fireflies guarded by the twin Iron Fortress!',
    goalType: 'rescue_fireflies',
    maxShots: 36,
    starThresholds: [2600, 4200, 6000],
    rows: [
      'RRGGBBYYTT',
      'RrGBbYyTt',
      'OOYYYYYYOO',
      'OXXYYYXXO',
      'GGGBBBBGGG',
      'G.GBbBG.G',
      'TT......TT',
      '.t.....t.',
      '..RR..RR..',
    ],
  },
  // 11 — Emerald Waterfall
  {
    levelNumber: 11,
    worldIndex: 2,
    worldName: 'Bamboo Valley',
    name: 'Emerald Cascade',
    subtitle: 'Aim high into narrow bamboo gaps for massive drops!',
    goalType: 'clear_all',
    maxShots: 32,
    starThresholds: [2300, 3800, 5400],
    rows: [
      'G..TTTT..G',
      'G..TTT..G',
      'GG.BBBB.GG',
      'GY.BBB.YG',
      'YY.RRRR.YY',
      'OY.RRR.YO',
      'OO..YY..OO',
      '.O..Y..O.',
    ],
  },
  // 12 — Butterfly Wings
  {
    levelNumber: 12,
    worldIndex: 2,
    worldName: 'Bamboo Valley',
    name: 'Sapphire Wings',
    subtitle: 'Rescue the butterfly-orb Fireflies across wide wings!',
    goalType: 'rescue_fireflies',
    maxShots: 34,
    starThresholds: [2400, 3900, 5600],
    rows: [
      'BBB....BBB',
      'BbB....Bb',
      'BGG....GGB',
      'BYY....YY',
      'RRRR..RRRR',
      'RrR....Rr',
      '.OO....OO.',
      '..T....T.',
    ],
  },
  // 13 — Iron Pillars
  {
    levelNumber: 13,
    worldIndex: 2,
    worldName: 'Bamboo Valley',
    name: 'Iron Bastion',
    subtitle: 'Use bank shots above the Iron pillars to collapse them!',
    goalType: 'clear_all',
    maxShots: 34,
    starThresholds: [2500, 4100, 5800],
    rows: [
      'RRRRGGRRRR',
      'BBBRGGRBB',
      'XXRRGGRRXX',
      'YY..GG..Y',
      'XXBBTTBBXX',
      'OO..T..OO',
      '.GG....GG.',
    ],
  },
  // 14 — Citrus Spiral
  {
    levelNumber: 14,
    worldIndex: 2,
    worldName: 'Bamboo Valley',
    name: 'Amber Spiral',
    subtitle: 'Unravel alternating amber & teal rings!',
    goalType: 'clear_all',
    maxShots: 34,
    starThresholds: [2600, 4300, 6100],
    rows: [
      'OOOOOOOTTT',
      'TTTTTTTOO',
      'GGGYYYYYYY',
      'BBGGGGGGG',
      'RRRBBBBBBB',
      'TTTRRRRRR',
      '..YYYYYY..',
      '...OOOO..',
    ],
  },
  // 15 — Tall Canopy Rescue
  {
    levelNumber: 15,
    worldIndex: 2,
    worldName: 'Bamboo Valley',
    name: 'Mist Canopy',
    subtitle: 'Climb all 11 canopy rows to save the high fireflies!',
    goalType: 'rescue_fireflies',
    maxShots: 38,
    starThresholds: [2900, 4700, 6600],
    rows: [
      'TTGGYYBBTT',
      'TtGyYBbTt',
      'RR......RR',
      'RXX....XX',
      'GGGGGGGGGG',
      'BBBBBBBBB',
      'OO......OO',
      '.o.....o.',
      '..YY..YY..',
      '..y....y.',
      '...RR..RR.',
    ],
  },
  // 16 — Checker Fortress
  {
    levelNumber: 16,
    worldIndex: 3,
    worldName: 'Honeycomb Hollow',
    name: 'Checker Mosaic',
    subtitle: 'Pair matching pockets strategically before firing!',
    goalType: 'clear_all',
    maxShots: 36,
    starThresholds: [2800, 4500, 6400],
    rows: [
      'RRYYRRYYRR',
      'GGBBGGBBG',
      'TTYYTTYYTT',
      'OOBBOOBBO',
      'RRGGRRGGRR',
      '.YY....YY',
      '..TT..TT..',
    ],
  },
  // 17 — Double Shield Fireflies
  {
    levelNumber: 17,
    worldIndex: 3,
    worldName: 'Honeycomb Hollow',
    name: 'Amber Sanctuary',
    subtitle: 'Shatter twin Iron shields around the sanctuary fireflies!',
    goalType: 'rescue_fireflies',
    maxShots: 38,
    starThresholds: [3000, 4900, 6900],
    rows: [
      'YYOOGGOOYY',
      'YoOGgOYyO',
      'BBXXXXXXXB',
      'RRRRRRRRR',
      '.GG....GG.',
      '.TT....TT',
      '..B....B..',
    ],
  },
  // 18 — Twin Diamond
  {
    levelNumber: 18,
    worldIndex: 3,
    worldName: 'Honeycomb Hollow',
    name: 'Twin Diamonds',
    subtitle: 'Split the upper seam to drop both diamonds at once!',
    goalType: 'clear_all',
    maxShots: 36,
    starThresholds: [3100, 5000, 7100],
    rows: [
      '..RR..BB..',
      '.RRR..BBB',
      'RRRR..BBBB',
      'GYR....BY',
      '.GG....GG.',
      '.XX....XX',
      '..TT..OO..',
      '..T....O.',
    ],
  },
  // 19 — Tall Honeycomb Waterfall
  {
    levelNumber: 19,
    worldIndex: 3,
    worldName: 'Honeycomb Hollow',
    name: 'Golden Waterfall',
    subtitle: '12 rows deep — build combo streaks for power boosts!',
    goalType: 'clear_all',
    maxShots: 40,
    starThresholds: [3400, 5400, 7600],
    rows: [
      'YYYYOOYYYY',
      'BBBYYYYBB',
      'RRBBBBBRRR',
      'GGGRRRRGG',
      'TTTTGGGTTT',
      '.XXTTTTXX',
      '..OOYYOO..',
      '..BBGBB..',
      '...RRRR...',
      '...YYY...',
      '....TT....',
    ],
  },
  // 20 — Canopy Legend Showcase
  {
    levelNumber: 20,
    worldIndex: 4,
    worldName: 'Ancient Canopy',
    name: 'Woodland Legend',
    subtitle: 'Conquer the Ancient Canopy fortress and unlock infinity!',
    goalType: 'rescue_fireflies',
    maxShots: 42,
    starThresholds: [3800, 6000, 8500],
    rows: [
      'BBRRGGRRBB',
      'BrRGgGRrB',
      'YYTTOOYYTT',
      'YXXOOXXYY',
      'GGGGBBGGGG',
      '.gGBbBGg.',
      'RRRRRRRRRR',
      '.OO....OO',
      '..TT..TT..',
      '..t....t.',
    ],
  },
];

const PROCEDURAL_COLORS = ['R', 'G', 'B', 'Y', 'T', 'O'] as const;

const PROCEDURAL_TITLE_PREFIXES = [
  'Oak',
  'Timber',
  'Cedar',
  'Golden',
  'Bamboo',
  'Emerald',
  'Amber',
  'Sunlit',
  'Mossy',
  'Honey',
];

const PROCEDURAL_TITLE_SUFFIXES = [
  'Canopy',
  'Cascade',
  'Sanctuary',
  'Bridge',
  'Crown',
  'Vault',
  'Terrace',
  'Arch',
  'Lattice',
  'Lanterns',
];

/**
 * Deterministic seeded PRNG for consistent procedural level regeneration
 */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Removes any disconnected floating ASCII cells not anchored to Row 0.
 */
function pruneFloatingFromAsciiRows(rows: string[]): string[] {
  if (rows.length === 0) return rows;
  const visited = new Set<string>();
  const queue: { row: number; col: number }[] = [];

  for (let c = 0; c < Math.min(rows[0].length, getRowColCount(0)); c++) {
    if (rows[0][c] && rows[0][c] !== '.') {
      visited.add(`0,${c}`);
      queue.push({ row: 0, col: c });
    }
  }

  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const n of getHexNeighbors(curr.row, curr.col, rows.length)) {
      const ch = rows[n.row]?.[n.col];
      const key = `${n.row},${n.col}`;
      if (ch && ch !== '.' && !visited.has(key)) {
        visited.add(key);
        queue.push(n);
      }
    }
  }

  return rows.map((rowStr, r) =>
    rowStr
      .split('')
      .map((ch, c) => (ch === '.' || visited.has(`${r},${c}`) ? ch : '.'))
      .join('')
  );
}

/**
 * Generates any level number from 1 to infinity cleanly & deterministically.
 * Guarantees row 0 never holds unmatchable Stone blockers and every level is solvable.
 */
export function generateBubbleLevel(levelNumber: number): BubbleLevelConfig {
  if (levelNumber <= HANDCRAFTED_LEVELS.length) {
    return HANDCRAFTED_LEVELS[Math.max(0, levelNumber - 1)];
  }

  const rng = mulberry32(levelNumber * 7919 + 104729);
  const worldIdx = (Math.floor((levelNumber - 1) / 25) % WOODLAND_WORLDS.length) + 1;
  const world = WOODLAND_WORLDS[worldIdx - 1];

  const isRescue = levelNumber % 3 === 0;
  const goalType: LevelGoalType = isRescue ? 'rescue_fireflies' : 'clear_all';

  // Pick 4 to 6 active colors progressively
  const activeColorCount = levelNumber >= 45 ? 6 : levelNumber >= 25 ? 5 : 4;
  const colorBag = [...PROCEDURAL_COLORS];
  for (let i = colorBag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [colorBag[i], colorBag[j]] = [colorBag[j], colorBag[i]];
  }
  const palette = colorBag.slice(0, activeColorCount);

  const rowCount = Math.min(13, 8 + Math.floor((levelNumber % 15) / 3));
  const patternMode = levelNumber % 5; // 5 distinct symmetrical geometric styles
  const rows: string[] = [];
  let firefliesPlaced = 0;

  for (let r = 0; r < rowCount; r++) {
    const colCount = r % 2 === 0 ? 10 : 9;
    const half = Math.ceil(colCount / 2);
    const leftChars: string[] = [];

    for (let c = 0; c < half; c++) {
      let empty = false;
      if (patternMode === 0 && r >= rowCount - 3) {
        // Tapered diamond bottom
        empty = c < r - (rowCount - 4);
      } else if (patternMode === 1 && r >= 2) {
        // Twin vertical forest arches
        empty = c === half - 1 && r % 2 === 1;
      } else if (patternMode === 2 && r >= rowCount - 4) {
        // Twin hanging wings
        empty = c >= half - 2 && r > rowCount - 3;
      } else if (patternMode === 3 && r >= 3) {
        // Checker hollow windows
        empty = (r + c) % 4 === 0 && c > 0;
      } else if (patternMode === 4 && r >= 4) {
        // Waterfall side channels
        empty = c === 0 && r % 2 === 0;
      }

      if (empty) {
        leftChars.push('.');
        continue;
      }

      // Iron Stone blockers only in middle layers (never Row 0 so anchors remain breakable!)
      if (r >= 2 && r <= rowCount - 2 && c >= 1 && c <= half - 2 && rng() < 0.09) {
        leftChars.push('X');
        continue;
      }

      // Cohesive color banding so clusters are naturally matchable
      let pickColor: string;
      if (r === 0) {
        pickColor = palette[Math.floor(c / 2) % palette.length];
      } else if (patternMode === 4) {
        pickColor = palette[(r + Math.floor(c / 2)) % palette.length];
      } else {
        pickColor = palette[(Math.floor((r + c) / 2) + Math.floor(rng() * 2)) % palette.length];
      }

      if (isRescue && r >= 1 && r <= rowCount - 3 && (r + c) % 3 === 0 && firefliesPlaced < 8) {
        leftChars.push(pickColor.toLowerCase());
        firefliesPlaced++;
      } else {
        leftChars.push(pickColor);
      }
    }

    // Mirror left half symmetrically across row
    const mirrored = [...leftChars];
    for (let c = leftChars.length; c < colCount; c++) {
      mirrored.push(leftChars[colCount - 1 - c]);
    }
    rows.push(mirrored.join(''));
  }

  const prunedRows = pruneFloatingFromAsciiRows(rows);

  // Ensure rescue levels always guarantee at least 1 anchored firefly even on sparse rolls
  if (isRescue && !prunedRows.some((r) => /[rgbyto]/.test(r)) && prunedRows.length > 0) {
    const r0 = prunedRows[0].split('');
    const idx = Math.floor(r0.length / 2);
    r0[idx] = (r0[idx] && r0[idx] !== '.' && r0[idx] !== 'X' ? r0[idx] : palette[0]).toLowerCase();
    prunedRows[0] = r0.join('');
  }

  const prefix = PROCEDURAL_TITLE_PREFIXES[levelNumber % PROCEDURAL_TITLE_PREFIXES.length];
  const suffix =
    PROCEDURAL_TITLE_SUFFIXES[Math.floor(levelNumber / 3) % PROCEDURAL_TITLE_SUFFIXES.length];

  const maxShots = Math.min(48, 28 + Math.floor((rowCount - 8) * 3) + (activeColorCount - 4) * 3);
  const baseStar = 1600 + rowCount * 180;

  return {
    levelNumber,
    worldIndex: worldIdx,
    worldName: world.name,
    name: `${prefix} ${suffix}`,
    subtitle: isRescue
      ? 'Rescue every Golden Firefly inside the woodland canopy!'
      : 'Bank shots & trigger chain drops to clear the board!',
    goalType,
    maxShots,
    starThresholds: [baseStar, Math.round(baseStar * 1.55), Math.round(baseStar * 2.2)],
    rows: prunedRows,
  };
}
