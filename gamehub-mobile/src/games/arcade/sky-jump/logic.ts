// ============================================================
// GameHub — Sky Jump Pure Logic
// ============================================================

import type { PlatformItem, SkyJumpState } from './types';

export function getInitialSkyJumpState(): SkyJumpState {
  const initialPlatforms: PlatformItem[] = [
    { id: 1, x: 40, y: 10, width: 25 },
    { id: 2, x: 20, y: 30, width: 25 },
    { id: 3, x: 60, y: 50, width: 25 },
    { id: 4, x: 30, y: 70, width: 25 },
    { id: 5, x: 70, y: 90, width: 25 },
  ];

  return {
    playerX: 50,
    playerY: 15,
    vy: 3,
    score: 0,
    platforms: initialPlatforms,
    gameOver: false,
  };
}

export function updateSkyJumpStep(state: SkyJumpState, moveDirection: -1 | 0 | 1): SkyJumpState {
  if (state.gameOver) return state;

  // Move horizontally
  let nextX = state.playerX + moveDirection * 2.5;
  if (nextX < 0) nextX = 100;
  if (nextX > 100) nextX = 0;

  // Apply gravity
  let nextVy = state.vy - 0.25;
  let nextY = state.playerY + nextVy;

  // Check platform bounce when falling
  let bouncyVy = nextVy;
  if (nextVy < 0) {
    for (const plat of state.platforms) {
      if (
        Math.abs(nextY - plat.y) < 3 &&
        nextX >= plat.x - 5 &&
        nextX <= plat.x + plat.width + 5
      ) {
        bouncyVy = 4.5; // High bounce!
        break;
      }
    }
  }

  // Camera scroll if player moves past top half
  let nextScore = state.score;
  let nextPlatforms = state.platforms;
  if (nextY > 60) {
    const delta = nextY - 60;
    nextY = 60;
    nextScore += Math.floor(delta * 10);

    nextPlatforms = state.platforms.map((p) => ({ ...p, y: p.y - delta }));

    // Recycle fallen platforms
    nextPlatforms = nextPlatforms.map((p) => {
      if (p.y < 0) {
        return {
          id: p.id + 10,
          x: Math.floor(Math.random() * 70) + 5,
          y: 95 + Math.floor(Math.random() * 10),
          width: 25,
        };
      }
      return p;
    });
  }

  const gameOver = nextY <= 0;

  return {
    playerX: nextX,
    playerY: nextY,
    vy: bouncyVy,
    score: nextScore,
    platforms: nextPlatforms,
    gameOver,
  };
}
