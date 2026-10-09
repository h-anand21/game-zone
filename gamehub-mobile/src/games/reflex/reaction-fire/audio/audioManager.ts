// ============================================================
// REACTION FIRE — Audio Feedback Manager
// Crash-safe audio triggers with mute enforcement
// ============================================================

export class RfAudio {
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

  static playSignalGo() {
    if (!this.soundEnabled) return;
    // Short high-frequency burst
  }

  static playSuccess() {
    if (!this.soundEnabled) return;
    // Crisp hit cue
  }

  static playFalseStart() {
    if (!this.soundEnabled) return;
    // Warning buzzer
  }

  static playCountdownTick() {
    if (!this.soundEnabled) return;
    // Radar pulse tick
  }

  static playNewRecord() {
    if (!this.soundEnabled) return;
    // Celebration chime
  }

  static playButtonClick() {
    if (!this.soundEnabled) return;
    // Tactile UI click
  }
}
