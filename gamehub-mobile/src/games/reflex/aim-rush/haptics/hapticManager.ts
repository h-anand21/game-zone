// ============================================================
// AIM RUSH — Haptic Feedback Engine
// Controlled physical touch sensations for arcade precision
// ============================================================

import * as Haptics from 'expo-haptics';

export class AimRushHaptics {
  private static enabled = true;

  static setEnabled(val: boolean) {
    this.enabled = val;
  }

  static hitNormal() {
    if (!this.enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignored if device doesn't support
    }
  }

  static hitGreat() {
    if (!this.enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Ignore
    }
  }

  static hitPerfect() {
    if (!this.enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {
      // Ignore
    }
  }

  static comboMilestone() {
    if (!this.enabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Ignore
    }
  }

  static missOrDanger() {
    if (!this.enabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (e) {
      // Ignore
    }
  }

  static newBest() {
    if (!this.enabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } catch (e) {}
      }, 150);
    } catch (e) {
      // Ignore
    }
  }
}
