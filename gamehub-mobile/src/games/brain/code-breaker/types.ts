// ============================================================
// GameHub — Code Breaker Types
// ============================================================

export interface GuessAttempt {
  guess: string;
  bulls: number; // Correct digit in correct position
  cows: number;  // Correct digit in wrong position
}
