// ============================================================
// GameHub — Game Registry (All 35 Games)
// ============================================================

import type { GameCategory, GameConfig } from './types';

/**
 * Central game registry — the SINGLE SOURCE OF TRUTH for all games.
 */
export const GAME_REGISTRY: GameConfig[] = [
  // ── Brain Games (8) ─────────────────────────────────────────
  {
    id: 'mind-lock', name: 'Mind Lock', category: 'brain',
    offline: true, multiplayer: false, route: '/games/mind-lock',
    icon: '🧠', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 3, maxDuration: 300 },
    saveSupport: 'background', description: 'Remember and reproduce patterns',
  },
  {
    id: 'find-one', name: 'Find One', category: 'brain',
    offline: true, multiplayer: false, route: '/games/find-one',
    icon: '🔍', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 3, maxDuration: 300 },
    saveSupport: 'none', description: 'Spot the odd one out',
  },
  {
    id: 'reverse-mind', name: 'Reverse Mind', category: 'brain',
    offline: true, multiplayer: false, route: '/games/reverse-mind',
    icon: '🔄', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 3, maxDuration: 300 },
    saveSupport: 'none', description: 'Reverse the pattern shown',
  },
  {
    id: 'memory-rush', name: 'Memory Rush', category: 'brain',
    offline: true, multiplayer: false, route: '/games/memory-rush',
    icon: '⚡', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 5, maxDuration: 600 },
    saveSupport: 'none', description: 'Match cards before time runs out',
  },
  {
    id: 'number-rush', name: 'Number Rush', category: 'brain',
    offline: true, multiplayer: false, route: '/games/number-rush',
    icon: '🔢', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 50000, minDuration: 5, maxDuration: 120 },
    saveSupport: 'none', description: 'Quick math challenges',
  },
  {
    id: 'pattern-break', name: 'Pattern Break', category: 'brain',
    offline: true, multiplayer: false, route: '/games/pattern-break',
    icon: '🧩', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 3, maxDuration: 300 },
    saveSupport: 'none', description: 'Find the rule-breaking element',
  },
  {
    id: 'code-breaker', name: 'Code Breaker', category: 'brain',
    offline: true, multiplayer: false, route: '/games/code-breaker',
    icon: '🔐', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 10, maxDuration: 600 },
    saveSupport: 'background', description: 'Crack the secret code',
  },
  {
    id: 'path-mind', name: 'Path Mind', category: 'brain',
    offline: true, multiplayer: false, route: '/games/path-mind',
    icon: '🛤️', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 3, maxDuration: 300 },
    saveSupport: 'none', description: 'Memorize and trace the path',
  },

  // ── Reflex / Skill Games (6) ────────────────────────────────
  {
    id: 'aim-rush', name: 'Aim Rush', category: 'reflex',
    offline: true, multiplayer: false, route: '/games/aim-rush',
    icon: '🎯', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 50000, minDuration: 5, maxDuration: 120 },
    saveSupport: 'none', description: 'Tap targets as fast as possible',
  },
  {
    id: 'one-tap', name: 'One Tap', category: 'reflex',
    offline: true, multiplayer: false, route: '/games/one-tap',
    icon: '👆', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 3, maxDuration: 120 },
    saveSupport: 'none', description: 'Perfect timing, one tap',
  },
  {
    id: 'dont-tap-wrong', name: "Don't Tap Wrong", category: 'reflex',
    offline: true, multiplayer: false, route: '/games/dont-tap-wrong',
    icon: '🚫', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 50000, minDuration: 5, maxDuration: 120 },
    saveSupport: 'none', description: 'Tap right, avoid wrong',
  },
  {
    id: 'reaction-fire', name: 'Reaction Fire', category: 'reflex',
    offline: true, multiplayer: false, route: '/games/reaction-fire',
    icon: '🔥', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 3, maxDuration: 60 },
    saveSupport: 'none', description: 'Test your reaction speed',
  },
  {
    id: 'stack-master', name: 'Stack Master', category: 'reflex',
    offline: true, multiplayer: false, route: '/games/stack-master',
    icon: '📦', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 50000, minDuration: 5, maxDuration: 300 },
    saveSupport: 'none', description: 'Stack blocks with precision',
  },
  {
    id: 'perfect-hit', name: 'Perfect Hit', category: 'reflex',
    offline: true, multiplayer: false, route: '/games/perfect-hit',
    icon: '💥', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 3, maxDuration: 120 },
    saveSupport: 'none', description: 'Hit the perfect zone',
  },

  // ── Arcade Games (5) ───────────────────────────────────────
  {
    id: 'snake', name: 'Snake', category: 'arcade',
    offline: true, multiplayer: false, route: '/games/snake',
    icon: '🐍', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 100000, minDuration: 5, maxDuration: 3600 },
    saveSupport: 'none', description: 'Classic Snake — eat, grow, survive',
  },
  {
    id: 'pong', name: 'Pong', category: 'arcade',
    offline: true, multiplayer: false, route: '/games/pong',
    icon: '🏓', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 50, minDuration: 10, maxDuration: 600 },
    saveSupport: 'none', description: 'Classic Pong — first to 11',
  },
  {
    id: 'sky-jump', name: 'Sky Jump', category: 'arcade',
    offline: true, multiplayer: false, route: '/games/sky-jump',
    icon: '🚀', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 100000, minDuration: 5, maxDuration: 1800 },
    saveSupport: 'none', description: 'Jump higher and higher',
  },
  {
    id: 'endless-runner', name: 'Endless Runner', category: 'arcade',
    offline: true, multiplayer: false, route: '/games/endless-runner',
    icon: '🏃', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 500000, minDuration: 5, maxDuration: 3600 },
    saveSupport: 'none', description: 'Run, dodge, collect',
  },
  {
    id: 'block-puzzle', name: 'Block Puzzle', category: 'arcade',
    offline: true, multiplayer: false, route: '/games/block-puzzle',
    icon: '🟦', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 100000, minDuration: 10, maxDuration: 7200 },
    saveSupport: 'background', description: 'Fit the blocks, clear the lines',
  },

  // ── Classic / Indian Games (6) ─────────────────────────────
  {
    id: 'ludo', name: 'Ludo', category: 'classic',
    offline: true, multiplayer: true, route: '/games/ludo',
    icon: '🎲', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 1000, minDuration: 60, maxDuration: 3600 },
    saveSupport: 'full', description: 'Classic Ludo with AI opponents',
  },
  {
    id: 'bagh-bakri', name: 'Bagh-Bakri', category: 'classic',
    offline: true, multiplayer: false, route: '/games/bagh-bakri',
    icon: '🐅', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 1000, minDuration: 30, maxDuration: 1800 },
    saveSupport: 'full', description: 'Tigers and Goats — traditional strategy',
  },
  {
    id: 'carrom', name: 'Carrom', category: 'classic',
    offline: true, multiplayer: false, route: '/games/carrom',
    icon: '⚪', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 1000, minDuration: 30, maxDuration: 1800 },
    saveSupport: 'none', description: 'Flick and pocket the coins',
  },
  {
    id: 'mini-chess', name: 'Mini Chess', category: 'classic',
    offline: true, multiplayer: false, route: '/games/mini-chess',
    icon: '♟️', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 1000, minDuration: 30, maxDuration: 3600 },
    saveSupport: 'full', description: 'Chess with AI — test your strategy',
  },
  {
    id: 'connect-4', name: 'Connect 4', category: 'classic',
    offline: true, multiplayer: false, route: '/games/connect-4',
    icon: '🔴', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 1000, minDuration: 10, maxDuration: 600 },
    saveSupport: 'none', description: 'Drop four in a row to win',
  },
  {
    id: 'memory-cards', name: 'Memory Cards', category: 'classic',
    offline: true, multiplayer: false, route: '/games/memory-cards',
    icon: '🃏', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 10, maxDuration: 600 },
    saveSupport: 'none', description: 'Match the hidden pairs',
  },

  // ── Battle Arena / FPS (5) ─────────────────────────────────
  {
    id: 'fps-ffa', name: 'Free For All', category: 'battle',
    offline: false, multiplayer: true, route: '/games/fps-ffa',
    icon: '⚔️', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 100, minDuration: 60, maxDuration: 600 },
    saveSupport: 'none', description: 'Every player for themselves — 60Hz arena',
  },
  {
    id: 'fps-tdm', name: 'Team Deathmatch', category: 'battle',
    offline: false, multiplayer: true, route: '/games/fps-tdm',
    icon: '🛡️', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 200, minDuration: 60, maxDuration: 600 },
    saveSupport: 'none', description: 'Team vs team tactical combat',
  },
  {
    id: 'fps-gun-game', name: 'Gun Game', category: 'battle',
    offline: false, multiplayer: true, route: '/games/fps-gun-game',
    icon: '🔫', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 50, minDuration: 60, maxDuration: 600 },
    saveSupport: 'none', description: 'Kill to upgrade your weapon tier',
  },
  {
    id: 'fps-capture-point', name: 'Capture Point', category: 'battle',
    offline: false, multiplayer: true, route: '/games/fps-capture-point',
    icon: '🏴', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 500, minDuration: 60, maxDuration: 600 },
    saveSupport: 'none', description: 'Hold control zones to earn points',
  },
  {
    id: 'fps-duel', name: '1v1 Duel', category: 'battle',
    offline: false, multiplayer: true, route: '/games/fps-duel',
    icon: '🤺', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 20, minDuration: 30, maxDuration: 300 },
    saveSupport: 'none', description: 'High stakes 1-on-1 showdown',
  },

  // ── Party / Social Games (5) ──────────────────────────────
  {
    id: 'tic-tac-toe', name: 'Tic Tac Toe', category: 'party',
    offline: true, multiplayer: true, route: '/games/tic-tac-toe',
    icon: '❌', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 100, minDuration: 5, maxDuration: 300 },
    saveSupport: 'none', description: 'Classic X and O',
  },
  {
    id: 'rock-paper-scissors', name: 'Rock Paper Scissors', category: 'party',
    offline: true, multiplayer: true, route: '/games/rock-paper-scissors',
    icon: '✊', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 100, minDuration: 3, maxDuration: 120 },
    saveSupport: 'none', description: 'Best of three — go!',
  },
  {
    id: 'air-hockey', name: 'Air Hockey', category: 'party',
    offline: true, multiplayer: false, route: '/games/air-hockey',
    icon: '🏒', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 50, minDuration: 10, maxDuration: 600 },
    saveSupport: 'none', description: 'Fast-paced puck action',
  },
  {
    id: 'quiz-battle', name: 'Quiz Battle', category: 'party',
    offline: true, multiplayer: true, route: '/games/quiz-battle',
    icon: '❓', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 10, maxDuration: 300 },
    saveSupport: 'none', description: 'Battle of knowledge',
  },
  {
    id: 'guess-the-drawing', name: 'Guess the Drawing', category: 'party',
    offline: true, multiplayer: true, route: '/games/guess-the-drawing',
    icon: '🎨', status: 'available', gameVersion: '1.0.0', scoreVersion: 'v1',
    validation: { maxScore: 10000, minDuration: 10, maxDuration: 300 },
    saveSupport: 'none', description: 'Draw and guess — be creative',
  },
];

/** Get games by category. */
export const getGamesByCategory = (category: GameCategory): GameConfig[] =>
  GAME_REGISTRY.filter((g) => g.category === category);

/** Get a game by its ID. */
export const getGameById = (id: string): GameConfig | undefined =>
  GAME_REGISTRY.find((g) => g.id === id);

/** All unique categories. */
export const GAME_CATEGORIES: { id: GameCategory; label: string; icon: string }[] = [
  { id: 'brain', label: 'Brain', icon: '🧠' },
  { id: 'reflex', label: 'Reflex', icon: '⚡' },
  { id: 'arcade', label: 'Arcade', icon: '🕹️' },
  { id: 'classic', label: 'Classic', icon: '🎲' },
  { id: 'battle', label: 'Battle', icon: '⚔️' },
  { id: 'party', label: 'Party', icon: '🎉' },
];
