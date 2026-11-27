// ============================================================
// Woodland Bubble Shooter — Pure Hexagonal Physics & Match Engine
// Zero React dependencies: handles staggered hex geometry, bank-shot
// raycasting, BFS clusters, floating island avalanches & power-ups.
// ============================================================

import type {
  AimRayResult,
  BubbleColor,
  BubbleKind,
  BubbleLevelConfig,
  HexCell,
  HexCoord,
  HexGrid,
  ShotImpactResult,
  TrajectoryPoint,
} from './types';

export const HEX_COLS_EVEN = 10;
export const HEX_COLS_ODD = 9;
export const HEX_VERTICAL_FACTOR = Math.sqrt(3) / 2; // ~0.8660254
export const DANGER_VISIBLE_ROWS = 11;

const CHAR_TO_COLOR: Record<string, BubbleColor> = {
  R: 'red',
  G: 'green',
  B: 'blue',
  Y: 'gold',
  T: 'teal',
  O: 'orange',
};

/**
 * Returns total valid columns on a given hex row index.
 */
export function getRowColCount(row: number): number {
  return row % 2 === 0 ? HEX_COLS_EVEN : HEX_COLS_ODD;
}

/**
 * Validates whether a (row, col) coordinate lies inside staggered hex bounds.
 */
export function isValidHexCoord(row: number, col: number, maxRows: number): boolean {
  if (row < 0 || row >= maxRows) return false;
  return col >= 0 && col < getRowColCount(row);
}

/**
 * Computes pixel center of a hex cell relative to board playfield origin.
 */
export function getCellCenter(
  row: number,
  col: number,
  bubbleDiameter: number,
  cameraTopRow = 0
): TrajectoryPoint {
  const radius = bubbleDiameter / 2;
  const xOffset = row % 2 === 1 ? radius : 0;
  return {
    x: col * bubbleDiameter + radius + xOffset,
    y: radius + (row - cameraTopRow) * bubbleDiameter * HEX_VERTICAL_FACTOR,
  };
}

/**
 * Returns the 6 staggered hexagonal neighbors for (row, col).
 */
export function getHexNeighbors(row: number, col: number, maxRows: number): HexCoord[] {
  const isEven = row % 2 === 0;
  const deltas: [number, number][] = isEven
    ? [
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 0],
        [1, -1],
        [1, 0],
      ]
    : [
        [0, -1],
        [0, 1],
        [-1, 0],
        [-1, 1],
        [1, 0],
        [1, 1],
      ];

  const neighbors: HexCoord[] = [];
  for (const [dr, dc] of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (isValidHexCoord(nr, nc, maxRows)) {
      neighbors.push({ row: nr, col: nc });
    }
  }
  return neighbors;
}

/**
 * Parses a level configuration's ASCII rows into an immutable HexGrid.
 * Encoding:
 * - Uppercase R/G/B/Y/T/O => Normal orb
 * - Lowercase r/g/b/y/t/o => Trapped Firefly inside that orb color
 * - X => Spiked Iron Stone blocker
 * - . => Empty space
 */
export function createGridFromLevel(config: BubbleLevelConfig): HexGrid {
  const grid: HexGrid = config.rows.map((rowStr, r) => {
    const expectedCols = getRowColCount(r);
    const cells: (HexCell | null)[] = [];
    for (let c = 0; c < expectedCols; c++) {
      const ch = rowStr[c] || '.';
      if (ch === '.') {
        cells.push(null);
        continue;
      }
      if (ch === 'X') {
        cells.push({
          id: `cell-${config.levelNumber}-${r}-${c}`,
          row: r,
          col: c,
          color: 'gold',
          kind: 'stone',
        });
        continue;
      }
      const upper = ch.toUpperCase();
      const mappedColor = CHAR_TO_COLOR[upper] || 'red';
      const hasFirefly = ch !== upper;
      cells.push({
        id: `cell-${config.levelNumber}-${r}-${c}`,
        row: r,
        col: c,
        color: mappedColor,
        kind: 'normal',
        hasFirefly,
      });
    }
    return cells;
  });

  // Pad at least 2 empty trailing rows so early ceiling/landing calculations always have valid slots
  while (grid.length < 4) {
    grid.push(Array.from({ length: getRowColCount(grid.length) }, () => null));
  }

  return grid;
}

/**
 * Deep-clones a HexGrid cleanly for pure immutable updates.
 */
export function cloneHexGrid(grid: HexGrid): HexGrid {
  return grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

/**
 * Returns highest occupied row index on the board (-1 if board is empty).
 */
export function getMaxOccupiedRow(grid: HexGrid): number {
  for (let r = grid.length - 1; r >= 0; r--) {
    if (grid[r].some((cell) => cell !== null)) {
      return r;
    }
  }
  return -1;
}

/**
 * Computes initial camera top row so tall levels show lowest canopy neatly
 * while leaving clear aiming room above the danger line.
 */
export function computeInitialCameraTopRow(grid: HexGrid): number {
  const maxRow = getMaxOccupiedRow(grid);
  return Math.max(0, maxRow - 7);
}

/**
 * Smoothly scrolls camera up toward row 0 as bottom rows are cleared (never scrolls backward).
 */
export function updateCameraTopRow(grid: HexGrid, currentCameraTopRow: number): number {
  const maxRow = getMaxOccupiedRow(grid);
  if (maxRow < 0) return 0;
  const desired = Math.max(0, maxRow - 7);
  return Math.min(currentCameraTopRow, desired);
}

/**
 * Counts active bubbles, fireflies, and iron stones on the grid.
 */
export function getGridStats(grid: HexGrid): {
  totalOccupied: number;
  normalCount: number;
  fireflyCount: number;
  stoneCount: number;
} {
  let totalOccupied = 0;
  let normalCount = 0;
  let fireflyCount = 0;
  let stoneCount = 0;

  for (const row of grid) {
    for (const cell of row) {
      if (!cell) continue;
      totalOccupied++;
      if (cell.kind === 'stone') stoneCount++;
      else normalCount++;
      if (cell.hasFirefly) fireflyCount++;
    }
  }

  return { totalOccupied, normalCount, fireflyCount, stoneCount };
}

/**
 * Returns list of active normal colors currently present on the visible/remaining board
 * so the launcher never deals dead colors.
 */
export function getActiveColorsOnGrid(grid: HexGrid): BubbleColor[] {
  const colorSet = new Set<BubbleColor>();
  for (const row of grid) {
    for (const cell of row) {
      if (cell && cell.kind === 'normal') {
        colorSet.add(cell.color);
      }
    }
  }
  return Array.from(colorSet);
}

/**
 * Picks next playable color from colors currently present on the board.
 */
export function pickPlayableBubbleColor(
  grid: HexGrid,
  rng: () => number = Math.random
): BubbleColor {
  const activeColors = getActiveColorsOnGrid(grid);
  if (activeColors.length === 0) return 'red';
  const idx = Math.floor(rng() * activeColors.length) % activeColors.length;
  return activeColors[idx];
}

/**
 * Ensures any color held in the launcher still exists on the board; swaps if obsolete.
 */
export function sanitizeShotColor(grid: HexGrid, currentColor: BubbleColor): BubbleColor {
  const activeColors = getActiveColorsOnGrid(grid);
  if (activeColors.length === 0 || activeColors.includes(currentColor)) {
    return currentColor;
  }
  return activeColors[0];
}

/**
 * Ensures grid array extends cleanly through targetRow.
 */
function ensureRowCapacity(grid: HexGrid, targetRow: number): HexGrid {
  const next = cloneHexGrid(grid);
  while (next.length <= targetRow) {
    next.push(Array.from({ length: getRowColCount(next.length) }, () => null));
  }
  return next;
}

/**
 * Finds nearest empty valid hex coordinate to pixel point (px, py) near hitCoord or ceiling.
 */
export function findNearestEmptyHexSlot(
  grid: HexGrid,
  px: number,
  py: number,
  bubbleDiameter: number,
  cameraTopRow: number,
  hitCoord: HexCoord | null
): HexCoord {
  const searchRows = Math.max(grid.length + 1, cameraTopRow + DANGER_VISIBLE_ROWS + 3);
  const candidates: HexCoord[] = [];

  if (hitCoord) {
    for (const neighbor of getHexNeighbors(hitCoord.row, hitCoord.col, searchRows)) {
      if (!grid[neighbor.row]?.[neighbor.col]) {
        candidates.push(neighbor);
      }
    }
  } else {
    // Ceiling landing along row 0
    for (let c = 0; c < HEX_COLS_EVEN; c++) {
      if (!grid[0]?.[c]) {
        candidates.push({ row: 0, col: c });
      }
    }
  }

  // Fallback global scan around (px, py) if immediate neighbors are occupied
  if (candidates.length === 0) {
    for (let r = Math.max(0, cameraTopRow); r < searchRows; r++) {
      const cols = getRowColCount(r);
      for (let c = 0; c < cols; c++) {
        if (!grid[r]?.[c]) {
          candidates.push({ row: r, col: c });
        }
      }
    }
  }

  let best = candidates[0] || { row: 0, col: 0 };
  let bestDistSq = Number.POSITIVE_INFINITY;

  for (const cand of candidates) {
    const center = getCellCenter(cand.row, cand.col, bubbleDiameter, cameraTopRow);
    const dx = center.x - px;
    const dy = center.y - py;
    const distSq = dx * dx + dy * dy;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      best = cand;
    }
  }

  return best;
}

/**
 * Traces bank-shot aim ray from cannon origin upward with wall reflections,
 * stopping cleanly at exact bubble collision or top ceiling.
 */
export function computeAimTrajectory(
  grid: HexGrid,
  originX: number,
  originY: number,
  angleRad: number,
  boardWidth: number,
  bubbleDiameter: number,
  cameraTopRow: number,
  maxBounces = 2
): AimRayResult {
  const radius = bubbleDiameter / 2;
  const minX = radius;
  const maxX = boardWidth - radius;
  const ceilingY = radius - cameraTopRow * bubbleDiameter * HEX_VERTICAL_FACTOR;

  // Clamp aiming strictly upward so player cannot fire backwards into footer
  const clampedAngle = Math.max(-Math.PI + 0.16, Math.min(-0.16, angleRad));
  let dx = Math.cos(clampedAngle);
  const dy = Math.sin(clampedAngle); // always negative

  let x = originX;
  let y = originY;
  const points: TrajectoryPoint[] = [{ x, y }];

  const stepSize = Math.max(3, radius * 0.28);
  const collisionRadiusSq = (bubbleDiameter * 0.88) ** 2;
  const maxSteps = 900;
  let bounces = 0;

  // Precompute active cell centers for tight inner-loop collision speed
  const activeCenters: { coord: HexCoord; x: number; y: number }[] = [];
  for (let r = 0; r < grid.length; r++) {
    const rowArr = grid[r];
    for (let c = 0; c < rowArr.length; c++) {
      if (rowArr[c]) {
        const pt = getCellCenter(r, c, bubbleDiameter, cameraTopRow);
        activeCenters.push({ coord: { row: r, col: c }, x: pt.x, y: pt.y });
      }
    }
  }

  let prevX = x;
  let prevY = y;

  for (let step = 0; step < maxSteps; step++) {
    prevX = x;
    prevY = y;
    x += dx * stepSize;
    y += dy * stepSize;

    // Reflect cleanly off left and right oak side pillars
    if (x <= minX && dx < 0) {
      const t = (minX - prevX) / (x - prevX || -1);
      const bounceY = prevY + (y - prevY) * t;
      points.push({ x: minX, y: bounceY });
      x = minX + (minX - x);
      dx = -dx;
      bounces++;
      if (bounces > maxBounces) {
        return { points, hitCoord: null, snapCoord: null, hitCenter: null };
      }
    } else if (x >= maxX && dx > 0) {
      const t = (maxX - prevX) / (x - prevX || 1);
      const bounceY = prevY + (y - prevY) * t;
      points.push({ x: maxX, y: bounceY });
      x = maxX - (x - maxX);
      dx = -dx;
      bounces++;
      if (bounces > maxBounces) {
        return { points, hitCoord: null, snapCoord: null, hitCenter: null };
      }
    }

    // Check ceiling collision (Row 0 anchor beam when visible)
    if (y <= ceilingY) {
      const clampedCeilY = Math.max(radius, ceilingY);
      const snapCoord = findNearestEmptyHexSlot(
        grid,
        x,
        clampedCeilY,
        bubbleDiameter,
        cameraTopRow,
        null
      );
      const hitCenter = getCellCenter(snapCoord.row, snapCoord.col, bubbleDiameter, cameraTopRow);
      points.push(hitCenter);
      return { points, hitCoord: null, snapCoord, hitCenter };
    }

    // Check bubble-to-bubble collision
    for (const target of activeCenters) {
      const distSq = (x - target.x) ** 2 + (y - target.y) ** 2;
      if (distSq <= collisionRadiusSq) {
        const snapCoord = findNearestEmptyHexSlot(
          grid,
          prevX,
          prevY,
          bubbleDiameter,
          cameraTopRow,
          target.coord
        );
        const hitCenter = getCellCenter(snapCoord.row, snapCoord.col, bubbleDiameter, cameraTopRow);
        points.push(hitCenter);
        return { points, hitCoord: target.coord, snapCoord, hitCenter };
      }
    }
  }

  points.push({ x, y });
  return { points, hitCoord: null, snapCoord: null, hitCenter: null };
}

/**
 * BFS flood-fill collecting all connected cells matching targetColor.
 */
export function findColorCluster(grid: HexGrid, start: HexCoord, targetColor: BubbleColor): HexCoord[] {
  const visited = new Set<string>();
  const queue: HexCoord[] = [start];
  const cluster: HexCoord[] = [];
  const keyOf = (c: HexCoord) => `${c.row},${c.col}`;

  visited.add(keyOf(start));

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const cell = grid[curr.row]?.[curr.col];
    if (!cell || cell.kind !== 'normal' || cell.color !== targetColor) continue;

    cluster.push(curr);

    for (const n of getHexNeighbors(curr.row, curr.col, grid.length)) {
      const nk = keyOf(n);
      if (!visited.has(nk)) {
        const nCell = grid[n.row]?.[n.col];
        if (nCell && nCell.kind === 'normal' && nCell.color === targetColor) {
          visited.add(nk);
          queue.push(n);
        }
      }
    }
  }

  return cluster;
}

/**
 * BFS from ceiling Row 0 collecting all cells that are NOT anchored (floating islands).
 */
export function findFloatingCells(grid: HexGrid): HexCoord[] {
  if (grid.length === 0) return [];
  const visited = new Set<string>();
  const queue: HexCoord[] = [];
  const keyOf = (r: number, c: number) => `${r},${c}`;

  // Seed BFS with every occupied cell pinned directly to top wood rail (Row 0)
  for (let c = 0; c < grid[0].length; c++) {
    if (grid[0][c]) {
      visited.add(keyOf(0, c));
      queue.push({ row: 0, col: c });
    }
  }

  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const n of getHexNeighbors(curr.row, curr.col, grid.length)) {
      const nk = keyOf(n.row, n.col);
      if (!visited.has(nk) && grid[n.row]?.[n.col]) {
        visited.add(nk);
        queue.push(n);
      }
    }
  }

  const floating: HexCoord[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] && !visited.has(keyOf(r, c))) {
        floating.push({ row: r, col: c });
      }
    }
  }

  return floating;
}

/**
 * Applies a landed projectile to the grid, executing Match-3+ or Fireball/Lightning/Rainbow
 * explosions, detaching unanchored islands, rescuing fireflies, and calculating points.
 */
export function resolveShotImpact(
  grid: HexGrid,
  coord: HexCoord,
  color: BubbleColor,
  kind: BubbleKind,
  comboStreak: number
): ShotImpactResult {
  const workGrid = ensureRowCapacity(grid, coord.row);
  const placedCell: HexCell = {
    id: `shot-${Date.now()}-${coord.row}-${coord.col}`,
    row: coord.row,
    col: coord.col,
    color,
    kind,
  };
  workGrid[coord.row][coord.col] = placedCell;

  const coordsToPop = new Map<string, HexCoord>();
  const addPopCoord = (hc: HexCoord) => {
    coordsToPop.set(`${hc.row},${hc.col}`, hc);
  };

  let clearedByPowerUp = false;

  if (kind === 'fireball') {
    clearedByPowerUp = true;
    const impactCenter = getCellCenter(coord.row, coord.col, 1, 0);
    const maxRadiusSq = 2.25 ** 2;
    for (let r = Math.max(0, coord.row - 2); r <= Math.min(workGrid.length - 1, coord.row + 2); r++) {
      for (let c = 0; c < workGrid[r].length; c++) {
        if (!workGrid[r][c]) continue;
        const p = getCellCenter(r, c, 1, 0);
        const dSq = (p.x - impactCenter.x) ** 2 + (p.y - impactCenter.y) ** 2;
        if (dSq <= maxRadiusSq) {
          addPopCoord({ row: r, col: c });
        }
      }
    }
  } else if (kind === 'lightning') {
    clearedByPowerUp = true;
    addPopCoord(coord);
    const targetRow = coord.row;
    for (let c = 0; c < (workGrid[targetRow]?.length || 0); c++) {
      if (workGrid[targetRow][c]) {
        addPopCoord({ row: targetRow, col: c });
      }
    }
    // Also zap immediate touching stones or bubbles vertically right at strike point
    for (const n of getHexNeighbors(coord.row, coord.col, workGrid.length)) {
      if (workGrid[n.row]?.[n.col]) {
        addPopCoord(n);
      }
    }
  } else if (kind === 'rainbow') {
    clearedByPowerUp = true;
    addPopCoord(coord);
    const neighbors = getHexNeighbors(coord.row, coord.col, workGrid.length);
    const matchedColors = new Set<BubbleColor>();
    for (const n of neighbors) {
      const nCell = workGrid[n.row]?.[n.col];
      if (!nCell) continue;
      if (nCell.kind === 'stone') {
        addPopCoord(n);
      } else if (nCell.kind === 'normal' && !matchedColors.has(nCell.color)) {
        matchedColors.add(nCell.color);
        const cluster = findColorCluster(workGrid, n, nCell.color);
        cluster.forEach(addPopCoord);
      }
    }
  } else {
    // Standard match-3+ color cluster check
    const cluster = findColorCluster(workGrid, coord, color);
    if (cluster.length >= 3) {
      cluster.forEach(addPopCoord);
    }
  }

  const poppedCells: HexCell[] = [];
  let rescuedCount = 0;
  let stonesCleared = 0;

  coordsToPop.forEach((hc) => {
    const cell = workGrid[hc.row]?.[hc.col];
    if (cell) {
      poppedCells.push(cell);
      if (cell.hasFirefly) rescuedCount++;
      if (cell.kind === 'stone') stonesCleared++;
      workGrid[hc.row][hc.col] = null;
    }
  });

  // Avalanche check: detach any floating cells not anchored to Row 0
  const floatingCoords = poppedCells.length > 0 ? findFloatingCells(workGrid) : [];
  const droppedCells: HexCell[] = [];

  for (const fc of floatingCoords) {
    const cell = workGrid[fc.row]?.[fc.col];
    if (cell) {
      droppedCells.push(cell);
      if (cell.hasFirefly) rescuedCount++;
      if (cell.kind === 'stone') stonesCleared++;
      workGrid[fc.row][fc.col] = null;
    }
  }

  // Trim trailing empty rows beyond a minimum buffer
  while (workGrid.length > 4 && workGrid[workGrid.length - 1].every((c) => c === null)) {
    workGrid.pop();
  }

  // Calculate score with combo & avalanche bonuses
  const popPoints = poppedCells.length * 10;
  const dropPoints = droppedCells.length * 15;
  const rescueBonus = rescuedCount * 50;
  const streakMultiplier = Math.max(1, 1 + Math.min(comboStreak, 5) * 0.25);
  const pointsEarned =
    poppedCells.length > 0
      ? Math.round((popPoints + dropPoints + rescueBonus) * streakMultiplier)
      : 0;

  let calloutText = '';
  if (kind === 'fireball') calloutText = 'FIREBALL!';
  else if (kind === 'lightning') calloutText = 'LIGHTNING!';
  else if (kind === 'rainbow') calloutText = 'PRISM BLAST!';
  else if (droppedCells.length >= 5) calloutText = 'AVALANCHE!';
  else if (poppedCells.length + droppedCells.length >= 7) calloutText = 'PERFECT!';
  else if (comboStreak >= 3) calloutText = `COMBO x${comboStreak}!`;
  else if (poppedCells.length >= 3) calloutText = 'POP!';

  return {
    nextGrid: workGrid,
    poppedCells,
    droppedCells,
    rescuedCount,
    stonesCleared,
    clearedByPowerUp,
    pointsEarned,
    calloutText,
  };
}

/**
 * Checks if lowest occupied row extends across visible shooter danger line.
 */
export function checkDangerLineOverflow(grid: HexGrid, cameraTopRow: number): boolean {
  const maxRow = getMaxOccupiedRow(grid);
  if (maxRow < 0) return false;
  return maxRow - cameraTopRow >= DANGER_VISIBLE_ROWS;
}

/**
 * Checks whether level victory condition is satisfied.
 */
export function checkLevelVictory(grid: HexGrid, config: BubbleLevelConfig): boolean {
  const stats = getGridStats(grid);
  if (config.goalType === 'rescue_fireflies') {
    return stats.fireflyCount === 0;
  }
  return stats.normalCount === 0 && stats.fireflyCount === 0;
}

/**
 * Computes final 1–3 star rating from earned score against level thresholds.
 */
export function computeLevelStars(score: number, thresholds: [number, number, number]): number {
  if (score >= thresholds[2]) return 3;
  if (score >= thresholds[1]) return 2;
  return 1;
}
