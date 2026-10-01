// ============================================================
// REVERSE MIND — Core Deterministic Game Logic Engine
// ============================================================

import { GAME_OBJECTS } from '../data/objects';
import { MIND_SHIFT_RULES } from '../data/rules';
import type {
  GameObject,
  SequenceItem,
  GameDifficulty,
  GameMode,
  MindShiftRule,
  RoundConfig,
} from '../types';

/**
 * Calculates round configuration based on difficulty, round index, and active mode
 */
export function getRoundConfig(
  mode: GameMode,
  difficulty: GameDifficulty,
  round: number
): RoundConfig {
  let sequenceLength = 3;
  let displayDurationMs = 3000;
  let inputTimeoutMs = 15000;
  let maxMistakes = 2;
  let gridDecoyCount = 6;
  let mindShiftRule: MindShiftRule = MIND_SHIFT_RULES.none;

  if (difficulty === 'easy') {
    sequenceLength = Math.min(3 + Math.floor(round / 3), 5); // 3 to 5
    displayDurationMs = Math.max(3500 - round * 100, 2500);
    maxMistakes = 2;
    gridDecoyCount = 5;
  } else if (difficulty === 'medium') {
    sequenceLength = Math.min(4 + Math.floor(round / 2), 6); // 4 to 6
    displayDurationMs = Math.max(2500 - round * 120, 1800);
    maxMistakes = 1;
    gridDecoyCount = 6;
  } else {
    // Hard
    sequenceLength = Math.min(5 + Math.floor(round / 2), 8); // 5 to 8
    displayDurationMs = Math.max(1800 - round * 100, 1000);
    maxMistakes = 0;
    gridDecoyCount = 7;
  }

  // Quick Flip accelerates timings
  if (mode === 'quick-flip') {
    displayDurationMs = Math.floor(displayDurationMs * 0.65);
    inputTimeoutMs = 8000;
  }

  // Mind Shift mode activates dynamic rules
  if (mode === 'mind-shift') {
    if (round >= 2 && round % 2 === 0) {
      mindShiftRule = MIND_SHIFT_RULES.ignore_red;
    } else if (round >= 5) {
      mindShiftRule = MIND_SHIFT_RULES.ignore_category;
    }
  }

  if (mode === 'daily-flip') {
    mindShiftRule = MIND_SHIFT_RULES.ignore_red;
    sequenceLength = Math.min(4 + Math.floor(round / 2), 7);
  }

  return {
    sequenceLength,
    displayDurationMs,
    inputTimeoutMs,
    maxMistakes,
    gridDecoyCount,
    mindShiftRule,
  };
}

/**
 * Generates an array of visual objects for the memory sequence
 */
export function generateSequence(
  length: number,
  pool: GameObject[] = GAME_OBJECTS,
  rule: MindShiftRule = MIND_SHIFT_RULES.none
): SequenceItem[] {
  // If rule requires red objects to ignore, guarantee at least 1 red object is included
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  let selected: GameObject[] = [];
  if (rule.id === 'ignore_red') {
    const redItems = shuffled.filter((item) => item.color === 'red');
    const nonRedItems = shuffled.filter((item) => item.color !== 'red');
    
    // Pick 1 or 2 red items, rest non-red
    const redCount = Math.min(redItems.length, Math.floor(length / 2) || 1);
    const redSample = redItems.slice(0, redCount);
    const nonRedSample = nonRedItems.slice(0, length - redCount);
    selected = [...redSample, ...nonRedSample].sort(() => Math.random() - 0.5);
  } else {
    selected = shuffled.slice(0, length);
  }

  return selected.map((obj, index) => ({
    uid: `${obj.id}_${index}_${Date.now()}`,
    object: obj,
    originalIndex: index,
    expectedReverseIndex: -1, // Calculated by applyMindShiftRule
    isHighlighted: index === 0 || index === length - 1,
  }));
}

/**
 * Applies the current Mind Shift rule to determine the exact target expected reverse sequence
 */
export function applyMindShiftRule(
  sequence: SequenceItem[],
  rule: MindShiftRule
): GameObject[] {
  // 1. Filter out objects forbidden by active rule
  let validItems = [...sequence];

  if (rule.id === 'ignore_red') {
    validItems = validItems.filter((item) => item.object.color !== 'red');
  } else if (rule.id === 'ignore_category' && rule.ignoredCategory) {
    validItems = validItems.filter((item) => item.object.category !== rule.ignoredCategory);
  } else if (rule.id === 'reverse_only_highlighted') {
    validItems = validItems.filter((item) => item.isHighlighted);
  }

  // 2. Invert the remaining sequence order
  const reversed = [...validItems].reverse().map((item) => item.object);
  return reversed;
}

/**
 * Reverses a basic array of objects
 */
export function reverseSequence<T>(seq: T[]): T[] {
  return [...seq].reverse();
}

/**
 * Generates interactive keypad grid options containing all required target items + distinct decoys
 */
export function generateGridOptions(
  targetObjects: GameObject[],
  decoyCount: number,
  pool: GameObject[] = GAME_OBJECTS
): GameObject[] {
  const targetIds = new Set(targetObjects.map((o) => o.id));
  const availableDecoys = pool.filter((o) => !targetIds.has(o.id));
  const shuffledDecoys = [...availableDecoys].sort(() => Math.random() - 0.5).slice(0, decoyCount);

  // Combine target items + decoys and shuffle
  const combined = [...targetObjects, ...shuffledDecoys];
  return combined.sort(() => Math.random() - 0.5);
}

/**
 * Validates the player's next tapped object against the expected target sequence
 */
export function validateInput(
  tappedObject: GameObject,
  currentIndex: number,
  expectedTarget: GameObject[]
): {
  isCorrect: boolean;
  isComplete: boolean;
  expectedObject: GameObject | undefined;
} {
  const expectedObject = expectedTarget[currentIndex];
  if (!expectedObject) {
    return { isCorrect: false, isComplete: false, expectedObject: undefined };
  }

  const isCorrect = tappedObject.id === expectedObject.id;
  const isComplete = isCorrect && currentIndex === expectedTarget.length - 1;

  return { isCorrect, isComplete, expectedObject };
}

/**
 * Calculates score based on round, combo streak, and response time
 */
export function calculateScore(
  round: number,
  combo: number,
  timeTakenMs: number,
  difficulty: GameDifficulty
): number {
  const basePoints = 100 * round;
  const comboMultiplier = 1 + Math.min(combo * 0.15, 2.5); // max 2.5x multiplier
  const speedBonus = Math.max(0, Math.floor((10000 - timeTakenMs) / 100)); // faster = more points
  const diffMultiplier = difficulty === 'hard' ? 1.5 : difficulty === 'medium' ? 1.2 : 1.0;

  return Math.round((basePoints + speedBonus) * comboMultiplier * diffMultiplier);
}

/**
 * Calculates combo increment
 */
export function calculateCombo(currentCombo: number, isCorrect: boolean): number {
  return isCorrect ? currentCombo + 1 : 0;
}

/**
 * Calculates player XP earned
 */
export function calculateXP(score: number, perfectRound: boolean): number {
  const baseXP = Math.floor(score / 20);
  return perfectRound ? baseXP + 50 : baseXP;
}

/**
 * Calculates coin and gem rewards upon level completion
 */
export function calculateRewards(score: number, accuracy: number, maxCombo: number) {
  const baseCoins = Math.floor(score / 15);
  const bonusCoins = accuracy >= 100 ? 50 : accuracy >= 80 ? 25 : 10;
  const gems = maxCombo >= 5 ? 3 : maxCombo >= 3 ? 1 : 0;

  return {
    coins: baseCoins + bonusCoins,
    gems,
    boosterUnlocked: accuracy === 100 && maxCombo >= 6,
  };
}

/**
 * Calculates round/game accuracy percentage
 */
export function calculateAccuracy(correctTaps: number, totalTaps: number): number {
  if (totalTaps <= 0) return 100;
  return Math.min(100, Math.round((correctTaps / totalTaps) * 100));
}
