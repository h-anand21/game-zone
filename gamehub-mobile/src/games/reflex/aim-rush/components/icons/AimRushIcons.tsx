// ============================================================
// AIM RUSH — Authentic Sci-Fi Vector SVG Icon System
// Precision vector paths styled for the cyberpunk arcade HUD
// ============================================================

import React from 'react';
import Svg, { Path, Circle, Rect, Polygon, G, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  fill?: string;
}

// 1. Tech Back Chevron
export const SvgBackArrow: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 19L8 12L15 5"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 12H8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.6}
    />
  </Svg>
);

// 2. User Avatar
export const SvgUserAvatar: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={2} />
    <Path
      d="M4 20C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 20"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// 3. Stats Bar Chart
export const SvgStatsBarChart: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="13" width="3.5" height="7" rx="1" fill={color} />
    <Rect x="10.25" y="7" width="3.5" height="13" rx="1" fill={color} />
    <Rect x="16.5" y="10" width="3.5" height="10" rx="1" fill={color} />
  </Svg>
);

// 4. Trophy
export const SvgTrophy: React.FC<IconProps> = ({ size = 20, color = '#FFD700' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 4H17V10C17 12.76 14.76 15 12 15C9.24 15 7 12.76 7 10V4Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Path
      d="M7 6H4C3.45 6 3 6.45 3 7V8C3 10.2 4.8 12 7 12V12"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M17 6H20C20.55 6 21 6.45 21 7V8C21 10.2 19.2 12 17 12V12"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path d="M12 15V19" stroke={color} strokeWidth={2} />
    <Path d="M8 19H16" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

// 5. Calendar / Daily
export const SvgCalendar: React.FC<IconProps> = ({ size = 20, color = '#C084FC' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth={2} />
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth={1.8} />
    <Circle cx="8" cy="13" r="1.2" fill={color} />
    <Circle cx="12" cy="13" r="1.2" fill={color} />
    <Circle cx="16" cy="13" r="1.2" fill={color} />
    <Circle cx="8" cy="17" r="1.2" fill={color} />
    <Circle cx="12" cy="17" r="1.2" fill={color} />
    <Circle cx="16" cy="17" r="1.2" fill={color} />
  </Svg>
);

// 6. Settings Gear
export const SvgSettingsGear: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth={2} />
    <Path
      d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// 7. Crown (Personal Best)
export const SvgCrown: React.FC<IconProps> = ({ size = 20, color = '#FFD700' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17L5 7L9 12L12 5L15 12L19 7L21 17H3Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      fill={color}
      fillOpacity={0.2}
    />
    <Rect x="3" y="17" width="18" height="3" rx="1" fill={color} />
  </Svg>
);

// 8. Chain Link (Streak)
export const SvgChainLink: React.FC<IconProps> = ({ size = 20, color = '#C8FF4D' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 13C10.45 13.57 11.04 14.03 11.72 14.33C12.4 14.63 13.15 14.77 13.9 14.73C14.65 14.69 15.38 14.47 16.02 14.1C16.66 13.73 17.2 13.22 17.58 12.6L19.58 9.35C20.31 8.16 20.35 6.67 19.7 5.46C19.05 4.25 17.78 3.47 16.39 3.42C15 3.37 13.67 4.07 12.9 5.23L11.5 7.5"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
    <Path
      d="M14 11C13.55 10.43 12.96 9.97 12.28 9.67C11.6 9.37 10.85 9.23 10.1 9.27C9.35 9.31 8.62 9.53 7.98 9.9C7.34 10.27 6.8 10.78 6.42 11.4L4.42 14.65C3.69 15.84 3.65 17.33 4.3 18.54C4.95 19.75 6.22 20.53 7.61 20.58C9 20.63 10.33 19.93 11.1 18.77L12.5 16.5"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </Svg>
);

// 9. Bullseye Target (Precision / Perfect)
export const SvgBullseyeTarget: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={1.8} />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// 10. Play Triangle
export const SvgPlayTriangle: React.FC<IconProps> = ({ size = 24, color = '#07090C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="7,4 20,12 7,20" fill={color} />
  </Svg>
);

// 11. Lightning Bolt (Rush)
export const SvgLightningFlash: React.FC<IconProps> = ({ size = 20, color = '#FF4D61' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill={color} />
  </Svg>
);

// 12. Star
export const SvgStar: React.FC<IconProps> = ({ size = 20, color = '#FFD700', fill }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
      fill={fill ?? color}
    />
  </Svg>
);

// 13. Book (How to Play)
export const SvgBook: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 19.5C4 18.12 5.12 17 6.5 17H20M4 19.5C4 20.88 5.12 22 6.5 22H20V4H6.5C5.12 4 4 5.12 4 6.5V19.5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="8" y1="8" x2="16" y2="8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1="8" y1="12" x2="14" y2="12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

// 14. Podium (Leaderboard)
export const SvgPodium: React.FC<IconProps> = ({ size = 20, color = '#C8FF4D' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="8.5" y="5" width="7" height="15" rx="1.5" stroke={color} strokeWidth={1.8} />
    <Rect x="2" y="10" width="6.5" height="10" rx="1.5" stroke={color} strokeWidth={1.8} />
    <Rect x="15.5" y="12" width="6.5" height="8" rx="1.5" stroke={color} strokeWidth={1.8} />
  </Svg>
);

// 15. Medal (Achievements)
export const SvgMedal: React.FC<IconProps> = ({ size = 20, color = '#FFD700' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="14" r="6" stroke={color} strokeWidth={2} />
    <Path d="M8 3L10.5 9M16 3L13.5 9" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Polygon points="12,12 13,14 15,14 13.5,15.5 14,17.5 12,16 10,17.5 10.5,15.5 9,14 11,14" fill={color} />
  </Svg>
);

// 16. Pause Bars
export const SvgPause: React.FC<IconProps> = ({ size = 18, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="5" width="4" height="14" rx="1" fill={color} />
    <Rect x="14" y="5" width="4" height="14" rx="1" fill={color} />
  </Svg>
);

// 17. Heart (Lives)
export const SvgHeart: React.FC<IconProps> = ({ size = 16, color = '#35E7FF', fill }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.77 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      fill={fill ?? color}
    />
  </Svg>
);

// 18. Bulb (Hint)
export const SvgBulbHint: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H15M10 24H14M12 2C7.58 2 4 5.58 4 10C4 12.76 5.41 15.19 7.55 16.61C8.42 17.18 9 18.15 9 19.2V20H15V19.2C15 18.15 15.58 17.18 16.45 16.61C18.59 15.19 20 12.76 20 10C20 5.58 16.42 2 12 2Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 19. Exit Door
export const SvgExitDoor: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 4.47 3.21 3.96 3.59 3.59C3.96 3.21 4.47 3 5 3H9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path d="M16 17L21 12L16 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 12H9" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// 20. Warning Triangle
export const SvgWarningTriangle: React.FC<IconProps> = ({ size = 24, color = '#FF4D61' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon
      points="12,2 23,21 1,21"
      stroke={color}
      strokeWidth={2.2}
      strokeLinejoin="round"
      fill={color}
      fillOpacity={0.15}
    />
    <Line x1="12" y1="9" x2="12" y2="14" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Circle cx="12" cy="17.5" r="1.3" fill={color} />
  </Svg>
);

// 21. Refresh / Restart
export const SvgRefresh: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C15.35 3 18.28 4.83 19.86 7.5M21 3V8H16"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 22. Close / Cancel
export const SvgClose: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

// 23. Home Icon
export const SvgHome: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
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

// 24. Gift / Reward
export const SvgGift: React.FC<IconProps> = ({ size = 20, color = '#FFD700' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="10" width="18" height="11" rx="2" stroke={color} strokeWidth={1.8} />
    <Rect x="2" y="6" width="20" height="4" rx="1.5" stroke={color} strokeWidth={1.8} />
    <Line x1="12" y1="6" x2="12" y2="21" stroke={color} strokeWidth={1.8} />
    <Path d="M12 6C10.5 4 8 3.5 7 5C6 6.5 8 8 12 8" stroke={color} strokeWidth={1.6} />
    <Path d="M12 6C13.5 4 16 3.5 17 5C18 6.5 16 8 12 8" stroke={color} strokeWidth={1.6} />
  </Svg>
);

// 25. Speaker / Audio
export const SvgVolumeHigh: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    <Path d="M15.54 8.46C16.48 9.4 17 10.66 17 12C17 13.34 16.48 14.6 15.54 15.54" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M19.07 4.93C20.94 6.8 22 9.33 22 12C22 14.67 20.94 17.2 19.07 19.07" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// 26. Music Notes
export const SvgMusic: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth={2} />
    <Circle cx="18" cy="16" r="3" stroke={color} strokeWidth={2} />
    <Path d="M9 18V5L21 3V16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 27. Phone / Haptics
export const SvgPhone: React.FC<IconProps> = ({ size = 20, color = '#C8FF4D' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="20" rx="3" stroke={color} strokeWidth={2} />
    <Line x1="12" y1="18" x2="12" y2="18.01" stroke={color} strokeWidth={3} strokeLinecap="round" />
  </Svg>
);

// 28. Eye / Visuals
export const SvgEye: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

// 29. Trash Bin
export const SvgTrash: React.FC<IconProps> = ({ size = 18, color = '#FF4D61' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    <Path d="M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    <Line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

// 30. Clock / Time
export const SvgClock: React.FC<IconProps> = ({ size = 20, color = '#35E7FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
    <Path d="M12 7V12L15 15" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
