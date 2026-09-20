// ============================================================
// GameHub — Shared Enums: Game State
// ============================================================

/**
 * Standard game lifecycle states.
 * Every non-FPS game follows this state machine:
 * IDLE → READY → PLAYING → PAUSED → PLAYING → FINISHED → RESULT → SAVE → SYNC
 */
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
