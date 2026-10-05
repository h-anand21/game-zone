// ============================================================
// PATH MIND — Component: GameTitlePlaque
// Carved Stone & Wood Fantasy Plaque with Metal Bolts & Glowing Trim
// Supports authentic atlas image plaque from user reference or vector signage
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Dimensions, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GameTitlePlaqueProps {
  imageSource?: ImageSourcePropType;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const GameTitlePlaque: React.FC<GameTitlePlaqueProps> = ({
  imageSource,
  title = 'CHOOSE YOUR MODE',
  subtitle = 'SELECT EXPEDITION DISCIPLINE',
  width,
  height,
  style,
}) => {
  // 1. If an authentic cropped plaque atlas image is provided (from user reference), render it directly
  if (imageSource) {
    const plaqueWidth = width || Math.min(SCREEN_WIDTH - 36, 320);
    const plaqueHeight = height || Math.round(plaqueWidth * (170 / 400)); // Natural ~2.35:1 aspect ratio

    return (
      <View style={[styles.outerContainer, style]}>
        <View style={styles.imageWrapper}>
          <Image
            source={imageSource}
            style={{ width: plaqueWidth, height: plaqueHeight }}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  // 2. Fallback: Procedural stone frame with carved timber plate & Minecraft typography
  return (
    <View style={[styles.outerContainer, style]}>
      {/* 1. OUTER STONE FRAME WITH RIVETS */}
      <View style={styles.stoneFrame}>
        {/* Metal Corner Bolts / Rivets */}
        <View style={[styles.bolt, styles.boltTL]} />
        <View style={[styles.bolt, styles.boltTR]} />
        <View style={[styles.bolt, styles.boltBL]} />
        <View style={[styles.bolt, styles.boltBR]} />

        {/* 2. INNER CARVED TIMBER PLATE */}
        <View style={styles.woodPlate}>
          {/* Subtle Decorative Jungle Leaf / Vine Glyphs */}
          <View style={styles.vineLeft}>
            <Svg width="18" height="18" viewBox="0 0 24 24">
              <Path
                d="M17 3c-4.4 0-8 3.6-8 8 0 1.2.3 2.4.8 3.4L3 21l6.6-6.8c1 .5 2.2.8 3.4.8 4.4 0 8-3.6 8-8s-3.6-8-8-8z"
                fill="rgba(46, 204, 113, 0.45)"
              />
            </Svg>
          </View>
          <View style={styles.vineRight}>
            <Svg width="18" height="18" viewBox="0 0 24 24" style={{ transform: [{ scaleX: -1 }] }}>
              <Path
                d="M17 3c-4.4 0-8 3.6-8 8 0 1.2.3 2.4.8 3.4L3 21l6.6-6.8c1 .5 2.2.8 3.4.8 4.4 0 8-3.6 8-8s-3.6-8-8-8z"
                fill="rgba(46, 204, 113, 0.45)"
              />
            </Svg>
          </View>

          {/* MAIN DOMINANT TITLE */}
          <Text style={styles.titleText}>{title}</Text>

          {/* 3. SUBTITLE CARVED PLAQUE */}
          {subtitle && (
            <View style={styles.subPill}>
              <View style={styles.subDot} />
              <Text style={styles.subtitleText}>{subtitle}</Text>
              <View style={styles.subDot} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.65,
    shadowRadius: 8,
    elevation: 8,
  },
  stoneFrame: {
    width: Math.min(SCREEN_WIDTH - 32, 345),
    backgroundColor: '#1E2C38',
    borderWidth: 2.5,
    borderBottomWidth: 4,
    borderColor: '#4A6278',
    borderRadius: pmRadii.lg,
    padding: 3.5,
    position: 'relative',
    ...pmShadows.heavy,
  },
  bolt: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8BA5BF',
    borderWidth: 1,
    borderColor: '#111A22',
    zIndex: 10,
  },
  boltTL: { top: 3, left: 4 },
  boltTR: { top: 3, right: 4 },
  boltBL: { bottom: 3, left: 4 },
  boltBR: { bottom: 3, right: 4 },
  woodPlate: {
    backgroundColor: '#2A180E',
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderColor: '#8C5627',
    borderRadius: pmRadii.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  vineLeft: {
    position: 'absolute',
    left: 8,
    top: 6,
  },
  vineRight: {
    position: 'absolute',
    right: 8,
    top: 6,
  },
  titleText: {
    fontFamily: pmTypography.displayTitle.fontFamily,
    fontSize: 18,
    fontWeight: '900',
    color: '#FFE27A',
    letterSpacing: 1.4,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1.5, height: 2 },
    textShadowRadius: 1,
  },
  subPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    backgroundColor: 'rgba(12, 18, 24, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    borderRadius: pmRadii.pill,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  subDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: pmColors.cyanGlow,
  },
  subtitleText: {
    fontFamily: pmTypography.caption.fontFamily,
    fontSize: 9.5,
    fontWeight: '800',
    color: '#A0C4E2',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
