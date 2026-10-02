// ============================================================
// PATTERN QUEST — Visual Pattern Generator Engine
// Shapes, Rotations, Colors, Sizes, Transformations, Mixed
// ============================================================

import {
  PatternQuestPuzzle,
  PQDifficulty,
  PQGameMode,
  PQPatternCategory,
  ShapeSymbol,
  VisualTile,
} from '../types';

const SHAPES: ShapeSymbol[] = ['circle', 'triangle', 'square', 'diamond', 'star', 'hexagon'];
const COLORS = [
  '#00F0FF', // Cyan Crystal
  '#FFD700', // Gold
  '#FF4757', // Ruby Red
  '#2ED573', // Emerald Green
  '#A55EEA', // Amethyst Purple
  '#FFA502', // Amber Orange
];
const SIZES: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
const STYLES: ('outline' | 'half' | 'filled')[] = ['outline', 'half', 'filled'];
const ROTATIONS = [0, 90, 180, 270];

function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generatePatternPuzzle(
  difficulty: PQDifficulty = 'EASY',
  mode: PQGameMode = 'DISCOVER',
  customCategory?: PQPatternCategory
): PatternQuestPuzzle {
  const categories: PQPatternCategory[] =
    difficulty === 'EASY'
      ? ['shape', 'color', 'rotation', 'size']
      : difficulty === 'MEDIUM'
      ? ['shape', 'rotation', 'color', 'transformation', 'movement']
      : ['mixed', 'transformation', 'rotation', 'number'];

  const category = customCategory || sample(categories);
  const seqLength = difficulty === 'EASY' ? 4 : difficulty === 'MEDIUM' ? 5 : 6;

  let sequence: VisualTile[] = [];
  let answerTile: VisualTile;
  let ruleTitle = '';
  let ruleExplanation = '';

  const baseShape = sample(SHAPES);
  const baseColor = sample(COLORS);

  if (category === 'shape') {
    // ABAB or ABCABC pattern
    const s1 = sample(SHAPES);
    let s2 = sample(SHAPES.filter((s) => s !== s1));
    let s3 = sample(SHAPES.filter((s) => s !== s1 && s !== s2));

    const cycle = difficulty === 'EASY' ? [s1, s2] : [s1, s2, s3];
    ruleTitle = difficulty === 'EASY' ? 'Alternating Shapes' : 'Three-Shape Cycle';
    ruleExplanation = `The sequence repeats: ${cycle.join(' → ')}`;

    for (let i = 0; i < seqLength; i++) {
      sequence.push({
        id: `t_${i}`,
        shape: cycle[i % cycle.length],
        color: baseColor,
        rotation: 0,
        size: 'medium',
        style: 'filled',
      });
    }
    answerTile = {
      id: 'ans_correct',
      shape: cycle[seqLength % cycle.length],
      color: baseColor,
      rotation: 0,
      size: 'medium',
      style: 'filled',
    };
  } else if (category === 'color') {
    // Color cycle
    const c1 = sample(COLORS);
    const c2 = sample(COLORS.filter((c) => c !== c1));
    const c3 = sample(COLORS.filter((c) => c !== c1 && c !== c2));
    const cycle = difficulty === 'EASY' ? [c1, c2] : [c1, c2, c3];

    ruleTitle = 'Chamber Hue Cycle';
    ruleExplanation = 'Colors cycle through the ancient gem spectrum.';

    for (let i = 0; i < seqLength; i++) {
      sequence.push({
        id: `t_${i}`,
        shape: baseShape,
        color: cycle[i % cycle.length],
        rotation: 0,
        size: 'medium',
        style: 'filled',
      });
    }
    answerTile = {
      id: 'ans_correct',
      shape: baseShape,
      color: cycle[seqLength % cycle.length],
      rotation: 0,
      size: 'medium',
      style: 'filled',
    };
  } else if (category === 'rotation') {
    // Clockwise or counter-clockwise 90-deg turns
    const step = 90;
    const startAngle = sample(ROTATIONS);
    ruleTitle = 'Clockwise Sundial Rotation';
    ruleExplanation = 'Each rune turns 90° clockwise with each step.';

    for (let i = 0; i < seqLength; i++) {
      sequence.push({
        id: `t_${i}`,
        shape: baseShape === 'circle' ? 'triangle' : baseShape,
        color: baseColor,
        rotation: (startAngle + i * step) % 360,
        size: 'medium',
        style: 'filled',
      });
    }
    answerTile = {
      id: 'ans_correct',
      shape: baseShape === 'circle' ? 'triangle' : baseShape,
      color: baseColor,
      rotation: (startAngle + seqLength * step) % 360,
      size: 'medium',
      style: 'filled',
    };
  } else if (category === 'size') {
    // Size cycle small -> medium -> large
    const cycle = SIZES;
    ruleTitle = 'Temple Growth Pattern';
    ruleExplanation = 'Crystal sizes grow: Small → Medium → Large.';

    for (let i = 0; i < seqLength; i++) {
      sequence.push({
        id: `t_${i}`,
        shape: baseShape,
        color: baseColor,
        rotation: 0,
        size: cycle[i % cycle.length],
        style: 'filled',
      });
    }
    answerTile = {
      id: 'ans_correct',
      shape: baseShape,
      color: baseColor,
      rotation: 0,
      size: cycle[seqLength % cycle.length],
      style: 'filled',
    };
  } else if (category === 'transformation') {
    // Outline -> Half -> Filled
    const cycle = STYLES;
    ruleTitle = 'Crystal Energy Infusion';
    ruleExplanation = 'Rune state transforms: Outline → Half-Filled → Solid.';

    for (let i = 0; i < seqLength; i++) {
      sequence.push({
        id: `t_${i}`,
        shape: baseShape,
        color: baseColor,
        rotation: 0,
        size: 'medium',
        style: cycle[i % cycle.length],
      });
    }
    answerTile = {
      id: 'ans_correct',
      shape: baseShape,
      color: baseColor,
      rotation: 0,
      size: 'medium',
      style: cycle[seqLength % cycle.length],
    };
  } else {
    // Mixed: Shape + Color
    const s1 = sample(SHAPES);
    const s2 = sample(SHAPES.filter((s) => s !== s1));
    const c1 = sample(COLORS);
    const c2 = sample(COLORS.filter((c) => c !== c1));

    ruleTitle = 'Dual Matrix Shift';
    ruleExplanation = 'Both shape and gem color alternate in unison.';

    for (let i = 0; i < seqLength; i++) {
      sequence.push({
        id: `t_${i}`,
        shape: i % 2 === 0 ? s1 : s2,
        color: i % 2 === 0 ? c1 : c2,
        rotation: 0,
        size: 'medium',
        style: 'filled',
      });
    }
    answerTile = {
      id: 'ans_correct',
      shape: seqLength % 2 === 0 ? s1 : s2,
      color: seqLength % 2 === 0 ? c1 : c2,
      rotation: 0,
      size: 'medium',
      style: 'filled',
    };
  }

  // Generate 3 clever distractors
  const distractors: VisualTile[] = [];

  // Distractor 1: wrong shape
  distractors.push({
    ...answerTile,
    id: 'distractor_1',
    shape: sample(SHAPES.filter((s) => s !== answerTile.shape)),
  });

  // Distractor 2: wrong color or rotation
  distractors.push({
    ...answerTile,
    id: 'distractor_2',
    color: sample(COLORS.filter((c) => c !== answerTile.color)),
    rotation: (answerTile.rotation + 90) % 360,
  });

  // Distractor 3: wrong size or style
  distractors.push({
    ...answerTile,
    id: 'distractor_3',
    size: sample(SIZES.filter((sz) => sz !== answerTile.size)),
    style: sample(STYLES.filter((st) => st !== answerTile.style)),
  });

  const allOptions = shuffle([answerTile, ...distractors]);
  const correctOptionIndex = allOptions.findIndex((opt) => opt.id === 'ans_correct');

  return {
    id: `puzzle_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    category,
    difficulty,
    questionPrompt: 'WHAT COMES NEXT?',
    ruleTitle,
    ruleExplanation,
    sequence,
    options: allOptions,
    correctOptionIndex,
    timeLimitSeconds: mode === 'RUSH' ? 12 : difficulty === 'HARD' ? 20 : 30,
  };
}
