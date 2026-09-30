// ============================================================
// Find One — 2.5D Bevel Interactive Game Button
// ============================================================

import React from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { FOColors, FORadius, FOShadows } from '../theme';

interface GameButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'gold' | 'purple' | 'blue' | 'green' | 'red';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  variant = 'gold',
  size = 'md',
  icon,
  rightIcon,
  style,
  textStyle,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const getGradientColors = (): readonly [string, string, ...string[]] => {
    switch (variant) {
      case 'purple':
        return FOColors.purpleGradient;
      case 'blue':
        return FOColors.blueGradient;
      case 'green':
        return FOColors.greenGradient;
      case 'red':
        return FOColors.redGradient;
      case 'gold':
      default:
        return FOColors.goldGradient;
    }
  };

  const getBottomBorderColor = () => {
    switch (variant) {
      case 'purple':
        return FOColors.purpleDark;
      case 'blue':
        return FOColors.blueDark;
      case 'green':
        return FOColors.greenDark;
      case 'red':
        return FOColors.redDark;
      case 'gold':
      default:
        return FOColors.goldBorder;
    }
  };

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 60 });
    translateY.value = withTiming(3, { duration: 60 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, { damping: 12, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const isDarkText = variant === 'gold';

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.base,
        isSmall && styles.sm,
        isLarge && styles.lg,
        { borderBottomColor: getBottomBorderColor() },
        variant === 'gold' && FOShadows.goldButton,
        animatedStyle,
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.inner,
          isSmall && styles.innerSm,
          isLarge && styles.innerLg,
        ]}
      >
        {/* Specular Highlight Arc on Top */}
        <View style={styles.specularTop} />

        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}

          <Text
            style={[
              styles.text,
              isSmall && styles.textSm,
              isLarge && styles.textLg,
              isDarkText ? styles.textDark : styles.textLight,
              textStyle,
            ]}
          >
            {title}
          </Text>

          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: FORadius.round,
    borderBottomWidth: 5,
    overflow: 'hidden',
  },
  sm: {
    borderBottomWidth: 3,
  },
  lg: {
    borderBottomWidth: 6,
  },
  inner: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: FORadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
  },
  innerSm: {
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  innerLg: {
    paddingHorizontal: 38,
    paddingVertical: 18,
  },
  specularTop: {
    position: 'absolute',
    top: 2,
    left: '10%',
    width: '80%',
    height: '40%',
    borderRadius: FORadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    marginRight: 4,
  },
  rightIconContainer: {
    marginLeft: 6,
  },
  text: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  textSm: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 24,
    letterSpacing: 1.2,
  },
  textDark: {
    color: '#2E1A00',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  textLight: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});
