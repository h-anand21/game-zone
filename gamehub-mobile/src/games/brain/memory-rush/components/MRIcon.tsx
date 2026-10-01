import React from 'react';
import Svg, { Path, Circle, Rect, Polyline, Line, Polygon } from 'react-native-svg';
import { colors } from '../constants/colors';

export type MRIconName =
  | 'play'
  | 'play-circle'
  | 'zap'
  | 'target'
  | 'clock'
  | 'bar-chart-2'
  | 'check-circle'
  | 'shield'
  | 'award'
  | 'star'
  | 'volume-2'
  | 'smartphone'
  | 'activity'
  | 'cpu'
  | 'eye'
  | 'type'
  | 'feather'
  | 'trash-2'
  | 'alert-triangle'
  | 'grid'
  | 'refresh-cw'
  | 'help-circle'
  | 'arrow-right'
  | 'chevron-right'
  | 'arrow-left'
  | 'user'
  | 'log-out'
  | 'flame'
  | 'pause'
  | 'freeze'
  | 'eye-reveal'
  | 'life';

interface MRIconProps {
  name: MRIconName | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const MRIcon: React.FC<MRIconProps> = ({
  name,
  size = 20,
  color = colors.accent,
  strokeWidth = 2,
}) => {
  switch (name) {
    case 'play':
    case 'play-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Polygon points="10 8 16 12 10 16 10 8" fill={color} />
        </Svg>
      );

    case 'zap':
    case 'flame':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} opacity={0.3} />
          <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </Svg>
      );

    case 'target':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Circle cx="12" cy="12" r="6" />
          <Circle cx="12" cy="12" r="2" fill={color} />
        </Svg>
      );

    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Polyline points="12 6 12 12 16 14" />
        </Svg>
      );

    case 'bar-chart-2':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Line x1="18" y1="20" x2="18" y2="10" />
          <Line x1="12" y1="20" x2="12" y2="4" />
          <Line x1="6" y1="20" x2="6" y2="14" />
        </Svg>
      );

    case 'check-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <Polyline points="22 4 12 14.01 9 11.01" />
        </Svg>
      );

    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </Svg>
      );

    case 'award':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="8" r="7" />
          <Polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </Svg>
      );

    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} />
        </Svg>
      );

    case 'volume-2':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </Svg>
      );

    case 'smartphone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <Line x1="12" y1="18" x2="12.01" y2="18" />
        </Svg>
      );

    case 'activity':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </Svg>
      );

    case 'cpu':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
          <Rect x="9" y="9" width="6" height="6" />
          <Line x1="9" y1="1" x2="9" y2="4" />
          <Line x1="15" y1="1" x2="15" y2="4" />
          <Line x1="9" y1="20" x2="9" y2="23" />
          <Line x1="15" y1="20" x2="15" y2="23" />
          <Line x1="20" y1="9" x2="23" y2="9" />
          <Line x1="20" y1="15" x2="23" y2="15" />
          <Line x1="1" y1="9" x2="4" y2="9" />
          <Line x1="1" y1="15" x2="4" y2="15" />
        </Svg>
      );

    case 'eye':
    case 'eye-reveal':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <Circle cx="12" cy="12" r="3" />
        </Svg>
      );

    case 'type':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Polyline points="4 7 4 4 20 4 20 7" />
          <Line x1="9" y1="20" x2="15" y2="20" />
          <Line x1="12" y1="4" x2="12" y2="20" />
        </Svg>
      );

    case 'feather':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 13v5h5l9.24-9.24z" />
          <Line x1="16" y1="8" x2="2" y2="22" />
          <Line x1="17.5" y1="15" x2="9" y2="15" />
        </Svg>
      );

    case 'trash-2':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Polyline points="3 6 5 6 21 6" />
          <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <Line x1="10" y1="11" x2="10" y2="17" />
          <Line x1="14" y1="11" x2="14" y2="17" />
        </Svg>
      );

    case 'alert-triangle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <Line x1="12" y1="9" x2="12" y2="13" />
          <Line x1="12" y1="17" x2="12.01" y2="17" />
        </Svg>
      );

    case 'grid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Rect x="3" y="3" width="7" height="7" />
          <Rect x="14" y="3" width="7" height="7" />
          <Rect x="14" y="14" width="7" height="7" />
          <Rect x="3" y="14" width="7" height="7" />
        </Svg>
      );

    case 'arrow-right':
    case 'chevron-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Polyline points="9 18 15 12 9 6" />
        </Svg>
      );

    case 'arrow-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Line x1="19" y1="12" x2="5" y2="12" />
          <Polyline points="12 19 5 12 12 5" />
        </Svg>
      );

    case 'user':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <Circle cx="12" cy="7" r="4" />
        </Svg>
      );

    case 'log-out':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <Polyline points="16 17 21 12 16 7" />
          <Line x1="21" y1="12" x2="9" y2="12" />
        </Svg>
      );

    case 'pause':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Rect x="6" y="4" width="4" height="16" />
          <Rect x="14" y="4" width="4" height="16" />
        </Svg>
      );

    case 'freeze':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Line x1="12" y1="2" x2="12" y2="22" />
          <Line x1="2" y1="12" x2="22" y2="12" />
          <Line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <Line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        </Svg>
      );

    case 'life':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} />
        </Svg>
      );

    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Line x1="12" y1="8" x2="12" y2="12" />
          <Line x1="12" y1="16" x2="12.01" y2="16" />
        </Svg>
      );
  }
};
