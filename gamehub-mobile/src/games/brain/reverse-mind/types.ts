// ============================================================
// GameHub — Reverse Mind Types
// ============================================================

export type SymbolItem = '🔴' | '🟦' | '⭐' | '▲' | '🍀' | '💎';

export interface ReverseMindState {
  sequence: SymbolItem[];
  playerSequence: SymbolItem[];
  level: number;
  score: number;
  isShowingPattern: boolean;
  statusText: string;
}
