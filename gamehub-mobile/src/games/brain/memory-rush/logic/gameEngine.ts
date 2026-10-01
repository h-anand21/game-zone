// ============================================================
// MEMORY RUSH — Core Game Round & Grid Logic Generator
// ============================================================

import type {
  GameMode,
  GameDifficulty,
  RoundType,
  RoundConfig,
  NumberTileData,
  GridPos,
} from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getGridDimensions(difficulty: GameDifficulty): { rows: number; cols: number } {
  switch (difficulty) {
    case 'hard':
      return { rows: 4, cols: 4 };
    case 'medium':
      return { rows: 3, cols: 4 };
    case 'easy':
    default:
      return { rows: 2, cols: 3 };
  }
}

export function getPreviewDurationMs(difficulty: GameDifficulty, smartDiffActive: boolean): number {
  const base = difficulty === 'hard' ? 900 : difficulty === 'medium' ? 1500 : 2500;
  return smartDiffActive ? base * 0.9 : base;
}

export function getTimerDurationMs(difficulty: GameDifficulty): number {
  return difficulty === 'hard' ? 15000 : difficulty === 'medium' ? 20000 : 30000;
}

export function generateTilesForGrid(
  rows: number,
  cols: number,
  difficulty: GameDifficulty
): NumberTileData[] {
  const total = rows * cols;
  const tiles: NumberTileData[] = [];
  const usedNums = new Set<number>();

  const isTwoDigitAllowed = difficulty !== 'easy';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let val: number;
      do {
        if (isTwoDigitAllowed && Math.random() > 0.6) {
          val = getRandomInt(10, 99);
        } else {
          val = getRandomInt(1, 9);
        }
      } while (usedNums.has(val));

      usedNums.add(val);
      tiles.push({
        id: `tile_${r}_${c}`,
        value: val,
        row: r,
        col: c,
        state: 'preview',
      });
    }
  }

  return tiles;
}

export function generateRoundConfig(
  mode: GameMode,
  difficulty: GameDifficulty,
  roundNumber: number,
  smartDiffActive: boolean = false
): { config: RoundConfig; initialTiles: NumberTileData[] } {
  const { rows, cols } = getGridDimensions(difficulty);
  const previewMs = getPreviewDurationMs(difficulty, smartDiffActive);
  const timerMs = getTimerDurationMs(difficulty);

  let actualType: RoundType = 'memoryGrid';
  if (mode === 'fusionRush') {
    const types: RoundType[] = ['memoryGrid', 'sequenceRush', 'numberShift', 'missingNumber'];
    actualType = types[(roundNumber - 1) % types.length];
  } else {
    actualType = mode as RoundType;
  }

  let initialTiles = generateTilesForGrid(rows, cols, difficulty);

  let prompt = '';
  let targetVal: number | undefined;
  let targetPos: GridPos | undefined;
  let seqOrder: number[] | undefined;
  let seqTileIds: string[] | undefined;
  let changedTileId: string | undefined;
  let changedOriginalVal: number | undefined;
  let changedNewVal: number | undefined;
  let vanishedVal: number | undefined;
  let missingOpts: number[] | undefined;

  switch (actualType) {
    case 'memoryGrid': {
      const chosenTile = initialTiles[getRandomInt(0, initialTiles.length - 1)];
      targetVal = chosenTile.value;
      targetPos = { row: chosenTile.row, col: chosenTile.col };
      prompt = `WHERE WAS ${targetVal}?`;
      break;
    }
    case 'sequenceRush': {
      const seqLen = Math.min(initialTiles.length, difficulty === 'hard' ? 5 : difficulty === 'medium' ? 4 : 3);
      const chosenTiles = shuffleArray(initialTiles).slice(0, seqLen);
      seqTileIds = chosenTiles.map((t) => t.id);
      seqOrder = chosenTiles.map((t) => t.value);

      // Mark the sequence steps on initialTiles for preview
      initialTiles = initialTiles.map((tile) => {
        const stepIdx = seqTileIds!.indexOf(tile.id);
        if (stepIdx !== -1) {
          return { ...tile, sequenceStep: stepIdx + 1 };
        }
        return tile;
      });

      prompt = `REPEAT SEQUENCE: 1 OF ${seqLen}`;
      break;
    }
    case 'numberShift': {
      const targetTile = initialTiles[getRandomInt(0, initialTiles.length - 1)];
      changedTileId = targetTile.id;
      changedOriginalVal = targetTile.value;

      // Generate a new value distinct from all current tiles
      const existingValues = new Set(initialTiles.map((t) => t.value));
      let newVal: number;
      do {
        newVal = getRandomInt(1, difficulty === 'easy' ? 9 : 99);
      } while (existingValues.has(newVal));

      changedNewVal = newVal;
      prompt = `ONE NUMBER MUTATED! TAP THE CHANGED NUMBER`;
      break;
    }
    case 'missingNumber': {
      const targetTile = initialTiles[getRandomInt(0, initialTiles.length - 1)];
      vanishedVal = targetTile.value;

      // Generate 3 distractors not in initialTiles
      const existingValues = new Set(initialTiles.map((t) => t.value));
      const distractors: number[] = [];
      while (distractors.length < 3) {
        const d = getRandomInt(1, difficulty === 'easy' ? 9 : 99);
        if (!existingValues.has(d) && !distractors.includes(d)) {
          distractors.push(d);
        }
      }

      missingOpts = shuffleArray([vanishedVal, ...distractors]);
      prompt = `WHICH NUMBER VANISHED FROM THE EMPTY TILE?`;
      break;
    }
  }

  const config: RoundConfig = {
    roundNumber,
    mode,
    actualType,
    gridRows: rows,
    gridCols: cols,
    previewDurationMs: previewMs,
    timerDurationMs: timerMs,
    targetValue: targetVal,
    targetPos,
    sequenceOrder: seqOrder,
    sequenceTileIds: seqTileIds,
    changedTileId,
    changedOriginalValue: changedOriginalVal,
    changedNewValue: changedNewVal,
    vanishedValue: vanishedVal,
    missingOptions: missingOpts,
    questionPrompt: prompt,
  };

  return { config, initialTiles };
}
