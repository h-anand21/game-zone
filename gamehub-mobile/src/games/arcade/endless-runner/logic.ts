// ============================================================
// GameHub — Endless Runner Pure Logic
// ============================================================

import type { Lane, RunnerObstacle, RunnerState } from './types';

export function getInitialRunnerState(): RunnerState {
  return {
    playerLane: 1, // Center lane
    score: 0,
    coinsCollected: 0,
    obstacles: [
      { id: 1, lane: 0, y: -20, type: 'obstacle' },
      { id: 2, lane: 2, y: -60, type: 'coin' },
    ],
    gameOver: false,
  };
}

export function updateRunnerStep(state: RunnerState): RunnerState {
  if (state.gameOver) return state;

  const speed = 2 + Math.min(5, Math.floor(state.score / 200));
  let nextScore = state.score + 1;
  let nextCoins = state.coinsCollected;
  let gameOver = false;

  const nextObstacles: RunnerObstacle[] = [];

  for (const obs of state.obstacles) {
    const nextY = obs.y + speed;

    // Check collision with player at y: 80-90%
    if (nextY >= 75 && nextY <= 90 && obs.lane === state.playerLane) {
      if (obs.type === 'obstacle') {
        gameOver = true;
      } else if (obs.type === 'coin') {
        nextCoins += 1;
        nextScore += 50;
        continue; // Coin collected!
      }
    }

    if (nextY < 105) {
      nextObstacles.push({ ...obs, y: nextY });
    }
  }

  // Spawn new items at top
  if (Math.random() < 0.08) {
    const lane = Math.floor(Math.random() * 3) as Lane;
    const isCoin = Math.random() > 0.6;
    nextObstacles.push({
      id: Date.now() + Math.random(),
      lane,
      y: -10,
      type: isCoin ? 'coin' : 'obstacle',
    });
  }

  return {
    playerLane: state.playerLane,
    score: nextScore,
    coinsCollected: nextCoins,
    obstacles: nextObstacles,
    gameOver,
  };
}
