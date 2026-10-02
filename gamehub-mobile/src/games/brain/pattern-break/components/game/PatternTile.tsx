// ============================================================
// PATTERN BREAKER — PatternTile Component
// Ancient-tech stone module with metallic rim, glowing seams & rich SVG icons
// Supports states: default, pressed, correct, wrong, revealed, highlighted
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Polygon, Rect, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { TileItem, TileState } from '../../types';
import { PBColors, PBTypography, PBRadius, PBShadows } from '../../theme';

interface PatternTileProps {
  item: TileItem;
  state?: TileState;
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const PatternTile: React.FC<PatternTileProps> = ({
  item,
  state = 'default',
  onPress,
  disabled = false,
  size = 92,
  style,
}) => {
  const isCorrect = state === 'correct';
  const isWrong = state === 'wrong';
  const isRevealed = state === 'revealed';
  const isHighlighted = state === 'highlighted';

  const handlePress = () => {
    if (disabled || state === 'disabled') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
    onPress();
  };

  // Determine Stone Surface Gradients
  const gradientColors = isCorrect
    ? PBColors.tileCorrect
    : isWrong
    ? PBColors.tileWrong
    : isHighlighted
    ? PBColors.tileHighlighted
    : isRevealed
    ? PBColors.tileBreakerHint
    : PBColors.tileDefault;

  // Determine Rim Border Color
  const borderColor = isCorrect
    ? PBColors.positive
    : isWrong
    ? PBColors.danger
    : isRevealed
    ? PBColors.accent
    : isHighlighted
    ? PBColors.primary
    : 'rgba(25, 211, 255, 0.35)';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isCorrect}
      style={({ pressed }) => [
        styles.tileOuter,
        { width: size, height: size },
        isCorrect && PBShadows.cyanGlow,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Pattern tile: ${item.type} ${item.value}`}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.tileBody, { borderColor }]}
      >
        {/* Top Metallic Bevel Highlight */}
        <View style={styles.topBevel} />

        {/* 4 Corner Tech Screws / Rivets */}
        <View style={[styles.cornerRivet, styles.tl]} />
        <View style={[styles.cornerRivet, styles.tr]} />
        <View style={[styles.cornerRivet, styles.bl]} />
        <View style={[styles.cornerRivet, styles.br]} />

        {/* Dynamic Tile Content Rendering */}
        <View style={styles.contentCenter}>{renderTileGraphic(item, size * 0.52)}</View>

        {/* State Indicator Badges */}
        {isCorrect ? (
          <View style={styles.stateBadgeCorrect}>
            <Text style={styles.stateBadgeText}>✓</Text>
          </View>
        ) : isWrong ? (
          <View style={styles.stateBadgeWrong}>
            <Text style={styles.stateBadgeText}>✕</Text>
          </View>
        ) : null}
      </LinearGradient>
    </Pressable>
  );
};

// Pure Vector Graphics Rendering for each Pattern Dimension
function renderTileGraphic(item: TileItem, iconSize: number) {
  if (item.type === 'number') {
    return (
      <Text style={[styles.numberText, { color: item.color || PBColors.primary }]}>
        {item.value}
      </Text>
    );
  }

  if (item.type === 'count') {
    const count = item.count || 1;
    return (
      <View style={styles.countGrid}>
        {Array.from({ length: count }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.countGem,
              { backgroundColor: item.color || PBColors.accent },
            ]}
          />
        ))}
      </View>
    );
  }

  if (item.type === 'direction') {
    const rotation = `${item.rotation || 0}deg`;
    return (
      <View style={{ transform: [{ rotate: rotation }] }}>
        <Svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <Path
            d="M 20,4 L 34,22 L 24,22 L 24,36 L 16,36 L 16,22 L 6,22 Z"
            fill={item.color || PBColors.primary}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </Svg>
      </View>
    );
  }

  if (item.type === 'color') {
    return (
      <View
        style={[
          styles.colorRune,
          {
            width: iconSize * 0.9,
            height: iconSize * 0.9,
            backgroundColor: item.color,
            shadowColor: item.color,
          },
        ]}
      />
    );
  }

  // Default / Shape / Mixed
  return (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 50 50">
      {renderShapeSvg(item.shape || 'triangle', item.color || PBColors.primary)}
    </Svg>
  );
}

function renderShapeSvg(shape: string, fill: string) {
  switch (shape) {
    case 'circle':
      return <Circle cx="25" cy="25" r="19" fill={fill} stroke="#FFFFFF" strokeWidth="1.5" />;
    case 'square':
      return <Rect x="8" y="8" width="34" height="34" rx="4" fill={fill} stroke="#FFFFFF" strokeWidth="1.5" />;
    case 'star':
      return (
        <Polygon
          points="25,5 31,18 45,18 34,27 38,40 25,32 12,40 16,27 5,18 19,18"
          fill={fill}
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
      );
    case 'hexagon':
      return (
        <Polygon
          points="25,6 43,15 43,35 25,44 7,35 7,15"
          fill={fill}
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
      );
    case 'diamond':
      return (
        <Polygon
          points="25,5 44,25 25,45 6,25"
          fill={fill}
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
      );
    case 'triangle':
    default:
      return (
        <Polygon
          points="25,6 45,42 5,42"
          fill={fill}
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
      );
  }
}

const styles = StyleSheet.create({
  tileOuter: {
    borderRadius: PBRadius.lg,
    margin: 4,
    overflow: 'hidden',
  },
  tileBody: {
    flex: 1,
    borderRadius: PBRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  cornerRivet: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(25, 211, 255, 0.5)',
  },
  tl: { top: 5, left: 5 },
  tr: { top: 5, right: 5 },
  bl: { bottom: 5, left: 5 },
  br: { bottom: 5, right: 5 },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  countGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countGem: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  colorRune: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  stateBadgeCorrect: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: PBColors.positive,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateBadgeWrong: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: PBColors.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
});
