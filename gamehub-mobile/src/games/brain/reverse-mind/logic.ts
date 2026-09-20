// ============================================================
// GameHub — Reverse Mind Logic
// ============================================================

import type { SymbolItem } from './types';

export const SYMBOLS: SymbolItem[] = ['🔴', '🟦', '⭐', '▲', '🍀', '💎'];

export function generateSequence(length: number): SymbolItem[] {
  const seq: SymbolItem[] = [];
  for (let i = 0; i < length; i++) {
    seq.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }
  return seq;
}

export function isReverseMatch(sequence: SymbolItem[], playerSequence: SymbolItem[]): boolean {
  if (sequence.length !== playerSequence.length) return false;
  const reversed = [...sequence].reverse();
  return reversed.every((sym, idx) => sym === playerSequence[idx]);
}
