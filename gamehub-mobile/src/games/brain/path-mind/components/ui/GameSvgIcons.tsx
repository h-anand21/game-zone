// ============================================================
// PATH MIND — Component: GameSvgIcons
// Crisp Vector SVG Game Icons (Zero Emojis System)
// High-contrast, scalable, game-like icons for all UI elements
// ============================================================

import React from 'react';
import Svg, { Path, Circle, Rect, Polygon, G } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  fill?: string;
}

export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 16,
  color = '#FFD700',
  filled = true,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={filled ? 0 : 2}
      strokeLinejoin="round"
    />
  </Svg>
);

export const FlameIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#FF8C00',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 23c-4.97 0-9-4.03-9-9 0-3.62 2.22-6.73 5.39-8.08C9.57 7.57 11 9.8 11 12c1.2-2.1 2.2-4.5 2-7.5 4.3 2.1 6.5 6.6 5.6 11.2-.4 2.1-1.6 3.9-3.3 5-1 .7-2.1 1.3-3.3 1.3z"
      fill={color}
    />
    <Path
      d="M12 21c-2.76 0-5-2.24-5-5 0-1.8 1-3.3 2.5-4 .5 1.5 1.5 2.5 2.5 3 .8-1.2 1.4-2.5 1.2-4 2 1.2 3.1 3.5 2.6 5.8-.4 2.4-2.2 4.2-3.8 4.2z"
      fill="#FFE27A"
    />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#8A9BA8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="5" y="11" width="14" height="10" rx="2" fill={color} />
    <Path
      d="M8 11V7a4 4 0 0 1 8 0v4"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="16" r="1.5" fill="#0C141C" />
  </Svg>
);

export const CrownIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#FFD700',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M3 18 L21 18 L21 21 L3 21 Z M3 16 L5 7 L9 12 L12 4 L15 12 L19 7 L21 16 Z"
      fill={color}
    />
  </Svg>
);

export const HourglassIcon: React.FC<IconProps> = ({
  size = 15,
  color = '#FFE27A',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M6 2 L18 2 L18 6 L14 10 L18 14 L18 22 L6 22 L6 14 L10 10 L6 6 Z"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path d="M8 18 L16 18 L12 14 Z" fill={color} />
    <Circle cx="12" cy="8" r="1.5" fill={color} />
  </Svg>
);

export const LightningIcon: React.FC<IconProps> = ({
  size = 15,
  color = '#00F0FF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Polygon points="13,2 4,14 11,14 9,22 20,9 13,9" fill={color} />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = ({
  size = 15,
  color = '#2ECC71',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M5 13 L9 17 L19 7"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CrossIcon: React.FC<IconProps> = ({
  size = 15,
  color = '#FF4757',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M6 6 L18 18 M18 6 L6 18"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TimerIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#00F0FF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="13" r="8" fill="none" stroke={color} strokeWidth="2" />
    <Path d="M12 9 L12 13 L15 13" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M10 2 L14 2 M12 2 L12 5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const RestartIcon: React.FC<IconProps> = ({
  size = 15,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M1 4v6h6M23 20v-6h-6"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LampIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#FFD700',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2a6 6 0 0 0-6 6c0 2.2 1.3 4 3 5v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2c1.7-1 3-2.8 3-5a6 6 0 0 0-6-6z"
      fill={color}
    />
    <Rect x="10" y="19" width="4" height="2" fill="#8C5627" rx="0.5" />
  </Svg>
);

export const ChestIcon: React.FC<IconProps> = ({
  size = 15,
  color = '#FFD700',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="9" width="18" height="11" rx="2" fill="#4A2810" stroke="#8C5627" strokeWidth="1.5" />
    <Path d="M3 13h18" stroke="#8C5627" strokeWidth="1.5" />
    <Rect x="10.5" y="11.5" width="3" height="3.5" rx="0.5" fill={color} />
    <Path d="M3 9c0-2.2 3.6-4 9-4s9 1.8 9 4H3z" fill="#6A3B18" stroke="#8C5627" strokeWidth="1.5" />
  </Svg>
);
