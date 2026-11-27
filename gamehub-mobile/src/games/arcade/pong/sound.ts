// ============================================================
// Woodland Bubble Shooter — Pitch-Escalating Sound Interface
// ============================================================

let soundEnabled = true;

export const BubbleSound = {
  setEnabled: (enabled: boolean) => {
    soundEnabled = enabled;
  },

  /**
   * Musical C-major scale frequencies for escalating chain combos
   */
  comboNotes: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25],

  getNoteFrequency: (streak: number): number => {
    const idx = Math.max(0, Math.min(streak - 1, BubbleSound.comboNotes.length - 1));
    return BubbleSound.comboNotes[idx];
  },

  playShoot: () => {
    if (!soundEnabled) return;
  },

  playPopCombo: (streak: number) => {
    if (!soundEnabled) return;
    void BubbleSound.getNoteFrequency(streak);
  },

  playPowerBlast: () => {
    if (!soundEnabled) return;
  },

  playLevelWin: () => {
    if (!soundEnabled) return;
  },
};
