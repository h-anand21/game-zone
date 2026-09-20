// ============================================================
// GameHub — Sync Manager
// ============================================================
// Processes the offline sync queue when connectivity is available.
// Uses exponential backoff and idempotent event_ids.

import { getDatabase } from '../sqlite/database';
import { SyncQueueRepository } from '../sqlite/repositories/SyncQueueRepository';
import { networkMonitor } from './network-monitor';
import apiClient from '@/services/api/client';

const BATCH_SIZE = 10;
const BASE_DELAY = 2000; // 2 seconds

class SyncManager {
  private isProcessing = false;
  private networkUnsubscribe: (() => void) | null = null;

  /** Start listening for connectivity and auto-sync. */
  start(): void {
    if (this.networkUnsubscribe) return;

    this.networkUnsubscribe = networkMonitor.subscribe((state) => {
      if (state === 'ONLINE') {
        this.processQueue();
      }
    });

    // Process if already online
    if (networkMonitor.isOnline()) {
      this.processQueue();
    }
  }

  /** Stop auto-sync. */
  stop(): void {
    if (this.networkUnsubscribe) {
      this.networkUnsubscribe();
      this.networkUnsubscribe = null;
    }
  }

  /** Manually trigger sync queue processing. */
  async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    if (!networkMonitor.isOnline()) return;

    this.isProcessing = true;
    networkMonitor.startSync();

    try {
      const db = await getDatabase();
      const syncRepo = new SyncQueueRepository(db);

      const pending = await syncRepo.getPending(BATCH_SIZE);
      if (pending.length === 0) {
        networkMonitor.finishSync(true);
        this.isProcessing = false;
        return;
      }

      console.log(`[Sync] Processing ${pending.length} pending events`);

      // Build batch payload
      const events = pending.map((item) => ({
        eventId: item.event_id,
        type: item.type,
        payload: JSON.parse(item.payload),
        clientTimestamp: item.created_at,
      }));

      // Mark all as processing
      for (const item of pending) {
        await syncRepo.markProcessing(item.id);
      }

      try {
        // Send batch to server
        const response = await apiClient.post<{
          success: boolean;
          data?: { results: { eventId: string; status: string; error?: string }[] };
        }>('/api/v1/sync', { events });

        if (response.success && response.data) {
          // Process individual results
          for (const result of response.data.results) {
            const item = pending.find((p) => p.event_id === result.eventId);
            if (!item) continue;

            if (result.status === 'processed' || result.status === 'duplicate') {
              await syncRepo.markCompleted(item.id);
            } else {
              await syncRepo.markFailed(item.id);
            }
          }
        } else {
          // Bulk failure — mark all as failed
          for (const item of pending) {
            await syncRepo.markFailed(item.id);
          }
        }

        networkMonitor.finishSync(true);
      } catch (error) {
        console.error('[Sync] Batch sync failed:', error);
        // Mark all as failed (will retry with backoff)
        for (const item of pending) {
          await syncRepo.markFailed(item.id);
        }
        networkMonitor.finishSync(false);
      }

      // Check if more items pending
      const remaining = await syncRepo.getPendingCount();
      if (remaining > 0 && networkMonitor.isOnline()) {
        // Schedule next batch with delay
        setTimeout(() => {
          this.isProcessing = false;
          this.processQueue();
        }, BASE_DELAY);
        return;
      }
    } catch (error) {
      console.error('[Sync] Queue processing error:', error);
      networkMonitor.finishSync(false);
    }

    this.isProcessing = false;
  }

  /** Get count of pending items. */
  async getPendingCount(): Promise<number> {
    const db = await getDatabase();
    const syncRepo = new SyncQueueRepository(db);
    return syncRepo.getPendingCount();
  }
}

export const syncManager = new SyncManager();
