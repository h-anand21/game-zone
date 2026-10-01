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

  const initialTiles = generateTilesForGrid(rows, cols, difficulty);

  let prompt = '';
  let targetVal: number | undefined;
  let targetPos: GridPos | undefined;
  let seqOrder: number[] | undefined;
  let changedPos: GridPos[] | undefined;
  let missingNums: number[] | undefined;

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
      const shuffled = shuffleArray(initialTiles).slice(0, seqLen);
      seqOrder = shuffled.map((t) => t.value);
      const isReverse = difficulty === 'hard' && Math.random() > 0.5;
      prompt = isReverse ? 'REPEAT IN REVERSE ORDER' : 'REPEAT THE SEQUENCE';
      break;
    }
    case 'numberShift': {
      // Pick 1 or 2 tiles to change value
      const targetIndices = shuffleArray(initialTiles.map((_, idx) => idx)).slice(0, difficulty === 'hard' ? 2 : 1);
      changedPos = targetIndices.map((idx) => ({ row: initialTiles[idx].row, col: initialTiles[idx].col }));
      prompt = 'WHAT CHANGED?';
      break;
    }
    case 'missingNumber': {
      const missingTile = initialTiles[getRandomInt(0, initialTiles.length - 1)];
      missingNums = [missingTile.value];
      prompt = 'WHICH NUMBER IS MISSING?';
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
    changedPositions: changedPos,
    missingNumbers: missingNums,
    questionPrompt: prompt,
  };

  return { config, initialTiles };
}
