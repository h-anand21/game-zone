// ============================================================
// Color Bloom Sort — Visual Color Themes & Ball Palettes
// Premium 3D Radial Gradients, Specular Highlights & Theme Palettes
// ============================================================

import type { BallColor, ThemeId, ThemeConfig } from './types';

export interface BallVisual {
  main: string;
  gradient: [string, string, string]; // Top highlight, core color, bottom shadow
  highlight: string;
  glow: string;
  shadow: string;
  label: string;
}

export const BALL_VISUALS: Record<BallColor, BallVisual> = {
  red: {
    main: '#EF4444',
    gradient: ['#FCA5A5', '#EF4444', '#991B1B'],
    highlight: '#FEE2E2',
    glow: 'rgba(239, 68, 68, 0.45)',
    shadow: '#7F1D1D',
    label: 'Ruby',
  },
  blue: {
    main: '#3B82F6',
    gradient: ['#93C5FD', '#3B82F6', '#1E40AF'],
    highlight: '#DBEAFE',
    glow: 'rgba(59, 130, 246, 0.45)',
    shadow: '#1E3A8A',
    label: 'Sapphire',
  },
  green: {
    main: '#10B981',
    gradient: ['#6EE7B7', '#10B981', '#065F46'],
    highlight: '#D1FAE5',
    glow: 'rgba(16, 185, 129, 0.45)',
    shadow: '#064E3B',
    label: 'Emerald',
  },
  amber: {
    main: '#F59E0B',
    gradient: ['#FCD34D', '#F59E0B', '#92400E'],
    highlight: '#FEF3C7',
    glow: 'rgba(245, 158, 11, 0.45)',
    shadow: '#78350F',
    label: 'Amber',
  },
  purple: {
    main: '#8B5CF6',
    gradient: ['#C4B5FD', '#8B5CF6', '#5B21B6'],
    highlight: '#EDE9FE',
    glow: 'rgba(139, 92, 246, 0.45)',
    shadow: '#4C1D95',
    label: 'Amethyst',
  },
  pink: {
    main: '#EC4899',
    gradient: ['#F9A8D4', '#EC4899', '#9D174D'],
    highlight: '#FCE7F3',
    glow: 'rgba(236, 72, 153, 0.45)',
    shadow: '#831843',
    label: 'Rose',
  },
  cyan: {
    main: '#06B6D4',
    gradient: ['#67E8F9', '#06B6D4', '#155E75'],
    highlight: '#CFFAFE',
    glow: 'rgba(6, 182, 212, 0.45)',
    shadow: '#164E63',
    label: 'Diamond',
  },
  orange: {
    main: '#F97316',
    gradient: ['#FDBA74', '#F97316', '#9A3412'],
    highlight: '#FFEDD5',
    glow: 'rgba(249, 115, 22, 0.45)',
    shadow: '#7C2D12',
    label: 'Topaz',
  },
  mint: {
    main: '#14B8A6',
    gradient: ['#5EEAD4', '#14B8A6', '#115E59'],
    highlight: '#CCFBF1',
    glow: 'rgba(20, 184, 166, 0.45)',
    shadow: '#134E4A',
    label: 'Jade',
  },
  lime: {
    main: '#84CC16',
    gradient: ['#BEF264', '#84CC16', '#3F6212'],
    highlight: '#ECFCCB',
    glow: 'rgba(132, 204, 22, 0.45)',
    shadow: '#365314',
    label: 'Peridot',
  },
};

export const THEMES: Record<ThemeId, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Neon',
    bgGradient: ['#0A0E1F', '#04070F'],
    tubeOutline: 'rgba(0, 207, 255, 0.35)',
    tubeGlass: 'rgba(14, 26, 50, 0.35)',
    tubeHighlight: 'rgba(255, 255, 255, 0.22)',
    accent: '#00CFFF',
    unlocked: true,
    price: 0,
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Deep',
    bgGradient: ['#071A2E', '#030D17'],
    tubeOutline: 'rgba(56, 189, 248, 0.35)',
    tubeGlass: 'rgba(12, 35, 60, 0.35)',
    tubeHighlight: 'rgba(255, 255, 255, 0.25)',
    accent: '#38BDF8',
    unlocked: false,
    price: 150,
  },
  sunset: {
    id: 'sunset',
    name: 'Amber Glow',
    bgGradient: ['#1A1208', '#0D0803'],
    tubeOutline: 'rgba(245, 158, 11, 0.4)',
    tubeGlass: 'rgba(40, 26, 12, 0.35)',
    tubeHighlight: 'rgba(255, 255, 255, 0.22)',
    accent: '#F59E0B',
    unlocked: false,
    price: 250,
  },
  cosmic: {
    id: 'cosmic',
    name: 'Arctic Ice',
    bgGradient: ['#0A192F', '#040B17'],
    tubeOutline: 'rgba(56, 189, 248, 0.4)',
    tubeGlass: 'rgba(15, 30, 60, 0.4)',
    tubeHighlight: 'rgba(255, 255, 255, 0.25)',
    accent: '#38BDF8',
    unlocked: false,
    price: 350,
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel Garden',
    bgGradient: ['#0E1F1A', '#07100D'],
    tubeOutline: 'rgba(52, 211, 153, 0.35)',
    tubeGlass: 'rgba(18, 42, 34, 0.35)',
    tubeHighlight: 'rgba(255, 255, 255, 0.25)',
    accent: '#34D399',
    unlocked: false,
    price: 500,
  },
};
