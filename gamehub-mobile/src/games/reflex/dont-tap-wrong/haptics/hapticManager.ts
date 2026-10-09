// ============================================================
// DON'T TAP WRONG — Haptics Manager
// High-precision physical sensation feedback for reflex gameplay
// ============================================================

import * as Haptics from 'expo-haptics';

export class DtwHaptics {
  private static enabled = true;

  static setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  static isEnabled(): boolean {
    return this.enabled;
  }

  static safeTap() {
    if (!this.enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
  }

  static dangerTap() {
    if (!this.enabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Fallback
    }
  }

  static countdownTick() {
    if (!this.enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
  }

  static countdownGo() {
    if (!this.enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Fallback
    }
  }

  static streakMilestone() {
    if (!this.enabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Fallback
    }
  }

  static newBest() {
    if (!this.enabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } catch {}
      }, 120);
    } catch {
      // Fallback
    }
  }
}
