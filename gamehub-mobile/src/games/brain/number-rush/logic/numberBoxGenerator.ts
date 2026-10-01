// ============================================================
// Number Rush — Number Box Matrix Puzzle Generator
// ============================================================

import type { Difficulty, NumberBoxCell, QuestionData } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateNumberBoxQuestion(
  difficulty: Difficulty,
  roundNumber = 1
): QuestionData {
  let timeLimit = 15;
  if (difficulty === 'medium') timeLimit = 13;
  if (difficulty === 'hard') timeLimit = 10;

  const patterns = ['row-sum', 'row-add', 'sequence'];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  const matrix: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  let ruleDesc = '';

  if (pattern === 'row-add') {
    // Each row: col0 + col1 = col2
    ruleDesc = 'Find the missing number: Left + Middle = Right';
    for (let r = 0; r < 3; r++) {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      matrix[r][0] = a;
      matrix[r][1] = b;
      matrix[r][2] = a + b;
    }
  } else if (pattern === 'sequence') {
    // Each row steps by a constant delta k
    const k = Math.floor(Math.random() * 4) + 2;
    ruleDesc = `Find the pattern: Each row increases by ${k}`;
    for (let r = 0; r < 3; r++) {
      const start = Math.floor(Math.random() * 6) + (r * 3 + 1);
      matrix[r][0] = start;
      matrix[r][1] = start + k;
      matrix[r][2] = start + 2 * k;
    }
  } else {
    // row-sum: Each row sums to target S
    const S = difficulty === 'hard' ? 24 : 18;
    ruleDesc = `Find the missing number: Each row sums to ${S}`;
    for (let r = 0; r < 3; r++) {
      const a = Math.floor(Math.random() * 5) + 3;
      const b = Math.floor(Math.random() * 5) + 3;
      matrix[r][0] = a;
      matrix[r][1] = b;
      matrix[r][2] = S - (a + b);
    }
  }

  // Choose a random cell to hide as "?"
  // Usually row 1 col 1 or row 2 col 2 or row 1 col 2
  const targetRow = Math.floor(Math.random() * 2) + 1; // row 1 or 2
  const targetCol = Math.floor(Math.random() * 3);
  const correctAnswer = matrix[targetRow][targetCol];

  // Build grid representation
  const gridCells: NumberBoxCell[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const isTarget = r === targetRow && c === targetCol;
      gridCells.push({
        row: r,
        col: c,
        val: isTarget ? null : matrix[r][c],
        isTarget,
      });
    }
  }

  // Generate 4 plausible choices
  const optionSet = new Set<number>();
  optionSet.add(correctAnswer);

  const deltas = [-1, 1, -2, 2, -3, 3, -4, 4];
  for (const d of deltas) {
    if (optionSet.size >= 4) break;
    const val = correctAnswer + d;
    if (val >= 1 && val !== correctAnswer) {
      optionSet.add(val);
    }
  }

  while (optionSet.size < 4) {
    optionSet.add(correctAnswer + optionSet.size);
  }

  const options = shuffle(Array.from(optionSet));
  const isSpecialRound = roundNumber > 3 && Math.random() < 0.25;

  return {
    id: `nb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    mode: 'number-box',
    questionText: 'What number replaces the "?"?',
    badgeText: '🧩 Number Box',
    options,
    correctAnswer,
    timeLimit,
    isSpecialRound,
    specialRoundMultiplier: isSpecialRound ? 2 : 1,
    numberBoxData: {
      grid: gridCells,
      size: 3,
      ruleDescription: ruleDesc,
    },
  };
}
