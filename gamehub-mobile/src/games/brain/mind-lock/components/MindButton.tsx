// ============================================================
// Mind Lock — Reusable 2.5D Button Component
// ============================================================

import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { MindLockHaptics } from '../services/haptics';

interface MindButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  glow?: boolean;
}

export const MindButton: React.FC<MindButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
  textStyle,
  glow = false,
}) => {
  const getGradient = (): readonly [string, string, ...string[]] => {
    switch (variant) {
      case 'primary':
        return MLColors.goldGradient as [string, string, ...string[]];
      case 'secondary':
        return ['#1E3452', '#122338', '#0A1624'] as [string, string, ...string[]];
      case 'danger':
        return MLColors.dangerGradient as [string, string, ...string[]];
      case 'success':
        return MLColors.greenGradient as [string, string, ...string[]];
      case 'outline':
      default:
        return ['#122338', '#0D1B2A'] as [string, string, ...string[]];
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#0A121D';
      case 'secondary':
      case 'danger':
      case 'success':
        return '#FFFFFF';
      case 'outline':
        return MLColors.primary;
      default:
        return '#FFFFFF';
    }
  };

  const handlePress = () => {
    if (disabled) return;
    MindLockHaptics.buttonTap();
    onPress();
  };

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, height: 38 },
    md: { paddingVertical: 14, paddingHorizontal: 24, height: 52 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, height: 64 },
  }[size];

  const fontSizes = {
    sm: MLTypography.bodySmall,
    md: MLTypography.bodyLarge,
    lg: MLTypography.h3,
  }[size];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.base,
        sizeStyles,
        glow && variant === 'primary' && MLShadows.glowGold,
        glow && variant === 'danger' && MLShadows.glowRed,
        glow && variant === 'success' && MLShadows.glowGreen,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <LinearGradient
        colors={getGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradient, sizeStyles]}
      >
        {/* Top glossy bevel reflection */}
        <LinearGradient
          colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0.05)']}
          style={styles.glossHighlight}
        />
        {icon}
        <Text
          style={[
            styles.text,
            { color: getTextColor(), fontSize: fontSizes },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: MLRadius.pill,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...MLShadows.md,
  },
  gradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: MLSpacing.sm,
    borderRadius: MLRadius.pill,
  },
  glossHighlight: {
    position: 'absolute',
    top: 2,
    left: 12,
    right: 12,
    height: '42%',
    borderRadius: MLRadius.pill,
  },
  text: {
    fontWeight: MLTypography.black,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
});
