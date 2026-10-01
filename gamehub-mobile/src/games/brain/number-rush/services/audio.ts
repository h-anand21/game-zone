// ============================================================
// Number Rush — Sound & Audio Service (Crash-Proof Synthesizer)
// ============================================================

import { Platform } from 'react-native';

export class NRAudio {
  private static soundEnabled = true;
  private static musicEnabled = true;
  private static volume = 0.6;

  public static setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public static setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
  }

  public static setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  private static playWebTone(
    freq: number,
    duration = 0.15,
    type: OscillatorType = 'sine',
    startGain = 0.25
  ) {
    if (!this.soundEnabled || Platform.OS !== 'web' || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(startGain * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  public static playButton() {
    this.playWebTone(520, 0.08, 'triangle', 0.2);
  }

  public static playCorrect() {
    if (!this.soundEnabled) return;
    this.playWebTone(587.33, 0.12, 'sine', 0.25);
    setTimeout(() => {
      this.playWebTone(880.0, 0.22, 'sine', 0.3);
    }, 90);
  }

  public static playWrong() {
    if (!this.soundEnabled) return;
    this.playWebTone(140.0, 0.22, 'sawtooth', 0.2);
  }

  public static playCombo() {
    if (!this.soundEnabled) return;
    this.playWebTone(523.25, 0.1, 'triangle', 0.25);
    setTimeout(() => this.playWebTone(659.25, 0.1, 'triangle', 0.25), 80);
    setTimeout(() => this.playWebTone(783.99, 0.15, 'triangle', 0.3), 160);
    setTimeout(() => this.playWebTone(1046.5, 0.3, 'sine', 0.35), 240);
  }

  public static playCountdownTick() {
    this.playWebTone(440, 0.09, 'sine', 0.2);
  }

  public static playCountdownGo() {
    this.playWebTone(880, 0.35, 'triangle', 0.35);
  }

  public static playPowerUp() {
    if (!this.soundEnabled) return;
    this.playWebTone(392, 0.1, 'sine', 0.2);
    setTimeout(() => this.playWebTone(659.25, 0.2, 'sine', 0.25), 100);
  }

  public static playVictory() {
    if (!this.soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playWebTone(freq, 0.25, 'triangle', 0.28);
      }, idx * 110);
    });
  }
}
