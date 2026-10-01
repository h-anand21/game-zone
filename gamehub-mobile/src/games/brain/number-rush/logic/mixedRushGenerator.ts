// ============================================================
// Number Rush — Mixed Rush (Signature Mode) Challenge Generator
// ============================================================

import type { Difficulty, QuestionData } from '../types';
import { generateAnimalCountQuestion } from './animalCountGenerator';
import { generateEmojiCountQuestion } from './emojiCountGenerator';
import { generateQuickRushQuestion } from './quickRushGenerator';
import { generateNumberBoxQuestion } from './numberBoxGenerator';

export function generateMixedRushQuestion(
  difficulty: Difficulty,
  roundNumber = 1
): QuestionData {
  const modes = ['animal-count', 'emoji-count', 'quick-rush', 'number-box'];
  const chosenMode = modes[Math.floor(Math.random() * modes.length)];

  let q: QuestionData;
  if (chosenMode === 'animal-count') {
    q = generateAnimalCountQuestion(difficulty, roundNumber);
  } else if (chosenMode === 'emoji-count') {
    q = generateEmojiCountQuestion(difficulty, roundNumber);
  } else if (chosenMode === 'number-box') {
    q = generateNumberBoxQuestion(difficulty, roundNumber);
  } else {
    q = generateQuickRushQuestion(difficulty, roundNumber);
  }

  return {
    ...q,
    badgeText: `🔀 Mixed Rush • Round ${roundNumber}`,
  };
}

export function generateQuestionForMode(
  mode: string,
  difficulty: Difficulty,
  roundNumber = 1
): QuestionData {
  switch (mode) {
    case 'animal-count':
      return generateAnimalCountQuestion(difficulty, roundNumber);
    case 'emoji-count':
      return generateEmojiCountQuestion(difficulty, roundNumber);
    case 'number-box':
      return generateNumberBoxQuestion(difficulty, roundNumber);
    case 'quick-rush':
      return generateQuickRushQuestion(difficulty, roundNumber);
    case 'mixed-rush':
    default:
      return generateMixedRushQuestion(difficulty, roundNumber);
  }
}
