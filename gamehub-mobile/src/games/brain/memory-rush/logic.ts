// ============================================================
// GameHub — Memory Rush Pure Logic
// ============================================================

import type { MemoryCard } from './types';

const CARD_SYMBOLS = ['🚀', '🦁', '🍕', '🎮', '🎸', '⚽', '💎', '🎨'];

export function generateDeck(numPairs = 6): MemoryCard[] {
  const chosen = CARD_SYMBOLS.slice(0, numPairs);
  const deck: MemoryCard[] = [];

  let idCounter = 1;
  for (const sym of chosen) {
    deck.push({ id: idCounter++, symbol: sym, isFlipped: false, isMatched: false });
    deck.push({ id: idCounter++, symbol: sym, isFlipped: false, isMatched: false });
  }

  // Shuffle deck
  return deck.sort(() => Math.random() - 0.5);
}
