// ============================================================
// PATH MIND — Component 03: GameButton
// Unified tactile game button with artwork, haptic press, and glow
// ============================================================

import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  ImageSourcePropType,
  Animated,
  View,
} from 'react-native';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';
import { pmAssets } from '../../design-system/uiAssets';

interface GameButtonProps {
  label?: string;
  icon?: ImageSourcePropType;
  buttonAsset?: ImageSourcePropType;
  variant?: 'gold' | 'green' | 'blue' | 'wood' | 'cyan' | 'red';
  size?: 'large' | 'medium' | 'small' | 'icon';
  width?: number;
  height?: number;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const GameButton: React.FC<GameButtonProps> = ({
  label,
  icon,
  buttonAsset,
  variant = 'gold',
  size = 'medium',
  width,
  height,
  disabled = false,
  onPress,
  style,
  accessibilityLabel,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.94,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const getAsset = () => {
    if (buttonAsset) return buttonAsset;
    switch (variant) {
      case 'green':
        return pmAssets.buttons.green;
      case 'blue':
        return pmAssets.buttons.blue;
      case 'wood':
        return pmAssets.buttons.wood;
      case 'cyan':
        return pmAssets.buttons.cyan;
      case 'red':
        return pmAssets.buttons.red;
      case 'gold':
      default:
        return pmAssets.buttons.gold;
    }
  };

  const getDefaultDimensions = () => {
    if (size === 'icon') return { w: width || 48, h: height || 48 };
    if (size === 'large') return { w: width || 260, h: height || 64 };
    if (size === 'small') return { w: width || 140, h: height || 42 };
    return { w: width || 210, h: height || 52 };
  };

  const dims = getDefaultDimensions();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, disabled && styles.disabled, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel || label}
        style={[styles.pressable, { width: dims.w, height: dims.h }]}
      >
        {/* Layer 1: Authentic RPG Button Artwork */}
        <Image
          source={getAsset()}
          style={[styles.buttonBg, { width: dims.w, height: dims.h }]}
          resizeMode="stretch"
        />

        {/* Layer 2: Label & Icon Content */}
        <View style={styles.contentRow}>
          {icon && (
            <Image
              source={icon}
              style={[
                styles.buttonIcon,
                size === 'large' ? styles.iconLarge : size === 'small' ? styles.iconSmall : styles.iconMedium,
              ]}
              resizeMode="contain"
            />
          )}
          {label && (
            <Text
              style={[
                size === 'large'
                  ? pmTypography.buttonLarge
                  : size === 'small'
                  ? pmTypography.buttonSmall
                  : pmTypography.buttonMedium,
                styles.labelText,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...pmShadows.medium,
  },
  buttonBg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  labelText: {
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 4,
  },
  iconLarge: {
    width: 26,
    height: 26,
  },
  iconMedium: {
    width: 22,
    height: 22,
  },
  iconSmall: {
    width: 18,
    height: 18,
  },
  disabled: {
    opacity: 0.5,
  },
});
