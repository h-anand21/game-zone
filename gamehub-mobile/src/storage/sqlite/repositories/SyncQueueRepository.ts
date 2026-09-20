// ============================================================
// GameHub — Sync Queue Repository
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';
import { Tables, type SyncQueueRow } from '../schema';

export class SyncQueueRepository {
  constructor(private db: SQLiteDatabase) {}

  /** Enqueue a new sync event. */
  async enqueue(item: {
    id: string;
    eventId: string;
    type: string;
    payload: Record<string, unknown>;
    maxRetries?: number;
  }): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO ${Tables.SYNC_QUEUE} (id, event_id, type, payload, status, retry_count, max_retries) VALUES (?, ?, ?, ?, 'pending', 0, ?)`,
      [
        item.id,
        item.eventId,
        item.type,
        JSON.stringify(item.payload),
        item.maxRetries ?? 5,
      ]
    );
  }

  /** Get all pending items, ordered by creation time. */
  async getPending(limit: number = 50): Promise<SyncQueueRow[]> {
    return this.db.getAllAsync<SyncQueueRow>(
      `SELECT * FROM ${Tables.SYNC_QUEUE} WHERE status = 'pending' ORDER BY created_at ASC LIMIT ?`,
      [limit]
    );
  }

  /** Get all failed items for manual retry. */
  async getFailed(): Promise<SyncQueueRow[]> {
    return this.db.getAllAsync<SyncQueueRow>(
      `SELECT * FROM ${Tables.SYNC_QUEUE} WHERE status = 'failed' ORDER BY created_at ASC`
    );
  }

  /** Mark an item as processing. */
  async markProcessing(id: string): Promise<void> {
    await this.db.runAsync(
      `UPDATE ${Tables.SYNC_QUEUE} SET status = 'processing' WHERE id = ?`,
      [id]
    );
  }

  /** Mark an item as completed (successfully synced). */
  async markCompleted(id: string): Promise<void> {
    await this.db.runAsync(
      `UPDATE ${Tables.SYNC_QUEUE} SET status = 'completed' WHERE id = ?`,
      [id]
    );
  }

  /** Mark an item as failed, incrementing retry count. */
  async markFailed(id: string): Promise<void> {
    await this.db.runAsync(
      `UPDATE ${Tables.SYNC_QUEUE}
       SET status = CASE WHEN retry_count + 1 >= max_retries THEN 'failed' ELSE 'pending' END,
           retry_count = retry_count + 1
       WHERE id = ?`,
      [id]
    );
  }

  /** Get count of pending sync items. */
  async getPendingCount(): Promise<number> {
    const result = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${Tables.SYNC_QUEUE} WHERE status IN ('pending', 'processing')`
    );
    return result?.count ?? 0;
  }

  /** Delete completed items older than N days. */
  async cleanup(daysOld: number = 30): Promise<number> {
    const result = await this.db.runAsync(
      `DELETE FROM ${Tables.SYNC_QUEUE}
       WHERE status = 'completed'
       AND created_at < datetime('now', ?)`,
      [`-${daysOld} days`]
    );
    return result.changes;
  }

  /** Reset all failed items back to pending for retry. */
  async retryAllFailed(): Promise<number> {
    const result = await this.db.runAsync(
      `UPDATE ${Tables.SYNC_QUEUE} SET status = 'pending', retry_count = 0 WHERE status = 'failed'`
    );
    return result.changes;
  }
}
