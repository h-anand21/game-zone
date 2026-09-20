// ============================================================
// GameHub — Feature Flag Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { DEFAULT_FEATURE_FLAGS } from '@/constants/features';
import type { FeatureFlags } from '@/constants/types';

interface FeatureFlagState extends FeatureFlags {
  isLoaded: boolean;
  loadFlags: () => Promise<void>;
  updateFlags: (flags: Partial<FeatureFlags>) => void;
}

export const useFeatureFlagStore = create<FeatureFlagState>((set) => ({
  ...DEFAULT_FEATURE_FLAGS,
  isLoaded: false,

  /**
   * Load feature flags from remote config cache (SQLite).
   * Falls back to defaults if not available.
   * In Phase 7+, this will fetch from the backend.
   */
  loadFlags: async () => {
    try {
      // Phase 2: Use defaults only
      // Phase 7+: Fetch from backend, cache in SQLite
      set({ ...DEFAULT_FEATURE_FLAGS, isLoaded: true });
    } catch (error) {
      console.error('[FeatureFlags] Load failed:', error);
      set({ ...DEFAULT_FEATURE_FLAGS, isLoaded: true });
    }
  },

  updateFlags: (flags: Partial<FeatureFlags>) => {
    set((state) => ({ ...state, ...flags }));
  },
}));
