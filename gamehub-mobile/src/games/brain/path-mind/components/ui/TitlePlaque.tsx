// ============================================================
// PATH MIND — Component 02: TitlePlaque
// Authentic Fantasy Menu Plaque Atlas & Carved Stone Banner
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image, ImageSourcePropType, Dimensions } from 'react-native';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TitlePlaqueProps {
  title?: string;
  subtitle?: string;
  imageSource?: ImageSourcePropType;
  variant?: 'gold' | 'cyan' | 'wood' | 'stone';
  size?: 'large' | 'medium' | 'small';
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const TitlePlaque: React.FC<TitlePlaqueProps> = ({
  title,
  subtitle,
  imageSource,
  variant = 'gold',
  size = 'medium',
  width,
  height,
  style,
}) => {
  // If an authentic cropped plaque atlas image is provided, render it with exact aspect ratio
  if (imageSource) {
    const plaqueWidth = width || Math.min(SCREEN_WIDTH - 36, 320);
    const plaqueHeight = height || Math.round(plaqueWidth * (170 / 400)); // Natural ~2.35:1 aspect ratio

    return (
      <View style={[styles.imageWrapper, style]}>
        <Image
          source={imageSource}
          style={{ width: plaqueWidth, height: plaqueHeight }}
          resizeMode="contain"
        />
      </View>
    );
  }

  const getBorderColor = () => {
    switch (variant) {
      case 'cyan':
        return pmColors.cyan;
      case 'wood':
        return pmColors.woodHighlight;
      case 'stone':
        return pmColors.stoneHighlight;
      case 'gold':
      default:
        return pmColors.gold;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'cyan':
        return pmColors.textCyan;
      case 'wood':
        return pmColors.textWood;
      case 'stone':
        return pmColors.textPrimary;
      case 'gold':
      default:
        return pmColors.textGold;
    }
  };

  return (
    <View style={[styles.outerFrame, { borderColor: getBorderColor() }, style]}>
      {/* Corner Stud Accents */}
      <View style={[styles.cornerStud, styles.topLeft, { backgroundColor: getBorderColor() }]} />
      <View style={[styles.cornerStud, styles.topRight, { backgroundColor: getBorderColor() }]} />
      <View style={[styles.cornerStud, styles.bottomLeft, { backgroundColor: getBorderColor() }]} />
      <View style={[styles.cornerStud, styles.bottomRight, { backgroundColor: getBorderColor() }]} />

      <View style={[styles.innerContent, size === 'large' && styles.innerLarge]}>
        {title && (
          <Text
            style={[
              size === 'large' ? pmTypography.displayHero : pmTypography.displayTitle,
              { color: getTextColor() },
              styles.titleText,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={[pmTypography.displaySub, styles.subtitleText]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  outerFrame: {
    backgroundColor: 'rgba(12, 22, 30, 0.95)',
    borderWidth: 2.5,
    borderBottomWidth: 4.5,
    borderRadius: pmRadii.lg,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...pmShadows.heavy,
  },
  innerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerLarge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  titleText: {
    textAlign: 'center',
  },
  subtitleText: {
    marginTop: 3,
    textAlign: 'center',
  },
  cornerStud: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.85,
  },
  topLeft: { top: 4, left: 4 },
  topRight: { top: 4, right: 4 },
  bottomLeft: { bottom: 4, left: 4 },
  bottomRight: { bottom: 4, right: 4 },
});
