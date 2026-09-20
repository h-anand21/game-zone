// ============================================================
// GameHub — Score Validation Rules
// ============================================================

import type { ScoreValidationRules } from '../game-ids/games';

/**
 * Per-game score validation rules.
 * Used by both mobile (local pre-validation) and backend (server validation).
 * maxScore: highest plausible score
 * minDuration: shortest possible game (seconds)
 * maxDuration: longest reasonable game (seconds)
 */
export const SCORE_VALIDATION_RULES: Record<string, ScoreValidationRules> = {
  // Brain Games
  'mind-lock':     { maxScore: 10000,  minDuration: 3,    maxDuration: 300 },
  'find-one':      { maxScore: 10000,  minDuration: 3,    maxDuration: 300 },
  'reverse-mind':  { maxScore: 10000,  minDuration: 3,    maxDuration: 300 },
  'memory-rush':   { maxScore: 10000,  minDuration: 5,    maxDuration: 600 },
  'number-rush':   { maxScore: 50000,  minDuration: 5,    maxDuration: 120 },
  'pattern-break': { maxScore: 10000,  minDuration: 3,    maxDuration: 300 },
  'code-breaker':  { maxScore: 10000,  minDuration: 10,   maxDuration: 600 },
  'path-mind':     { maxScore: 10000,  minDuration: 3,    maxDuration: 300 },

  // Reflex / Skill
  'aim-rush':        { maxScore: 50000,  minDuration: 5,    maxDuration: 120 },
  'one-tap':         { maxScore: 10000,  minDuration: 3,    maxDuration: 120 },
  'dont-tap-wrong':  { maxScore: 50000,  minDuration: 5,    maxDuration: 120 },
  'reaction-fire':   { maxScore: 10000,  minDuration: 3,    maxDuration: 60 },
  'stack-master':    { maxScore: 50000,  minDuration: 5,    maxDuration: 300 },
  'perfect-hit':     { maxScore: 10000,  minDuration: 3,    maxDuration: 120 },

  // Arcade
  'snake':           { maxScore: 100000, minDuration: 5,    maxDuration: 3600 },
  'pong':            { maxScore: 50,     minDuration: 10,   maxDuration: 600 },
  'sky-jump':        { maxScore: 100000, minDuration: 5,    maxDuration: 1800 },
  'endless-runner':  { maxScore: 500000, minDuration: 5,    maxDuration: 3600 },
  'block-puzzle':    { maxScore: 100000, minDuration: 10,   maxDuration: 7200 },

  // Classic / Indian
  'ludo':            { maxScore: 1000,   minDuration: 60,   maxDuration: 3600 },
  'bagh-bakri':      { maxScore: 1000,   minDuration: 30,   maxDuration: 1800 },
  'carrom':          { maxScore: 1000,   minDuration: 30,   maxDuration: 1800 },
  'mini-chess':      { maxScore: 1000,   minDuration: 30,   maxDuration: 3600 },
  'connect-4':       { maxScore: 1000,   minDuration: 10,   maxDuration: 600 },
  'memory-cards':    { maxScore: 10000,  minDuration: 10,   maxDuration: 600 },

  // Party / Social
  'tic-tac-toe':           { maxScore: 100,    minDuration: 5,    maxDuration: 300 },
  'rock-paper-scissors':   { maxScore: 100,    minDuration: 3,    maxDuration: 120 },
  'air-hockey':            { maxScore: 50,     minDuration: 10,   maxDuration: 600 },
  'quiz-battle':           { maxScore: 10000,  minDuration: 10,   maxDuration: 300 },
  'guess-the-drawing':     { maxScore: 10000,  minDuration: 10,   maxDuration: 300 },
};
