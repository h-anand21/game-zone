// ============================================================
// ONE TAP: PRECISION GAME — Haptic Feedback Manager
// Crisp tactile feedback for Good, Great, Perfect, Miss, Fever
// ============================================================

import * as Haptics from 'expo-haptics';

let hapticsEnabled = true;

export const OneTapHaptics = {
  setEnabled(enabled: boolean) {
    hapticsEnabled = enabled;
  },

  good() {
    if (!hapticsEnabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
  },

  great() {
    if (!hapticsEnabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignore
    }
  },

  perfect() {
    if (!hapticsEnabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Ignore
    }
  },

  miss() {
    if (!hapticsEnabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Ignore
    }
  },

  fever() {
    if (!hapticsEnabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignore
    }
  },

  countdownTick() {
    if (!hapticsEnabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
  },

  countdownGo() {
    if (!hapticsEnabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Ignore
    }
  },

  newBest() {
    if (!hapticsEnabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignore
    }
  },
};
