// ============================================================
// Wood Screw: Nuts & Bolts Puzzle — Pure Physics & Puzzle Engine
// Handles geometry, wood occlusion, pendulum swing, drop gravity,
// move validation, undo snapshots, and deadlock / victory checks
// ============================================================

import {
  BOARD_H,
  PIN_SNAP_TOLERANCE,
  SOLID_BLOCK_MARGIN,
  type BoardHole,
  type PlankHole,
  type ScrewItem,
  type WoodPlank,
} from './types';

export function clonePlanks(planks: WoodPlank[]): WoodPlank[] {
  return planks.map((p) => ({
    ...p,
    holes: p.holes.map((h) => ({ ...h })),
  }));
}

export function cloneScrews(screws: ScrewItem[]): ScrewItem[] {
  return screws.map((s) => ({ ...s }));
}

/**
 * Computes world (x, y) coordinates of a plank's drilled hole on the board.
 */
export function getPlankHoleWorldPos(
  plank: WoodPlank,
  plankHole: PlankHole
): { x: number; y: number } {
  const rad = (plank.angle * Math.PI) / 180;
  return {
    x: plank.x + plankHole.localX * Math.cos(rad),
    y: plank.y + plankHole.localX * Math.sin(rad),
  };
}

/**
 * Checks whether solid wood from a given active plank physically blocks
 * a board hole at (holeX, holeY). If the hole lies outside the plank OR
 * aligns cleanly with one of the plank's own drilled holes, it is NOT blocked.
 */
export function isPointBlockedByPlank(
  holeX: number,
  holeY: number,
  plank: WoodPlank
): boolean {
  if (plank.status === 'falling' || plank.status === 'cleared') {
    return false;
  }

  const dx = holeX - plank.x;
  const dy = holeY - plank.y;
  const rad = (-plank.angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;

  const r = plank.thickness / 2;
  const innerHalf = Math.max(0, plank.length / 2 - r);
  const clampedX = Math.max(-innerHalf, Math.min(innerHalf, localX));
  const distToSpine = Math.hypot(localX - clampedX, localY);

  // Outside the physical wood + screw footprint clearance
  if (distToSpine >= r + SOLID_BLOCK_MARGIN) {
    return false;
  }

  // Inside the plank bounds — check if the plank has a drilled hole here
  for (const ph of plank.holes) {
    if (Math.hypot(localX - ph.localX, localY) <= PIN_SNAP_TOLERANCE) {
      return false;
    }
  }

  return true;
}

/**
 * Returns true if the target board hole is unoccupied and unobstructed by solid wood.
 */
export function isHoleOpenAndClear(
  holeId: string,
  holes: BoardHole[],
  planks: WoodPlank[],
  screws: ScrewItem[]
): boolean {
  const hole = holes.find((h) => h.id === holeId);
  if (!hole) return false;

  // Must not already contain a screw
  if (screws.some((s) => s.holeId === holeId)) {
    return false;
  }

  // Must not be covered by solid wood of any active plank
  for (const plank of planks) {
    if (isPointBlockedByPlank(hole.x, hole.y, plank)) {
      return false;
    }
  }

  return true;
}

/**
 * Validates transferring a screw from `fromHoleId` to `toHoleId`.
 */
export function canMoveScrew(
  holes: BoardHole[],
  planks: WoodPlank[],
  screws: ScrewItem[],
  fromHoleId: string,
  toHoleId: string
): boolean {
  if (fromHoleId === toHoleId) return false;
  if (!screws.some((s) => s.holeId === fromHoleId)) return false;

  return isHoleOpenAndClear(toHoleId, holes, planks, screws);
}

/**
 * Re-evaluates each active plank's constraint status ('pinned' | 'swinging' | 'falling').
 */
export function updatePlanksConstraintState(planks: WoodPlank[]): WoodPlank[] {
  return planks.map((plank) => {
    if (plank.status === 'falling' || plank.status === 'cleared') {
      return plank;
    }

    const pinnedCount = plank.holes.filter((h) => h.pinnedHoleId !== null).length;

    if (pinnedCount >= 2) {
      return {
        ...plank,
        status: 'pinned',
        vx: 0,
        vy: 0,
        angularVel: 0,
      };
    }

    if (pinnedCount === 1) {
      return {
        ...plank,
        status: 'swinging',
      };
    }

    // 0 screws left -> detach and fall off board!
    const spinDir = Math.round(plank.x) % 2 === 0 ? 1.5 : -1.5;
    return {
      ...plank,
      status: 'falling',
      vx: spinDir * 0.25,
      vy: 1.4,
      angularVel: spinDir,
    };
  });
}

/**
 * Executes a legal screw move from `fromHoleId` to `toHoleId`.
 * Unpins planks at `fromHoleId`, pins aligned plank holes at `toHoleId`,
 * and updates constraint states cleanly.
 */
export function moveScrew(
  holes: BoardHole[],
  planks: WoodPlank[],
  screws: ScrewItem[],
  fromHoleId: string,
  toHoleId: string
): { nextPlanks: WoodPlank[]; nextScrews: ScrewItem[] } {
  const destHole = holes.find((h) => h.id === toHoleId);
  if (!destHole) {
    return { nextPlanks: planks, nextScrews: screws };
  }

  const nextScrews = screws.map((s) =>
    s.holeId === fromHoleId ? { ...s, holeId: toHoleId } : { ...s }
  );

  const updatedPlanks = clonePlanks(planks).map((plank) => {
    if (plank.status === 'falling' || plank.status === 'cleared') {
      return plank;
    }

    const nextHoles = plank.holes.map((ph) => {
      if (ph.pinnedHoleId === fromHoleId) {
        return { ...ph, pinnedHoleId: null };
      }

      if (ph.pinnedHoleId === null) {
        const worldPos = getPlankHoleWorldPos(plank, ph);
        if (Math.hypot(worldPos.x - destHole.x, worldPos.y - destHole.y) <= PIN_SNAP_TOLERANCE) {
          return { ...ph, pinnedHoleId: toHoleId };
        }
      }

      return ph;
    });

    return { ...plank, holes: nextHoles };
  });

  return {
    nextPlanks: updatePlanksConstraintState(updatedPlanks),
    nextScrews,
  };
}

/**
 * Booster: Permanently unscrews and deletes a screw at `holeId` without requiring an empty hole.
 */
export function removeScrewWithBooster(
  planks: WoodPlank[],
  screws: ScrewItem[],
  holeId: string
): { nextPlanks: WoodPlank[]; nextScrews: ScrewItem[] } {
  const nextScrews = screws.filter((s) => s.holeId !== holeId);

  const updatedPlanks = clonePlanks(planks).map((plank) => {
    if (plank.status === 'falling' || plank.status === 'cleared') {
      return plank;
    }
    return {
      ...plank,
      holes: plank.holes.map((ph) =>
        ph.pinnedHoleId === holeId ? { ...ph, pinnedHoleId: null } : ph
      ),
    };
  });

  return {
    nextPlanks: updatePlanksConstraintState(updatedPlanks),
    nextScrews,
  };
}

/**
 * Advances 2D pendulum swing and gravity fall physics by `dtFactor` (1.0 ≈ 16.6ms).
 * Returns `changed: false` if all planks are completely stationary, avoiding idle re-renders.
 */
export function stepPhysics(
  holes: BoardHole[],
  planks: WoodPlank[],
  dtFactor = 1
): { planks: WoodPlank[]; changed: boolean; allSettled: boolean } {
  let changed = false;
  let allSettled = true;

  const holeMap = new Map<string, BoardHole>();
  for (const h of holes) {
    holeMap.set(h.id, h);
  }

  const nextPlanks = planks.map((plank) => {
    if (plank.status === 'pinned' || plank.status === 'cleared') {
      return plank;
    }

    if (plank.status === 'swinging') {
      const pivotPH = plank.holes.find((h) => h.pinnedHoleId !== null);
      if (!pivotPH || !pivotPH.pinnedHoleId) {
        return plank;
      }

      const pivotHole = holeMap.get(pivotPH.pinnedHoleId);
      if (!pivotHole) return plank;

      // Balanced exact-center pivot gently damps without infinite spin
      if (Math.abs(pivotPH.localX) < 1) {
        if (Math.abs(plank.angularVel) > 0.05) {
          changed = true;
          allSettled = false;
          const nextVel = plank.angularVel * Math.pow(0.92, dtFactor);
          const nextAngle = plank.angle + nextVel * dtFactor;
          return {
            ...plank,
            angle: nextAngle,
            angularVel: Math.abs(nextVel) < 0.05 ? 0 : nextVel,
          };
        }
        return plank;
      }

      const rad = (plank.angle * Math.PI) / 180;
      const rx = -pivotPH.localX * Math.cos(rad);
      const ry = -pivotPH.localX * Math.sin(rad);

      // Break knife-edge unstable inverted equilibrium (straight up)
      let nudge = 0;
      if (Math.abs(rx) < 0.8 && ry < 0) {
        nudge = (plank.id.charCodeAt(plank.id.length - 1) % 2 === 0 ? 1 : -1) * 0.35;
      }

      // Gravity torque pulls center-of-mass toward +Y downward
      const GRAVITY_TORQUE = 0.012;
      const rawVel =
        (plank.angularVel + (rx * GRAVITY_TORQUE + nudge) * dtFactor) *
        Math.pow(0.92, dtFactor);

      // Snap cleanly to rest once settled at vertical hanging point
      if (Math.abs(rawVel) < 0.06 && Math.abs(rx) < 0.4 && ry > 0) {
        if (plank.angularVel !== 0) {
          changed = true;
          const restAngle = pivotPH.localX < 0 ? 90 : -90;
          const restRad = (restAngle * Math.PI) / 180;
          return {
            ...plank,
            angle: restAngle,
            angularVel: 0,
            x: pivotHole.x - pivotPH.localX * Math.cos(restRad),
            y: pivotHole.y - pivotPH.localX * Math.sin(restRad),
          };
        }
        return plank;
      }

      changed = true;
      allSettled = false;
      const nextAngle = plank.angle + rawVel * dtFactor;
      const nextRad = (nextAngle * Math.PI) / 180;

      return {
        ...plank,
        angle: nextAngle,
        angularVel: rawVel,
        x: pivotHole.x - pivotPH.localX * Math.cos(nextRad),
        y: pivotHole.y - pivotPH.localX * Math.sin(nextRad),
      };
    }

    // status === 'falling'
    changed = true;
    allSettled = false;
    const nextVy = plank.vy + 0.58 * dtFactor;
    const nextY = plank.y + nextVy * dtFactor;
    const nextX = plank.x + plank.vx * dtFactor;
    const nextAngle = plank.angle + plank.angularVel * dtFactor;

    if (nextY > BOARD_H + 150) {
      return {
        ...plank,
        x: nextX,
        y: nextY,
        vy: nextVy,
        angle: nextAngle,
        status: 'cleared' as const,
      };
    }

    return {
      ...plank,
      x: nextX,
      y: nextY,
      vy: nextVy,
      angle: nextAngle,
    };
  });

  return {
    planks: changed ? nextPlanks : planks,
    changed,
    allSettled,
  };
}

/**
 * Settles swinging planks instantaneously (used by fast solver & level verification).
 */
export function settlePhysicsQuick(
  holes: BoardHole[],
  planks: WoodPlank[],
  maxSteps = 120
): WoodPlank[] {
  let current = clonePlanks(planks);
  for (let i = 0; i < maxSteps; i++) {
    const res = stepPhysics(holes, current, 2);
    current = res.planks;
    if (res.allSettled || current.every((p) => p.status === 'pinned' || p.status === 'cleared')) {
      break;
    }
  }
  return current;
}

/**
 * Returns number of planks that have detached ('falling' or 'cleared').
 */
export function getDetachedPlankCount(planks: WoodPlank[]): number {
  return planks.filter((p) => p.status === 'falling' || p.status === 'cleared').length;
}

/**
 * True when every wooden plank on the board has detached and started/finished dropping.
 */
export function isAllPlanksDetached(planks: WoodPlank[]): boolean {
  return planks.length > 0 && planks.every((p) => p.status === 'falling' || p.status === 'cleared');
}

/**
 * Checks whether any legal move exists on the current board (detects Screw Jam).
 */
export function hasAnyValidMove(
  holes: BoardHole[],
  planks: WoodPlank[],
  screws: ScrewItem[]
): boolean {
  if (isAllPlanksDetached(planks)) return true;

  for (const screw of screws) {
    for (const hole of holes) {
      if (canMoveScrew(holes, planks, screws, screw.holeId, hole.id)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Bounded priority best-first solver used to verify level solvability.
 * Returns true if the level can clear all planks within `maxVisited` states.
 */
export function isLevelSolvableFast(
  holes: BoardHole[],
  initialPlanks: WoodPlank[],
  initialScrews: ScrewItem[],
  maxVisited = 1500
): boolean {
  interface Node {
    planks: WoodPlank[];
    screws: ScrewItem[];
    score: number;
    depth: number;
  }

  const serialize = (planks: WoodPlank[], screws: ScrewItem[]) => {
    const screwKeys = screws
      .map((s) => s.holeId)
      .sort()
      .join(',');
    const activePlankKeys = planks
      .map((p) => `${p.status === 'falling' || p.status === 'cleared' ? 'X' : Math.round(p.angle / 30)}`)
      .join('');
    return `${screwKeys}#${activePlankKeys}`;
  };

  const settledInit = settlePhysicsQuick(holes, initialPlanks);
  if (isAllPlanksDetached(settledInit)) return true;

  const visited = new Set<string>();
  const pq: Node[] = [{ planks: settledInit, screws: cloneScrews(initialScrews), score: 0, depth: 0 }];
  visited.add(serialize(settledInit, initialScrews));

  while (pq.length > 0 && visited.size < maxVisited) {
    // Pick highest-priority candidate state
    let bestIdx = 0;
    for (let i = 1; i < pq.length; i++) {
      if (pq[i].score > pq[bestIdx].score) bestIdx = i;
    }
    const curr = pq.splice(bestIdx, 1)[0];

    for (const screw of curr.screws) {
      for (const hole of holes) {
        if (!canMoveScrew(holes, curr.planks, curr.screws, screw.holeId, hole.id)) {
          continue;
        }
        const { nextPlanks: movedPlanks, nextScrews } = moveScrew(
          holes,
          curr.planks,
          curr.screws,
          screw.holeId,
          hole.id
        );
        const settled = settlePhysicsQuick(holes, movedPlanks);
        if (isAllPlanksDetached(settled)) {
          return true;
        }
        const key = serialize(settled, nextScrews);
        if (!visited.has(key)) {
          visited.add(key);
          const detached = getDetachedPlankCount(settled);
          const swinging = settled.filter((p) => p.status === 'swinging').length;
          const emptyCount = holes.filter((hh) => !nextScrews.some((ns) => ns.holeId === hh.id)).length;
          const score = detached * 50 + emptyCount * 5 + swinging * 4 - curr.depth * 2;
          pq.push({
            planks: settled,
            screws: nextScrews,
            score,
            depth: curr.depth + 1,
          });
          if (visited.size >= maxVisited) return false;
        }
      }
    }
  }

  return false;
}
