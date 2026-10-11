// ============================================================
// STACK MASTER — Haptics Controller
// ============================================================

import * as Haptics from 'expo-haptics';

export const StackHaptics = {
  buttonPress: (enabled = true) => {
    if (!enabled) return;
    try {
      Haptics.selectionAsync();
    } catch {}
  },

  placeGood: (enabled = true) => {
    if (!enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  },

  placePerfect: (enabled = true) => {
    if (!enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  },

  comboStreak: (enabled = true) => {
    if (!enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
  },

  milestone: (enabled = true) => {
    if (!enabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  },

  gameOver: (enabled = true) => {
    if (!enabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  },
};
