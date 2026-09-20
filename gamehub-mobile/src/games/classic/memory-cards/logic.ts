// ============================================================
// GameHub — Memory Cards Pure Logic
// ============================================================

import type { ClassicCardItem } from './types';

const SYMBOLS = ['👑', '🏰', '🛡️', '⚔️', '🏹', '🔮', '📜', '⚜️'];

export function generateClassicDeck(pairsCount = 8): ClassicCardItem[] {
  const chosen = SYMBOLS.slice(0, pairsCount);
  const deck: ClassicCardItem[] = [];

  let id = 1;
  for (const s of chosen) {
    deck.push({ id: id++, symbol: s, isFlipped: false, isMatched: false });
    deck.push({ id: id++, symbol: s, isFlipped: false, isMatched: false });
  }

  return deck.sort(() => Math.random() - 0.5);
}
