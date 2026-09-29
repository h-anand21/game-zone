// ============================================================
// Mind Lock — Sound Audio Service
// ============================================================

import { Audio } from 'expo-av';
import type { PadColor } from '../types';

export class MindLockAudio {
  private static soundEnabled = true;
  private static musicEnabled = true;
  private static musicVolume = 0.5;

  private static sounds: Record<string, Audio.Sound> = {};

  public static setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public static setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
  }

  public static setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  public static async playPad(color: PadColor) {
    if (!this.soundEnabled) return;
    try {
      let soundAsset;
      switch (color) {
        case 'red':
          soundAsset = require('@/../assets/mind-lock/sounds/pad-red.wav');
          break;
        case 'blue':
          soundAsset = require('@/../assets/mind-lock/sounds/pad-blue.wav');
          break;
        case 'green':
          soundAsset = require('@/../assets/mind-lock/sounds/pad-green.wav');
          break;
        case 'yellow':
          soundAsset = require('@/../assets/mind-lock/sounds/pad-yellow.wav');
          break;
      }
      const { sound } = await Audio.Sound.createAsync(soundAsset, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {}
  }

  public static async playButton() {
    if (!this.soundEnabled) return;
    try {
      const soundAsset = require('@/../assets/mind-lock/sounds/button.wav');
      const { sound } = await Audio.Sound.createAsync(soundAsset, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {}
  }

  public static async playCorrect() {
    if (!this.soundEnabled) return;
    try {
      const soundAsset = require('@/../assets/mind-lock/sounds/correct.wav');
      const { sound } = await Audio.Sound.createAsync(soundAsset, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {}
  }

  public static async playWrong() {
    if (!this.soundEnabled) return;
    try {
      const soundAsset = require('@/../assets/mind-lock/sounds/wrong.wav');
      const { sound } = await Audio.Sound.createAsync(soundAsset, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {}
  }

  public static async playVictory() {
    if (!this.soundEnabled) return;
    try {
      const soundAsset = require('@/../assets/mind-lock/sounds/victory.wav');
      const { sound } = await Audio.Sound.createAsync(soundAsset, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {}
  }

  public static async playUnlock() {
    if (!this.soundEnabled) return;
    try {
      const soundAsset = require('@/../assets/mind-lock/sounds/unlock.wav');
      const { sound } = await Audio.Sound.createAsync(soundAsset, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {}
  }
}
