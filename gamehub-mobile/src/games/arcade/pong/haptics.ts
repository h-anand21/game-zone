// ============================================================
// Woodland Bubble Shooter — Tactile Haptics Helper
// ============================================================

import * as Haptics from 'expo-haptics';

let hapticsEnabled = true;

export const BubbleHaptics = {
  setEnabled: (enabled: boolean) => {
    hapticsEnabled = enabled;
  },

  shoot: () => {
    if (!hapticsEnabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  },

  swap: () => {
    if (!hapticsEnabled) return;
    try {
      Haptics.selectionAsync();
    } catch {}
  },

  pop: (popCount: number) => {
    if (!hapticsEnabled) return;
    try {
      if (popCount >= 6) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {}
  },

  powerBlast: () => {
    if (!hapticsEnabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  },

  levelWin: () => {
    if (!hapticsEnabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  },

  gameOver: () => {
    if (!hapticsEnabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  },
};
