// ============================================================
// Number Rush — Emoji Count Challenge Generator
// ============================================================

import type { Difficulty, EmojiGridItem, QuestionData } from '../types';

interface EmojiDef {
  char: string;
  name: string;
}

const EMOJI_POOL: EmojiDef[] = [
  { char: '😎', name: 'Cool Faces' },
  { char: '🔥', name: 'Flames' },
  { char: '🚀', name: 'Rockets' },
  { char: '⭐', name: 'Stars' },
  { char: '💎', name: 'Gems' },
  { char: '🍕', name: 'Pizzas' },
  { char: '🎈', name: 'Balloons' },
  { char: '💖', name: 'Hearts' },
  { char: '🎮', name: 'Controllers' },
  { char: '⚡', name: 'Lightning' },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateEmojiCountQuestion(
  difficulty: Difficulty,
  roundNumber = 1
): QuestionData {
  let totalItems = 12;
  let targetMin = 3;
  let targetMax = 5;
  let timeLimit = 12;
  let gridCols = 4;

  if (difficulty === 'medium') {
    totalItems = 16;
    targetMin = 4;
    targetMax = 7;
    timeLimit = 10;
    gridCols = 4;
  } else if (difficulty === 'hard') {
    totalItems = 20;
    targetMin = 5;
    targetMax = 9;
    timeLimit = 9;
    gridCols = 5;
  }

  const shuffledPool = shuffle(EMOJI_POOL);
  const targetEmoji = shuffledPool[0];
  const distractors = shuffledPool.slice(1, 4);

  const targetCount =
    Math.floor(Math.random() * (targetMax - targetMin + 1)) + targetMin;
  const distractorCount = totalItems - targetCount;

  const items: EmojiGridItem[] = [];

  for (let i = 0; i < targetCount; i++) {
    items.push({
      id: `target_em_${i}_${Date.now()}_${Math.random()}`,
      char: targetEmoji.char,
      name: targetEmoji.name,
      isTarget: true,
    });
  }

  for (let i = 0; i < distractorCount; i++) {
    const d = distractors[Math.floor(Math.random() * distractors.length)];
    items.push({
      id: `dist_em_${i}_${Date.now()}_${Math.random()}`,
      char: d.char,
      name: d.name,
      isTarget: false,
    });
  }

  const shuffledGrid = shuffle(items);

  // Generate 4 distinct options around targetCount
  const optionSet = new Set<number>();
  optionSet.add(targetCount);

  const offsets = [-2, -1, 1, 2, 3, -3];
  for (const offset of offsets) {
    if (optionSet.size >= 4) break;
    const val = targetCount + offset;
    if (val >= 1 && val <= targetCount + 6) {
      optionSet.add(val);
    }
  }

  while (optionSet.size < 4) {
    optionSet.add(targetCount + optionSet.size);
  }

  const options = shuffle(Array.from(optionSet));
  const isSpecialRound = roundNumber > 4 && Math.random() < 0.2;

  return {
    id: `ec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    mode: 'emoji-count',
    questionText: `How many ${targetEmoji.char} ${targetEmoji.name}?`,
    badgeText: `${targetEmoji.char} Count`,
    options,
    correctAnswer: targetCount,
    timeLimit,
    isSpecialRound,
    specialRoundMultiplier: isSpecialRound ? 2 : 1,
    emojiData: {
      targetChar: targetEmoji.char,
      targetName: targetEmoji.name,
      items: shuffledGrid,
      gridCols,
      targetCount,
    },
  };
}
