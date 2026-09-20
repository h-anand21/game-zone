// ============================================================
// GameHub — Ludo Types
// ============================================================

export type LudoColor = 'red' | 'green' | 'yellow' | 'blue';

export interface LudoToken {
  id: number;
  color: LudoColor;
  position: number; // -1 = Home base, 0-51 = Track, 52-56 = Home stretch, 57 = Finished
}

export interface LudoState {
  currentPlayer: LudoColor;
  diceValue: number | null;
  tokens: Record<LudoColor, LudoToken[]>;
  isRolling: boolean;
  statusText: string;
}
