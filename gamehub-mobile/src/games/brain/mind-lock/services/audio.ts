// ============================================================
// Mind Lock — Sound Audio Service (Crash-Proof Synthesizer)
// ============================================================

import { Platform } from 'react-native';
import type { PadColor } from '../types';

export class MindLockAudio {
  private static soundEnabled = true;
  private static musicEnabled = true;
  private static musicVolume = 0.5;

  public static setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public static setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
  }

  public static setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  // Pure Web Audio API tone synthesizer (Web Browser)
  private static playWebTone(freq: number, duration: number = 0.16) {
    if (!this.soundEnabled || Platform.OS !== 'web' || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3 * this.musicVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  public static async playPad(color: PadColor) {
    const freqs: Record<PadColor, number> = {
      red: 261.63,
      blue: 329.63,
      green: 392.00,
      yellow: 523.25,
    };
    this.playWebTone(freqs[color] || 440, 0.2);
  }

  public static async playButton() {
    this.playWebTone(440, 0.08);
  }

  public static async playCorrect() {
    this.playWebTone(587.33, 0.25);
  }

  public static async playWrong() {
    this.playWebTone(130.81, 0.3);
  }

  public static async playVictory() {
    this.playWebTone(659.25, 0.4);
  }

  public static async playUnlock() {
    this.playWebTone(783.99, 0.35);
  }
}

