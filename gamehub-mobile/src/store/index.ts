// ============================================================
// GameHub — Zustand Stores
// ============================================================

// Placeholder stores — will be fleshed out in Phase 2+ with SQLite integration.

// Auth store — manages guest identity and cloud auth state
export interface AuthState {
  guestId: string | null;
  deviceId: string | null;
  cloudUserId: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
}

// Profile store — manages user profile data
export interface ProfileState {
  displayName: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  coins: number;
  gamesPlayed: number;
}

// Network store — manages connectivity state
export interface NetworkStoreState {
  state: 'ONLINE' | 'OFFLINE' | 'CONNECTING' | 'RECONNECTING' | 'SYNCING' | 'SYNC_FAILED';
  isOnline: boolean;
  pendingSyncCount: number;
}

// Feature flag store
export interface FeatureFlagState {
  fpsEnabled: boolean;
  onlineMultiplayerEnabled: boolean;
  dailyChallengesEnabled: boolean;
  friendsEnabled: boolean;
}

// Note: Zustand stores will be implemented in Phase 2 when
// SQLite persistence is added. For now, the type definitions
// serve as the API contract.
