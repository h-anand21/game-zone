// ============================================================
// REVERSE MIND — Logic Engine Unit Tests
// ============================================================

import {
  generateSequence,
  applyMindShiftRule,
  reverseSequence,
  validateInput,
  calculateScore,
  calculateCombo,
  calculateAccuracy,
  getRoundConfig,
} from '../logic/reverseMindEngine';
import { GAME_OBJECTS } from '../data/objects';
import { MIND_SHIFT_RULES } from '../data/rules';
import type { GameObject, SequenceItem } from '../types';

describe('Reverse Mind Logic Engine', () => {
  const dog = GAME_OBJECTS.find((o) => o.id === 'corgi_01')!;
  const car = GAME_OBJECTS.find((o) => o.id === 'car_01')!; // red
  const star = GAME_OBJECTS.find((o) => o.id === 'star_01')!;
  const apple = GAME_OBJECTS.find((o) => o.id === 'apple_01')!; // red
  const lion = GAME_OBJECTS.find((o) => o.id === 'lion_01')!;

  test('reverseSequence properly inverts standard arrays', () => {
    const original = ['dog', 'car', 'star', 'apple', 'lion'];
    const reversed = reverseSequence(original);
    expect(reversed).toEqual(['lion', 'apple', 'star', 'car', 'dog']);
  });

  test('generateSequence produces requested length with unique elements', () => {
    const seq = generateSequence(5, GAME_OBJECTS, MIND_SHIFT_RULES.none);
    expect(seq.length).toBe(5);
    const ids = new Set(seq.map((s) => s.object.id));
    expect(ids.size).toBe(5);
  });

  test('applyMindShiftRule handles standard inversion (none)', () => {
    const sequence: SequenceItem[] = [
      { uid: '1', object: dog, originalIndex: 0, expectedReverseIndex: -1 },
      { uid: '2', object: car, originalIndex: 1, expectedReverseIndex: -1 },
      { uid: '3', object: star, originalIndex: 2, expectedReverseIndex: -1 },
      { uid: '4', object: apple, originalIndex: 3, expectedReverseIndex: -1 },
      { uid: '5', object: lion, originalIndex: 4, expectedReverseIndex: -1 },
    ];

    const target = applyMindShiftRule(sequence, MIND_SHIFT_RULES.none);
    expect(target).toEqual([lion, apple, star, car, dog]);
  });

  test('applyMindShiftRule filters red objects when rule is ignore_red', () => {
    const sequence: SequenceItem[] = [
      { uid: '1', object: dog, originalIndex: 0, expectedReverseIndex: -1 },
      { uid: '2', object: car, originalIndex: 1, expectedReverseIndex: -1 }, // red
      { uid: '3', object: star, originalIndex: 2, expectedReverseIndex: -1 },
      { uid: '4', object: apple, originalIndex: 3, expectedReverseIndex: -1 }, // red
      { uid: '5', object: lion, originalIndex: 4, expectedReverseIndex: -1 },
    ];

    // Under ignore_red: dog, star, lion remain; reversed order = [lion, star, dog]
    const target = applyMindShiftRule(sequence, MIND_SHIFT_RULES.ignore_red);
    expect(target).toEqual([lion, star, dog]);
    expect(target.some((o) => o.color === 'red')).toBe(false);
  });

  test('validateInput correctly identifies matching and completing steps', () => {
    const expectedTarget: GameObject[] = [lion, star, dog];

    // Tap 1: Lion (Correct)
    const res1 = validateInput(lion, 0, expectedTarget);
    expect(res1.isCorrect).toBe(true);
    expect(res1.isComplete).toBe(false);

    // Tap 2: Dog (Wrong, expected Star)
    const res2 = validateInput(dog, 1, expectedTarget);
    expect(res2.isCorrect).toBe(false);
    expect(res2.expectedObject?.id).toBe('star_01');

    // Tap 2 retry: Star (Correct)
    const res2Retry = validateInput(star, 1, expectedTarget);
    expect(res2Retry.isCorrect).toBe(true);
    expect(res2Retry.isComplete).toBe(false);

    // Tap 3: Dog (Correct and Completes sequence)
    const res3 = validateInput(dog, 2, expectedTarget);
    expect(res3.isCorrect).toBe(true);
    expect(res3.isComplete).toBe(true);
  });

  test('calculateScore accounts for difficulty and combo multipliers', () => {
    const easyScore = calculateScore(1, 0, 2000, 'easy');
    const hardScoreWithCombo = calculateScore(1, 5, 2000, 'hard');
    expect(hardScoreWithCombo).toBeGreaterThan(easyScore);
  });

  test('calculateAccuracy returns correct percentage', () => {
    expect(calculateAccuracy(5, 5)).toBe(100);
    expect(calculateAccuracy(4, 5)).toBe(80);
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  test('calculateCombo increments on correct and resets on wrong', () => {
    expect(calculateCombo(3, true)).toBe(4);
    expect(calculateCombo(3, false)).toBe(0);
  });

  test('getRoundConfig configures sequence length and timers appropriately', () => {
    const easy = getRoundConfig('classic', 'easy', 1);
    const hard = getRoundConfig('classic', 'hard', 1);
    expect(hard.sequenceLength).toBeGreaterThanOrEqual(easy.sequenceLength);
    expect(hard.displayDurationMs).toBeLessThan(easy.displayDurationMs);
    expect(hard.maxMistakes).toBe(0);
  });
});
