// ============================================================
// PATTERN QUEST — GameButton Component
// Tactile 3D press feedback, asset backing or dimensional frame
// ============================================================

import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  Image,
  ImageSourcePropType,
  ViewStyle,
  StyleProp,
  TextStyle,
  View,
  DimensionValue,
} from 'react-native';
import { pqColors, pqSpacing, pqTypography } from '../../theme';

interface GameButtonProps {
  label?: string;
  onPress: () => void;
  buttonAsset?: ImageSourcePropType;
  icon?: ImageSourcePropType;
  variant?: 'primary' | 'secondary' | 'danger' | 'gold' | 'wood';
  width?: DimensionValue;
  height?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const GameButton: React.FC<GameButtonProps> = ({
  label,
  onPress,
  buttonAsset,
  icon,
  variant = 'primary',
  width,
  height,
  disabled = false,
  style,
  labelStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 3,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (buttonAsset) {
    const defaultW = typeof width === 'number' ? width : 200;
    const defaultH = height || 64;
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[styles.assetWrapper, style, disabled && styles.disabled]}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            },
          ]}
        >
          <Image
            source={buttonAsset}
            style={{ width: defaultW, height: defaultH }}
            resizeMode="contain"
          />
        </Animated.View>
      </Pressable>
    );
  }

  // Fallback to carved 3D physical component button
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return pqColors.jungleGreen;
      case 'secondary':
        return pqColors.turquoiseDeep;
      case 'gold':
        return pqColors.goldDeep;
      case 'danger':
        return pqColors.dangerRed;
      case 'wood':
        return pqColors.woodDark;
      default:
        return pqColors.jungleGreen;
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'gold':
        return pqColors.goldBright;
      case 'danger':
        return pqColors.dangerGlow;
      case 'secondary':
        return pqColors.crystalCyan;
      default:
        return pqColors.jungleGreenBright;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.buttonContainer,
        {
          width: width || '100%',
          height: height || 52,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.contentRow,
          {
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
          },
        ]}
      >
        {icon && <Image source={icon} style={styles.buttonIcon} resizeMode="contain" />}
        {label && <Text style={[pqTypography.buttonLarge, labelStyle]}>{label}</Text>}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  assetWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    borderRadius: pqSpacing.radiusMd,
    borderWidth: 2,
    borderBottomWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pqSpacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 26,
    height: 26,
    marginRight: pqSpacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
