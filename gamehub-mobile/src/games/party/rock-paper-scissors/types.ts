// ============================================================
// GameHub — Rock Paper Scissors Types
// ============================================================

export type Choice = 'rock' | 'paper' | 'scissors';

export interface RPSResult {
  playerChoice: Choice;
  aiChoice: Choice;
  outcome: 'WIN' | 'LOSS' | 'DRAW';
}
