// ============================================================
// GameHub — Auth Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { getDatabase } from '@/storage/sqlite/database';
import { UserRepository } from '@/storage/sqlite/repositories/UserRepository';
import { secureStore } from '@/storage/secure/secure-store';

interface AuthState {
  // State
  guestId: string | null;
  deviceId: string | null;
  cloudUserId: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  setTokens: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
}

import { generateUUID } from '@/utils/uuid';

/**
 * Generate a random guest username like "Player_A3F2".
 */
function generateGuestUsername(): string {
  const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `Player_${hex}`;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  guestId: null,
  deviceId: null,
  cloudUserId: null,
  accessToken: null,
  isAuthenticated: false,
  isGuest: true,
  isInitialized: false,

  /**
   * Initialize auth state on app launch.
   * - Creates guest identity if first launch
   * - Loads existing user from SQLite
   * - Restores auth tokens from secure store
   */
  initialize: async () => {
    try {
      const db = await getDatabase();
      const userRepo = new UserRepository(db);

      // Check for existing user
      let user = await userRepo.getUser();

      if (!user) {
        // First launch — create guest identity
        const guestId = generateUUID();
        const deviceId = generateUUID();
        const userId = generateUUID();
        const username = generateGuestUsername();

        await userRepo.createGuestUser({
          id: userId,
          guestId,
          deviceId,
          username,
          displayName: 'Guest Player',
        });

        // Persist to secure store
        await secureStore.setGuestId(guestId);
        await secureStore.setDeviceId(deviceId);

        user = await userRepo.getUser();
        console.log(`[Auth] Guest identity created: ${username}`);
      }

      // Restore tokens
      const accessToken = await secureStore.getAccessToken();

      set({
        guestId: user?.guest_id ?? null,
        deviceId: user?.device_id ?? null,
        cloudUserId: user?.cloud_user_id ?? null,
        accessToken,
        isAuthenticated: !!accessToken,
        isGuest: !user?.cloud_user_id,
        isInitialized: true,
      });

      console.log(`[Auth] Initialized — guest: ${!user?.cloud_user_id}, authenticated: ${!!accessToken}`);
    } catch (error) {
      console.error('[Auth] Initialization failed:', error);
      set({ isInitialized: true }); // Still mark as initialized to unblock UI
    }
  },

  setTokens: async (access: string, refresh: string) => {
    await secureStore.setAccessToken(access);
    await secureStore.setRefreshToken(refresh);
    set({ accessToken: access, isAuthenticated: true });
  },

  logout: async () => {
    await secureStore.clearAuth();
    set({ accessToken: null, isAuthenticated: false });
  },
}));
