// ============================================================
// GameHub — Snake Pure Logic (Supports Big Screen Grid)
// ============================================================

import type { Position, Direction, SnakeState } from './types';

export const GRID_SIZE = 15;
export const DEFAULT_GRID_COLS = 15;
export const DEFAULT_GRID_ROWS = 22; // Full-height vertical proportions for modern mobile screens

export function generateFood(
  snake: Position[],
  colsOrSize: number = DEFAULT_GRID_COLS,
  rows?: number
): Position {
  const gridCols = colsOrSize;
  const gridRows = rows ?? colsOrSize;

  let newFood: Position;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * gridCols),
      y: Math.floor(Math.random() * gridRows),
    };
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
}

export function getInitialState(
  colsOrSize?: number,
  rows?: number
): SnakeState {
  const gridCols = colsOrSize ?? DEFAULT_GRID_COLS;
  const gridRows = rows ?? (colsOrSize !== undefined ? colsOrSize : DEFAULT_GRID_ROWS);

  const startX = Math.floor(gridCols / 2);
  const startY = Math.floor(gridRows / 2);

  const initialSnake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];

  return {
    snake: initialSnake,
    food: generateFood(initialSnake, gridCols, gridRows),
    direction: 'RIGHT',
    score: 0,
    gameOver: false,
    gridSize: gridCols,
    gridCols,
    gridRows,
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

  const cols = state.gridCols ?? state.gridSize ?? 15;
  const rows = state.gridRows ?? state.gridSize ?? 15;

  // Edge Wrap: pass through borders smoothly (opposite side teleport)
  if (head.x < 0) head.x = cols - 1;
  else if (head.x >= cols) head.x = 0;
  if (head.y < 0) head.y = rows - 1;
  else if (head.y >= rows) head.y = 0;

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
    newFood = generateFood(newSnake, cols, rows);
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
