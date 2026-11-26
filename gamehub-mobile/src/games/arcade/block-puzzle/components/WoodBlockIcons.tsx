// ============================================================
// Block Puzzle — Crisp Cartoon Wood UI Vector SVG Icons
// Replaces all UI emojis with dark-outlined warm wood & gold SVGs
// ============================================================

import React from 'react';
import Svg, { Path, Circle, Rect, Polygon, Polyline } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const OUTLINE = '#421F07';

/**
 * Tactile back chevron arrow
 */
export const BackArrowIcon: React.FC<IconProps> = ({ size = 20, color = '#FFF8E7' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 5L8 12L15 19"
      stroke={OUTLINE}
      strokeWidth={5.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 5L8 12L15 19"
      stroke={color}
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Settings gear icon styled like the top-right wooden button in Block Crush
 */
export const GearSettingsIcon: React.FC<IconProps> = ({ size = 22, color = '#421F07' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.3 2.5H13.7L14.3 5.1C14.9 5.3 15.5 5.6 16.0 6.0L18.5 5.0L20.2 8.0L18.2 9.7C18.3 10.4 18.4 11.2 18.2 12.0C18.3 12.5 18.3 13.0 18.2 13.6L20.2 15.4L18.5 18.4L16.0 17.5C15.5 17.9 14.9 18.3 14.3 18.5L13.7 21.1H10.3L9.7 18.5C9.1 18.3 8.5 17.9 8.0 17.5L5.5 18.4L3.8 15.4L5.8 13.7C5.7 13.0 5.6 12.3 5.8 11.6L3.8 8.0L5.5 5.0L8.0 6.0C8.5 5.6 9.1 5.3 9.7 5.1L10.3 2.5Z"
      fill={color}
      stroke="#FFF4D6"
      strokeWidth={1.1}
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="11.8" r="3.4" fill="#E39747" stroke={color} strokeWidth={1.6} />
  </Svg>
);

/**
 * Dark-outlined royal crown icon above the Score pill
 */
export const CrownScoreIcon: React.FC<IconProps> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 26 22" fill="none">
    <Path
      d="M3 16.5L1.8 6.5L8.2 11L13 3.5L17.8 11L24.2 6.5L23 16.5H3Z"
      fill="#FCD34D"
      stroke={OUTLINE}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Rect
      x="3"
      y="16.5"
      width="20"
      height="3.2"
      rx="1.2"
      fill="#F59E0B"
      stroke={OUTLINE}
      strokeWidth={1.8}
    />
    <Circle cx="13" cy="3.2" r="1.4" fill="#FFF3B0" stroke={OUTLINE} strokeWidth={1.1} />
  </Svg>
);

/**
 * Golden four-point sparkle icon for the glowing Combo capsule
 */
export const ComboSparkleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
      fill="#FFE680"
      stroke={OUTLINE}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <Circle cx="19" cy="5.5" r="1.6" fill="#FFF6C4" />
  </Svg>
);

/**
 * Wooden trophy icon for Level badge & completion banners
 */
export const TrophyWoodIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.5 4.5H17.5V9.5C17.5 12.8 15.1 15.2 12 15.2C8.9 15.2 6.5 12.8 6.5 9.5V4.5Z"
      fill="#FCD34D"
      stroke={OUTLINE}
      strokeWidth={1.9}
      strokeLinejoin="round"
    />
    <Path
      d="M6.5 6.2H4C3.5 9.2 4.7 11.1 6.5 11.4M17.5 6.2H20C20.5 9.2 19.3 11.1 17.5 11.4"
      stroke={OUTLINE}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Rect x="10.4" y="15.2" width="3.2" height="3.2" fill="#E9A324" stroke={OUTLINE} strokeWidth={1.6} />
    <Rect x="7.5" y="18.4" width="9" height="2.8" rx="1.2" fill="#D9821E" stroke={OUTLINE} strokeWidth={1.6} />
  </Svg>
);

/**
 * Carved bullseye target for Lines Goal indicator
 */
export const TargetGoalIcon: React.FC<IconProps> = ({ size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9.5" fill="#FFF6D6" stroke={OUTLINE} strokeWidth={2} />
    <Circle cx="12" cy="12" r="5.5" fill="#F59E0B" stroke={OUTLINE} strokeWidth={1.4} />
    <Circle cx="12" cy="12" r="2.1" fill="#421F07" />
  </Svg>
);

/**
 * Five-point golden star for ratings and level cards
 */
export const StarGoldIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 24,
  filled = true,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon
      points="12,2.4 14.9,8.4 21.5,9.3 16.7,13.9 17.9,20.5 12,17.3 6.1,20.5 7.3,13.9 2.5,9.3 9.1,8.4"
      fill={filled ? '#FFD54F' : 'rgba(40, 18, 5, 0.55)'}
      stroke={filled ? OUTLINE : '#7B461B'}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Carved padlock icon for locked levels
 */
export const LockWoodIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.5 10.5V7.8C7.5 5.2 9.5 3.3 12 3.3C14.5 3.3 16.5 5.2 16.5 7.8V10.5"
      stroke="#A87449"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
    <Rect
      x="5"
      y="10.2"
      width="14"
      height="10.5"
      rx="2.6"
      fill="#8D5122"
      stroke={OUTLINE}
      strokeWidth={1.8}
    />
    <Circle cx="12" cy="15.4" r="1.7" fill="#3D1C06" />
  </Svg>
);

/**
 * Circular replay arrow icon
 */
export const ReplayWoodIcon: React.FC<IconProps> = ({ size = 16, color = '#FFF8E7' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4.5 12A7.5 7.5 0 1 0 7.4 6.1L4.8 8.4"
      stroke={OUTLINE}
      strokeWidth={4.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="4.2 4.5 4.6 8.7 8.8 8.3"
      stroke={OUTLINE}
      strokeWidth={4.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.5 12A7.5 7.5 0 1 0 7.4 6.1L4.8 8.4"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="4.2 4.5 4.6 8.7 8.8 8.3"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * 2x2 wood tiles icon for Levels button
 */
export const LevelsGridIcon: React.FC<IconProps> = ({ size = 16, color = '#FDE6C4' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3.5" y="3.5" width="7.2" height="7.2" rx="1.6" fill={color} stroke={OUTLINE} strokeWidth={1.6} />
    <Rect x="13.3" y="3.5" width="7.2" height="7.2" rx="1.6" fill={color} stroke={OUTLINE} strokeWidth={1.6} />
    <Rect x="3.5" y="13.3" width="7.2" height="7.2" rx="1.6" fill={color} stroke={OUTLINE} strokeWidth={1.6} />
    <Rect x="13.3" y="13.3" width="7.2" height="7.2" rx="1.6" fill={color} stroke={OUTLINE} strokeWidth={1.6} />
  </Svg>
);

/**
 * Tactile triangular play glyph for Resume buttons
 */
export const PlayTriangleIcon: React.FC<IconProps> = ({ size = 16, color = '#3A1904' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon
      points="6.5,4.2 19.5,12 6.5,19.8"
      fill={color}
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Compact gesture icons for the bottom wood hint capsule
 */
export const SlideHintIcon: React.FC<IconProps> = ({ size = 13, color = '#FFD65C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 8L3 12L7 16M17 8L21 12L17 16M4 12H20"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const RotateHintIcon: React.FC<IconProps> = ({ size = 13, color = '#FFD65C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19.5 12A7.5 7.5 0 1 1 16.5 6"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
    <Polyline
      points="17.5 3.5 18 7.4 14.1 7.6"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DropHintIcon: React.FC<IconProps> = ({ size = 13, color = '#FFD65C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4V19M7 14L12 19L17 14"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
