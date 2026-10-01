// ============================================================
// Number Rush — Animal Count Challenge Generator
// ============================================================

import type { AnimalItem, AnimalType, Difficulty, QuestionData } from '../types';

const ANIMAL_TYPES: AnimalType[] = [
  'tiger',
  'lion',
  'monkey',
  'elephant',
  'giraffe',
  'zebra',
];

const ANIMAL_NAMES: Record<AnimalType, { single: string; plural: string; emoji: string }> = {
  tiger: { single: 'Tiger', plural: 'Tigers', emoji: '🐯' },
  lion: { single: 'Lion', plural: 'Lions', emoji: '🦁' },
  monkey: { single: 'Monkey', plural: 'Monkeys', emoji: '🐒' },
  elephant: { single: 'Elephant', plural: 'Elephants', emoji: '🐘' },
  giraffe: { single: 'Giraffe', plural: 'Giraffes', emoji: '🦒' },
  zebra: { single: 'Zebra', plural: 'Zebras', emoji: '🦓' },
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateAnimalCountQuestion(
  difficulty: Difficulty,
  roundNumber = 1
): QuestionData {
  const isSpecialRound = roundNumber > 3 && Math.random() < 0.25;

  let totalMin = 4;
  let totalMax = 6;
  let targetMin = 2;
  let targetMax = 4;
  let timeLimit = 14;

  if (difficulty === 'medium') {
    totalMin = 7;
    totalMax = 10;
    targetMin = 3;
    targetMax = 6;
    timeLimit = 12;
  } else if (difficulty === 'hard') {
    totalMin = 11;
    totalMax = 15;
    targetMin = 4;
    targetMax = 8;
    timeLimit = 10;
  }

  const targetAnimal: AnimalType = isSpecialRound
    ? 'lion'
    : ANIMAL_TYPES[Math.floor(Math.random() * ANIMAL_TYPES.length)];

  const targetCount =
    Math.floor(Math.random() * (targetMax - targetMin + 1)) + targetMin;
  const otherCount =
    Math.floor(Math.random() * (totalMax - totalMin + 1)) +
    (totalMin - targetMin);

  const otherTypes = ANIMAL_TYPES.filter((t) => t !== targetAnimal);

  const animalList: AnimalItem[] = [];

  // Helper to ensure spread across scene
  const positions: { x: number; y: number }[] = [];
  const getSafePosition = () => {
    let attempts = 0;
    while (attempts < 40) {
      attempts++;
      const x = 8 + Math.floor(Math.random() * 74); // 8% to 82%
      const y = 14 + Math.floor(Math.random() * 62); // 14% to 76%
      const tooClose = positions.some(
        (p) => Math.hypot(p.x - x, p.y - y) < 14
      );
      if (!tooClose || attempts > 30) {
        positions.push({ x, y });
        return { x, y };
      }
    }
    const fallbackX = 10 + Math.floor(Math.random() * 70);
    const fallbackY = 15 + Math.floor(Math.random() * 60);
    return { x: fallbackX, y: fallbackY };
  };

  // Add target animals
  for (let i = 0; i < targetCount; i++) {
    const pos = getSafePosition();
    animalList.push({
      id: `target_${i}_${Date.now()}_${Math.random()}`,
      type: targetAnimal,
      xPercent: pos.x,
      yPercent: pos.y,
      scale: 0.9 + Math.random() * 0.25,
      flipHorizontal: Math.random() > 0.5,
      isTarget: true,
    });
  }

  // Add distractor animals
  for (let i = 0; i < otherCount; i++) {
    const distractorType =
      otherTypes[Math.floor(Math.random() * otherTypes.length)];
    const pos = getSafePosition();
    animalList.push({
      id: `distractor_${i}_${Date.now()}_${Math.random()}`,
      type: distractorType,
      xPercent: pos.x,
      yPercent: pos.y,
      scale: 0.85 + Math.random() * 0.25,
      flipHorizontal: Math.random() > 0.5,
      isTarget: false,
    });
  }

  const shuffledAnimals = shuffle(animalList);

  // Generate 4 distinct options around targetCount
  const optionSet = new Set<number>();
  optionSet.add(targetCount);

  const offsets = [-2, -1, 1, 2, 3, -3];
  for (const offset of offsets) {
    if (optionSet.size >= 4) break;
    const val = targetCount + offset;
    if (val >= 1 && val <= targetCount + 5) {
      optionSet.add(val);
    }
  }

  while (optionSet.size < 4) {
    optionSet.add(targetCount + optionSet.size);
  }

  const options = shuffle(Array.from(optionSet));
  const animalMeta = ANIMAL_NAMES[targetAnimal];

  return {
    id: `ac_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    mode: 'animal-count',
    questionText: `How many ${targetCount === 1 ? animalMeta.single : animalMeta.plural}?`,
    badgeText: `${animalMeta.emoji} ${animalMeta.single}`,
    options,
    correctAnswer: targetCount,
    timeLimit,
    isSpecialRound,
    specialRoundMultiplier: isSpecialRound ? 2 : 1,
    animalData: {
      targetAnimal,
      animals: shuffledAnimals,
      targetCount,
    },
  };
}
