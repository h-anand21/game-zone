// ============================================================
// Mind Lock — Procedural Audio Service (100% Code-Generated Tones)
// ============================================================

import { Audio } from 'expo-av';
import type { PadColor } from '../types';

// Fast Base64 encoder for binary audio buffers
const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function bytesToBase64(bytes: Uint8Array): string {
  let result = '';
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < len ? bytes[i + 1] : 0;
    const b3 = i + 2 < len ? bytes[i + 2] : 0;

    result += B64_CHARS[b1 >> 2];
    result += B64_CHARS[((b1 & 3) << 4) | (b2 >> 4)];
    result += i + 1 < len ? B64_CHARS[((b2 & 15) << 2) | (b3 >> 6)] : '=';
    result += i + 2 < len ? B64_CHARS[b3 & 63] : '=';
  }
  return result;
}

// Procedural WAV sound synthesizer
function generateToneDataUri(freq: number, duration: number = 0.16, waveType: 'sine' | 'square' = 'sine'): string {
  try {
    const sampleRate = 11025;
    const numSamples = Math.floor(sampleRate * duration);
    const dataSize = numSamples * 2;
    const fileSize = 44 + dataSize;
    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, fileSize - 8, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"

    // "fmt " sub-chunk
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true);          // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true);           // AudioFormat (1 = PCM)
    view.setUint16(22, 1, true);           // NumChannels (1 = Mono)
    view.setUint32(24, sampleRate, true);  // SampleRate
    view.setUint32(28, sampleRate * 2, true); // ByteRate
    view.setUint16(32, 2, true);           // BlockAlign
    view.setUint16(34, 16, true);          // BitsPerSample

    // "data" sub-chunk
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, dataSize, true);

    // Generate samples with envelope decay
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const decay = Math.max(0, 1 - (i / numSamples) * 0.9);
      let s = 0;
      if (waveType === 'square') {
        s = Math.sin(2 * Math.PI * freq * t) >= 0 ? 0.4 : -0.4;
      } else {
        s = Math.sin(2 * Math.PI * freq * t) * 0.6;
      }
      view.setInt16(44 + i * 2, Math.floor(s * decay * 32767), true);
    }

    const bytes = new Uint8Array(buffer);
    return `data:audio/wav;base64,${bytesToBase64(bytes)}`;
  } catch {
    return '';
  }
}

// Pre-cached procedural tones
const TONES: Record<string, string> = {
  red: generateToneDataUri(261.63, 0.18),    // C4 note
  blue: generateToneDataUri(329.63, 0.18),   // E4 note
  green: generateToneDataUri(392.00, 0.18),  // G4 note
  yellow: generateToneDataUri(523.25, 0.18), // C5 note
  button: generateToneDataUri(440.00, 0.08), // Short click
  correct: generateToneDataUri(587.33, 0.25),// High harmonic
  wrong: generateToneDataUri(130.81, 0.28, 'square'), // Low buzz
  victory: generateToneDataUri(659.25, 0.35),
  unlock: generateToneDataUri(783.99, 0.30),
};

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

  private static async playTone(toneUri: string) {
    if (!this.soundEnabled || !toneUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: toneUri },
        { shouldPlay: true, volume: 0.8 }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch {}
  }

  public static async playPad(color: PadColor) {
    const uri = TONES[color];
    if (uri) await this.playTone(uri);
  }

  public static async playButton() {
    await this.playTone(TONES.button);
  }

  public static async playCorrect() {
    await this.playTone(TONES.correct);
  }

  public static async playWrong() {
    await this.playTone(TONES.wrong);
  }

  public static async playVictory() {
    await this.playTone(TONES.victory);
  }

  public static async playUnlock() {
    await this.playTone(TONES.unlock);
  }
}

