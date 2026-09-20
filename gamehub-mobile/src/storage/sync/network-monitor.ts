// ============================================================
// GameHub — Network Monitor
// ============================================================
// Tracks connectivity using @react-native-community/netinfo
// and exposes a state machine via Zustand.

import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import type { NetworkState } from '@/constants/types';

type NetworkListener = (state: NetworkState) => void;

class NetworkMonitor {
  private currentState: NetworkState = 'OFFLINE';
  private listeners: Set<NetworkListener> = new Set();
  private unsubscribe: (() => void) | null = null;

  /** Start monitoring network state. */
  start(): void {
    if (this.unsubscribe) return; // Already running

    this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const wasOnline = this.currentState === 'ONLINE' || this.currentState === 'SYNCING';
      const isNowConnected = state.isConnected && state.isInternetReachable !== false;

      if (isNowConnected && !wasOnline) {
        this.transition('CONNECTING');
        // Short delay to confirm stable connection
        setTimeout(() => {
          if (this.currentState === 'CONNECTING') {
            this.transition('ONLINE');
          }
        }, 1000);
      } else if (!isNowConnected && wasOnline) {
        this.transition('OFFLINE');
      }
    });

    // Check initial state
    NetInfo.fetch().then((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        this.transition('ONLINE');
      } else {
        this.transition('OFFLINE');
      }
    });
  }

  /** Stop monitoring. */
  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /** Get the current network state. */
  getState(): NetworkState {
    return this.currentState;
  }

  /** Check if we're online. */
  isOnline(): boolean {
    return this.currentState === 'ONLINE' || this.currentState === 'SYNCING';
  }

  /** Transition to syncing state. */
  startSync(): void {
    if (this.currentState === 'ONLINE') {
      this.transition('SYNCING');
    }
  }

  /** Transition back from syncing. */
  finishSync(success: boolean): void {
    if (this.currentState === 'SYNCING') {
      this.transition(success ? 'ONLINE' : 'SYNC_FAILED');
    }
  }

  /** Subscribe to state changes. Returns unsubscribe function. */
  subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private transition(newState: NetworkState): void {
    if (this.currentState === newState) return;

    console.log(`[Network] ${this.currentState} → ${newState}`);
    this.currentState = newState;

    for (const listener of this.listeners) {
      listener(newState);
    }
  }
}

export const networkMonitor = new NetworkMonitor();
