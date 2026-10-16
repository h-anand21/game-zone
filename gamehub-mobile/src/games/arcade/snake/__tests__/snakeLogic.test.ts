// ============================================================
// GameHub — Snake Logic Unit Tests
// Tests edge wrap-around and self-collision game over
// ============================================================

import { moveSnake, getInitialState } from '../logic';
import type { SnakeState } from '../types';

describe('Snake Logic — Edge Wrap & Self Collision', () => {
  it('wraps around right wall to left edge without dying', () => {
    const state: SnakeState = {
      snake: [
        { x: 14, y: 5 },
        { x: 13, y: 5 },
        { x: 12, y: 5 },
      ],
      food: { x: 0, y: 0 },
      direction: 'RIGHT',
      score: 0,
      gameOver: false,
      gridSize: 15,
    };

    const next = moveSnake(state, 'RIGHT');
    expect(next.gameOver).toBe(false);
    expect(next.snake[0]).toEqual({ x: 0, y: 5 });
  });

  it('wraps around left wall to right edge without dying', () => {
    const state: SnakeState = {
      snake: [
        { x: 0, y: 5 },
        { x: 1, y: 5 },
        { x: 2, y: 5 },
      ],
      food: { x: 7, y: 7 },
      direction: 'LEFT',
      score: 0,
      gameOver: false,
      gridSize: 15,
    };

    const next = moveSnake(state, 'LEFT');
    expect(next.gameOver).toBe(false);
    expect(next.snake[0]).toEqual({ x: 14, y: 5 });
  });

  it('wraps around top wall to bottom edge without dying', () => {
    const state: SnakeState = {
      snake: [
        { x: 5, y: 0 },
        { x: 5, y: 1 },
        { x: 5, y: 2 },
      ],
      food: { x: 7, y: 7 },
      direction: 'UP',
      score: 0,
      gameOver: false,
      gridSize: 15,
    };

    const next = moveSnake(state, 'UP');
    expect(next.gameOver).toBe(false);
    expect(next.snake[0]).toEqual({ x: 5, y: 14 });
  });

  it('wraps around bottom wall to top edge without dying', () => {
    const state: SnakeState = {
      snake: [
        { x: 5, y: 14 },
        { x: 5, y: 13 },
        { x: 5, y: 12 },
      ],
      food: { x: 7, y: 7 },
      direction: 'DOWN',
      score: 0,
      gameOver: false,
      gridSize: 15,
    };

    const next = moveSnake(state, 'DOWN');
    expect(next.gameOver).toBe(false);
    expect(next.snake[0]).toEqual({ x: 5, y: 0 });
  });

  it('ends game ONLY when snake runs into its own body', () => {
    // Snake coiled into itself: head at (5,5), body loops around (5,6), (6,6), (6,5)
    // Moving RIGHT into (6,5) hits its own body
    const state: SnakeState = {
      snake: [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 6, y: 6 },
        { x: 6, y: 5 },
        { x: 7, y: 5 },
      ],
      food: { x: 0, y: 0 },
      direction: 'UP',
      score: 40,
      gameOver: false,
      gridSize: 15,
    };

    const next = moveSnake(state, 'RIGHT');
    expect(next.gameOver).toBe(true);
  });

  it('continuously wraps through borders for 100 steps without ending game', () => {
    let state = getInitialState(15);
    // Move RIGHT through right wall 30 times
    for (let i = 0; i < 30; i++) {
      state = moveSnake(state, 'RIGHT');
      expect(state.gameOver).toBe(false);
      expect(state.snake[0].x).toBeGreaterThanOrEqual(0);
      expect(state.snake[0].x).toBeLessThan(15);
    }

    // Turn DOWN and wrap through bottom wall 30 times
    for (let i = 0; i < 30; i++) {
      state = moveSnake(state, 'DOWN');
      expect(state.gameOver).toBe(false);
      expect(state.snake[0].y).toBeGreaterThanOrEqual(0);
      expect(state.snake[0].y).toBeLessThan(15);
    }
  });
});

