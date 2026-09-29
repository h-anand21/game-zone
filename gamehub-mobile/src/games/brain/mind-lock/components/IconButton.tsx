// ============================================================
// Mind Lock — Icon Button Component
// ============================================================

import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows } from '../theme';
import { MindLockHaptics } from '../services/haptics';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  style?: ViewStyle;
  variant?: 'surface' | 'gold' | 'danger';
  glow?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 44,
  style,
  variant = 'surface',
  glow = false,
}) => {
  const getGradient = (): readonly [string, string, ...string[]] => {
    switch (variant) {
      case 'gold':
        return MLColors.goldGradient as [string, string, ...string[]];
      case 'danger':
        return MLColors.dangerGradient as [string, string, ...string[]];
      case 'surface':
      default:
        return ['#1C2E46', '#0F1E31'] as [string, string, ...string[]];
    }
  };

  const handlePress = () => {
    MindLockHaptics.buttonTap();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        glow && variant === 'gold' && MLShadows.glowGold,
        pressed && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={getGradient()}
        style={[styles.gradient, { borderRadius: size / 2 }]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.02)']}
          style={[styles.highlight, { borderRadius: size / 2 }]}
        />
        {icon}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    ...MLShadows.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.12)',
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight: {
    position: 'absolute',
    top: 1,
    left: 4,
    right: 4,
    height: '40%',
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.85,
  },
});
