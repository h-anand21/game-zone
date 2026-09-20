// ============================================================
// GameHub — Sync Service API
// ============================================================

import apiClient from './client';

export interface SyncEventItem {
  eventId: string;
  type: string;
  payload: any;
  timestamp: number;
}

export interface SyncResponse {
  success: boolean;
  data?: {
    processedEvents: string[];
  };
  message?: string;
  error?: {
    message: string;
  };
}

export async function pushSyncEventsApi(events: SyncEventItem[]): Promise<SyncResponse> {
  return apiClient.post<SyncResponse>('/api/v1/sync', { events });
}
