// ============================================================
// ONE TAP: PRECISION GAME — SVG Vector Icons
// 100% Native SVG vector paths, crisp on all resolutions
// ============================================================

import React from 'react';
import Svg, { Path, Circle, Rect, Polygon, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  fill?: string;
}

// 1. Back Arrow
export const SvgBackArrow: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 2. Home
export const SvgHome: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 3. Settings Gear
export const SvgSettings: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
    <Path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke={color}
      strokeWidth={1.8}
    />
  </Svg>
);

// 4. Crown
export const SvgCrown: React.FC<IconProps> = ({ size = 20, color = '#FFD700' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 19H22V21H2V19ZM2 5L7 11L12 3L17 11L22 5V17H2V5Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
      fill={color}
      fillOpacity={0.2}
    />
  </Svg>
);

// 5. Lightning (Rush/Combo)
export const SvgLightning: React.FC<IconProps> = ({ size = 20, color = '#00E5FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} />
  </Svg>
);

// 6. Pause (HUD)
export const SvgPause: React.FC<IconProps> = ({ size = 18, color = '#00E5FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="4" width="4" height="16" rx="1.5" fill={color} />
    <Rect x="14" y="4" width="4" height="16" rx="1.5" fill={color} />
  </Svg>
);

// 7. Play (Triangle)
export const SvgPlay: React.FC<IconProps> = ({ size = 20, color = '#00E5FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="6 4 20 12 6 20 6 4" fill={color} />
  </Svg>
);

// 8. Refresh (Play Again / Restart)
export const SvgRefresh: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 9. Chevron Right
export const SvgChevronRight: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 10. Lock (Locked Mode)
export const SvgLock: React.FC<IconProps> = ({ size = 20, color = '#8B949E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="10" width="16" height="11" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="15.5" r="1.5" fill={color} />
  </Svg>
);

// 11. Target (Bullseye)
export const SvgTarget: React.FC<IconProps> = ({ size = 20, color = '#00E5FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={1.8} />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// 12. Star
export const SvgStar: React.FC<IconProps> = ({ size = 18, color = '#FFD700' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={color}
    />
  </Svg>
);

// 13. Grid (Mode Select)
export const SvgGrid: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1.5" fill={color} />
    <Rect x="14" y="3" width="7" height="7" rx="1.5" fill={color} />
    <Rect x="3" y="14" width="7" height="7" rx="1.5" fill={color} />
    <Rect x="14" y="14" width="7" height="7" rx="1.5" fill={color} />
  </Svg>
);

// 14. Volume High
export const SvgVolumeHigh: React.FC<IconProps> = ({ size = 20, color = '#00E5FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    <Path d="M15.54 8.46C16.48 9.4 17 10.66 17 12C17 13.34 16.48 14.6 15.54 15.54" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M19.07 4.93C20.94 6.8 22 9.33 22 12C22 14.67 20.94 17.2 19.07 19.07" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// 15. Music Notes
export const SvgMusic: React.FC<IconProps> = ({ size = 20, color = '#00E5FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth={2} />
    <Circle cx="18" cy="16" r="3" stroke={color} strokeWidth={2} />
    <Path d="M9 18V5L21 3V16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 16. Phone / Haptics
export const SvgPhone: React.FC<IconProps> = ({ size = 20, color = '#C8FF4D' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="20" rx="3" stroke={color} strokeWidth={2} />
    <Line x1="12" y1="18" x2="12" y2="18.01" stroke={color} strokeWidth={3} strokeLinecap="round" />
  </Svg>
);

// 17. Eye (Visual FX)
export const SvgEye: React.FC<IconProps> = ({ size = 20, color = '#00E5FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

// 18. Trash
export const SvgTrash: React.FC<IconProps> = ({ size = 18, color = '#FF4D61' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    <Path d="M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" stroke={color} strokeWidth={2} strokeLinejoin="round" />
  </Svg>
);

// 19. Timer / Clock
export const SvgTimer: React.FC<IconProps> = ({ size = 18, color = '#00E5FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
    <Path d="M12 7V12L15 15" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// 20. Exit / Door
export const SvgExitDoor: React.FC<IconProps> = ({ size = 20, color = '#FF4D61' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5C4.47 21 4 20.53 4 20V4C4 3.47 4.47 3 5 3H9" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M16 17L21 12L16 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// 21. Share
export const SvgShare: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={2} />
    <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth={2} />
    <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth={2} />
    <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={color} strokeWidth={2} />
    <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={color} strokeWidth={2} />
  </Svg>
);
