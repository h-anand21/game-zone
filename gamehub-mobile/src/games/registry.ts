// ============================================================
// GameHub — Central Game Component Registry
// ============================================================

import React from 'react';
import { TIC_TAC_TOE_CONFIG } from './party/tic-tac-toe/config';
import { TicTacToeGame } from './party/tic-tac-toe/Game';

import { SNAKE_CONFIG } from './arcade/snake/config';
import { SnakeGame } from './arcade/snake/Game';

import { MIND_LOCK_CONFIG } from './brain/mind-lock/config';
import { MindLockGame } from './brain/mind-lock/Game';

import { FIND_ONE_CONFIG } from './brain/find-one/config';
import { FindOneGame } from './brain/find-one/Game';

import { NUMBER_RUSH_CONFIG } from './brain/number-rush/config';
import { NumberRushGame } from './brain/number-rush/Game';

import type { GameConfig } from '@/constants/types';
import type { GameEngine } from './engine/GameEngine';

export interface GameRegistryEntry {
  config: GameConfig;
  component: React.ComponentType<{
    engine: GameEngine;
    onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
    isPaused: boolean;
  }>;
}

export const GAME_COMPONENT_REGISTRY: Record<string, GameRegistryEntry> = {
  'tic-tac-toe': {
    config: TIC_TAC_TOE_CONFIG,
    component: TicTacToeGame,
  },
  'snake': {
    config: SNAKE_CONFIG,
    component: SnakeGame,
  },
  'mind-lock': {
    config: MIND_LOCK_CONFIG,
    component: MindLockGame,
  },
  'find-one': {
    config: FIND_ONE_CONFIG,
    component: FindOneGame,
  },
  'number-rush': {
    config: NUMBER_RUSH_CONFIG,
    component: NumberRushGame,
  },
};

export function getRegisteredGame(gameId: string): GameRegistryEntry | undefined {
  return GAME_COMPONENT_REGISTRY[gameId];
}
