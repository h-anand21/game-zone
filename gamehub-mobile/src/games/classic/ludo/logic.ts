// ============================================================
// GameHub — Ludo Pure Logic
// ============================================================

import type { LudoColor, LudoToken, LudoState } from './types';

export function getInitialLudoState(): LudoState {
  const createTokens = (color: LudoColor): LudoToken[] => [
    { id: 1, color, position: -1 },
    { id: 2, color, position: -1 },
    { id: 3, color, position: -1 },
    { id: 4, color, position: -1 },
  ];

  return {
    currentPlayer: 'red',
    diceValue: null,
    tokens: {
      red: createTokens('red'),
      green: createTokens('green'),
      yellow: createTokens('yellow'),
      blue: createTokens('blue'),
    },
    isRolling: false,
    statusText: 'Roll the dice to start!',
  };
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function canMoveToken(token: LudoToken, dice: number): boolean {
  if (token.position === -1) {
    return dice === 6; // Needs 6 to leave home
  }
  if (token.position === 57) return false; // Already finished
  return token.position + dice <= 57;
}
