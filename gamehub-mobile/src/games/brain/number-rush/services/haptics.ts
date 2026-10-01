// ============================================================
// Number Rush — Haptics Service
// ============================================================

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export class NRHaptics {
  private static enabled = true;

  public static setEnabled(val: boolean) {
    this.enabled = val;
  }

  public static async buttonTap() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }

  public static async success() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  }

  public static async error() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  }

  public static async heavy() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
  }

  public static async medium() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  }
}
