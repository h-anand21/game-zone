// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Procedural Endless World Generator
// Generates guaranteed 100% solvable arrow puzzle levels on the fly in < 1ms
// ============================================================

import type { ArrowPieceData, Direction, GameLevel } from '../game/types';
import { canExitBoard } from '../game/engine';

const PALETTE = [
  '#20BFFF', // Cyan
  '#FF45B5', // Pink
  '#49E67A', // Neon Green
  '#FFD43B', // Golden Yellow
  '#A64DFF', // Mystic Purple
  '#FF8C22', // Ember Orange
  '#00E5FF', // Electric Blue
  '#FF4655', // Ruby Red
];

export interface WorldInfo {
  worldId: number;
  worldName: string;
  worldIcon: string;
  themeColor: string;
  minLevel: number;
  maxLevel: number;
}

export const WORLD_DEFINITIONS: WorldInfo[] = [
  {
    worldId: 1,
    worldName: 'Whispering Forest',
    worldIcon: '🌲',
    themeColor: '#49E67A',
    minLevel: 1,
    maxLevel: 10,
  },
  {
    worldId: 2,
    worldName: 'Crystal Coast',
    worldIcon: '🌊',
    themeColor: '#20BFFF',
    minLevel: 11,
    maxLevel: 20,
  },
  {
    worldId: 3,
    worldName: 'Mystic Kingdom',
    worldIcon: '🏰',
    themeColor: '#FFD43B',
    minLevel: 21,
    maxLevel: 30,
  },
  {
    worldId: 4,
    worldName: 'Candy Valley',
    worldIcon: '🍬',
    themeColor: '#FF45B5',
    minLevel: 31,
    maxLevel: 40,
  },
  {
    worldId: 5,
    worldName: 'Lava Fortress',
    worldIcon: '🌋',
    themeColor: '#FF8C22',
    minLevel: 41,
    maxLevel: 50,
  },
  {
    worldId: 6,
    worldName: 'Galaxy Realm',
    worldIcon: '🪐',
    themeColor: '#A64DFF',
    minLevel: 51,
    maxLevel: 60,
  },
  {
    worldId: 7,
    worldName: 'Celestial Citadel',
    worldIcon: '⚡',
    themeColor: '#00E5FF',
    minLevel: 61,
    maxLevel: 70,
  },
  {
    worldId: 8,
    worldName: 'Phantom Crypt',
    worldIcon: '🔮',
    themeColor: '#E056FD',
    minLevel: 71,
    maxLevel: 80,
  },
  {
    worldId: 9,
    worldName: 'Sunken Atlantis',
    worldIcon: '🔱',
    themeColor: '#17C0EB',
    minLevel: 81,
    maxLevel: 90,
  },
  {
    worldId: 10,
    worldName: 'Infinite Realm',
    worldIcon: '👑',
    themeColor: '#FFD700',
    minLevel: 91,
    maxLevel: 9999,
  },
];

export function getWorldInfoForLevel(levelId: number): WorldInfo {
  const worldId = Math.floor((levelId - 1) / 10) + 1;
  const def = WORLD_DEFINITIONS.find((w) => w.worldId === worldId);
  if (def) return def;

  // Procedural world for levels beyond 100
  const loopIdx = (worldId - 1) % (WORLD_DEFINITIONS.length - 1);
  const base = WORLD_DEFINITIONS[loopIdx];
  return {
    worldId,
    worldName: `${base.worldName} II`,
    worldIcon: base.worldIcon,
    themeColor: base.themeColor,
    minLevel: (worldId - 1) * 10 + 1,
    maxLevel: worldId * 10,
  };
}

// Deterministic PRNG seeded by levelId
function createPrng(seed: number) {
  let s = Math.abs(seed) % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// In-memory cache for ultra-fast instant lookups with 0 loading
const levelCache = new Map<number, GameLevel>();

/**
 * Generates an endlessly scalable, guaranteed 100% solvable level.
 * Uses reverse exit simulation construction to guarantee no deadlocks.
 * Takes < 1ms to execute, so UI transitions have 0 latency.
 */
export function generateProceduralLevel(levelId: number): GameLevel {
  const cached = levelCache.get(levelId);
  if (cached) return cached;

  const rand = createPrng(levelId * 7919 + 1013);

  // Progressive grid sizing (comfortable for touch screens, never overcrowded)
  let rows = 6;
  let cols = 6;
  let targetPieces = 6;

  if (levelId <= 5) {
    rows = 6; cols = 6; targetPieces = 5 + levelId;
  } else if (levelId <= 15) {
    rows = 7; cols = 7; targetPieces = 8 + Math.floor((levelId - 5) * 0.5);
  } else if (levelId <= 30) {
    rows = 8; cols = 8; targetPieces = 11 + Math.floor((levelId - 15) * 0.4);
  } else if (levelId <= 60) {
    rows = 9; cols = 9; targetPieces = 14 + Math.floor((levelId - 30) * 0.3);
  } else {
    rows = 10; cols = 10; targetPieces = Math.min(20, 16 + Math.floor((levelId - 60) * 0.1));
  }

  const occupied = new Set<string>();
  const pieces: ArrowPieceData[] = [];
  const solution: string[] = [];

  const directions: Direction[] = ['right', 'left', 'down', 'up'];

  // Construct pieces in REVERSE removal order:
  // Each newly added piece can escape out without colliding with pieces placed before it.
  for (let pIdx = 0; pIdx < targetPieces; pIdx++) {
    const id = `p${pIdx + 1}`;
    const color = PALETTE[pIdx % PALETTE.length];

    for (let attempt = 0; attempt < 80; attempt++) {
      const dir = directions[Math.floor(rand() * directions.length)];
      const length = 2 + Math.floor(rand() * 3); // 2 to 4 cells

      const startRow = Math.floor(rand() * rows);
      const startCol = Math.floor(rand() * cols);

      if (occupied.has(`${startRow}:${startCol}`)) continue;

      const cells = [{ row: startRow, col: startCol }];
      let currR = startRow;
      let currC = startCol;
      let valid = true;

      for (let s = 1; s < length; s++) {
        const stepChoices = [
          { r: 0, c: 1 }, { r: 0, c: -1 }, { r: 1, c: 0 }, { r: -1, c: 0 }
        ].sort(() => rand() - 0.5);

        let stepFound = false;
        for (const ch of stepChoices) {
          const nextR = currR + ch.r;
          const nextC = currC + ch.c;
          if (
            nextR >= 0 && nextR < rows &&
            nextC >= 0 && nextC < cols &&
            !occupied.has(`${nextR}:${nextC}`) &&
            !cells.some(c => c.row === nextR && c.col === nextC)
          ) {
            cells.push({ row: nextR, col: nextC });
            currR = nextR;
            currC = nextC;
            stepFound = true;
            break;
          }
        }
        if (!stepFound) {
          valid = false;
          break;
        }
      }

      if (!valid || cells.length < 2) continue;

      const candidate: ArrowPieceData = { id, color, direction: dir, cells };

      // Verify that this piece can exit right now
      const exitTest = canExitBoard(candidate, pieces, rows, cols);
      if (exitTest.canExit) {
        pieces.push(candidate);
        cells.forEach(c => occupied.add(`${c.row}:${c.col}`));
        solution.unshift(id);
        break;
      }
    }
  }

  const worldInfo = getWorldInfoForLevel(levelId);
  const symbols = ['🌲', '🌊', '🏰', '🍬', '🌋', '🪐', '⚡', '🔮', '🔱', '👑', '💎', '⚔️', '✨'];
  const hiddenSymbol = symbols[(levelId - 1) % symbols.length];

  const generatedLevel: GameLevel = {
    id: levelId,
    worldId: worldInfo.worldId,
    worldName: worldInfo.worldName,
    name: `Kingdom ${levelId}`,
    rows,
    cols,
    threeStarMoves: pieces.length,
    twoStarMoves: pieces.length + 3,
    reward: {
      coins: 50 + levelId * 5,
      gems: levelId % 5 === 0 ? 10 : 0,
    },
    hiddenSymbol,
    pieces,
    solution,
  };

  levelCache.set(levelId, generatedLevel);
  return generatedLevel;
}
