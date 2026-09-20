// ============================================================
// GameHub — Guess the Drawing Pure Logic
// ============================================================

const PROMPT_WORDS = ['SUN', 'HOUSE', 'CAR', 'APPLE', 'TREE', 'CAT', 'DOG', 'STAR', 'BOAT'];

export function getRandomPromptWord(): string {
  return PROMPT_WORDS[Math.floor(Math.random() * PROMPT_WORDS.length)];
}
