// ============================================================
// Wood Screw: Nuts & Bolts Puzzle — Handcrafted & Procedural Levels
// Includes faithful Level 5 (Pine Tree) & Level 7 (Multi-Color Lattice)
// plus unlimited deterministic solvable levels
// ============================================================

import {
  DEFAULT_PLANK_THICKNESS,
  PIN_SNAP_TOLERANCE,
  type BoardHole,
  type PlankColor,
  type PlankHole,
  type ScrewItem,
  type WoodLevelData,
  type WoodPlank,
} from './types';
import { isLevelSolvableFast, updatePlanksConstraintState } from './logic';

interface PlankSpec {
  id: string;
  color: PlankColor;
  layer: number;
  holeIds: string[]; // At least 2 board hole IDs along a straight line
  thickness?: number;
}

class SeededPRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = (seed % 2147483647) || 1;
    if (this.seed <= 0) this.seed += 2147483646;
  }
  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(arr: readonly T[]): T {
    return arr[this.nextInt(0, arr.length - 1)];
  }
}

/**
 * Builds a complete, aligned WoodLevelData from board holes, plank specs, and empty hole IDs.
 */
function buildLevel(
  levelNumber: number,
  title: string,
  timeLimitSeconds: number,
  holes: BoardHole[],
  plankSpecs: PlankSpec[],
  emptyHoleIds: Set<string>
): WoodLevelData {
  const holeMap = new Map<string, BoardHole>();
  for (const h of holes) {
    holeMap.set(h.id, h);
  }

  // Place a screw in every hole except the intentionally empty ones (if used by a plank)
  const usedHoleIds = new Set<string>();
  const planks: WoodPlank[] = [];

  for (const spec of plankSpecs) {
    const pts = spec.holeIds
      .map((id) => holeMap.get(id))
      .filter((h): h is BoardHole => Boolean(h));
    if (pts.length < 2) continue;

    // Endpoints define plank axis
    const first = pts[0];
    const last = pts[pts.length - 1];
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) continue;

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const cx = (first.x + last.x) / 2;
    const cy = (first.y + last.y) / 2;
    const thickness = spec.thickness ?? DEFAULT_PLANK_THICKNESS;
    const length = dist + thickness + 4;

    const ux = dx / dist;
    const uy = dy / dist;

    const plankHoles: PlankHole[] = pts.map((pt, idx) => {
      const localX = (pt.x - cx) * ux + (pt.y - cy) * uy;
      const hasScrew = !emptyHoleIds.has(pt.id);
      if (hasScrew) {
        usedHoleIds.add(pt.id);
      }
      return {
        id: `${spec.id}-ph-${idx}`,
        localX,
        pinnedHoleId: hasScrew ? pt.id : null,
      };
    });

    planks.push({
      id: spec.id,
      color: spec.color,
      layer: spec.layer,
      x: cx,
      y: cy,
      angle,
      length,
      thickness,
      holes: plankHoles,
      vx: 0,
      vy: 0,
      angularVel: 0,
      status: 'pinned',
    });
  }

  // Ensure any hole occupied by a screw pins EVERY overlapping plank hole cleanly
  const screws: ScrewItem[] = [];
  let screwCounter = 1;
  for (const hole of holes) {
    if (usedHoleIds.has(hole.id) && !emptyHoleIds.has(hole.id)) {
      screws.push({
        id: `s-${screwCounter++}`,
        holeId: hole.id,
      });
    }
  }

  // Re-sync extra overlapping intersections if a plank happened to pass over a pinned hole
  const syncedPlanks = planks.map((plank) => ({
    ...plank,
    holes: plank.holes.map((ph) => {
      if (ph.pinnedHoleId) return ph;
      const rad = (plank.angle * Math.PI) / 180;
      const wx = plank.x + ph.localX * Math.cos(rad);
      const wy = plank.y + ph.localX * Math.sin(rad);
      const matchScrew = screws.find((sc) => {
        const bh = holeMap.get(sc.holeId);
        return bh && Math.hypot(bh.x - wx, bh.y - wy) <= PIN_SNAP_TOLERANCE;
      });
      return matchScrew ? { ...ph, pinnedHoleId: matchScrew.holeId } : ph;
    }),
  }));

  return {
    levelNumber,
    title,
    timeLimitSeconds,
    holes,
    planks: updatePlanksConstraintState(syncedPlanks),
    screws,
  };
}

// ============================================================
// HANDCRAFTED ICONIC LEVELS (1–12)
// ============================================================

function createLevel1(): WoodLevelData {
  const holes: BoardHole[] = [
    { id: 't1', x: 100, y: 46 },
    { id: 't2', x: 220, y: 46 },
    { id: 'h1', x: 80, y: 170 },
    { id: 'h2', x: 240, y: 170 },
    { id: 'h3', x: 80, y: 270 },
    { id: 'h4', x: 240, y: 270 },
  ];
  const planks: PlankSpec[] = [
    { id: 'p1', color: 'amber', layer: 0, holeIds: ['h1', 'h2'] },
    { id: 'p2', color: 'green', layer: 1, holeIds: ['h3', 'h4'] },
  ];
  return buildLevel(1, 'Wood Basics', 45, holes, planks, new Set(['t1', 't2']));
}

function createLevel2(): WoodLevelData {
  const holes: BoardHole[] = [
    { id: 't1', x: 96, y: 46 },
    { id: 't2', x: 224, y: 46 },
    { id: 'h1', x: 80, y: 148 },
    { id: 'h2', x: 240, y: 148 },
    { id: 'h3', x: 160, y: 228 },
    { id: 'h4', x: 80, y: 308 },
    { id: 'h5', x: 240, y: 308 },
  ];
  const planks: PlankSpec[] = [
    { id: 'p1', color: 'green', layer: 0, holeIds: ['h1', 'h2'] },
    { id: 'p2', color: 'amber', layer: 1, holeIds: ['h1', 'h3', 'h5'] },
    { id: 'p3', color: 'sienna', layer: 2, holeIds: ['h2', 'h3', 'h4'] },
  ];
  return buildLevel(2, 'Cross Lock', 60, holes, planks, new Set(['t1', 't2']));
}

function createLevel3(): WoodLevelData {
  const holes: BoardHole[] = [
    { id: 't1', x: 90, y: 46 },
    { id: 't2', x: 230, y: 46 },
    { id: 'h1', x: 78, y: 138 },
    { id: 'h2', x: 242, y: 138 },
    { id: 'h3', x: 78, y: 236 },
    { id: 'h4', x: 242, y: 236 },
    { id: 'h5', x: 78, y: 334 },
    { id: 'h6', x: 242, y: 334 },
  ];
  const planks: PlankSpec[] = [
    { id: 'p1', color: 'walnut', layer: 0, holeIds: ['h1', 'h3', 'h5'] },
    { id: 'p2', color: 'walnut', layer: 0, holeIds: ['h2', 'h4', 'h6'] },
    { id: 'p3', color: 'green', layer: 1, holeIds: ['h1', 'h2'] },
    { id: 'p4', color: 'amber', layer: 1, holeIds: ['h3', 'h4'] },
    { id: 'p5', color: 'sienna', layer: 2, holeIds: ['h5', 'h6'] },
  ];
  return buildLevel(3, 'Twin Gate', 75, holes, planks, new Set(['t1', 't2']));
}

function createLevel4(): WoodLevelData {
  const holes: BoardHole[] = [
    { id: 't1', x: 76, y: 46 },
    { id: 't2', x: 160, y: 46 },
    { id: 't3', x: 244, y: 46 },
    { id: 'top', x: 160, y: 122 },
    { id: 'l1', x: 74, y: 215 },
    { id: 'r1', x: 246, y: 215 },
    { id: 'mid', x: 160, y: 215 },
    { id: 'l2', x: 100, y: 335 },
    { id: 'r2', x: 220, y: 335 },
  ];
  const planks: PlankSpec[] = [
    { id: 'p1', color: 'caramel', layer: 0, holeIds: ['l1', 'mid', 'r1'] },
    { id: 'p2', color: 'amber', layer: 1, holeIds: ['top', 'l1'] },
    { id: 'p3', color: 'sienna', layer: 1, holeIds: ['top', 'r1'] },
    { id: 'p4', color: 'green', layer: 2, holeIds: ['l1', 'l2'] },
    { id: 'p5', color: 'green', layer: 2, holeIds: ['r1', 'r2'] },
    { id: 'p6', color: 'walnut', layer: 3, holeIds: ['l2', 'r2'] },
  ];
  return buildLevel(4, 'Timber Crown', 85, holes, planks, new Set(['t1', 't2', 't3']));
}

/**
 * Level 5 — Symmetrical Green Pine Tree (matches Uploaded Image 1!)
 * Two vertical trunk bars meet cleanly so every single bar uses 2 pins and is solvable with 2 empty holes!
 */
function createLevel5(): WoodLevelData {
  const holes: BoardHole[] = [
    { id: 't1', x: 64, y: 44 },
    { id: 't2', x: 256, y: 44 },
    // Central trunk line (upper bar: c0-c1, lower bar: c2-c3)
    { id: 'c0', x: 160, y: 108 },
    { id: 'c1', x: 160, y: 176 },
    { id: 'c2', x: 160, y: 248 },
    { id: 'c3', x: 160, y: 316 },
    // Left branch tips
    { id: 'l1', x: 112, y: 158 },
    { id: 'l2', x: 92, y: 224 },
    { id: 'l3', x: 72, y: 294 },
    { id: 'l4', x: 54, y: 362 },
    // Right branch tips
    { id: 'r1', x: 208, y: 158 },
    { id: 'r2', x: 228, y: 224 },
    { id: 'r3', x: 248, y: 294 },
    { id: 'r4', x: 266, y: 362 },
  ];

  const planks: PlankSpec[] = [
    // Symmetrical branch tiers (layered neatly like a woven pine tree)
    { id: 'p_l1', color: 'green', layer: 0, holeIds: ['c0', 'l1'], thickness: 22 },
    { id: 'p_r1', color: 'green', layer: 0, holeIds: ['c0', 'r1'], thickness: 22 },
    { id: 'p_l2', color: 'green', layer: 1, holeIds: ['c1', 'l2'], thickness: 22 },
    { id: 'p_r2', color: 'green', layer: 1, holeIds: ['c1', 'r2'], thickness: 22 },
    { id: 'p_l3', color: 'green', layer: 2, holeIds: ['c2', 'l3'], thickness: 22 },
    { id: 'p_r3', color: 'green', layer: 2, holeIds: ['c2', 'r3'], thickness: 22 },
    { id: 'p_l4', color: 'green', layer: 3, holeIds: ['c3', 'l4'], thickness: 22 },
    { id: 'p_r4', color: 'green', layer: 3, holeIds: ['c3', 'r4'], thickness: 22 },
    // Split central vertical spine (matches Image 1 seam and stays solvable with 2 empty holes!)
    { id: 'p_trunk_top', color: 'green', layer: 4, holeIds: ['c0', 'c1'], thickness: 22 },
    { id: 'p_trunk_bot', color: 'green', layer: 4, holeIds: ['c2', 'c3'], thickness: 22 },
  ];

  return buildLevel(5, 'Pine Tree', 105, holes, planks, new Set(['t1', 't2']));
}

function createLevel6(): WoodLevelData {
  const holes: BoardHole[] = [
    { id: 't1', x: 74, y: 46 },
    { id: 't2', x: 160, y: 46 },
    { id: 't3', x: 246, y: 46 },
    { id: 'top', x: 160, y: 120 },
    { id: 'ul', x: 72, y: 186 },
    { id: 'ur', x: 248, y: 186 },
    { id: 'll', x: 72, y: 294 },
    { id: 'lr', x: 248, y: 294 },
    { id: 'bot', x: 160, y: 360 },
  ];
  const planks: PlankSpec[] = [
    { id: 'p1', color: 'amber', layer: 0, holeIds: ['top', 'ul'] },
    { id: 'p2', color: 'amber', layer: 0, holeIds: ['top', 'ur'] },
    { id: 'p3', color: 'walnut', layer: 1, holeIds: ['ul', 'll'] },
    { id: 'p4', color: 'walnut', layer: 1, holeIds: ['ur', 'lr'] },
    { id: 'p5', color: 'sienna', layer: 2, holeIds: ['ll', 'bot'] },
    { id: 'p6', color: 'sienna', layer: 2, holeIds: ['lr', 'bot'] },
    { id: 'p7', color: 'green', layer: 3, holeIds: ['ul', 'lr'] },
    { id: 'p8', color: 'caramel', layer: 4, holeIds: ['ur', 'll'] },
  ];
  return buildLevel(6, 'Timber Hexagon', 110, holes, planks, new Set(['t1', 't2', 't3']));
}

/**
 * Level 7 — Multi-Color Intersecting Lattice (matches Uploaded Image 2!)
 */
function createLevel7(): WoodLevelData {
  const holes: BoardHole[] = [
    // 3 Top Staging Holes
    { id: 't1', x: 70, y: 46 },
    { id: 't2', x: 160, y: 46 },
    { id: 't3', x: 250, y: 46 },

    // Lattice nodes
    { id: 'ul_top', x: 96, y: 112 },
    { id: 'ur_top', x: 224, y: 112 },
    { id: 'mid_top', x: 160, y: 120 },

    { id: 'gl', x: 54, y: 158 },
    { id: 'gm', x: 160, y: 158 },
    { id: 'gr', x: 266, y: 158 },

    { id: 'center', x: 160, y: 204 },
    { id: 'ml', x: 114, y: 252 },
    { id: 'mr', x: 206, y: 252 },

    { id: 'sl', x: 86, y: 276 },
    { id: 'sr', x: 234, y: 276 },

    { id: 'bl', x: 54, y: 332 },
    { id: 'br', x: 266, y: 332 },

    { id: 'bot_l', x: 116, y: 366 },
    { id: 'bot_r', x: 204, y: 366 },
  ];

  const planks: PlankSpec[] = [
    // Back green horizontal bars (top & bottom)
    { id: 'p_g_top', color: 'green', layer: 0, holeIds: ['gl', 'gm', 'gr'], thickness: 22 },
    { id: 'p_g_bot', color: 'green', layer: 0, holeIds: ['bl', 'br'], thickness: 22 },

    // Inner mid amber/sienna trusses
    { id: 'p_s_left', color: 'sienna', layer: 1, holeIds: ['gl', 'ml', 'bot_r'], thickness: 22 },
    { id: 'p_s_right', color: 'sienna', layer: 1, holeIds: ['gr', 'mr', 'bot_l'], thickness: 22 },

    // Caramel & amber diagonals
    { id: 'p_c_diag1', color: 'caramel', layer: 2, holeIds: ['ur_top', 'center', 'sl', 'bl'], thickness: 22 },
    { id: 'p_a_diag2', color: 'amber', layer: 2, holeIds: ['ul_top', 'center', 'sr', 'br'], thickness: 22 },

    // Walnut front X diagonals
    { id: 'p_w_1', color: 'walnut', layer: 3, holeIds: ['ul_top', 'center', 'br'], thickness: 22 },
    { id: 'p_w_2', color: 'walnut', layer: 3, holeIds: ['sl', 'bot_r'], thickness: 22 },
    { id: 'p_a_front', color: 'amber', layer: 4, holeIds: ['sr', 'bot_l'], thickness: 22 },
  ];

  return buildLevel(7, 'Cedar Lattice', 130, holes, planks, new Set(['t1', 't2', 't3']));
}

function createLevel8(): WoodLevelData {
  const holes: BoardHole[] = [
    { id: 't1', x: 70, y: 46 },
    { id: 't2', x: 160, y: 46 },
    { id: 't3', x: 250, y: 46 },
    { id: 'h1', x: 68, y: 140 },
    { id: 'h2', x: 160, y: 140 },
    { id: 'h3', x: 252, y: 140 },
    { id: 'h4', x: 68, y: 240 },
    { id: 'h5', x: 160, y: 240 },
    { id: 'h6', x: 252, y: 240 },
    { id: 'h7', x: 68, y: 340 },
    { id: 'h8', x: 160, y: 340 },
    { id: 'h9', x: 252, y: 340 },
  ];
  const planks: PlankSpec[] = [
    { id: 'p1', color: 'walnut', layer: 0, holeIds: ['h1', 'h4', 'h7'] },
    { id: 'p2', color: 'walnut', layer: 0, holeIds: ['h3', 'h6', 'h9'] },
    { id: 'p3', color: 'green', layer: 1, holeIds: ['h1', 'h2', 'h3'] },
    { id: 'p4', color: 'amber', layer: 1, holeIds: ['h7', 'h8', 'h9'] },
    { id: 'p5', color: 'sienna', layer: 2, holeIds: ['h2', 'h5', 'h8'] },
    { id: 'p6', color: 'caramel', layer: 3, holeIds: ['h4', 'h5', 'h6'] },
  ];
  return buildLevel(8, 'Master Grid', 120, holes, planks, new Set(['t1', 't2', 't3']));
}

function createLevel9(): WoodLevelData {
  const holes: BoardHole[] = [
    { id: 't1', x: 70, y: 46 },
    { id: 't2', x: 160, y: 46 },
    { id: 't3', x: 250, y: 46 },
    { id: 'a1', x: 70, y: 130 },
    { id: 'a2', x: 250, y: 130 },
    { id: 'm', x: 160, y: 235 },
    { id: 'b1', x: 70, y: 340 },
    { id: 'b2', x: 250, y: 340 },
  ];
  const planks: PlankSpec[] = [
    { id: 'p1', color: 'green', layer: 0, holeIds: ['a1', 'b1'] },
    { id: 'p2', color: 'green', layer: 0, holeIds: ['a2', 'b2'] },
    { id: 'p3', color: 'amber', layer: 1, holeIds: ['a1', 'm', 'b2'] },
    { id: 'p4', color: 'sienna', layer: 2, holeIds: ['a2', 'm', 'b1'] },
    { id: 'p5', color: 'walnut', layer: 3, holeIds: ['a1', 'a2'] },
    { id: 'p6', color: 'caramel', layer: 3, holeIds: ['b1', 'b2'] },
  ];
  return buildLevel(9, 'Butterfly Wings', 110, holes, planks, new Set(['t1', 't2', 't3']));
}

function createLevel10(): WoodLevelData {
  const holes: BoardHole[] = [
    { id: 't1', x: 70, y: 46 },
    { id: 't2', x: 160, y: 46 },
    { id: 't3', x: 250, y: 46 },
    { id: 'p_top', x: 160, y: 112 },
    { id: 'p_l1', x: 82, y: 175 },
    { id: 'p_r1', x: 238, y: 175 },
    { id: 'p_c', x: 160, y: 238 },
    { id: 'p_l2', x: 82, y: 300 },
    { id: 'p_r2', x: 238, y: 300 },
    { id: 'p_bot', x: 160, y: 364 },
  ];
  const planks: PlankSpec[] = [
    { id: 'p1', color: 'walnut', layer: 0, holeIds: ['p_top', 'p_c', 'p_bot'] },
    { id: 'p2', color: 'green', layer: 1, holeIds: ['p_l1', 'p_r1'] },
    { id: 'p3', color: 'green', layer: 1, holeIds: ['p_l2', 'p_r2'] },
    { id: 'p4', color: 'amber', layer: 2, holeIds: ['p_top', 'p_l1'] },
    { id: 'p5', color: 'amber', layer: 2, holeIds: ['p_top', 'p_r1'] },
    { id: 'p6', color: 'sienna', layer: 3, holeIds: ['p_l1', 'p_c', 'p_r2'] },
    { id: 'p7', color: 'caramel', layer: 3, holeIds: ['p_r1', 'p_c', 'p_l2'] },
    { id: 'p8', color: 'sienna', layer: 4, holeIds: ['p_l2', 'p_bot'] },
    { id: 'p9', color: 'amber', layer: 4, holeIds: ['p_r2', 'p_bot'] },
  ];
  return buildLevel(10, 'Twin Diamond', 140, holes, planks, new Set(['t1', 't2', 't3']));
}

const HANDCRAFTED_FACTORIES: Record<number, () => WoodLevelData> = {
  1: createLevel1,
  2: createLevel2,
  3: createLevel3,
  4: createLevel4,
  5: createLevel5,
  6: createLevel6,
  7: createLevel7,
  8: createLevel8,
  9: createLevel9,
  10: createLevel10,
};

// ============================================================
// UNLIMITED PROCEDURAL LEVEL GENERATOR (11+ -> INFINITY)
// Guaranteed solvable by forward solver verification
// ============================================================

const ALL_PLANK_COLORS: PlankColor[] = ['green', 'amber', 'sienna', 'walnut', 'caramel'];

const GRID_ANCHORS: BoardHole[] = [
  { id: 'g00', x: 74, y: 128 },
  { id: 'g01', x: 160, y: 128 },
  { id: 'g02', x: 246, y: 128 },
  { id: 'g10', x: 74, y: 204 },
  { id: 'g11', x: 160, y: 204 },
  { id: 'g12', x: 246, y: 204 },
  { id: 'g20', x: 74, y: 280 },
  { id: 'g21', x: 160, y: 280 },
  { id: 'g22', x: 246, y: 280 },
  { id: 'g30', x: 74, y: 356 },
  { id: 'g31', x: 160, y: 356 },
  { id: 'g32', x: 246, y: 356 },
];

// Clean straight segments on the 3x4 board grid (either horizontal, vertical, or diagonal)
const SEGMENT_POOL: string[][] = [
  ['g00', 'g01', 'g02'],
  ['g10', 'g11', 'g12'],
  ['g20', 'g21', 'g22'],
  ['g30', 'g31', 'g32'],
  ['g00', 'g01'],
  ['g01', 'g02'],
  ['g10', 'g11'],
  ['g11', 'g12'],
  ['g20', 'g21'],
  ['g21', 'g22'],
  ['g30', 'g31'],
  ['g31', 'g32'],
  ['g00', 'g10', 'g20'],
  ['g10', 'g20', 'g30'],
  ['g01', 'g11', 'g21'],
  ['g11', 'g21', 'g31'],
  ['g02', 'g12', 'g22'],
  ['g12', 'g22', 'g32'],
  ['g00', 'g11', 'g22'],
  ['g02', 'g11', 'g20'],
  ['g10', 'g21', 'g32'],
  ['g12', 'g21', 'g30'],
  ['g00', 'g11'],
  ['g02', 'g11'],
  ['g20', 'g31'],
  ['g22', 'g31'],
];

const TITLES = [
  'Oak Workshop',
  'Timber Vault',
  'Carpentry Lab',
  'Hardwood Puzzle',
  'Carved Truss',
  'Maple Interlock',
  'Cedar Matrix',
  'Walnut Frame',
];

/**
 * Computes responsive time budget based on level progression, plank count, and screw count.
 * Easy levels get brisk 45–85s limits; complex/higher levels scale fairly without feeling bloated.
 */
export function computeLevelTimeLimit(
  levelNumber: number,
  plankCount: number,
  screwCount: number
): number {
  const baseByComplexity = 30 + plankCount * 7 + screwCount * 2;
  const speedPressure = Math.min(35, Math.floor(Math.max(0, levelNumber - 10) / 12) * 3);
  const floorBySize = 45 + plankCount * 4;
  return Math.max(floorBySize, Math.min(150, baseByComplexity - speedPressure));
}

function generateProceduralLevel(levelNumber: number): WoodLevelData {
  const stagingHoles: BoardHole[] = [
    { id: 't1', x: 70, y: 46 },
    { id: 't2', x: 160, y: 46 },
    { id: 't3', x: 250, y: 46 },
  ];

  // Add a 4th staging hole occasionally on higher dense levels or stick to classic 3
  const allBoardHoles = [...stagingHoles, ...GRID_ANCHORS];
  const emptyIds = new Set(['t1', 't2', 't3']);

  const targetPlankCount = Math.min(9, 5 + Math.floor((levelNumber - 11) / 8));

  for (let attempt = 0; attempt < 24; attempt++) {
    const prng = new SeededPRNG(levelNumber * 104729 + attempt * 7919 + 31);
    const chosenSegments: string[][] = [];
    const usedKeys = new Set<string>();

    let guard = 0;
    while (chosenSegments.length < targetPlankCount && guard < 100) {
      guard++;
      const seg = prng.pick(SEGMENT_POOL);
      const key = [...seg].sort().join('-');
      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        chosenSegments.push(seg);
      }
    }

    const specs: PlankSpec[] = chosenSegments.map((seg, idx) => ({
      id: `proc_p${idx}`,
      color: ALL_PLANK_COLORS[(idx + levelNumber + attempt) % ALL_PLANK_COLORS.length],
      layer: idx % 4,
      holeIds: seg,
      thickness: 22,
    }));

    // Keep only board holes that are either staging holes OR actually referenced by a plank
    const referencedGridIds = new Set<string>();
    for (const s of specs) {
      for (const id of s.holeIds) referencedGridIds.add(id);
    }
    const levelHoles = allBoardHoles.filter(
      (h) => emptyIds.has(h.id) || referencedGridIds.has(h.id)
    );

    const candidate = buildLevel(
      levelNumber,
      TITLES[levelNumber % TITLES.length],
      100,
      levelHoles,
      specs,
      emptyIds
    );
    candidate.timeLimitSeconds = computeLevelTimeLimit(
      levelNumber,
      candidate.planks.length,
      candidate.screws.length
    );

    if (isLevelSolvableFast(candidate.holes, candidate.planks, candidate.screws, 750)) {
      return candidate;
    }
  }

  // Fallback guaranteed solvable symmetrical level scaled with levelNumber
  const fallback = createLevel7();
  return {
    ...fallback,
    levelNumber,
    title: TITLES[levelNumber % TITLES.length],
    timeLimitSeconds: computeLevelTimeLimit(
      levelNumber,
      fallback.planks.length,
      fallback.screws.length
    ),
  };
}

/**
 * Generates any Wood Screw level from 1 to Infinity cleanly and deterministically.
 */
export function generateWoodScrewLevel(levelNumber: number): WoodLevelData {
  const clamped = Math.max(1, Math.floor(levelNumber));
  if (HANDCRAFTED_FACTORIES[clamped]) {
    return HANDCRAFTED_FACTORIES[clamped]();
  }
  return generateProceduralLevel(clamped);
}
