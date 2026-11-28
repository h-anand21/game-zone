// ============================================================
// Worms Zone 3D Arena — Tactile Haptics Helper
// ============================================================

import * as Haptics from 'expo-haptics';

let hapticsEnabled = true;

export const WormHaptics = {
  setEnabled: (enabled: boolean) => {
    hapticsEnabled = enabled;
  },

  eat: (isLoot: boolean) => {
    if (!hapticsEnabled) return;
    try {
      Haptics.impactAsync(
        isLoot ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
      );
    } catch {}
  },

  chestUnlock: () => {
    if (!hapticsEnabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  },

  killBot: () => {
    if (!hapticsEnabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
  },

  boosterActivated: () => {
    if (!hapticsEnabled) return;
    try {
      Haptics.selectionAsync();
    } catch {}
  },

  gameOver: () => {
    if (!hapticsEnabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  },
};
