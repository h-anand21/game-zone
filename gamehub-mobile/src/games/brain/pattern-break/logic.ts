// ============================================================
// GameHub — Pattern Break Pure Logic
// ============================================================

import type { PatternQuestion } from './types';

export function generatePatternQuestion(level: number): PatternQuestion {
  const type = Math.floor(Math.random() * 3);

  if (type === 0) {
    // Arithmetic progression rule (e.g. +2, +2, +2, wrong!)
    const start = Math.floor(Math.random() * 10) + 1;
    const step = Math.floor(Math.random() * 5) + 2;
    const count = 5;

    const items: number[] = [];
    for (let i = 0; i < count; i++) {
      items.push(start + i * step);
    }

    // Pick a random breaker index (1 to 4)
    const breakerIdx = Math.floor(Math.random() * (count - 1)) + 1;
    items[breakerIdx] = items[breakerIdx] + (Math.random() > 0.5 ? 1 : -1);

    return {
      items,
      breakerIndex: breakerIdx,
      ruleExplanation: `Rule: Add ${step} each time`,
    };
  } else if (type === 1) {
    // Even/Odd rule
    const allEven = Math.random() > 0.5;
    const count = 5;
    const breakerIdx = Math.floor(Math.random() * count);

    const items: number[] = [];
    for (let i = 0; i < count; i++) {
      if (i === breakerIdx) {
        items.push(allEven ? 2 * Math.floor(Math.random() * 10) + 1 : 2 * Math.floor(Math.random() * 10));
      } else {
        items.push(allEven ? 2 * Math.floor(Math.random() * 10) : 2 * Math.floor(Math.random() * 10) + 1);
      }
    }

    return {
      items,
      breakerIndex: breakerIdx,
      ruleExplanation: allEven ? 'Rule: All numbers are Even' : 'Rule: All numbers are Odd',
    };
  } else {
    // Shape/Emoji sequence rule
    const emojiPairs = [
      ['🔴', '🔵'],
      ['⭐', '🌟'],
      ['🐱', '🐶'],
      ['🍎', '🍌'],
    ];
    const pair = emojiPairs[Math.floor(Math.random() * emojiPairs.length)];
    const count = 5;
    const breakerIdx = Math.floor(Math.random() * count);

    const items: string[] = [];
    for (let i = 0; i < count; i++) {
      if (i === breakerIdx) {
        items.push(pair[i % 2 === 0 ? 1 : 0]); // Inverted!
      } else {
        items.push(pair[i % 2]);
      }
    }

    return {
      items,
      breakerIndex: breakerIdx,
      ruleExplanation: 'Rule: Alternating sequence pattern',
    };
  }
}
