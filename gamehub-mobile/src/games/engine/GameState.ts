// ============================================================
// GameHub — Game State Machine
// Standard lifecycle: IDLE → READY → PLAYING → PAUSED → FINISHED → RESULT → SAVE → SYNC
// ============================================================

export enum GameState {
  IDLE = 'IDLE',
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
  RESULT = 'RESULT',
  SAVE = 'SAVE',
  SYNC = 'SYNC',
}

/** Allowed transitions between states */
const VALID_TRANSITIONS: Record<GameState, GameState[]> = {
  [GameState.IDLE]: [GameState.READY],
  [GameState.READY]: [GameState.PLAYING, GameState.IDLE],
  [GameState.PLAYING]: [GameState.PAUSED, GameState.FINISHED],
  [GameState.PAUSED]: [GameState.PLAYING, GameState.FINISHED, GameState.IDLE],
  [GameState.FINISHED]: [GameState.RESULT],
  [GameState.RESULT]: [GameState.SAVE, GameState.IDLE],
  [GameState.SAVE]: [GameState.SYNC, GameState.IDLE],
  [GameState.SYNC]: [GameState.IDLE],
};

export type StateChangeListener = (from: GameState, to: GameState) => void;

export class GameStateMachine {
  private _state: GameState = GameState.IDLE;
  private _listeners: StateChangeListener[] = [];
  private _history: Array<{ from: GameState; to: GameState; at: number }> = [];

  /** Current state */
  get state(): GameState { return this._state; }

  /** Whether game is actively playing */
  get isPlaying(): boolean { return this._state === GameState.PLAYING; }

  /** Whether game is paused */
  get isPaused(): boolean { return this._state === GameState.PAUSED; }

  /** Whether game has finished */
  get isFinished(): boolean {
    return [GameState.FINISHED, GameState.RESULT, GameState.SAVE, GameState.SYNC].includes(this._state);
  }

  /**
   * Attempt to transition to a new state
   * @returns true if transition was valid and applied
   */
  transition(newState: GameState): boolean {
    const allowedTargets = VALID_TRANSITIONS[this._state];
    if (!allowedTargets || !allowedTargets.includes(newState)) {
      console.warn(`[GameState] Invalid transition: ${this._state} → ${newState}`);
      return false;
    }

    const from = this._state;
    this._state = newState;
    this._history.push({ from, to: newState, at: Date.now() });

    // Notify listeners
    this._listeners.forEach((listener) => {
      try { listener(from, newState); } catch (e) { /* ignore listener errors */ }
    });

    return true;
  }

  /** Subscribe to state changes */
  onChange(listener: StateChangeListener): () => void {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== listener);
    };
  }

  /** Reset to IDLE */
  reset(): void {
    this._state = GameState.IDLE;
    this._history = [];
  }

  /** Get transition history */
  getHistory() {
    return [...this._history];
  }

  /** Check if a transition to the target state is valid */
  canTransition(target: GameState): boolean {
    const allowed = VALID_TRANSITIONS[this._state];
    return allowed ? allowed.includes(target) : false;
  }
}
