// ============================================================
// Number Rush — Quick Rush (Mental Math & Series) Generator
// ============================================================

import type { Difficulty, QuestionData } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateQuickRushQuestion(
  difficulty: Difficulty,
  roundNumber = 1
): QuestionData {
  let timeLimit = 10;
  if (difficulty === 'medium') timeLimit = 8;
  if (difficulty === 'hard') timeLimit = 6;

  const challengeTypes = ['add', 'sub', 'mul', 'div', 'series'];
  const type =
    challengeTypes[Math.floor(Math.random() * challengeTypes.length)];

  let questionText = '';
  let expression = '';
  let correctAnswer = 0;
  let badgeText = '⚡ Math Rush';

  if (type === 'add') {
    let a = Math.floor(Math.random() * 20) + 5;
    let b = Math.floor(Math.random() * 20) + 5;
    if (difficulty === 'medium') {
      a = Math.floor(Math.random() * 50) + 15;
      b = Math.floor(Math.random() * 50) + 15;
    } else if (difficulty === 'hard') {
      a = Math.floor(Math.random() * 80) + 25;
      b = Math.floor(Math.random() * 80) + 25;
    }
    correctAnswer = a + b;
    expression = `${a} + ${b}`;
    questionText = `${expression} = ?`;
    badgeText = '➕ Addition';
  } else if (type === 'sub') {
    let a = Math.floor(Math.random() * 30) + 10;
    let b = Math.floor(Math.random() * a) + 2;
    if (difficulty === 'medium') {
      a = Math.floor(Math.random() * 80) + 30;
      b = Math.floor(Math.random() * (a - 10)) + 10;
    } else if (difficulty === 'hard') {
      a = Math.floor(Math.random() * 150) + 50;
      b = Math.floor(Math.random() * (a - 20)) + 20;
    }
    correctAnswer = a - b;
    expression = `${a} - ${b}`;
    questionText = `${expression} = ?`;
    badgeText = '➖ Subtraction';
  } else if (type === 'mul') {
    let a = Math.floor(Math.random() * 8) + 2;
    let b = Math.floor(Math.random() * 9) + 2;
    if (difficulty === 'medium') {
      a = Math.floor(Math.random() * 10) + 4;
      b = Math.floor(Math.random() * 12) + 3;
    } else if (difficulty === 'hard') {
      a = Math.floor(Math.random() * 15) + 6;
      b = Math.floor(Math.random() * 14) + 4;
    }
    correctAnswer = a * b;
    expression = `${a} × ${b}`;
    questionText = `${expression} = ?`;
    badgeText = '✖️ Multiply';
  } else if (type === 'div') {
    const divisor = Math.floor(Math.random() * 7) + 2;
    const quotient =
      difficulty === 'easy'
        ? Math.floor(Math.random() * 8) + 2
        : Math.floor(Math.random() * 12) + 3;
    const dividend = divisor * quotient;
    correctAnswer = quotient;
    expression = `${dividend} ÷ ${divisor}`;
    questionText = `${expression} = ?`;
    badgeText = '➗ Division';
  } else {
    // Number Series: e.g. 2 → 4 → 8 → ? or 3 → 7 → 11 → ?
    const isGeometric = Math.random() > 0.6;
    if (isGeometric) {
      const base = Math.floor(Math.random() * 3) + 2;
      const ratio = 2;
      const s1 = base;
      const s2 = base * ratio;
      const s3 = s2 * ratio;
      correctAnswer = s3 * ratio;
      expression = `${s1} → ${s2} → ${s3} → ?`;
    } else {
      const start = Math.floor(Math.random() * 10) + 1;
      const step = Math.floor(Math.random() * 6) + 2;
      const s1 = start;
      const s2 = start + step;
      const s3 = s2 + step;
      correctAnswer = s3 + step;
      expression = `${s1} → ${s2} → ${s3} → ?`;
    }
    questionText = `What comes next?\n${expression}`;
    badgeText = '🔢 Number Series';
  }

  // Generate 4 plausible options
  const optionSet = new Set<number>();
  optionSet.add(correctAnswer);

  const deltas = [-1, 1, -2, 2, -10, 10, -5, 5];
  for (const d of deltas) {
    if (optionSet.size >= 4) break;
    const val = correctAnswer + d;
    if (val >= 1 && val !== correctAnswer) {
      optionSet.add(val);
    }
  }

  while (optionSet.size < 4) {
    optionSet.add(correctAnswer + optionSet.size * 2);
  }

  const options = shuffle(Array.from(optionSet));
  const isSpecialRound = roundNumber > 3 && Math.random() < 0.25;

  return {
    id: `qr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    mode: 'quick-rush',
    questionText,
    badgeText,
    options,
    correctAnswer,
    timeLimit,
    isSpecialRound,
    specialRoundMultiplier: isSpecialRound ? 2 : 1,
    quickRushData: {
      expression,
      hint: `Notice the pattern in ${expression}`,
    },
  };
}
