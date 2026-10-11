// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Audio Feedback System
// ============================================================

import { Audio } from 'expo-av';

let soundEnabled = true;

export const ArrowAudio = {
  setEnabled: (enabled: boolean) => {
    soundEnabled = enabled;
  },

  playWhoosh: async () => {
    if (!soundEnabled) return;
    // Non-blocking trigger
  },

  playBlocked: async () => {
    if (!soundEnabled) return;
  },

  playWin: async () => {
    if (!soundEnabled) return;
  },

  playCoin: async () => {
    if (!soundEnabled) return;
  },

  playClick: async () => {
    if (!soundEnabled) return;
  },

  playChestOpen: async () => {
    if (!soundEnabled) return;
  },
};
