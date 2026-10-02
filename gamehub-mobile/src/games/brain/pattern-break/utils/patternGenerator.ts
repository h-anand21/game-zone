// ============================================================
// PATTERN BREAKER — Deterministic Pattern Generator Engine
// Ensures EXACTLY ONE breaker per board.
// ============================================================

import { PBPatternType, PBDifficulty, PatternPuzzle, TileItem, ShapeKind } from '../types';

const SHAPES: ShapeKind[] = ['triangle', 'circle', 'square', 'star', 'hexagon', 'diamond'];

const PALETTES = [
  { primary: '#19D3FF', breaker: '#FFD54A' }, // Cyan vs Amber
  { primary: '#38E58C', breaker: '#FF5C61' }, // Emerald vs Crimson
  { primary: '#A78BFA', breaker: '#19D3FF' }, // Violet vs Cyan
  { primary: '#FF6EA7', breaker: '#38E58C' }, // Pink vs Emerald
  { primary: '#FFD54A', breaker: '#A78BFA' }, // Amber vs Violet
];

export function generatePatternPuzzle(
  type: PBPatternType = 'RANDOM',
  difficulty: PBDifficulty = 'MEDIUM',
  tileCount: number = 9
): PatternPuzzle {
  const chosenType: PBPatternType =
    type === 'RANDOM'
      ? (['NUMBER', 'SHAPE', 'COLOR', 'COUNT', 'DIRECTION', 'MIXED'][
          Math.floor(Math.random() * 6)
        ] as PBPatternType)
      : type;

  const breakerIndex = Math.floor(Math.random() * tileCount);
  const timeLimit = difficulty === 'EASY' ? 30 : difficulty === 'MEDIUM' ? 20 : 12;

  switch (chosenType) {
    case 'NUMBER':
      return generateNumberPuzzle(difficulty, tileCount, breakerIndex, timeLimit);
    case 'SHAPE':
      return generateShapePuzzle(difficulty, tileCount, breakerIndex, timeLimit);
    case 'COLOR':
      return generateColorPuzzle(difficulty, tileCount, breakerIndex, timeLimit);
    case 'COUNT':
      return generateCountPuzzle(difficulty, tileCount, breakerIndex, timeLimit);
    case 'DIRECTION':
      return generateDirectionPuzzle(difficulty, tileCount, breakerIndex, timeLimit);
    case 'MIXED':
    default:
      return generateMixedPuzzle(difficulty, tileCount, breakerIndex, timeLimit);
  }
}

function generateNumberPuzzle(
  difficulty: PBDifficulty,
  count: number,
  breakerIdx: number,
  timeLimit: number
): PatternPuzzle {
  const subType = Math.floor(Math.random() * 3);

  if (subType === 0) {
    // Arithmetic Step: e.g. +3 each step
    const step = Math.floor(Math.random() * 4) + 2; // 2..5
    const start = Math.floor(Math.random() * 12) + 1;
    const items: TileItem[] = [];

    for (let i = 0; i < count; i++) {
      const isBreaker = i === breakerIdx;
      const normalVal = start + i * step;
      const val = isBreaker ? normalVal + (Math.random() > 0.5 ? 1 : -1) : normalVal;

      items.push({
        id: `num_${i}`,
        type: 'number',
        value: val,
        color: '#19D3FF',
        shape: 'square',
      });
    }

    return {
      patternType: 'NUMBER',
      difficulty,
      ruleTitle: `Sequence: +${step} progression`,
      ruleDescription: `Numbers increment by ${step}. One tile deviates!`,
      items,
      breakerIndex: breakerIdx,
      breakerExplanation: `Number does not follow +${step} step`,
      timeLimit,
    };
  } else if (subType === 1) {
    // Multiples of X
    const base = Math.floor(Math.random() * 3) + 3; // 3, 4, 5
    const items: TileItem[] = [];

    for (let i = 0; i < count; i++) {
      const isBreaker = i === breakerIdx;
      const multiplier = i + 1 + Math.floor(Math.random() * 2);
      const val = isBreaker ? base * multiplier + 1 : base * multiplier;

      items.push({
        id: `num_${i}`,
        type: 'number',
        value: val,
        color: '#FFD54A',
        shape: 'hexagon',
      });
    }

    return {
      patternType: 'NUMBER',
      difficulty,
      ruleTitle: `Multiples of ${base}`,
      ruleDescription: `Every tile is divisible by ${base}, except one!`,
      items,
      breakerIndex: breakerIdx,
      breakerExplanation: `Not divisible by ${base}`,
      timeLimit,
    };
  } else {
    // Even vs Odd
    const allEven = Math.random() > 0.5;
    const items: TileItem[] = [];

    for (let i = 0; i < count; i++) {
      const isBreaker = i === breakerIdx;
      const baseNum = Math.floor(Math.random() * 18) + 2;
      const evenVal = baseNum % 2 === 0 ? baseNum : baseNum + 1;
      const oddVal = baseNum % 2 !== 0 ? baseNum : baseNum + 1;

      const val = isBreaker ? (allEven ? oddVal : evenVal) : allEven ? evenVal : oddVal;

      items.push({
        id: `num_${i}`,
        type: 'number',
        value: val,
        color: '#38E58C',
        shape: 'diamond',
      });
    }

    return {
      patternType: 'NUMBER',
      difficulty,
      ruleTitle: allEven ? 'All Even Numbers' : 'All Odd Numbers',
      ruleDescription: `Find the single number with opposite parity!`,
      items,
      breakerIndex: breakerIdx,
      breakerExplanation: allEven ? 'Odd number amongst evens' : 'Even number amongst odds',
      timeLimit,
    };
  }
}

function generateShapePuzzle(
  difficulty: PBDifficulty,
  count: number,
  breakerIdx: number,
  timeLimit: number
): PatternPuzzle {
  const commonShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const remainingShapes = SHAPES.filter((s) => s !== commonShape);
  const breakerShape = remainingShapes[Math.floor(Math.random() * remainingShapes.length)];

  const items: TileItem[] = [];
  for (let i = 0; i < count; i++) {
    const isBreaker = i === breakerIdx;
    items.push({
      id: `shape_${i}`,
      type: 'shape',
      value: isBreaker ? breakerShape : commonShape,
      color: '#19D3FF',
      shape: isBreaker ? breakerShape : commonShape,
    });
  }

  return {
    patternType: 'SHAPE',
    difficulty,
    ruleTitle: `Dominant Shape: ${commonShape.toUpperCase()}`,
    ruleDescription: `All tiles feature the same ancient geometry except one outlier.`,
    items,
    breakerIndex: breakerIdx,
    breakerExplanation: `Outlier shape (${breakerShape}) instead of ${commonShape}`,
    timeLimit,
  };
}

function generateColorPuzzle(
  difficulty: PBDifficulty,
  count: number,
  breakerIdx: number,
  timeLimit: number
): PatternPuzzle {
  const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const items: TileItem[] = [];

  for (let i = 0; i < count; i++) {
    const isBreaker = i === breakerIdx;
    items.push({
      id: `color_${i}`,
      type: 'color',
      value: isBreaker ? 'BREAKER' : 'MATCH',
      color: isBreaker ? palette.breaker : palette.primary,
      shape: 'diamond',
    });
  }

  return {
    patternType: 'COLOR',
    difficulty,
    ruleTitle: 'Chromatic Harmony',
    ruleDescription: '8 tiles emit the pure resonance color. Spot the discordant hue!',
    items,
    breakerIndex: breakerIdx,
    breakerExplanation: 'Discordant color frequency',
    timeLimit,
  };
}

function generateCountPuzzle(
  difficulty: PBDifficulty,
  count: number,
  breakerIdx: number,
  timeLimit: number
): PatternPuzzle {
  const baseCount = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
  const breakerCount = baseCount === 4 ? 2 : baseCount + 1;
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];

  const items: TileItem[] = [];
  for (let i = 0; i < count; i++) {
    const isBreaker = i === breakerIdx;
    const cnt = isBreaker ? breakerCount : baseCount;

    items.push({
      id: `count_${i}`,
      type: 'count',
      value: cnt,
      color: '#FFD54A',
      shape,
      count: cnt,
    });
  }

  return {
    patternType: 'COUNT',
    difficulty,
    ruleTitle: `Quantity Resonance: ${baseCount} Items`,
    ruleDescription: `Each matrix stone contains ${baseCount} runestones. One contains ${breakerCount}.`,
    items,
    breakerIndex: breakerIdx,
    breakerExplanation: `Different quantity (${breakerCount} items)`,
    timeLimit,
  };
}

function generateDirectionPuzzle(
  difficulty: PBDifficulty,
  count: number,
  breakerIdx: number,
  timeLimit: number
): PatternPuzzle {
  const angles = [0, 90, 180, 270];
  const commonAngle = angles[Math.floor(Math.random() * angles.length)];
  const breakerAngle = (commonAngle + 180) % 360;

  const items: TileItem[] = [];
  for (let i = 0; i < count; i++) {
    const isBreaker = i === breakerIdx;
    items.push({
      id: `dir_${i}`,
      type: 'direction',
      value: isBreaker ? breakerAngle : commonAngle,
      color: '#A78BFA',
      rotation: isBreaker ? breakerAngle : commonAngle,
    });
  }

  return {
    patternType: 'DIRECTION',
    difficulty,
    ruleTitle: 'Vector Alignment',
    ruleDescription: 'Energy glyphs vector in identical alignment. One opposes the flow!',
    items,
    breakerIndex: breakerIdx,
    breakerExplanation: `Inverted directional vector`,
    timeLimit,
  };
}

function generateMixedPuzzle(
  difficulty: PBDifficulty,
  count: number,
  breakerIdx: number,
  timeLimit: number
): PatternPuzzle {
  const baseShape: ShapeKind = 'star';
  const baseColor = '#19D3FF';
  const baseCount = 3;

  const items: TileItem[] = [];
  for (let i = 0; i < count; i++) {
    const isBreaker = i === breakerIdx;
    items.push({
      id: `mixed_${i}`,
      type: 'mixed',
      value: isBreaker ? '?' : '★',
      color: isBreaker ? '#FF5C61' : baseColor,
      shape: isBreaker ? 'circle' : baseShape,
      count: isBreaker ? 2 : baseCount,
    });
  }

  return {
    patternType: 'MIXED',
    difficulty,
    ruleTitle: 'Multi-Vector Fusion',
    ruleDescription: 'Combines shape, quantity, and hue. Exactly one tile shatters harmony!',
    items,
    breakerIndex: breakerIdx,
    breakerExplanation: 'Violates combined matrix properties',
    timeLimit,
  };
}
