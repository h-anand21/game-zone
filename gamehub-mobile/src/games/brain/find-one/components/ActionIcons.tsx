// ============================================================
// Find One — Visual Action Button Icons
// Faithful to the UI Design Reference
// ============================================================

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
}

/**
 * Open 3D Book Icon for "HOW TO PLAY" button
 * Exactly matches the design reference open book icon with white pages and purple spine
 */
export const HowToPlayBookIcon: React.FC<IconProps> = ({ size = 20 }) => {
  const height = Math.round(size * 0.9);
  return (
    <Svg width={size} height={height} viewBox="0 0 24 22" fill="none">
      {/* Back book cover subtle glow */}
      <Path
        d="M2 18C5 16.5 9 16.5 12 19C15 16.5 19 16.5 22 18V4C19 2.5 15 2.5 12 5C9 2.5 5 2.5 2 4V18Z"
        fill="#5E23C7"
      />
      {/* Left Page (White with curved top) */}
      <Path
        d="M12 4.5C8.5 2.2 3.8 2.2 2 3.8V17C3.8 15.5 8.5 15.5 12 18V4.5Z"
        fill="#FFFFFF"
        stroke="#D4E4F7"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Right Page (White with curved top) */}
      <Path
        d="M12 4.5C15.5 2.2 20.2 2.2 22 3.8V17C20.2 15.5 15.5 15.5 12 18V4.5Z"
        fill="#F6FAFF"
        stroke="#D4E4F7"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Book Spine (Purple divider) */}
      <Path
        d="M12 4.2V18.2"
        stroke="#7A39E8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Left Page text indicator lines */}
      <Path
        d="M4.5 7.5H9.5M4.5 10.5H9M4.5 13.5H8"
        stroke="#A8C9ED"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Right Page text indicator lines */}
      <Path
        d="M14.5 7.5H19.5M14.5 10.5H19M14.5 13.5H17.5"
        stroke="#A8C9ED"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

/**
 * 3-Bar Podium / Ranking Chart Icon for "LEADERBOARD" button
 * Exactly matches the design reference golden podium bars
 */
export const LeaderboardBarsIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Left Bar (Medium - Rank 2) */}
      <Rect x="2.5" y="8" width="5" height="13" rx="2" fill="#FFC928" />
      <Rect x="3.5" y="9" width="3" height="3" rx="1" fill="#FFEAA0" opacity={0.7} />

      {/* Center Bar (Tallest - Rank 1) */}
      <Rect x="9.5" y="3" width="5" height="18" rx="2" fill="#FFD700" />
      <Rect x="10.5" y="4" width="3" height="4" rx="1" fill="#FFFFFF" opacity={0.8} />

      {/* Right Bar (Shortest - Rank 3) */}
      <Rect x="16.5" y="12" width="5" height="9" rx="2" fill="#FFA500" />
      <Rect x="17.5" y="13" width="3" height="2" rx="1" fill="#FFEAA0" opacity={0.7} />
    </Svg>
  );
};
