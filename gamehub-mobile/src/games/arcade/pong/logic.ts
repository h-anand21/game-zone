// ============================================================
// GameHub — Pong Pure Logic
// ============================================================

import type { PongState } from './types';

export function getInitialPongState(): PongState {
  return {
    playerY: 40,
    aiY: 40,
    ballX: 50,
    ballY: 50,
    ballSpeedX: Math.random() > 0.5 ? 1.5 : -1.5,
    ballSpeedY: Math.random() > 0.5 ? 1 : -1,
    playerScore: 0,
    aiScore: 0,
    gameOver: false,
  };
}

export function updatePongStep(state: PongState, touchYPercent?: number): PongState {
  if (state.gameOver) return state;

  // 1. Move player paddle towards touch input
  let nextPlayerY = state.playerY;
  if (touchYPercent !== undefined) {
    nextPlayerY = Math.max(0, Math.min(80, touchYPercent - 10));
  }

  // 2. AI paddle tracking ball
  let nextAiY = state.aiY;
  const aiCenter = state.aiY + 10;
  if (aiCenter < state.ballY - 2) nextAiY += 1.2;
  else if (aiCenter > state.ballY + 2) nextAiY -= 1.2;
  nextAiY = Math.max(0, Math.min(80, nextAiY));

  // 3. Move ball
  let nextBallX = state.ballX + state.ballSpeedX;
  let nextBallY = state.ballY + state.ballSpeedY;
  let nextSpeedX = state.ballSpeedX;
  let nextSpeedY = state.ballSpeedY;

  // Bounce off top/bottom walls
  if (nextBallY <= 0 || nextBallY >= 100) {
    nextSpeedY = -nextSpeedY;
  }

  // Left paddle (Player) collision check
  if (nextBallX <= 6) {
    if (nextBallY >= nextPlayerY && nextBallY <= nextPlayerY + 20) {
      nextSpeedX = Math.abs(nextSpeedX) * 1.05; // speed up slightly
    } else {
      // AI scores!
      const newAiScore = state.aiScore + 1;
      const gameOver = newAiScore >= 5 || state.playerScore >= 5;
      return {
        ...state,
        aiScore: newAiScore,
        ballX: 50,
        ballY: 50,
        ballSpeedX: 1.5,
        ballSpeedY: 1,
        gameOver,
      };
    }
  }

  // Right paddle (AI) collision check
  if (nextBallX >= 94) {
    if (nextBallY >= nextAiY && nextBallY <= nextAiY + 20) {
      nextSpeedX = -Math.abs(nextSpeedX) * 1.05;
    } else {
      // Player scores!
      const newPlayerScore = state.playerScore + 1;
      const gameOver = newPlayerScore >= 5 || state.aiScore >= 5;
      return {
        ...state,
        playerScore: newPlayerScore,
        ballX: 50,
        ballY: 50,
        ballSpeedX: -1.5,
        ballSpeedY: -1,
        gameOver,
      };
    }
  }

  return {
    ...state,
    playerY: nextPlayerY,
    aiY: nextAiY,
    ballX: nextBallX,
    ballY: nextBallY,
    ballSpeedX: nextSpeedX,
    ballSpeedY: nextSpeedY,
  };
}
