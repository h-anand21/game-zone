// ============================================================
// GameHub — Account Linker
// ============================================================
// Handles guest → cloud account linking and data merge.

import { getDatabase } from '../sqlite/database';
import { UserRepository } from '../sqlite/repositories/UserRepository';
import { SyncQueueRepository } from '../sqlite/repositories/SyncQueueRepository';
import apiClient from '@/services/api/client';
import { secureStore } from '../secure/secure-store';

export interface LinkResult {
  success: boolean;
  error?: string;
}

/**
 * Link a guest account to a newly created cloud account.
 * Steps:
 * 1. Register with guest_id
 * 2. Store tokens securely
 * 3. Update local user with cloud_user_id
 * 4. Trigger sync of all pending offline data
 */
export async function linkGuestToCloud(params: {
  username: string;
  email: string;
  password: string;
}): Promise<LinkResult> {
  try {
    const db = await getDatabase();
    const userRepo = new UserRepository(db);
    const user = await userRepo.getUser();

    if (!user) {
      return { success: false, error: 'No local user found' };
    }

    if (user.cloud_user_id) {
      return { success: false, error: 'Account already linked' };
    }

    // Register with guest_id for data linking
    const response = await apiClient.post<{
      success: boolean;
      data?: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: { id: string; username: string; email: string };
      };
      error?: { code: string; message: string };
    }>('/api/v1/auth/register', {
      username: params.username,
      email: params.email,
      password: params.password,
      guestId: user.guest_id,
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error?.message ?? 'Registration failed',
      };
    }

    // Store tokens securely
    await secureStore.setAccessToken(response.data.accessToken);
    await secureStore.setRefreshToken(response.data.refreshToken);

    // Update local user with cloud identity
    await userRepo.linkToCloud(response.data.user.id);
    await userRepo.updateProfile({
      username: response.data.user.username,
    });

    console.log('[AccountLinker] Guest account linked successfully');
    return { success: true };
  } catch (error) {
    console.error('[AccountLinker] Link failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Login to an existing cloud account.
 */
export async function loginToCloud(params: {
  email: string;
  password: string;
}): Promise<LinkResult> {
  try {
    const response = await apiClient.post<{
      success: boolean;
      data?: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: { id: string; username: string; email: string };
      };
      error?: { code: string; message: string };
    }>('/api/v1/auth/login', params);

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error?.message ?? 'Login failed',
      };
    }

    // Store tokens
    await secureStore.setAccessToken(response.data.accessToken);
    await secureStore.setRefreshToken(response.data.refreshToken);

    // Update local user
    const db = await getDatabase();
    const userRepo = new UserRepository(db);
    await userRepo.linkToCloud(response.data.user.id);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
