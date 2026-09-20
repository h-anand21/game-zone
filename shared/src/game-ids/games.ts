// ============================================================
// GameHub — Game IDs & Registry Types
// ============================================================

/** Game category classification. */
export type GameCategory = 'brain' | 'reflex' | 'arcade' | 'classic' | 'battle' | 'party';

/** Save support level for a game. */
export type SaveSupport = 'none' | 'background' | 'full';

/** Game availability status. */
export type GameStatus = 'available' | 'coming-soon' | 'maintenance';

/** Score validation rules for a specific game. */
export interface ScoreValidationRules {
  maxScore: number;
  minDuration: number;  // seconds
  maxDuration: number;  // seconds
}

/** Configuration for a single game in the registry. */
export interface GameConfig {
  id: string;
  name: string;
  category: GameCategory;
  offline: boolean;
  multiplayer: boolean;
  route: string;
  icon: string;
  status: GameStatus;
  gameVersion: string;
  scoreVersion: string;
  validation: ScoreValidationRules;
  saveSupport: SaveSupport;
  description: string;
}

// ── Brain Games ──────────────────────────────────────────────

export const GAME_MIND_LOCK = 'mind-lock';
export const GAME_FIND_ONE = 'find-one';
export const GAME_REVERSE_MIND = 'reverse-mind';
export const GAME_MEMORY_RUSH = 'memory-rush';
export const GAME_NUMBER_RUSH = 'number-rush';
export const GAME_PATTERN_BREAK = 'pattern-break';
export const GAME_CODE_BREAKER = 'code-breaker';
export const GAME_PATH_MIND = 'path-mind';

// ── Reflex / Skill Games ────────────────────────────────────

export const GAME_AIM_RUSH = 'aim-rush';
export const GAME_ONE_TAP = 'one-tap';
export const GAME_DONT_TAP_WRONG = 'dont-tap-wrong';
export const GAME_REACTION_FIRE = 'reaction-fire';
export const GAME_STACK_MASTER = 'stack-master';
export const GAME_PERFECT_HIT = 'perfect-hit';

// ── Arcade Games ────────────────────────────────────────────

export const GAME_SNAKE = 'snake';
export const GAME_PONG = 'pong';
export const GAME_SKY_JUMP = 'sky-jump';
export const GAME_ENDLESS_RUNNER = 'endless-runner';
export const GAME_BLOCK_PUZZLE = 'block-puzzle';

// ── Classic / Indian Games ──────────────────────────────────

export const GAME_LUDO = 'ludo';
export const GAME_BAGH_BAKRI = 'bagh-bakri';
export const GAME_CARROM = 'carrom';
export const GAME_MINI_CHESS = 'mini-chess';
export const GAME_CONNECT_4 = 'connect-4';
export const GAME_MEMORY_CARDS = 'memory-cards';

// ── Battle Arena (FPS) ──────────────────────────────────────

export const GAME_FPS_FFA = 'fps-ffa';
export const GAME_FPS_TDM = 'fps-tdm';
export const GAME_FPS_GUN_GAME = 'fps-gun-game';
export const GAME_FPS_CAPTURE_POINT = 'fps-capture-point';
export const GAME_FPS_DUEL = 'fps-duel';

// ── Party / Social Games ────────────────────────────────────

export const GAME_TIC_TAC_TOE = 'tic-tac-toe';
export const GAME_ROCK_PAPER_SCISSORS = 'rock-paper-scissors';
export const GAME_AIR_HOCKEY = 'air-hockey';
export const GAME_QUIZ_BATTLE = 'quiz-battle';
export const GAME_GUESS_THE_DRAWING = 'guess-the-drawing';

// ── All Game IDs ────────────────────────────────────────────

export const ALL_GAME_IDS = [
  // Brain
  GAME_MIND_LOCK, GAME_FIND_ONE, GAME_REVERSE_MIND, GAME_MEMORY_RUSH,
  GAME_NUMBER_RUSH, GAME_PATTERN_BREAK, GAME_CODE_BREAKER, GAME_PATH_MIND,
  // Reflex
  GAME_AIM_RUSH, GAME_ONE_TAP, GAME_DONT_TAP_WRONG, GAME_REACTION_FIRE,
  GAME_STACK_MASTER, GAME_PERFECT_HIT,
  // Arcade
  GAME_SNAKE, GAME_PONG, GAME_SKY_JUMP, GAME_ENDLESS_RUNNER, GAME_BLOCK_PUZZLE,
  // Classic
  GAME_LUDO, GAME_BAGH_BAKRI, GAME_CARROM, GAME_MINI_CHESS, GAME_CONNECT_4, GAME_MEMORY_CARDS,
  // Battle Arena
  GAME_FPS_FFA, GAME_FPS_TDM, GAME_FPS_GUN_GAME, GAME_FPS_CAPTURE_POINT, GAME_FPS_DUEL,
  // Party
  GAME_TIC_TAC_TOE, GAME_ROCK_PAPER_SCISSORS, GAME_AIR_HOCKEY, GAME_QUIZ_BATTLE, GAME_GUESS_THE_DRAWING,
] as const;

export type GameId = (typeof ALL_GAME_IDS)[number];
