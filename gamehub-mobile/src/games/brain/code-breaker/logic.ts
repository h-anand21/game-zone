// ============================================================
// GameHub — Code Breaker Pure Logic
// ============================================================

import type { GuessAttempt } from './types';

export function generateSecretCode(codeLength = 4): string {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const shuffled = digits.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, codeLength).join('');
}

export function evaluateGuess(secret: string, guess: string): GuessAttempt {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) {
      bulls++;
    } else if (secret.includes(guess[i])) {
      cows++;
    }
  }

  return { guess, bulls, cows };
}
