// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Haptic Feedback Utility
// ============================================================

import * as Haptics from 'expo-haptics';

export const ArrowHaptics = {
  /** Light tap when touching an arrow or selecting a button */
  touch: () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  },

  /** Satisfying medium thump when an arrow slides free */
  slide: () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  },

  /** Error vibration when an arrow hits a blocker */
  blocked: () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  },

  /** Celebratory heavy triple-buzz when completing level */
  victory: () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  },

  /** Button press */
  buttonPress: () => {
    try {
      Haptics.selectionAsync();
    } catch {}
  },
};
