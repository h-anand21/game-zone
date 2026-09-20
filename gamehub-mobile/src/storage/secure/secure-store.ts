// ============================================================
// GameHub — Secure Store Wrapper
// ============================================================
// Wraps expo-secure-store for auth tokens and sensitive data.

import * as ExpoSecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'gamehub_access_token',
  REFRESH_TOKEN: 'gamehub_refresh_token',
  GUEST_ID: 'gamehub_guest_id',
  DEVICE_ID: 'gamehub_device_id',
} as const;

class SecureStore {
  // ── Access Token ─────────────────────────────

  async getAccessToken(): Promise<string | null> {
    return ExpoSecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  }

  async setAccessToken(token: string): Promise<void> {
    await ExpoSecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
  }

  async removeAccessToken(): Promise<void> {
    await ExpoSecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
  }

  // ── Refresh Token ────────────────────────────

  async getRefreshToken(): Promise<string | null> {
    return ExpoSecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  }

  async setRefreshToken(token: string): Promise<void> {
    await ExpoSecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
  }

  async removeRefreshToken(): Promise<void> {
    await ExpoSecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
  }

  // ── Guest ID ─────────────────────────────────

  async getGuestId(): Promise<string | null> {
    return ExpoSecureStore.getItemAsync(KEYS.GUEST_ID);
  }

  async setGuestId(guestId: string): Promise<void> {
    await ExpoSecureStore.setItemAsync(KEYS.GUEST_ID, guestId);
  }

  // ── Device ID ────────────────────────────────

  async getDeviceId(): Promise<string | null> {
    return ExpoSecureStore.getItemAsync(KEYS.DEVICE_ID);
  }

  async setDeviceId(deviceId: string): Promise<void> {
    await ExpoSecureStore.setItemAsync(KEYS.DEVICE_ID, deviceId);
  }

  // ── Utility ──────────────────────────────────

  /** Clear all auth tokens (logout). */
  async clearAuth(): Promise<void> {
    await this.removeAccessToken();
    await this.removeRefreshToken();
  }

  /** Check if user has valid auth tokens. */
  async hasAuth(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null;
  }
}

export const secureStore = new SecureStore();
