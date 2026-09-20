// ============================================================
// GameHub — Shared Contracts: Sync
// ============================================================

/** Types of events that can be synced from offline → cloud. */
export type SyncEventType =
  | 'score_submit'
  | 'stats_update'
  | 'achievement_unlock'
  | 'profile_update'
  | 'progress_save';

/** A single sync event sent from the mobile client. */
export interface SyncEvent {
  /** Client-generated UUID — used for idempotency. */
  eventId: string;
  type: SyncEventType;
  payload: Record<string, unknown>;
  /** ISO timestamp of when the event occurred on the client. */
  clientTimestamp: string;
}

/** Bulk sync request — sends multiple offline events at once. */
export interface SyncRequest {
  events: SyncEvent[];
}

/** Result for each event in a bulk sync. */
export interface SyncEventResult {
  eventId: string;
  status: 'processed' | 'duplicate' | 'failed';
  error?: string;
}

/** Bulk sync response. */
export interface SyncResponse {
  results: SyncEventResult[];
}
