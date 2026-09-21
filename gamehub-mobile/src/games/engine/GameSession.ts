// ============================================================
// GameHub — Game Session Tracker
// Tracks a single play session: start time, duration, events
// ============================================================

import { generateUUID } from '@/utils/uuid';

export interface SessionEvent {
  type: string;
  data?: any;
  timestamp: number;
}

export class GameSession {
  public readonly sessionId: string;
  public readonly gameId: string;
  public readonly gameVersion: string;
  public readonly startedAt: number;

  private _endedAt: number | null = null;
  private _score: number = 0;
  private _events: SessionEvent[] = [];
  private _isPaused: boolean = false;
  private _pauseStart: number = 0;
  private _totalPauseDuration: number = 0;

  constructor(gameId: string, gameVersion: string = '1.0.0') {
    this.sessionId = generateUUID();
    this.gameId = gameId;
    this.gameVersion = gameVersion;
    this.startedAt = Date.now();
  }

  /** Current score */
  get score(): number { return this._score; }
  set score(value: number) { this._score = value; }

  /** Whether session has ended */
  get isFinished(): boolean { return this._endedAt !== null; }

  /** Whether session is currently paused */
  get isPaused(): boolean { return this._isPaused; }

  /** Duration in seconds (excluding pause time) */
  get duration(): number {
    const endTime = this._endedAt ?? Date.now();
    const totalMs = endTime - this.startedAt - this._totalPauseDuration;
    return Math.max(0, Math.floor(totalMs / 1000));
  }

  /** Pause the session */
  pause(): void {
    if (this._isPaused || this.isFinished) return;
    this._isPaused = true;
    this._pauseStart = Date.now();
    this.addEvent('pause');
  }

  /** Resume the session */
  resume(): void {
    if (!this._isPaused || this.isFinished) return;
    this._totalPauseDuration += Date.now() - this._pauseStart;
    this._isPaused = false;
    this.addEvent('resume');
  }

  /** End the session */
  finish(finalScore?: number): void {
    if (this.isFinished) return;
    if (this._isPaused) this.resume();
    if (finalScore !== undefined) this._score = finalScore;
    this._endedAt = Date.now();
    this.addEvent('finish', { score: this._score });
  }

  /** Add a tracked event */
  addEvent(type: string, data?: any): void {
    this._events.push({ type, data, timestamp: Date.now() });
  }

  /** Get all events */
  getEvents(): SessionEvent[] {
    return [...this._events];
  }

  /** Serialize for storage */
  toJSON() {
    return {
      sessionId: this.sessionId,
      gameId: this.gameId,
      gameVersion: this.gameVersion,
      startedAt: this.startedAt,
      endedAt: this._endedAt,
      score: this._score,
      duration: this.duration,
      eventCount: this._events.length,
    };
  }
}
