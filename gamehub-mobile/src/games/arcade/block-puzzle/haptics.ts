// ============================================================
// Block Blast — Tactile Haptics Module
// ============================================================

import * as Haptics from 'expo-haptics';

export const BlockHaptics = {
  /**
   * Triggered when player touches and begins dragging a piece
   */
  piecePickup: () => {
    try {
      Haptics.selectionAsync();
    } catch {}
  },

  /**
   * Triggered when piece snaps or enters a valid grid target
   */
  gridSnap: () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  },

  /**
   * Triggered when piece is successfully placed on grid
   */
  piecePlaced: () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  },

  /**
   * Triggered when 1 or more rows/columns are cleared (blast)
   */
  lineBlast: () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
  },

  /**
   * Triggered on combo streak multipliers
   */
  comboStreak: (streak: number) => {
    try {
      if (streak >= 3) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch {}
  },

  /**
   * Triggered when game is over
   */
  gameOver: () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  },
};
