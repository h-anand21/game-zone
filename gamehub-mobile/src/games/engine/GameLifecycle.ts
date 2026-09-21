// ============================================================
// GameHub — Game Lifecycle Interface
// Every game must implement this contract
// ============================================================

export interface GameResult {
  score: number;
  duration: number;
  result: 'win' | 'loss' | 'draw' | 'completed';
  metadata?: Record<string, any>;
}

export interface GameConfig {
  id: string;
  name: string;
  category: string;
  gameVersion: string;
  scoreVersion: string;
  maxScore: number;
  minDuration: number;
  maxDuration: number;
  saveSupport: 'none' | 'background' | 'full';
}

/**
 * Standard game lifecycle hooks.
 * Every game component should call these at appropriate times
 * to integrate with the common game engine.
 */
export interface IGameLifecycle {
  /** Called when the game component mounts */
  onInit(): void;

  /** Called when player starts playing (after countdown/instructions) */
  onStart(): void;

  /** Called when player pauses (app background, pause button) */
  onPause(): void;

  /** Called when player resumes from pause */
  onResume(): void;

  /** Called when game ends naturally (win/loss/timeout) */
  onFinish(result: GameResult): void;

  /** Called when game component unmounts (cleanup) */
  onDestroy(): void;
}

/**
 * Full game contract combining config and lifecycle
 */
export interface IGame extends IGameLifecycle {
  id: string;
  config: GameConfig;
}
