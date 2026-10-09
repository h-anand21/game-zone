// ============================================================
// DON'T TAP WRONG — Arcade Audio Manager
// Crash-safe, low-latency audio feedback system
// ============================================================

export class DtwAudio {
  private static soundEnabled = true;
  private static musicEnabled = true;

  static setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  static setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
  }

  static isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  static isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  static playSafeTap() {
    if (!this.soundEnabled) return;
    // Fast snap/click feedback
  }

  static playDangerTap() {
    if (!this.soundEnabled) return;
    // Error / buzzer feedback
  }

  static playCountdownTick() {
    if (!this.soundEnabled) return;
    // Tick tone
  }

  static playCountdownGo() {
    if (!this.soundEnabled) return;
    // Start buzzer/bell
  }

  static playMilestone() {
    if (!this.soundEnabled) return;
    // Chime reward
  }

  static playNewBest() {
    if (!this.soundEnabled) return;
    // Fanfare
  }

  static playButtonClick() {
    if (!this.soundEnabled) return;
    // Subtle tactile tap
  }
}
