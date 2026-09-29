// ============================================================
// Mind Lock — Haptics Service
// ============================================================

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export class MindLockHaptics {
  private static enabled = true;

  public static setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public static padTap() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }

  public static buttonTap() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  }

  public static success() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  }

  public static error() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  }

  public static victory() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
  }
}
