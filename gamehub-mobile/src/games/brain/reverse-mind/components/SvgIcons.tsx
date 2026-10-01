// ============================================================
// REVERSE MIND — Premium Custom SVG Vector Icons Library
// ============================================================

import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  Polygon,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  G,
} from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const PlayIconSvg: React.FC<IconProps> = ({ size = 20, color = '#07111F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 5V19L19 12L8 5Z" fill={color} />
  </Svg>
);

export const RocketIconSvg: React.FC<IconProps> = ({ size = 22, color = '#FFD83D' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C12 2 16 6 16 11C16 14.5 14.5 17 14.5 17L12 15.5 L9.5 17C9.5 17 8 14.5 8 11C8 6 12 2 12 2Z"
      fill={color}
    />
    <Path d="M5 14.5L8.5 12L9.5 17L5 14.5Z" fill="#FF5E6C" />
    <Path d="M19 14.5L15.5 12L14.5 17L19 14.5Z" fill="#FF5E6C" />
    <Circle cx="12" cy="9" r="2" fill="#07111F" />
  </Svg>
);

export const StarIconSvg: React.FC<IconProps> = ({ size = 20, color = '#FFD83D' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={color}
    />
  </Svg>
);

export const FlameIconSvg: React.FC<IconProps> = ({ size = 20, color = '#FF9800' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 23C16.1421 23 19.5 19.6421 19.5 15.5C19.5 11.5 16 8 13.5 4.5C13.2 4 12.4 4 12.2 4.5C10.5 7.5 7.5 10.5 7.5 15.5C7.5 19.6421 10.8579 23 12 23Z"
      fill={color}
    />
    <Path
      d="M12 20C13.6569 20 15 18.6569 15 17C15 15 13 13 12 11.5C11 13 9 15 9 17C9 18.6569 10.3431 20 12 20Z"
      fill="#FFE082"
    />
  </Svg>
);

export const BrainIconSvg: React.FC<IconProps> = ({ size = 22, color = '#4DE7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4C9 4 7 6 7 8.5C7 9.5 7.5 10.4 8.2 11C7 11.5 6 12.8 6 14.5C6 16.5 7.5 18 9.5 18H12V4Z"
      fill={color}
      opacity={0.9}
    />
    <Path
      d="M12 4C15 4 17 6 17 8.5C17 9.5 16.5 10.4 15.8 11C17 11.5 18 12.8 18 14.5C18 16.5 16.5 18 14.5 18H12V4Z"
      fill={color}
    />
    <Circle cx="12" cy="12" r="2" fill="#FFFFFF" />
  </Svg>
);

export const LightningIconSvg: React.FC<IconProps> = ({ size = 20, color = '#8D6BFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill={color} />
  </Svg>
);

export const TargetIconSvg: React.FC<IconProps> = ({ size = 20, color = '#57E389' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2.5" fill={color} />
  </Svg>
);

export const CoinIconSvg: React.FC<IconProps> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#FFD83D" stroke="#C68A00" strokeWidth="2" />
    <Circle cx="12" cy="12" r="6.5" fill="#FFE082" />
    <Path d="M12 8V16M9.5 10.5H14.5M9.5 13.5H14.5" stroke="#B28704" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const GemIconSvg: React.FC<IconProps> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="6,4 18,4 22,10 12,21 2,10" fill="#4DE7FF" stroke="#00BCD4" strokeWidth="1.5" />
    <Polygon points="6,4 12,10 18,4" fill="#B2F5EA" />
    <Polygon points="12,10 12,21 2,10" fill="#00ACC1" opacity={0.6} />
  </Svg>
);

export const ReverseArrowIconSvg: React.FC<IconProps> = ({ size = 20, color = '#4DE7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 12C4 7.58172 7.58172 4 12 4C15.5 4 18.5 6.2 19.5 9.5"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Path d="M20 12C20 16.4183 16.4183 20 12 20C8.5 20 5.5 17.8 4.5 14.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M16 9.5L20 9.5L20 5.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const HomeNavIconSvg: React.FC<IconProps> = ({ size = 20, color = '#8CA0B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z" fill={color} />
  </Svg>
);

export const ModesNavIconSvg: React.FC<IconProps> = ({ size = 20, color = '#8CA0B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="8" height="8" rx="2" fill={color} />
    <Rect x="13" y="3" width="8" height="8" rx="2" fill={color} />
    <Rect x="3" y="13" width="8" height="8" rx="2" fill={color} />
    <Rect x="13" y="13" width="8" height="8" rx="2" fill={color} />
  </Svg>
);

export const DailyNavIconSvg: React.FC<IconProps> = ({ size = 20, color = '#8CA0B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="2" />
    <Path d="M8 2V6M16 2V6M3 9H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const StatsNavIconSvg: React.FC<IconProps> = ({ size = 20, color = '#8CA0B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="13" width="4" height="8" rx="1" fill={color} />
    <Rect x="10" y="8" width="4" height="13" rx="1" fill={color} />
    <Rect x="16" y="3" width="4" height="18" rx="1" fill={color} />
  </Svg>
);

export const ProfileNavIconSvg: React.FC<IconProps> = ({ size = 20, color = '#8CA0B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="7" r="4" fill={color} />
    <Path d="M4 21C4 16.5817 7.58172 13 12 13C16.4183 13 20 16.5817 20 21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

// Dedicated High-Level Game Mode SVG Badges
export const ClassicModeIconSvg: React.FC<IconProps> = ({ size = 26, color = '#4DE7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="14" fill="#0D243B" stroke={color} strokeWidth="2" />
    <Path d="M9 16C9 12.134 12.134 9 16 9C19.1 9 21.7 11 22.6 13.8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M23 16C23 19.866 19.866 23 16 23C12.9 23 10.3 21 9.4 18.2" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M20 14L23.5 13.8L23 10.2" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 18L8.5 18.2L9 21.8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="16" cy="16" r="3" fill="#FFD83D" />
  </Svg>
);

export const QuickFlipModeIconSvg: React.FC<IconProps> = ({ size = 26, color = '#B57CFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="14" fill="#1C0F33" stroke={color} strokeWidth="2" />
    <Circle cx="16" cy="17" r="9" stroke="#E2D4FF" strokeWidth="2" />
    <Path d="M16 4V7M12 5L14 7M20 5L18 7" stroke="#FF9100" strokeWidth="2" strokeLinecap="round" />
    <Path d="M16 11V17L20 15" stroke="#FFD83D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const MindShiftModeIconSvg: React.FC<IconProps> = ({ size = 26, color = '#FF9100' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="14" fill="#241204" stroke={color} strokeWidth="2" />
    <Rect x="9" y="11" width="14" height="11" rx="3" fill="#3D200A" stroke="#FFB84D" strokeWidth="1.8" />
    <Circle cx="13" cy="15" r="1.8" fill="#4DE7FF" />
    <Circle cx="19" cy="15" r="1.8" fill="#4DE7FF" />
    <Path d="M13 19C14 20 18 20 19 19" stroke="#FFD83D" strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M16 6V11" stroke="#FF9100" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="16" cy="5" r="2" fill="#FFD83D" />
  </Svg>
);

export const DailyFlipModeIconSvg: React.FC<IconProps> = ({ size = 26, color = '#00E676' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="14" fill="#07241A" stroke={color} strokeWidth="2" />
    <Rect x="8" y="10" width="16" height="14" rx="2.5" stroke="#A7F3D0" strokeWidth="1.8" fill="#0A3324" />
    <Path d="M12 7V11M20 7V11M8 15H24" stroke="#00E676" strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 18L13 21L16 17L19 21L20 18" stroke="#FFD83D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#FFD83D" opacity={0.8} />
  </Svg>
);
