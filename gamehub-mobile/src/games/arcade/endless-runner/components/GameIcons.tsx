// ============================================================
// Color Bloom Sort — Custom Vector SVG Icon System
// Crisp multi-layered geometric & glossy game icons (no emojis)
// ============================================================

import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline, G } from 'react-native-svg';

export interface GameIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Clean rounded back arrow
 */
export const ArrowLeftIcon: React.FC<GameIconProps> = ({
  size = 18,
  color = '#E2E8F0',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L11.5 5.5M5 12L11.5 18.5"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Clean rounded forward arrow
 */
export const ArrowRightIcon: React.FC<GameIconProps> = ({
  size = 16,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12H19M19 12L12.5 5.5M19 12L12.5 18.5"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Compact downward chevron for dropdowns / selectors
 */
export const ChevronDownIcon: React.FC<GameIconProps> = ({
  size = 14,
  color = '#00CFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline
      points="6 9 12 15 18 9"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Rounded modal close (X) icon
 */
export const CloseIcon: React.FC<GameIconProps> = ({
  size = 15,
  color = '#94A3B8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
    />
    <Line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Crisp checkmark icon
 */
export const CheckIcon: React.FC<GameIconProps> = ({
  size = 14,
  color = '#00CFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline
      points="5 12.5 10 17.5 19.5 6.5"
      stroke={color}
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Crisp plus icon
 */
export const PlusIcon: React.FC<GameIconProps> = ({
  size = 10,
  color = '#0A0E1F',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={3.2} strokeLinecap="round" />
    <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={3.2} strokeLinecap="round" />
  </Svg>
);

/**
 * Circular restart / replay arrow
 */
export const RestartIcon: React.FC<GameIconProps> = ({
  size = 18,
  color = '#E2E8F0',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.5 12A8.5 8.5 0 1 0 6.2 5.8L3.5 8.2"
      stroke={color}
      strokeWidth={2.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="3.5 3.5 3.5 8.2 8.2 8.2"
      stroke={color}
      strokeWidth={2.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Curved back-step undo icon
 */
export const UndoIcon: React.FC<GameIconProps> = ({
  size = 20,
  color = '#E2E8F0',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 14L4 9L9 4"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 9H14.5C17.8137 9 20.5 11.6863 20.5 15C20.5 18.3137 17.8137 21 14.5 21H11"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Lightbulb hint icon with optional illuminated glow rays
 */
export const BulbHintIcon: React.FC<GameIconProps & { active?: boolean }> = ({
  size = 20,
  color = '#FBBF24',
  active = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {active && (
      <G stroke="#00CFFF" strokeWidth={2} strokeLinecap="round" opacity={0.9}>
        <Line x1="12" y1="1.5" x2="12" y2="3" />
        <Line x1="4.2" y1="4.5" x2="5.5" y2="5.8" />
        <Line x1="19.8" y1="4.5" x2="18.5" y2="5.8" />
        <Line x1="2.2" y1="11" x2="4" y2="11" />
        <Line x1="20" y1="11" x2="21.8" y2="11" />
      </G>
    )}
    <Path
      d="M9 17.2V16.2C9 15.1 8.3 14.1 7.6 13.3C6.6 12.2 6 10.8 6 9.3C6 6.1 8.7 3.5 12 3.5C15.3 3.5 18 6.1 18 9.3C18 10.8 17.4 12.2 16.4 13.3C15.7 14.1 15 15.1 15 16.2V17.2"
      fill={active ? 'rgba(0, 207, 255, 0.25)' : 'rgba(251, 191, 36, 0.22)'}
      stroke={color}
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="9.5"
      y1="19.5"
      x2="14.5"
      y2="19.5"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
    <Line
      x1="10.5"
      y1="22"
      x2="13.5"
      y2="22"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
    <Path
      d="M10.5 9.5C10.5 8.5 11.2 7.8 12.2 7.8"
      stroke="#FEF08A"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Glass Test Tube with layered colored balls inside
 */
export const TestTubeIcon: React.FC<GameIconProps> = ({
  size = 20,
  color = '#38BDF8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Rim collar */}
    <Rect
      x="6.5"
      y="2.5"
      width="11"
      height="3"
      rx="1.5"
      fill="rgba(255, 255, 255, 0.16)"
      stroke={color}
      strokeWidth={1.8}
    />
    {/* Tube glass outline */}
    <Path
      d="M8 5.5V16.5C8 18.7091 9.79086 20.5 12 20.5C14.2091 20.5 16 18.7091 16 16.5V5.5"
      fill="rgba(14, 165, 233, 0.12)"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Stacked balls inside */}
    <Circle cx="12" cy="16.8" r="2.2" fill="#00CFFF" />
    <Circle cx="12" cy="12" r="2.2" fill="#FBBF24" />
    <Circle cx="12" cy="7.9" r="1.7" fill="#FB7185" opacity={0.95} />
    {/* Specular glass glint */}
    <Line
      x1="9.6"
      y1="7"
      x2="9.6"
      y2="16"
      stroke="#FFFFFF"
      strokeWidth={1.1}
      strokeLinecap="round"
      opacity={0.55}
    />
  </Svg>
);

/**
 * Multi-color palette icon for Theme Gallery
 */
export const PaletteIcon: React.FC<GameIconProps> = ({
  size = 20,
  color = '#E2E8F0',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3C7.03 3 3 6.81 3 11.5C3 14.89 5.38 17.5 8.5 17.5H10.2C10.95 17.5 11.4 18.18 11.2 18.9C11.02 19.55 11.42 20.5 12.6 20.5C17.24 20.5 21 16.65 21 11.8C21 6.94 16.97 3 12 3Z"
      fill="rgba(255, 255, 255, 0.1)"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Color paint swatches (zero purple) */}
    <Circle cx="7.8" cy="10.2" r="1.5" fill="#FB7185" />
    <Circle cx="11.2" cy="7.4" r="1.5" fill="#FBBF24" />
    <Circle cx="15.4" cy="8.6" r="1.5" fill="#00CFFF" />
    <Circle cx="16.4" cy="12.8" r="1.5" fill="#34D399" />
  </Svg>
);

/**
 * Metallic golden coin icon with inner bevel and specular shine
 */
export const CoinIcon: React.FC<GameIconProps> = ({ size = 16, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    {/* Outer coin rim */}
    <Circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#FEF08A" strokeWidth={1.2} />
    {/* Bright inner gold face */}
    <Circle cx="12" cy="12" r="7.4" fill="#FBBF24" stroke="#D97706" strokeWidth={1.1} />
    {/* Center emblem diamond */}
    <Path
      d="M12 7.4L14.8 12L12 16.6L9.2 12L12 7.4Z"
      fill="#FEF08A"
      opacity={0.92}
    />
    {/* Specular gleam */}
    <Path
      d="M7 6.5C8.5 5 10.6 4.4 12.6 4.6"
      stroke="#FFFFFF"
      strokeWidth={1.5}
      strokeLinecap="round"
      opacity={0.75}
    />
  </Svg>
);

/**
 * Prestigious golden victory trophy cup icon
 */
export const TrophyIcon: React.FC<GameIconProps> = ({ size = 20, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    {/* Left & right handles */}
    <Path
      d="M6.5 6H4.2C3.5 6 3 6.6 3 7.3V8.8C3 10.6 4.4 12.1 6.2 12.2H7"
      stroke="#F59E0B"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M17.5 6H19.8C20.5 6 21 6.6 21 7.3V8.8C21 10.6 19.6 12.1 17.8 12.2H17"
      stroke="#F59E0B"
      strokeWidth={2}
      strokeLinecap="round"
    />
    {/* Cup body */}
    <Path
      d="M6.5 4.2H17.5V10C17.5 13.04 15.04 15.5 12 15.5C8.96 15.5 6.5 13.04 6.5 10V4.2Z"
      fill="#FBBF24"
      stroke="#FEF08A"
      strokeWidth={1.3}
      strokeLinejoin="round"
    />
    {/* Stem & pedestal */}
    <Line x1="12" y1="15.5" x2="12" y2="19" stroke="#F59E0B" strokeWidth={2.5} />
    <Rect x="7.5" y="18.8" width="9" height="2.6" rx="1.3" fill="#D97706" stroke="#FDE68A" strokeWidth={0.9} />
    {/* Cup specular highlight */}
    <Line
      x1="9"
      y1="6.5"
      x2="9"
      y2="10.5"
      stroke="#FFFFFF"
      strokeWidth={1.5}
      strokeLinecap="round"
      opacity={0.75}
    />
  </Svg>
);

/**
 * 5-point game star icon (filled golden or dim outline)
 */
export const StarIcon: React.FC<GameIconProps & { filled?: boolean }> = ({
  size = 24,
  filled = true,
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M12 2.4L14.95 8.38L21.55 9.34L16.77 14L17.9 20.57L12 17.47L6.1 20.57L7.23 14L2.45 9.34L9.05 8.38L12 2.4Z"
      fill={filled ? '#FBBF24' : 'rgba(148, 163, 184, 0.16)'}
      stroke={filled ? '#FDE68A' : 'rgba(148, 163, 184, 0.35)'}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
    {filled && (
      <Path
        d="M12 4.6L13.5 7.8L10.3 7.5L12 4.6Z"
        fill="#FFFFFF"
        opacity={0.45}
      />
    )}
  </Svg>
);

/**
 * 4-point sparkle burst for solved tube badge
 */
export const SparkleIcon: React.FC<GameIconProps> = ({
  size = 12,
  color = '#FEF08A',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
      fill={color}
    />
  </Svg>
);

/**
 * Sleek padlock icon for locked levels
 */
export const LockIcon: React.FC<GameIconProps> = ({
  size = 12,
  color = '#64748B',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 10V7.5C7 4.74 9.24 2.5 12 2.5C14.76 2.5 17 4.74 17 7.5V10"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
    />
    <Rect
      x="5"
      y="10"
      width="14"
      height="11"
      rx="3"
      fill="rgba(100, 116, 139, 0.28)"
      stroke={color}
      strokeWidth={2}
    />
    <Circle cx="12" cy="15.5" r="1.4" fill={color} />
  </Svg>
);

/**
 * Clean 2x2 grid menu icon
 */
export const MenuGridIcon: React.FC<GameIconProps> = ({
  size = 14,
  color = '#E2E8F0',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3.5" y="3.5" width="7" height="7" rx="2" stroke={color} strokeWidth={2.2} />
    <Rect x="13.5" y="3.5" width="7" height="7" rx="2" stroke={color} strokeWidth={2.2} />
    <Rect x="3.5" y="13.5" width="7" height="7" rx="2" stroke={color} strokeWidth={2.2} />
    <Rect x="13.5" y="13.5" width="7" height="7" rx="2" stroke={color} strokeWidth={2.2} />
  </Svg>
);
