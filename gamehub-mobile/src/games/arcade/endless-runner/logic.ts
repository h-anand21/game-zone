// ============================================================
// Color Bloom Sort — Pure Puzzle Engine, Generator & Solver
// 100% Solvable Seeded Level Generator & BFS State-Space Solver
// ============================================================

import {
  BallColor,
  Tube,
  TUBE_CAPACITY,
  ALL_BALL_COLORS,
  LevelData,
  HintMove,
} from './types';

/**
 * Validates whether transferring the top ball from source tube to destination tube is legal.
 */
export function canMove(tubes: Tube[], fromIdx: number, toIdx: number): boolean {
  if (fromIdx === toIdx) return false;
  if (fromIdx < 0 || fromIdx >= tubes.length) return false;
  if (toIdx < 0 || toIdx >= tubes.length) return false;

  const fromTube = tubes[fromIdx];
  const toTube = tubes[toIdx];

  // Source must not be empty
  if (!fromTube || fromTube.length === 0) return false;

  // Destination must have space
  if (!toTube || toTube.length >= TUBE_CAPACITY) return false;

  // Don't move a ball out of an already completed tube (preserves player progress)
  if (isTubeSolved(fromTube)) return false;

  // If destination is empty, moving is always allowed
  if (toTube.length === 0) return true;

  // If destination has balls, top ball of dest must match top ball of source
  const sourceTop = fromTube[fromTube.length - 1];
  const destTop = toTube[toTube.length - 1];

  return sourceTop === destTop;
}

/**
 * Executes a legal move and returns a new cloned array of tubes.
 */
export function executeMove(
  tubes: Tube[],
  fromIdx: number,
  toIdx: number
): { newTubes: Tube[]; movedBall: BallColor } {
  const newTubes: Tube[] = tubes.map((t) => [...t]);
  const movedBall = newTubes[fromIdx].pop()!;
  newTubes[toIdx].push(movedBall);

  return { newTubes, movedBall };
}

/**
 * Checks if an individual tube is completed (contains 4 balls of the exact same color).
 */
export function isTubeSolved(tube: Tube): boolean {
  if (tube.length !== TUBE_CAPACITY) return false;
  const first = tube[0];
  return tube.every((b) => b === first);
}

/**
 * Checks if the entire puzzle is solved.
 * Every nonempty tube must contain exactly 4 balls of a single color.
 */
export function isPuzzleSolved(tubes: Tube[]): boolean {
  let solvedTubesCount = 0;

  for (const tube of tubes) {
    if (tube.length === 0) {
      continue;
    } else if (isTubeSolved(tube)) {
      solvedTubesCount++;
    } else {
      // Partially filled or mixed tube
      return false;
    }
  }

  // At least 2 tubes must be solved for a valid puzzle
  return solvedTubesCount >= 2;
}

/**
 * Serializes tube configuration into a canonical state string for BFS memoization.
 * Tubes are sorted so symmetric tube permutations map to the identical state key.
 */
function serializeState(tubes: Tube[]): string {
  const tubeStrings = tubes.map((t) => t.join(','));
  tubeStrings.sort();
  return tubeStrings.join('|');
}

/**
 * Real BFS Solver that searches the state space for the next legal move towards victory.
 * Returns the recommended first move or null if no solution is reachable within budget.
 */
export function findHint(tubes: Tube[], maxSteps = 1200): HintMove | null {
  if (isPuzzleSolved(tubes)) return null;

  interface QueueNode {
    state: Tube[];
    firstMove: HintMove | null;
  }

  const visited = new Set<string>();
  const initialKey = serializeState(tubes);
  visited.add(initialKey);

  const queue: QueueNode[] = [];

  // Seed queue with first depth moves
  for (let from = 0; from < tubes.length; from++) {
    for (let to = 0; to < tubes.length; to++) {
      if (canMove(tubes, from, to)) {
        // Redundant move check: moving a ball from a tube with only that color to an empty tube changes nothing
        const fromT = tubes[from];
        const toT = tubes[to];
        if (toT.length === 0 && fromT.every((b) => b === fromT[0])) {
          continue;
        }

        const { newTubes, movedBall } = executeMove(tubes, from, to);
        const key = serializeState(newTubes);

        if (!visited.has(key)) {
          visited.add(key);

          const hint: HintMove = { fromTube: from, toTube: to, color: movedBall };

          if (isPuzzleSolved(newTubes)) {
            return hint;
          }

          queue.push({ state: newTubes, firstMove: hint });
        }
      }
    }
  }

  let steps = 0;
  while (queue.length > 0 && steps < maxSteps) {
    steps++;
    const current = queue.shift()!;

    for (let from = 0; from < current.state.length; from++) {
      for (let to = 0; to < current.state.length; to++) {
        if (canMove(current.state, from, to)) {
          const fromT = current.state[from];
          const toT = current.state[to];
          if (toT.length === 0 && fromT.every((b) => b === fromT[0])) {
            continue;
          }

          const { newTubes } = executeMove(current.state, from, to);
          const key = serializeState(newTubes);

          if (!visited.has(key)) {
            visited.add(key);

            if (isPuzzleSolved(newTubes)) {
              return current.firstMove;
            }

            queue.push({ state: newTubes, firstMove: current.firstMove });
          }
        }
      }
    }
  }

  return null;
}

/**
 * Linear Congruential Pseudo-Random Number Generator for deterministic level generation
 */
class DeterministicPRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = Math.abs(seed) % 2147483647;
    if (this.seed === 0) this.seed = 1;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(min + this.next() * (max - min + 1));
  }
}

/**
 * Handcrafted initial level arrangements for smooth onboarding
 */
const HANDCRAFTED_TUTORIAL_LEVELS: Record<number, Tube[]> = {
  1: [
    ['red', 'blue', 'red', 'blue'],
    ['blue', 'red', 'blue', 'red'],
    [],
  ],
  2: [
    ['green', 'amber', 'green', 'amber'],
    ['amber', 'green', 'amber', 'green'],
    ['blue', 'blue', 'blue', 'blue'],
    [],
  ],
  3: [
    ['red', 'green', 'blue', 'red'],
    ['blue', 'red', 'green', 'green'],
    ['blue', 'blue', 'red', 'green'],
    [],
    [],
  ],
  4: [
    ['purple', 'cyan', 'purple', 'cyan'],
    ['cyan', 'purple', 'pink', 'pink'],
    ['pink', 'cyan', 'pink', 'purple'],
    [],
    [],
  ],
};

/**
 * Generates a guaranteed solvable puzzle for any level from 1 to 500+
 */
export function generateLevel(levelNumber: number): LevelData {
  const clampedLevel = Math.max(1, levelNumber);

  // Return handcrafted tutorial level if available
  if (HANDCRAFTED_TUTORIAL_LEVELS[clampedLevel]) {
    const tutorialTubes = HANDCRAFTED_TUTORIAL_LEVELS[clampedLevel].map((t) => [...t]);
    return {
      levelNumber: clampedLevel,
      tubes: tutorialTubes,
      colorCount: tutorialTubes.filter((t) => t.length > 0).length,
      emptyTubeCount: tutorialTubes.filter((t) => t.length === 0).length,
    };
  }

  // Determine difficulty scaling
  let colorCount: number;
  let emptyTubeCount = 2;

  if (clampedLevel <= 6) {
    colorCount = 3;
    emptyTubeCount = 2;
  } else if (clampedLevel <= 15) {
    colorCount = 4;
    emptyTubeCount = 2;
  } else if (clampedLevel <= 40) {
    colorCount = 5;
    emptyTubeCount = 2;
  } else if (clampedLevel <= 100) {
    colorCount = 6;
    emptyTubeCount = 2;
  } else if (clampedLevel <= 220) {
    colorCount = 7;
    emptyTubeCount = 2;
  } else if (clampedLevel <= 360) {
    colorCount = 8;
    emptyTubeCount = 2;
  } else {
    colorCount = 9;
    emptyTubeCount = 2;
  }

  colorCount = Math.min(colorCount, ALL_BALL_COLORS.length);

  const colorsUsed = ALL_BALL_COLORS.slice(0, colorCount);
  const totalTubes = colorCount + emptyTubeCount;

  // Seeded PRNG for deterministic, reproducible generation
  const prng = new DeterministicPRNG(clampedLevel * 104729 + 7919);

  // Start from solved state
  const tubes: Tube[] = [];
  for (let c = 0; c < colorCount; c++) {
    tubes.push(Array(TUBE_CAPACITY).fill(colorsUsed[c]));
  }
  for (let e = 0; e < emptyTubeCount; e++) {
    tubes.push([]);
  }

  // Shuffle via legal reverse moves to guarantee 100% solvability
  const shuffleSteps = Math.min(60, 24 + clampedLevel * 2);

  for (let step = 0; step < shuffleSteps; step++) {
    const validReverseMoves: { from: number; to: number }[] = [];

    for (let from = 0; from < totalTubes; from++) {
      for (let to = 0; to < totalTubes; to++) {
        if (from === to) continue;
        const source = tubes[from];
        const dest = tubes[to];

        if (source.length > 0 && dest.length < TUBE_CAPACITY) {
          // A reverse move of taking ball X from source and putting into dest is valid
          // if, in the forward direction, taking ball X from dest and putting into source is legal.
          const movingBall = source[source.length - 1];
          const remainingSourceTop = source.length > 1 ? source[source.length - 2] : null;

          // Forward rule: ball must land on empty tube OR same color
          const isForwardLegal =
            remainingSourceTop === null || remainingSourceTop === movingBall;

          if (isForwardLegal) {
            validReverseMoves.push({ from, to });
          }
        }
      }
    }

    if (validReverseMoves.length > 0) {
      const chosen = validReverseMoves[prng.nextInt(0, validReverseMoves.length - 1)];
      const ball = tubes[chosen.from].pop()!;
      tubes[chosen.to].push(ball);
    }
  }

  // Ensure puzzle is not trivial (if by chance it stayed solved)
  if (isPuzzleSolved(tubes)) {
    // Perform guaranteed swap
    const b1 = tubes[0].pop()!;
    const b2 = tubes[1].pop()!;
    tubes[0].push(b2);
    tubes[1].push(b1);
  }

  return {
    levelNumber: clampedLevel,
    tubes,
    colorCount,
    emptyTubeCount,
  };
}
