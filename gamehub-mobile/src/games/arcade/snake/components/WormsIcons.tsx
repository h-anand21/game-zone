// ============================================================
// Worms Zone 3D Arena — Vector SVG HUD & Control Icons
// Crisp glossy icons matching the arena UI (zero emojis)
// ============================================================

import React from 'react';
import Svg, { Path, Circle, Rect, Polygon, Polyline, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

/**
 * Treasure Chest icon shown in top-center weight milestone bar
 */
export const TreasureChestIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    {/* Chest Base */}
    <Rect x="3" y="12" width="22" height="12" rx="2.5" fill="#9A3412" stroke="#2A0F04" strokeWidth={1.6} />
    {/* Gold Trim Bands */}
    <Rect x="6" y="12" width="3" height="12" fill="#FBBF24" stroke="#2A0F04" strokeWidth={1.1} />
    <Rect x="19" y="12" width="3" height="12" fill="#FBBF24" stroke="#2A0F04" strokeWidth={1.1} />
    {/* Domed Lid */}
    <Path
      d="M3 12C3 7.5 6.5 5 14 5C21.5 5 25 7.5 25 12H3Z"
      fill="#B45309"
      stroke="#2A0F04"
      strokeWidth={1.6}
    />
    <Path d="M6 12C6 8.5 8 6.5 14 6.5C20 6.5 22 8.5 22 12" stroke="#FDE047" strokeWidth={1.5} />
    {/* Central Lock Clasp */}
    <Rect x="11.5" y="10.2" width="5" height="6" rx="1.2" fill="#FDE047" stroke="#2A0F04" strokeWidth={1.3} />
    <Circle cx="14" cy="13.2" r="1" fill="#2A0F04" />
  </Svg>
);

/**
 * Glossy Gold Smiley Coin icon (Worms Zone signature currency)
 */
export const SmileyCoinIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
    <Circle cx="13" cy="13" r="11.2" fill="#D97706" stroke="#451A03" strokeWidth={1.5} />
    <Circle cx="13" cy="12.6" r="10" fill="#FACC15" stroke="#FEF08A" strokeWidth={1.2} />
    <Circle cx="13" cy="12.6" r="7.4" fill="none" stroke="#B45309" strokeWidth={1.1} />
    {/* Cute Worm Face Embossed inside Coin */}
    <Circle cx="10.6" cy="10.4" r="1.5" fill="#FEF9C3" stroke="#78350F" strokeWidth={0.9} />
    <Circle cx="15.4" cy="10.4" r="1.5" fill="#FEF9C3" stroke="#78350F" strokeWidth={0.9} />
    <Circle cx="10.8" cy="10.6" r="0.6" fill="#451A03" />
    <Circle cx="15.2" cy="10.6" r="0.6" fill="#451A03" />
    <Path
      d="M9.6 14.5C11 16.5 15 16.5 16.4 14.5"
      stroke="#78350F"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Magnet U-horseshoe booster icon
 */
export const MagnetBoosterIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 5V12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12V5"
      stroke="#CBD5E1"
      strokeWidth={4.2}
      strokeLinecap="butt"
    />
    <Path
      d="M7 5V12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12V5"
      stroke="#E2E8F0"
      strokeWidth={2.4}
      strokeLinecap="butt"
    />
    <Rect x="4.8" y="3.5" width="4.4" height="3.2" rx="0.8" fill="#EF4444" />
    <Rect x="14.8" y="3.5" width="4.4" height="3.2" rx="0.8" fill="#EF4444" />
  </Svg>
);

/**
 * Double upward chevron Speed / x2 Mass booster icon
 */
export const TurboBoosterIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline
      points="6.5,12.5 12,6.5 17.5,12.5"
      stroke="#FFFFFF"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="6.5,18.2 12,12.2 17.5,18.2"
      stroke="#BAE6FD"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Magnifying glass (+) Zoom-Out Scope booster icon
 */
export const ScopeBoosterIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="10.8" cy="10.8" r="6.2" stroke="#FFFFFF" strokeWidth={2.5} fill="rgba(255,255,255,0.18)" />
    <Line x1="15.4" y1="15.4" x2="20" y2="20" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
    <Line x1="8.3" y1="10.8" x2="13.3" y2="10.8" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
    <Line x1="10.8" y1="8.3" x2="10.8" y2="13.3" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

/**
 * Sprint boost lightning bolt for right-hand boost pedal
 */
export const SprintBoltIcon: React.FC<IconProps> = ({ size = 26, color = '#FEF08A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon
      points="13.5,2.2 5,13.5 11.4,13.5 9.6,21.8 19,10.2 12.6,10.2"
      fill={color}
      stroke="#451A03"
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Compact settings / pause gear icon
 */
export const ArenaGearIcon: React.FC<IconProps> = ({ size = 20, color = '#F8FAFC' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.3 2.5H13.7L14.3 5.1C14.9 5.3 15.5 5.6 16.0 6.0L18.5 5.0L20.2 8.0L18.2 9.7C18.3 10.4 18.4 11.2 18.2 12.0C18.3 12.5 18.3 13.0 18.2 13.6L20.2 15.4L18.5 18.4L16.0 17.5C15.5 17.9 14.9 18.3 14.3 18.5L13.7 21.1H10.3L9.7 18.5C9.1 18.3 8.5 17.9 8.0 17.5L5.5 18.4L3.8 15.4L5.8 13.7C5.7 13.0 5.6 12.3 5.8 11.6L3.8 8.0L5.5 5.0L8.0 6.0C8.5 5.6 9.1 5.3 9.7 5.1L10.3 2.5Z"
      fill={color}
      stroke="#0F2744"
      strokeWidth={1.1}
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="11.8" r="3.3" fill="#1E3A5F" stroke={color} strokeWidth={1.4} />
  </Svg>
);

/**
 * Tiny silhouette player emblem in leaderboard rows
 */
export const MiniPlayerIcon: React.FC<IconProps> = ({ size = 11, color = '#93C5FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="5.2" r="2.7" fill={color} />
    <Path d="M3 13.5C3 10.8 5.2 9 8 9C10.8 9 13 10.8 13 13.5" fill={color} />
  </Svg>
);

/**
 * Crown emblem for High Weight & Victory headers
 */
export const ArenaCrownIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 26 22" fill="none">
    <Path
      d="M3 16.5L1.8 6.5L8.2 11L13 3.5L17.8 11L24.2 6.5L23 16.5H3Z"
      fill="#FACC15"
      stroke="#451A03"
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Rect x="3" y="16.5" width="20" height="3.2" rx="1.2" fill="#D97706" stroke="#451A03" strokeWidth={1.6} />
  </Svg>
);

export const BackChevronIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 5L8 12L15 19"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SoundSpeakerIcon: React.FC<IconProps & { muted?: boolean }> = ({
  size = 18,
  muted = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 5L6.5 8.8H3.5V15.2H6.5L11 19V5Z"
      fill="#93C5FD"
      stroke="#0F2744"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    {!muted ? (
      <Path
        d="M14.8 8.5C16.2 10 16.2 14 14.8 15.5M17.6 6.2C20 9 20 15 17.6 17.8"
        stroke="#93C5FD"
        strokeWidth={2}
        strokeLinecap="round"
      />
    ) : (
      <Line x1="15" y1="8.5" x2="20" y2="15.5" stroke="#F87171" strokeWidth={2.4} strokeLinecap="round" />
    )}
  </Svg>
);

export const WardrobePaletteIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" fill="#9352E5" stroke="#E9D5FF" strokeWidth={1.6} />
    <Circle cx="9" cy="9.5" r="2" fill="#FACC15" />
    <Circle cx="15" cy="9.5" r="2" fill="#22C55E" />
    <Circle cx="12" cy="15" r="2" fill="#EF4444" />
  </Svg>
);

export const ReplayCircleIcon: React.FC<IconProps> = ({ size = 17, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4.5 12A7.5 7.5 0 1 0 7.4 6.1L4.8 8.4"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="4.2 4.5 4.6 8.7 8.8 8.3"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArenaPlayIcon: React.FC<IconProps> = ({ size = 16, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="6.5,4 19.5,12 6.5,20" fill={color} />
  </Svg>
);
