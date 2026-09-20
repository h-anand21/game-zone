// ============================================================
// GameHub — Mind Lock Types
// ============================================================

export type PadColor = 'red' | 'blue' | 'green' | 'yellow';

export interface PadConfig {
  id: PadColor;
  color: string;
  activeColor: string;
  soundFreq: number;
}
