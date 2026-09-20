// ============================================================
// GameHub — Network Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { networkMonitor } from '@/storage/sync/network-monitor';
import { syncManager } from '@/storage/sync/sync-manager';
import type { NetworkState } from '@/constants/types';

interface NetworkStoreState {
  state: NetworkState;
  isOnline: boolean;
  pendingSyncCount: number;

  // Actions
  initialize: () => void;
  refreshPendingCount: () => Promise<void>;
  cleanup: () => void;
}

export const useNetworkStore = create<NetworkStoreState>((set, get) => {
  let unsubscribe: (() => void) | null = null;

  return {
    state: 'OFFLINE',
    isOnline: false,
    pendingSyncCount: 0,

    initialize: () => {
      // Start network monitoring
      networkMonitor.start();

      // Subscribe to state changes
      unsubscribe = networkMonitor.subscribe((newState) => {
        set({
          state: newState,
          isOnline: newState === 'ONLINE' || newState === 'SYNCING',
        });
      });

      // Start sync manager
      syncManager.start();

      // Set initial state
      set({
        state: networkMonitor.getState(),
        isOnline: networkMonitor.isOnline(),
      });

      // Load pending count
      get().refreshPendingCount();
    },

    refreshPendingCount: async () => {
      try {
        const count = await syncManager.getPendingCount();
        set({ pendingSyncCount: count });
      } catch {
        // Ignore — DB may not be ready yet
      }
    },

    cleanup: () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      networkMonitor.stop();
      syncManager.stop();
    },
  };
});
