// ============================================================
// GameHub — Number Rush Pure Logic
// ============================================================

import type { MathQuestion, Operator } from './types';

export function generateQuestion(score: number): MathQuestion {
  const operators: Operator[] = score < 5 ? ['+', '-'] : score < 12 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
  const op = operators[Math.floor(Math.random() * operators.length)];

  let num1 = 1;
  let num2 = 1;
  let answer = 2;

  const maxVal = Math.min(50, 10 + score * 2);

  switch (op) {
    case '+':
      num1 = Math.floor(Math.random() * maxVal) + 1;
      num2 = Math.floor(Math.random() * maxVal) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * maxVal) + 5;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      answer = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 * num2;
      break;
    case '÷':
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = Math.floor(Math.random() * 10) + 1;
      num1 = num2 * answer;
      break;
  }

  // Generate 3 unique distractor options
  const distractorSet = new Set<number>([answer]);
  while (distractorSet.size < 4) {
    const offset = (Math.floor(Math.random() * 10) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const candidate = answer + offset;
    if (candidate >= 0 && candidate !== answer) {
      distractorSet.add(candidate);
    }
  }

  const options = Array.from(distractorSet).sort(() => Math.random() - 0.5);

  return {
    num1,
    num2,
    operator: op,
    answer,
    options,
  };
}
