// ============================================================
// PATH MIND — Mode Selection Data Model: modeConfig.ts
// Single Source of Truth for Expedition Disciplines
// ============================================================

export type ModeId = 'classic' | 'number-trail' | 'mixed' | 'challenge';

export interface GameModeConfig {
  id: ModeId;
  title: string;
  badge: string;
  description: string;
  accent: 'green' | 'cyan' | 'crystal' | 'red';
  accentColor: string;
  accentGlow: string;
  borderColor: string;
  iconType: 'classic' | 'number-trail' | 'mixed' | 'challenge';
}

export const MODES: GameModeConfig[] = [
  {
    id: 'classic',
    title: 'CLASSIC PATH',
    badge: 'CORE EXPEDITION',
    description: 'Watch the glowing route and trace it from start to goal.',
    accent: 'green',
    accentColor: '#2ECC71',
    accentGlow: 'rgba(46, 204, 113, 0.45)',
    borderColor: '#1E824C',
    iconType: 'classic',
  },
  {
    id: 'number-trail',
    title: 'NUMBER TRAIL',
    badge: 'SEQUENCE MEMORY',
    description: 'Remember numbered tiles and follow them in order.',
    accent: 'cyan',
    accentColor: '#00F0FF',
    accentGlow: 'rgba(0, 240, 255, 0.45)',
    borderColor: '#007A99',
    iconType: 'number-trail',
  },
  {
    id: 'mixed',
    title: 'MIXED PATH',
    badge: 'ADVANCED MIND',
    description: 'Combine symbols, colors, and path memory.',
    accent: 'crystal',
    accentColor: '#B088FF',
    accentGlow: 'rgba(176, 136, 255, 0.45)',
    borderColor: '#6C48B5',
    iconType: 'mixed',
  },
  {
    id: 'challenge',
    title: 'CHALLENGE PATH',
    badge: 'HARDCORE RUN',
    description: 'Face decoys, moving obstacles, and limited time.',
    accent: 'red',
    accentColor: '#FF4757',
    accentGlow: 'rgba(255, 71, 87, 0.45)',
    borderColor: '#B32635',
    iconType: 'challenge',
  },
];
