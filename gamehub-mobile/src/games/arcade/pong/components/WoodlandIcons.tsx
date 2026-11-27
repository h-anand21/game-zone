// ============================================================
// Woodland Bubble Shooter — Crisp Vector SVG Icons (Zero Emojis)
// Dark-outlined cartoon timber & botanical aesthetic
// ============================================================

import React from 'react';
import Svg, { Path, Circle, Rect, Polygon, Polyline, Line, G } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const OUTLINE = '#3F1D06';

/**
 * Carved back navigation chevron
 */
export const BackArrowIcon: React.FC<IconProps> = ({ size = 19, color = '#FFF8E7' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 5L8 12L15 19"
      stroke={OUTLINE}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 5L8 12L15 19"
      stroke={color}
      strokeWidth={2.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Wooden settings / pause gear icon
 */
export const GearSettingsIcon: React.FC<IconProps> = ({ size = 21, color = '#3F1D06' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.3 2.5H13.7L14.3 5.1C14.9 5.3 15.5 5.6 16.0 6.0L18.5 5.0L20.2 8.0L18.2 9.7C18.3 10.4 18.4 11.2 18.2 12.0C18.3 12.5 18.3 13.0 18.2 13.6L20.2 15.4L18.5 18.4L16.0 17.5C15.5 17.9 14.9 18.3 14.3 18.5L13.7 21.1H10.3L9.7 18.5C9.1 18.3 8.5 17.9 8.0 17.5L5.5 18.4L3.8 15.4L5.8 13.7C5.7 13.0 5.6 12.3 5.8 11.6L3.8 8.0L5.5 5.0L8.0 6.0C8.5 5.6 9.1 5.3 9.7 5.1L10.3 2.5Z"
      fill={color}
      stroke="#FFF4D6"
      strokeWidth={1.1}
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="11.8" r="3.4" fill="#E39747" stroke={color} strokeWidth={1.5} />
  </Svg>
);

/**
 * Wooden Trophy badge for Level Pill & Win banners
 */
export const TrophyWoodIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.5 4.5H17.5V9.5C17.5 12.8 15.1 15.2 12 15.2C8.9 15.2 6.5 12.8 6.5 9.5V4.5Z"
      fill="#FCD34D"
      stroke={OUTLINE}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path
      d="M6.5 6.2H4C3.5 9.2 4.7 11.1 6.5 11.4M17.5 6.2H20C20.5 9.2 19.3 11.1 17.5 11.4"
      stroke={OUTLINE}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
    <Rect x="10.4" y="15.2" width="3.2" height="3.2" fill="#E9A324" stroke={OUTLINE} strokeWidth={1.5} />
    <Rect x="7.5" y="18.4" width="9" height="2.8" rx="1.2" fill="#D9821E" stroke={OUTLINE} strokeWidth={1.5} />
  </Svg>
);

/**
 * Crown emblem for best score
 */
export const CrownScoreIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 26 22" fill="none">
    <Path
      d="M3 16.5L1.8 6.5L8.2 11L13 3.5L17.8 11L24.2 6.5L23 16.5H3Z"
      fill="#FCD34D"
      stroke={OUTLINE}
      strokeWidth={1.9}
      strokeLinejoin="round"
    />
    <Rect x="3" y="16.5" width="20" height="3.2" rx="1.2" fill="#F59E0B" stroke={OUTLINE} strokeWidth={1.7} />
  </Svg>
);

/**
 * Golden star rating icon
 */
export const StarGoldIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 20,
  filled = true,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon
      points="12,2.4 14.9,8.4 21.5,9.3 16.7,13.9 17.9,20.5 12,17.3 6.1,20.5 7.3,13.9 2.5,9.3 9.1,8.4"
      fill={filled ? '#FFD54F' : 'rgba(35, 16, 4, 0.58)'}
      stroke={filled ? OUTLINE : '#7B461B'}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Carved padlock icon for locked level discs
 */
export const LockWoodIcon: React.FC<IconProps> = ({ size = 14 }) => (
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
    <Circle cx="12" cy="15.4" r="1.7" fill={OUTLINE} />
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
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="4.2 4.5 4.6 8.7 8.8 8.3"
      stroke={OUTLINE}
      strokeWidth={4}
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
 * 2x2 grid tiles icon for World Map button
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
 * Play triangle glyph for Resume buttons
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
 * Dual curved swap arrows for switching Active <-> Next orb
 */
export const SwapArrowsIcon: React.FC<IconProps> = ({ size = 16, color = '#FFF8E7' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 7H18M18 7L14.8 3.8M18 7L14.8 10.2M17 17H6M6 17L9.2 13.8M6 17L9.2 20.2"
      stroke={OUTLINE}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 7H18M18 7L14.8 3.8M18 7L14.8 10.2M17 17H6M6 17L9.2 13.8M6 17L9.2 20.2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Cute glowing Golden Forest Firefly icon for Rescue Goal HUD & badges
 */
export const FireflyBadgeIcon: React.FC<IconProps> = ({ size = 17 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G>
      {/* Left & Right glowing wings */}
      <Path
        d="M11 11C7.2 7.2 3.8 8.4 4.2 11.4C4.6 13.8 8.4 13.6 11 12Z"
        fill="#E0F2FE"
        stroke={OUTLINE}
        strokeWidth={1.3}
      />
      <Path
        d="M13 11C16.8 7.2 20.2 8.4 19.8 11.4C19.4 13.8 15.6 13.6 13 12Z"
        fill="#E0F2FE"
        stroke={OUTLINE}
        strokeWidth={1.3}
      />
      {/* Warm golden firefly abdomen & head */}
      <Circle cx="12" cy="14.2" r="4.2" fill="#FACC15" stroke={OUTLINE} strokeWidth={1.5} />
      <Circle cx="12" cy="8.8" r="2.7" fill="#78350F" stroke={OUTLINE} strokeWidth={1.4} />
      <Circle cx="11.2" cy="14.5" r="1.4" fill="#FEF9C3" />
    </G>
  </Svg>
);

/**
 * Fireball Flame icon for Fireball Bomb Power-Up button
 */
export const FireballPowerIcon: React.FC<IconProps> = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12.5 2.4C15.8 6.2 19.5 9.2 19.5 14C19.5 18.2 16.2 21.5 12 21.5C7.8 21.5 4.5 18.2 4.5 14C4.5 10.6 6.8 7.8 8.6 6C8.8 8 9.8 9.2 10.8 9.5C10.5 6.8 11.4 4.2 12.5 2.4Z"
      fill="#F97316"
      stroke={OUTLINE}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <Path
      d="M12 10.2C14.2 12.4 15.2 14.2 15.2 16C15.2 17.8 13.8 19.2 12 19.2C10.2 19.2 8.8 17.8 8.8 16C8.8 14 10.2 12 12 10.2Z"
      fill="#FDE047"
    />
  </Svg>
);

/**
 * Lightning Bolt icon for Horizontal Row Blast Power-Up button
 */
export const LightningPowerIcon: React.FC<IconProps> = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon
      points="13.5,2.2 5.2,13.4 11.4,13.4 9.6,21.8 18.8,10.2 12.6,10.2"
      fill="#38BDF8"
      stroke={OUTLINE}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <Polygon
      points="12.6,5.5 8.2,12.1 12.3,12.1 11.2,17.2 15.8,11.5 11.8,11.5"
      fill="#E0F2FE"
    />
  </Svg>
);

/**
 * Rainbow Prism Wildcard icon (zero purple — crisp warm sun/leaf/sky/ruby quadrants)
 */
export const RainbowPowerIcon: React.FC<IconProps> = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9.2" fill="#FFFBEB" stroke={OUTLINE} strokeWidth={1.8} />
    <Path d="M12 3.4A8.6 8.6 0 0 1 20.6 12H12V3.4Z" fill="#EF4444" />
    <Path d="M20.6 12A8.6 8.6 0 0 1 12 20.6V12H20.6Z" fill="#F59E0B" />
    <Path d="M12 20.6A8.6 8.6 0 0 1 3.4 12H12V20.6Z" fill="#22C55E" />
    <Path d="M3.4 12A8.6 8.6 0 0 1 12 3.4V12H3.4Z" fill="#2563EB" />
    <Circle cx="12" cy="12" r="3.4" fill="#FFFBEB" stroke={OUTLINE} strokeWidth={1.4} />
    <Circle cx="12" cy="12" r="1.4" fill="#FBBF24" />
  </Svg>
);

/**
 * Target bullseye icon for clear-canopy goal
 */
export const TargetGoalIcon: React.FC<IconProps> = ({ size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" fill="#FFF7DF" stroke={OUTLINE} strokeWidth={1.9} />
    <Circle cx="12" cy="12" r="5" fill="#F59E0B" stroke={OUTLINE} strokeWidth={1.3} />
    <Circle cx="12" cy="12" r="2" fill={OUTLINE} />
  </Svg>
);

/**
 * Four-point gold sparkle icon
 */
export const ComboSparkleIcon: React.FC<IconProps> = ({ size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
      fill="#FFE680"
      stroke={OUTLINE}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Speaker audio icon with mute slash option
 */
export const SoundToggleIcon: React.FC<IconProps & { muted?: boolean }> = ({
  size = 18,
  muted = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 5L6.5 8.8H3.5V15.2H6.5L11 19V5Z"
      fill="#FDE68A"
      stroke={OUTLINE}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    {!muted ? (
      <Path
        d="M14.8 8.5C16.2 10 16.2 14 14.8 15.5M17.8 6.2C20.2 9 20.2 15 17.8 17.8"
        stroke="#FDE68A"
        strokeWidth={2}
        strokeLinecap="round"
      />
    ) : (
      <Line x1="15" y1="8.5" x2="20" y2="15.5" stroke="#F87171" strokeWidth={2.4} strokeLinecap="round" />
    )}
  </Svg>
);
