// ============================================================
// GameHub — useSync Hook
// ============================================================

import { useCallback } from 'react';
import { useNetworkStore } from '@/store';
import { syncManager } from '@/storage/sync/sync-manager';

/**
 * Hook for interacting with the sync queue.
 */
export function useSync() {
  const { state, isOnline, pendingSyncCount, refreshPendingCount } = useNetworkStore();

  /** Manually trigger sync processing. */
  const triggerSync = useCallback(async () => {
    await syncManager.processQueue();
    await refreshPendingCount();
  }, [refreshPendingCount]);

  return {
    networkState: state,
    isOnline,
    pendingSyncCount,
    triggerSync,
    refreshPendingCount,
  };
}
