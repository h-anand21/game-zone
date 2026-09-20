// ============================================================
// GameHub — Common Game Engine
// ============================================================
// Orchestrates the standard game lifecycle.
// Every non-FPS game uses this engine to ensure consistent
// score submission, XP, achievements, and sync.

import type { GameConfig, GameResult, GameState } from '@/constants/types';

/**
 * Contract that every game must implement.
 * The engine calls these hooks at the right time.
 */
export interface IGame {
  id: string;
  config: GameConfig;
  onInit(): void;
  onStart(): void;
  onPause(): void;
  onResume(): void;
  onFinish(result: GameResult): void;
  onDestroy(): void;
}

/**
 * Game lifecycle state machine.
 * Valid transitions:
 *   IDLE → READY → PLAYING ↔ PAUSED → FINISHED → RESULT → SAVE → SYNC
 */
const VALID_TRANSITIONS: Record<GameState, GameState[]> = {
  IDLE:     ['READY'],
  READY:    ['PLAYING'],
  PLAYING:  ['PAUSED', 'FINISHED'],
  PAUSED:   ['PLAYING', 'FINISHED'],
  FINISHED: ['RESULT'],
  RESULT:   ['SAVE'],
  SAVE:     ['SYNC'],
  SYNC:     ['IDLE'],
};

export class GameEngine {
  private state: GameState = 'IDLE';
  private sessionStartTime: number = 0;
  private sessionDuration: number = 0;

  constructor(public readonly config: GameConfig) {}

  getState(): GameState {
    return this.state;
  }

  private transition(to: GameState): void {
    const allowed = VALID_TRANSITIONS[this.state];
    if (!allowed.includes(to)) {
      console.warn(`[GameEngine] Invalid transition: ${this.state} → ${to}`);
      return;
    }
    this.state = to;
  }

  /** Prepare the game for play. */
  ready(): void {
    this.transition('READY');
  }

  /** Start gameplay — records session start time. */
  start(): void {
    this.transition('PLAYING');
    this.sessionStartTime = Date.now();
  }

  /** Pause gameplay. */
  pause(): void {
    if (this.state === 'PLAYING') {
      this.transition('PAUSED');
    }
  }

  /** Resume from pause. */
  resume(): void {
    if (this.state === 'PAUSED') {
      this.transition('PLAYING');
    }
  }

  /** Finish gameplay — calculates duration. */
  finish(): void {
    this.sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    this.transition('FINISHED');
  }

  /** Move to result display. */
  showResult(): void {
    this.transition('RESULT');
  }

  /** Save result locally. */
  save(): void {
    this.transition('SAVE');
  }

  /** Queue for sync. */
  sync(): void {
    this.transition('SYNC');
  }

  /** Reset to idle for replay. */
  reset(): void {
    this.state = 'IDLE';
    this.sessionStartTime = 0;
    this.sessionDuration = 0;
  }

  /** Get session duration in seconds. */
  getDuration(): number {
    if (this.state === 'PLAYING') {
      return Math.floor((Date.now() - this.sessionStartTime) / 1000);
    }
    return this.sessionDuration;
  }
}
