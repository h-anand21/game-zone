// ============================================================
// Wood Screw: Nuts & Bolts Puzzle — Cartoon Wood & UI SVG Icons
// Crisp tactile vector icons matching the wooden reference style
// ============================================================

import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, G, Text as SvgText } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

/**
 * Circular white pause badge inside top-left amber button
 */
export const PauseButtonIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="14" r="11.5" fill="#FFFFFF" stroke="#421F07" strokeWidth={2.2} />
    <Rect x="9.8" y="8.8" width="3.2" height="10.4" rx="1.4" fill="#421F07" />
    <Rect x="15" y="8.8" width="3.2" height="10.4" rx="1.4" fill="#421F07" />
  </Svg>
);

/**
 * Curved white restart arrow + small red heart "-1" badge inside top-right button
 */
export const RestartHeartIcon: React.FC<IconProps> = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Bold dark outline behind white arrow */}
    <Path
      d="M7 16A8.5 8.5 0 1 0 11 8.8L7.8 11.2"
      stroke="#421F07"
      strokeWidth={5.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="7.2 6.8 7.6 11.6 12.6 11.2"
      stroke="#421F07"
      strokeWidth={5.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Crisp white fill */}
    <Path
      d="M7 16A8.5 8.5 0 1 0 11 8.8L7.8 11.2"
      stroke="#FFFFFF"
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="7.2 6.8 7.6 11.6 12.6 11.2"
      stroke="#FFFFFF"
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Bottom-right red heart with "-1" */}
    <Path
      d="M22.5 29.2C22.5 29.2 16 25.4 16 21.3C16 19.3 17.5 17.8 19.4 17.8C20.7 17.8 21.8 18.5 22.5 19.5C23.2 18.5 24.3 17.8 25.6 17.8C27.5 17.8 29 19.3 29 21.3C29 25.4 22.5 29.2 22.5 29.2Z"
      fill="#EF4444"
      stroke="#421F07"
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <SvgText
      x="22.5"
      y="24.3"
      fill="#FFFFFF"
      fontSize="6.8"
      fontWeight="900"
      textAnchor="middle"
    >
      -1
    </SvgText>
  </Svg>
);

/**
 * Thick curved silver-white Undo arrow for bottom-left gray button
 */
export const UndoWoodIcon: React.FC<IconProps> = ({ size = 34 }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <Path
      d="M15 8L6 15.5L15 23V18.2C20.8 18.2 24.5 20.4 26.2 25.5C26.5 26.4 28 26.2 28.2 25.2C29.4 18.4 24.8 12.2 15 12.2V8Z"
      fill="#FFFFFF"
      stroke="#3B200B"
      strokeWidth={2.4}
      strokeLinejoin="round"
    />
    {/* Glossy highlight on upper edge */}
    <Path
      d="M10 14.5L14 11.2M16 14.2C21.5 14.4 24.8 16.5 26.2 19.5"
      stroke="#E2E8F0"
      strokeWidth={1.4}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Slanted blue-gold Screwdriver tool icon for bottom-center booster button
 */
export const ScrewdriverBoostIcon: React.FC<IconProps> = ({ size = 34 }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <G transform="rotate(-35 18 18)">
      {/* Handle collar (yellow) */}
      <Rect
        x="13"
        y="17"
        width="10"
        height="4.5"
        rx="1.5"
        fill="#FACC15"
        stroke="#3B1D07"
        strokeWidth={1.9}
      />
      {/* Ergonomic blue handle */}
      <Rect
        x="14"
        y="21"
        width="8"
        height="11.5"
        rx="3.8"
        fill="#2563EB"
        stroke="#3B1D07"
        strokeWidth={1.9}
      />
      {/* Handle gloss streak */}
      <Line
        x1="16.4"
        y1="23.2"
        x2="16.4"
        y2="29.8"
        stroke="#93C5FD"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {/* Steel shaft */}
      <Rect
        x="16.5"
        y="6.5"
        width="3"
        height="10.8"
        fill="#E2E8F0"
        stroke="#3B1D07"
        strokeWidth={1.7}
      />
      {/* Flat/Phillips tip */}
      <Path
        d="M15.6 6.8L16.5 3.2H19.5L20.4 6.8H15.6Z"
        fill="#94A3B8"
        stroke="#3B1D07"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

/**
 * Bright lime-green cartoon "+" badge for Screwdriver booster
 */
export const PlusGreenIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.5 3.5H14.5V9.5H20.5V14.5H14.5V20.5H9.5V14.5H3.5V9.5H9.5V3.5Z"
      fill="#4ADE1A"
      stroke="#2D1504"
      strokeWidth={2.2}
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Icy blue crystal alarm clock icon for Time Freeze booster (clean ice palette, zero purple)
 */
export const FreezeClockIcon: React.FC<IconProps> = ({ size = 36 }) => (
  <Svg width={size} height={size} viewBox="0 0 38 38" fill="none">
    {/* Ice crystal shards at bottom */}
    <Path
      d="M7 31L10.5 23.5L15 31H7ZM23 31L27.5 23L31 31H23ZM14 32.5L19 25.5L24 32.5H14Z"
      fill="#38BDF8"
      stroke="#1E3A5F"
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    {/* Top clock bells & stem */}
    <Rect x="16.5" y="4" width="5" height="3.2" rx="1.2" fill="#0284C7" stroke="#1E3A5F" strokeWidth={1.6} />
    <Circle cx="10.5" cy="9.5" r="3" fill="#38BDF8" stroke="#1E3A5F" strokeWidth={1.6} />
    <Circle cx="27.5" cy="9.5" r="3" fill="#38BDF8" stroke="#1E3A5F" strokeWidth={1.6} />
    {/* Outer icy clock bezel */}
    <Circle cx="19" cy="19.5" r="10.5" fill="#0EA5E9" stroke="#1E3A5F" strokeWidth={2} />
    {/* Clock dial face */}
    <Circle cx="19" cy="19.5" r="7.6" fill="#E0F2FE" stroke="#0284C7" strokeWidth={1.2} />
    {/* Clock hands */}
    <Polyline
      points="19 14.5 19 19.5 22.8 21.5"
      stroke="#0C4A6E"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Frost sparkle */}
    <Circle cx="15" cy="15.5" r="1.2" fill="#FFFFFF" />
  </Svg>
);

/**
 * Golden cartoon trophy cup for Victory modal
 */
export const TrophyWoodIcon: React.FC<IconProps> = ({ size = 40 }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path
      d="M11 10H6.5C5.2 10 4.5 11 4.5 12.2V14.8C4.5 18 7 20.5 10.2 20.5H11.5"
      stroke="#4E270D"
      strokeWidth={4.2}
      strokeLinecap="round"
    />
    <Path
      d="M11 10H6.5C5.2 10 4.5 11 4.5 12.2V14.8C4.5 18 7 20.5 10.2 20.5H11.5"
      stroke="#F59E0B"
      strokeWidth={2.2}
      strokeLinecap="round"
    />
    <Path
      d="M29 10H33.5C34.8 10 35.5 11 35.5 12.2V14.8C35.5 18 33 20.5 29.8 20.5H28.5"
      stroke="#4E270D"
      strokeWidth={4.2}
      strokeLinecap="round"
    />
    <Path
      d="M29 10H33.5C34.8 10 35.5 11 35.5 12.2V14.8C35.5 18 33 20.5 29.8 20.5H28.5"
      stroke="#F59E0B"
      strokeWidth={2.2}
      strokeLinecap="round"
    />
    <Path
      d="M11 7H29V16.5C29 21.8 25 26 20 26C15 26 11 21.8 11 16.5V7Z"
      fill="#FBBF24"
      stroke="#4E270D"
      strokeWidth={2.4}
      strokeLinejoin="round"
    />
    <Line x1="20" y1="26" x2="20" y2="32" stroke="#4E270D" strokeWidth={5} />
    <Line x1="20" y1="26" x2="20" y2="32" stroke="#F59E0B" strokeWidth={2.6} />
    <Rect x="12.5" y="31.5" width="15" height="4.5" rx="2" fill="#D97706" stroke="#4E270D" strokeWidth={2} />
    <Line x1="15" y1="10.5" x2="15" y2="17" stroke="#FEF08A" strokeWidth={2.2} strokeLinecap="round" />
  </Svg>
);

/**
 * Bold cartoon Star icon (filled gold or dim wood hollow)
 */
export const StarWoodIcon: React.FC<{ size?: number; filled?: boolean }> = ({
  size = 30,
  filled = true,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 2.5L17.4 9.4L25 10.5L19.5 15.8L20.8 23.4L14 19.8L7.2 23.4L8.5 15.8L3 10.5L10.6 9.4L14 2.5Z"
      fill={filled ? '#FBBF24' : '#5C2E10'}
      stroke="#421F07"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    {filled && (
      <Path
        d="M14 5.4L15.8 9.2L11.8 9L14 5.4Z"
        fill="#FEF08A"
        opacity={0.8}
      />
    )}
  </Svg>
);

export const CloseWoodIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={3} strokeLinecap="round" />
    <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={3} strokeLinecap="round" />
  </Svg>
);

export const ArrowRightWoodIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12H19M19 12L12.5 5.5M19 12L12.5 18.5"
      stroke={color}
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LockWoodIcon: React.FC<IconProps> = ({ size = 13, color = '#C28D58' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 10V7.5C7 4.74 9.24 2.5 12 2.5C14.76 2.5 17 4.74 17 7.5V10"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
    <Rect x="5" y="10" width="14" height="11" rx="3" fill={color} />
    <Circle cx="12" cy="15.5" r="1.4" fill="#3B1A06" />
  </Svg>
);

export const HeartBadgeIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C12 21 3.5 15.5 3.5 9.6C3.5 6.8 5.7 4.5 8.5 4.5C10.2 4.5 11.4 5.4 12 6.6C12.6 5.4 13.8 4.5 15.5 4.5C18.3 4.5 20.5 6.8 20.5 9.6C20.5 15.5 12 21 12 21Z"
      fill="#EF4444"
      stroke="#421F07"
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </Svg>
);
