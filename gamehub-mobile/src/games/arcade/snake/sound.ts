// ============================================================
// Worms Zone 3D Arena — Audio Cues Helper
// ============================================================

let soundEnabled = true;

export const WormSound = {
  setEnabled: (enabled: boolean) => {
    soundEnabled = enabled;
  },

  playEat: () => {
    if (!soundEnabled) return;
  },

  playKill: () => {
    if (!soundEnabled) return;
  },

  playChestReward: () => {
    if (!soundEnabled) return;
  },

  playBooster: () => {
    if (!soundEnabled) return;
  },
};
