// ============================================================
// GameHub — Air Hockey Pure Logic
// ============================================================

import type { AirHockeyState } from './types';

export function getInitialAirHockeyState(): AirHockeyState {
  return {
    playerX: 50,
    playerY: 80,
    aiX: 50,
    aiY: 15,
    puckX: 50,
    puckY: 50,
    puckVx: 0,
    puckVy: 1.5,
    playerScore: 0,
    aiScore: 0,
    gameOver: false,
  };
}

export function updateAirHockeyStep(state: AirHockeyState, targetX?: number, targetY?: number): AirHockeyState {
  if (state.gameOver) return state;

  // Move player paddle towards touch target
  let nextPlayerX = state.playerX;
  let nextPlayerY = state.playerY;
  if (targetX !== undefined && targetY !== undefined) {
    nextPlayerX = Math.max(10, Math.min(90, targetX));
    nextPlayerY = Math.max(55, Math.min(92, targetY));
  }

  // AI Paddle tracking puck
  let nextAiX = state.aiX;
  if (state.puckX > nextAiX + 2) nextAiX += 1.5;
  else if (state.puckX < nextAiX - 2) nextAiX -= 1.5;
  nextAiX = Math.max(10, Math.min(90, nextAiX));

  // Move puck
  let nextPuckX = state.puckX + state.puckVx;
  let nextPuckY = state.puckY + state.puckVy;
  let nextVx = state.puckVx * 0.98;
  let nextVy = state.puckVy * 0.98;

  // Side Wall Bounces
  if (nextPuckX <= 5 || nextPuckX >= 95) {
    nextVx = -nextVx;
  }

  // Goal Collision (Top / Bottom)
  if (nextPuckY <= 5) {
    if (nextPuckX >= 30 && nextPuckX <= 70) {
      // Player Goal!
      const newPlayerScore = state.playerScore + 1;
      return {
        ...state,
        playerScore: newPlayerScore,
        puckX: 50,
        puckY: 50,
        puckVx: 0,
        puckVy: -1.5,
        gameOver: newPlayerScore >= 7,
      };
    } else {
      nextVy = -nextVy;
    }
  }

  if (nextPuckY >= 95) {
    if (nextPuckX >= 30 && nextPuckX <= 70) {
      // AI Goal!
      const newAiScore = state.aiScore + 1;
      return {
        ...state,
        aiScore: newAiScore,
        puckX: 50,
        puckY: 50,
        puckVx: 0,
        puckVy: 1.5,
        gameOver: newAiScore >= 7,
      };
    } else {
      nextVy = -nextVy;
    }
  }

  // Paddle Collision (Player)
  const distPlayer = Math.hypot(nextPuckX - nextPlayerX, nextPuckY - nextPlayerY);
  if (distPlayer < 10) {
    nextVx = (nextPuckX - nextPlayerX) * 0.4;
    nextVy = -Math.abs((nextPuckY - nextPlayerY) * 0.4) - 1.5;
  }

  // Paddle Collision (AI)
  const distAi = Math.hypot(nextPuckX - nextAiX, nextPuckY - state.aiY);
  if (distAi < 10) {
    nextVx = (nextPuckX - nextAiX) * 0.4;
    nextVy = Math.abs((nextPuckY - state.aiY) * 0.4) + 1.5;
  }

  return {
    ...state,
    playerX: nextPlayerX,
    playerY: nextPlayerY,
    aiX: nextAiX,
    puckX: nextPuckX,
    puckY: nextPuckY,
    puckVx: nextVx,
    puckVy: nextVy,
  };
}
