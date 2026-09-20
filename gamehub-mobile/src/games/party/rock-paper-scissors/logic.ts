// ============================================================
// GameHub — Rock Paper Scissors Pure Logic
// ============================================================

import type { Choice, RPSResult } from './types';

export function getAIChoice(): Choice {
  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
}

export function playRPSRound(player: Choice, ai: Choice): RPSResult {
  if (player === ai) return { playerChoice: player, aiChoice: ai, outcome: 'DRAW' };

  if (
    (player === 'rock' && ai === 'scissors') ||
    (player === 'paper' && ai === 'rock') ||
    (player === 'scissors' && ai === 'paper')
  ) {
    return { playerChoice: player, aiChoice: ai, outcome: 'WIN' };
  }

  return { playerChoice: player, aiChoice: ai, outcome: 'LOSS' };
}
