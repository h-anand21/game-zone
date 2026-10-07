// ============================================================
// AIM RUSH — Audio Engine
// Non-blocking arcade sound triggers with mute control
// ============================================================

import { Audio } from 'expo-av';

export class AimRushAudio {
  private static soundEnabled = true;
  private static musicEnabled = true;

  static setSoundEnabled(val: boolean) {
    this.soundEnabled = val;
  }

  static setMusicEnabled(val: boolean) {
    this.musicEnabled = val;
  }

  // Prepares the audio engine mode safely
  static async init() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (e) {
      // Ignore
    }
  }

  static playHit() {
    if (!this.soundEnabled) return;
    // Trigger tick/snap tone
  }

  static playPerfect() {
    if (!this.soundEnabled) return;
    // Trigger high chime
  }

  static playComboUp() {
    if (!this.soundEnabled) return;
    // Trigger rising pitch
  }

  static playMiss() {
    if (!this.soundEnabled) return;
    // Trigger low buzz
  }

  static playCountdownTick() {
    if (!this.soundEnabled) return;
    // Trigger short pulse
  }

  static playGameStart() {
    if (!this.soundEnabled) return;
    // Trigger rush alert
  }
}
