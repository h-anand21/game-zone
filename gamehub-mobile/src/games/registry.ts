// ============================================================
// GameHub — Central Game Component Registry (All 30 Non-FPS Games)
// ============================================================

import React from 'react';
import type { GameConfig } from '@/constants/types';
import type { GameEngine } from './engine/GameEngine';

// ── 1. Brain Games (8) ──────────────────────────────────────
import { MIND_LOCK_CONFIG } from './brain/mind-lock/config';
import { MindLockGame } from './brain/mind-lock/Game';

import { FIND_ONE_CONFIG } from './brain/find-one/config';
import { FindOneGame } from './brain/find-one/Game';

import { NUMBER_RUSH_CONFIG } from './brain/number-rush/config';
import { NumberRushGame } from './brain/number-rush/Game';

import { REVERSE_MIND_CONFIG } from './brain/reverse-mind/config';
import { ReverseMindGame } from './brain/reverse-mind/Game';

import { MEMORY_RUSH_CONFIG } from './brain/memory-rush/config';
import { MemoryRushGame } from './brain/memory-rush/Game';

import { PATTERN_BREAK_CONFIG } from './brain/pattern-break/config';
import { PatternBreakGame } from './brain/pattern-break/Game';

import { CODE_BREAKER_CONFIG } from './brain/code-breaker/config';
import { CodeBreakerGame } from './brain/code-breaker/Game';

import { PATH_MIND_CONFIG } from './brain/path-mind/config';
import { PathMindGame } from './brain/path-mind/Game';

// ── 2. Reflex / Skill Games (6) ─────────────────────────────
import { AIM_RUSH_CONFIG } from './reflex/aim-rush/config';
import { AimRushGame } from './reflex/aim-rush/Game';

import { ONE_TAP_CONFIG } from './reflex/one-tap/config';
import { OneTapGame } from './reflex/one-tap/Game';

import { DONT_TAP_WRONG_CONFIG } from './reflex/dont-tap-wrong/config';
import { DontTapWrongGame } from './reflex/dont-tap-wrong/Game';

import { REACTION_FIRE_CONFIG } from './reflex/reaction-fire/config';
import { ReactionFireGame } from './reflex/reaction-fire/Game';

import { STACK_MASTER_CONFIG } from './reflex/stack-master/config';
import { StackMasterGame } from './reflex/stack-master/Game';

import { PERFECT_HIT_CONFIG } from './reflex/perfect-hit/config';
import { PerfectHitGame } from './reflex/perfect-hit/Game';

// ── 3. Arcade Games (5) ──────────────────────────────────────
import { SNAKE_CONFIG } from './arcade/snake/config';
import { SnakeGame } from './arcade/snake/Game';

import { PONG_CONFIG } from './arcade/pong/config';
import { PongGame } from './arcade/pong/Game';

import { SKY_JUMP_CONFIG } from './arcade/sky-jump/config';
import { SkyJumpGame } from './arcade/sky-jump/Game';

import { ENDLESS_RUNNER_CONFIG } from './arcade/endless-runner/config';
import { EndlessRunnerGame } from './arcade/endless-runner/Game';

import { BLOCK_PUZZLE_CONFIG } from './arcade/block-puzzle/config';
import { BlockPuzzleGame } from './arcade/block-puzzle/Game';

// ── 4. Classic / Indian Games (6) ────────────────────────────
import { LUDO_CONFIG } from './classic/ludo/config';
import { LudoGame } from './classic/ludo/Game';

import { BAGH_BAKRI_CONFIG } from './classic/bagh-bakri/config';
import { BaghBakriGame } from './classic/bagh-bakri/Game';

import { CARROM_CONFIG } from './classic/carrom/config';
import { CarromGame } from './classic/carrom/Game';

import { MINI_CHESS_CONFIG } from './classic/mini-chess/config';
import { MiniChessGame } from './classic/mini-chess/Game';

import { CONNECT_4_CONFIG } from './classic/connect-4/config';
import { Connect4Game } from './classic/connect-4/Game';

import { MEMORY_CARDS_CONFIG } from './classic/memory-cards/config';
import { MemoryCardsGame } from './classic/memory-cards/Game';

// ── 5. Party / Social Games (5) ──────────────────────────────
import { TIC_TAC_TOE_CONFIG } from './party/tic-tac-toe/config';
import { TicTacToeGame } from './party/tic-tac-toe/Game';

import { ROCK_PAPER_SCISSORS_CONFIG } from './party/rock-paper-scissors/config';
import { RockPaperScissorsGame } from './party/rock-paper-scissors/Game';

import { AIR_HOCKEY_CONFIG } from './party/air-hockey/config';
import { AirHockeyGame } from './party/air-hockey/Game';

import { QUIZ_BATTLE_CONFIG } from './party/quiz-battle/config';
import { QuizBattleGame } from './party/quiz-battle/Game';

import { GUESS_THE_DRAWING_CONFIG } from './party/guess-the-drawing/config';
import { GuessTheDrawingGame } from './party/guess-the-drawing/Game';
import { BattleArenaGame } from './battle/BattleArenaGame';
import { getGameById } from '@/constants/games';

export interface GameRegistryEntry {
  config: GameConfig;
  component: React.ComponentType<{
    engine: GameEngine;
    onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
    isPaused: boolean;
  }>;
}

export const GAME_COMPONENT_REGISTRY: Record<string, GameRegistryEntry> = {
  // Brain
  'mind-lock': { config: MIND_LOCK_CONFIG, component: MindLockGame },
  'find-one': { config: FIND_ONE_CONFIG, component: FindOneGame },
  'number-rush': { config: NUMBER_RUSH_CONFIG, component: NumberRushGame },
  'reverse-mind': { config: REVERSE_MIND_CONFIG, component: ReverseMindGame },
  'memory-rush': { config: MEMORY_RUSH_CONFIG, component: MemoryRushGame },
  'pattern-break': { config: PATTERN_BREAK_CONFIG, component: PatternBreakGame },
  'code-breaker': { config: CODE_BREAKER_CONFIG, component: CodeBreakerGame },
  'path-mind': { config: PATH_MIND_CONFIG, component: PathMindGame },

  // Reflex
  'aim-rush': { config: AIM_RUSH_CONFIG, component: AimRushGame },
  'one-tap': { config: ONE_TAP_CONFIG, component: OneTapGame },
  'dont-tap-wrong': { config: DONT_TAP_WRONG_CONFIG, component: DontTapWrongGame },
  'reaction-fire': { config: REACTION_FIRE_CONFIG, component: ReactionFireGame },
  'stack-master': { config: STACK_MASTER_CONFIG, component: StackMasterGame },
  'perfect-hit': { config: PERFECT_HIT_CONFIG, component: PerfectHitGame },

  // Arcade
  'snake': { config: SNAKE_CONFIG, component: SnakeGame },
  'pong': { config: PONG_CONFIG, component: PongGame },
  'sky-jump': { config: SKY_JUMP_CONFIG, component: SkyJumpGame },
  'endless-runner': { config: ENDLESS_RUNNER_CONFIG, component: EndlessRunnerGame },
  'block-puzzle': { config: BLOCK_PUZZLE_CONFIG, component: BlockPuzzleGame },

  // Classic
  'ludo': { config: LUDO_CONFIG, component: LudoGame },
  'bagh-bakri': { config: BAGH_BAKRI_CONFIG, component: BaghBakriGame },
  'carrom': { config: CARROM_CONFIG, component: CarromGame },
  'mini-chess': { config: MINI_CHESS_CONFIG, component: MiniChessGame },
  'connect-4': { config: CONNECT_4_CONFIG, component: Connect4Game },
  'memory-cards': { config: MEMORY_CARDS_CONFIG, component: MemoryCardsGame },

  // Party
  'tic-tac-toe': { config: TIC_TAC_TOE_CONFIG, component: TicTacToeGame },
  'rock-paper-scissors': { config: ROCK_PAPER_SCISSORS_CONFIG, component: RockPaperScissorsGame },
  'air-hockey': { config: AIR_HOCKEY_CONFIG, component: AirHockeyGame },
  'quiz-battle': { config: QUIZ_BATTLE_CONFIG, component: QuizBattleGame },
  'guess-the-drawing': { config: GUESS_THE_DRAWING_CONFIG, component: GuessTheDrawingGame },

  // Battle Arena 3D FPS (5)
  'fps-ffa': { config: getGameById('fps-ffa')!, component: BattleArenaGame },
  'fps-tdm': { config: getGameById('fps-tdm')!, component: BattleArenaGame },
  'fps-gun-game': { config: getGameById('fps-gun-game')!, component: BattleArenaGame },
  'fps-capture-point': { config: getGameById('fps-capture-point')!, component: BattleArenaGame },
  'fps-duel': { config: getGameById('fps-duel')!, component: BattleArenaGame },
};

export function getRegisteredGame(gameId: string): GameRegistryEntry | undefined {
  return GAME_COMPONENT_REGISTRY[gameId];
}
