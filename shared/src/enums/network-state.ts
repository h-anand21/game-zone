// ============================================================
// GameHub — Shared Enums: Network State
// ============================================================

/** Mobile network connectivity state machine. */
export enum NetworkState {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  CONNECTING = 'CONNECTING',
  RECONNECTING = 'RECONNECTING',
  SYNCING = 'SYNCING',
  SYNC_FAILED = 'SYNC_FAILED',
}
