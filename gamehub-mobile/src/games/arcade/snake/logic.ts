// ============================================================
// GameHub — Snake Pure Logic
// ============================================================

import type { Position, Direction, SnakeState } from './types';

export const GRID_SIZE = 15;

export function generateFood(snake: Position[], gridSize = GRID_SIZE): Position {
  let newFood: Position;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
}

export function getInitialState(gridSize = GRID_SIZE): SnakeState {
  const initialSnake = [
    { x: 7, y: 7 },
    { x: 6, y: 7 },
    { x: 5, y: 7 },
  ];
  return {
    snake: initialSnake,
    food: generateFood(initialSnake, gridSize),
    direction: 'RIGHT',
    score: 0,
    gameOver: false,
    gridSize,
  };
}

export function moveSnake(state: SnakeState, newDirection?: Direction): SnakeState {
  if (state.gameOver) return state;

  const dir = newDirection || state.direction;
  const head = { ...state.snake[0] };

  switch (dir) {
    case 'UP':
      head.y -= 1;
      break;
    case 'DOWN':
      head.y += 1;
      break;
    case 'LEFT':
      head.x -= 1;
      break;
    case 'RIGHT':
      head.x += 1;
      break;
  }

  // Edge Wrap: pass through borders smoothly (opposite side teleport)
  if (head.x < 0) head.x = state.gridSize - 1;
  else if (head.x >= state.gridSize) head.x = 0;
  if (head.y < 0) head.y = state.gridSize - 1;
  else if (head.y >= state.gridSize) head.y = 0;

  // Self-collision: Game ends ONLY when the snake runs into itself!
  const isEating = head.x === state.food.x && head.y === state.food.y;
  const bodyToCheck = isEating ? state.snake : state.snake.slice(0, -1);
  if (bodyToCheck.some((seg) => seg.x === head.x && seg.y === head.y)) {
    return { ...state, gameOver: true };
  }

  const newSnake = [head, ...state.snake];
  let newScore = state.score;
  let newFood = state.food;

  // Food collision
  if (isEating) {
    newScore += 10;
    newFood = generateFood(newSnake, state.gridSize);
  } else {
    newSnake.pop(); // Remove tail
  }

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    score: newScore,
    direction: dir,
  };
}
