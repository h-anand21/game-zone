// ============================================================
// PATTERN BREAKER — Primary Action Button
// Large, tactile sci-fi game-card shape with golden/cyan shine
// Real press physics, haptic feedback, and vibrant gradient edge
// ============================================================

import React from 'react';
import { StyleSheet, Text, Pressable, View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { PBColors, PBTypography, PBRadius, PBShadows } from '../../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'cyan' | 'amber' | 'danger';
  size?: 'md' | 'lg';
  icon?: string;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  style,
  variant = 'cyan',
  size = 'lg',
  icon,
  disabled = false,
}) => {
  const handlePress = () => {
    if (disabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
    onPress();
  };

  const gradientColors =
    variant === 'amber'
      ? (['#FFD54A', '#F59E0B', '#D97706'] as const)
      : variant === 'danger'
      ? (['#FF5C61', '#E11D48', '#9F1239'] as const)
      : (['#38BDF8', '#19D3FF', '#0284C7'] as const);

  const textColor = variant === 'amber' ? '#451A03' : '#FFFFFF';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.outerContainer,
        variant === 'cyan' ? PBShadows.cyanGlow : PBShadows.amberGlow,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.buttonBody, size === 'lg' ? styles.bodyLg : styles.bodyMd]}
      >
        {/* Top Sunlit Edge Bevel */}
        <View style={styles.topBevel} />

        {/* Content */}
        <View style={styles.innerContent}>
          {icon ? <Text style={styles.iconText}>{icon} </Text> : null}
          <Text style={[styles.label, { color: textColor }]}>{title}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: PBRadius.lg,
    overflow: 'hidden',
  },
  buttonBody: {
    borderRadius: PBRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  bodyLg: {
    paddingVertical: 15,
    paddingHorizontal: 26,
    minHeight: 56,
  },
  bodyMd: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    minHeight: 46,
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  label: {
    ...PBTypography.buttonLabel,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.4,
  },
});
