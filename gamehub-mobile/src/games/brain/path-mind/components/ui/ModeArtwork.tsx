// ============================================================
// PATH MIND — Component: ModeArtwork
// Tactile 2.5D Stone Tile with Standalone Vector SVG Fantasy Emblems
// Dedicated Illustrations: Classic Rune, Number Trail, Mixed Crystal, Challenge Blades
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle, Polygon, Line } from 'react-native-svg';
import { pmColors } from '../../design-system/colors';
import { pmRadii } from '../../design-system/radii';

interface ModeArtworkProps {
  type: 'classic' | 'number-trail' | 'mixed' | 'challenge';
  size?: number;
  accentColor?: string;
  glowColor?: string;
}

export const ModeArtwork: React.FC<ModeArtworkProps> = ({
  type,
  size = 66,
  accentColor = pmColors.cyanGlow,
  glowColor = 'rgba(0, 240, 255, 0.35)',
}) => {
  const renderEmblem = () => {
    switch (type) {
      case 'classic':
        // Glowing path rune on ancient tile: start node -> winding path -> goal diamond
        return (
          <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 48 48">
            {/* Ancient Stone Circuit Path */}
            <Path
              d="M10 38 L10 24 L24 24 L24 12 L38 12"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Glowing Energy Beam */}
            <Path
              d="M10 38 L10 24 L24 24 L24 12 L38 12"
              fill="none"
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Start Node */}
            <Circle cx="10" cy="38" r="4.5" fill="#FFE27A" stroke="#2A180E" strokeWidth="1.5" />
            {/* Mid Node */}
            <Circle cx="24" cy="24" r="3.5" fill={accentColor} />
            {/* Goal Node */}
            <Polygon points="38,7 43,12 38,17 33,12" fill="#FFE27A" stroke="#2A180E" strokeWidth="1.5" />
          </Svg>
        );

      case 'number-trail':
        // Stacked numbered rune tiles: 1, 2, 3 in ascending sequence
        return (
          <Svg width={size * 0.72} height={size * 0.72} viewBox="0 0 48 48">
            {/* Tile 1 */}
            <Rect x="6" y="8" width="16" height="16" rx="3" fill="#0C1B26" stroke={accentColor} strokeWidth="1.5" />
            <Path d="M12 19 L14 19 L14 12 L12 13.5" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

            {/* Connecting Arc Beam */}
            <Path d="M22 16 Q28 16 28 22" fill="none" stroke={accentColor} strokeWidth="2" strokeDasharray="2,2" />

            {/* Tile 2 */}
            <Rect x="20" y="24" width="16" height="16" rx="3" fill="#0C1B26" stroke={accentColor} strokeWidth="1.5" />
            <Path d="M25 29 C25 27.5 28.5 27.5 28.5 29.5 C28.5 32 25 33 25 35 L31 35" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

            {/* Tile 3 mini node */}
            <Circle cx="39" cy="14" r="5" fill={accentColor} />
            <Circle cx="39" cy="14" r="2.5" fill="#0C1B26" />
          </Svg>
        );

      case 'mixed':
        // Mystical multifaceted crystal gem with magical symbols & facets
        return (
          <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 48 48">
            {/* Outer Gem Outline */}
            <Polygon
              points="24,4 38,15 32,42 16,42 10,15"
              fill="rgba(176, 136, 255, 0.22)"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Inner Crystal Facets */}
            <Line x1="10" y1="15" x2="38" y2="15" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" />
            <Line x1="24" y1="4" x2="19" y2="15" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" />
            <Line x1="24" y1="4" x2="29" y2="15" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" />
            <Line x1="19" y1="15" x2="16" y2="42" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
            <Line x1="29" y1="15" x2="32" y2="42" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
            <Line x1="24" y1="4" x2="24" y2="42" stroke={accentColor} strokeWidth="1.5" />
            {/* Central Glow Sparkle */}
            <Circle cx="24" cy="20" r="3" fill="#FFFFFF" opacity={0.8} />
          </Svg>
        );

      case 'challenge':
        // Crossed blades & skull hazard trap tile in radiant danger red
        return (
          <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 48 48">
            {/* Crossed Blade 1 */}
            <Path
              d="M10 10 L38 38 M10 10 L15 9 L39 33 L38 38 L33 39 L9 15 Z"
              fill="rgba(255, 71, 87, 0.25)"
              stroke={accentColor}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Crossed Blade 2 */}
            <Path
              d="M38 10 L10 38 M38 10 L39 15 L15 39 L10 38 L9 33 L33 9 Z"
              fill="rgba(255, 71, 87, 0.25)"
              stroke={accentColor}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Central Danger Rune Skull Eye */}
            <Circle cx="24" cy="24" r="5" fill="#1C0A0E" stroke={accentColor} strokeWidth="2" />
            <Circle cx="24" cy="24" r="2.5" fill="#FF4757" />
          </Svg>
        );
    }
  };

  return (
    <View
      style={[
        styles.tileFrame,
        {
          width: size,
          height: size,
          borderColor: accentColor,
          shadowColor: glowColor,
        },
      ]}
    >
      {/* 2.5D Carved Inner Bevel */}
      <View style={styles.innerCarving}>
        {renderEmblem()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tileFrame: {
    backgroundColor: '#0F1A24',
    borderWidth: 2,
    borderBottomWidth: 3.5,
    borderRadius: pmRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 4,
  },
  innerCarving: {
    width: '90%',
    height: '90%',
    backgroundColor: 'rgba(8, 14, 20, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: pmRadii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
