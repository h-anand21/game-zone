// ============================================================
// Mind Lock — 2.5D Glossy Memory Pad Component
// ============================================================

import React from 'react';
import { StyleSheet, Pressable, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polygon } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows } from '../theme';
import type { PadColor } from '../types';

interface MemoryPadProps {
  color: PadColor;
  isActive: boolean;
  disabled: boolean;
  onPress: () => void;
  size?: number;
  style?: ViewStyle;
}

export const MemoryPad: React.FC<MemoryPadProps> = ({
  color,
  isActive,
  disabled,
  onPress,
  size = 135,
  style,
}) => {
  const getPadStyles = () => {
    switch (color) {
      case 'red':
        return {
          gradient: isActive
            ? (['#FFA1A1', '#FF4B4B', '#D12323'] as [string, string, ...string[]])
            : (['#FF5E5E', '#E03333', '#A81D1D'] as [string, string, ...string[]]),
          borderColor: isActive ? '#FFFFFF' : 'rgba(255, 120, 120, 0.4)',
          glow: MLShadows.glowRed,
          symbolColor: isActive ? '#FFFFFF' : '#8A1515',
          symbolActiveColor: '#FFFFFF',
        };
      case 'blue':
        return {
          gradient: isActive
            ? (['#85C6FF', '#2997FF', '#0D72D6'] as [string, string, ...string[]])
            : (['#3E9EF7', '#1E80DC', '#115599'] as [string, string, ...string[]]),
          borderColor: isActive ? '#FFFFFF' : 'rgba(100, 180, 255, 0.4)',
          glow: MLShadows.glowBlue,
          symbolColor: isActive ? '#FFFFFF' : '#0B4077',
          symbolActiveColor: '#FFFFFF',
        };
      case 'green':
        return {
          gradient: isActive
            ? (['#A2F494', '#55D63F', '#269E12'] as [string, string, ...string[]])
            : (['#5AD845', '#40B52C', '#226D16'] as [string, string, ...string[]]),
          borderColor: isActive ? '#FFFFFF' : 'rgba(130, 235, 110, 0.4)',
          glow: MLShadows.glowGreen,
          symbolColor: isActive ? '#FFFFFF' : '#17540D',
          symbolActiveColor: '#FFFFFF',
        };
      case 'yellow':
      default:
        return {
          gradient: isActive
            ? (['#FFF099', '#FFC928', '#D49200'] as [string, string, ...string[]])
            : (['#FFD147', '#E5AC10', '#A37500'] as [string, string, ...string[]]),
          borderColor: isActive ? '#FFFFFF' : 'rgba(255, 230, 120, 0.4)',
          glow: MLShadows.glowGold,
          symbolColor: isActive ? '#FFFFFF' : '#805900',
          symbolActiveColor: '#FFFFFF',
        };
    }
  };

  const padConfig = getPadStyles();

  const renderSymbol = () => {
    const fill = isActive ? padConfig.symbolActiveColor : padConfig.symbolColor;
    const iconSize = size * 0.42;

    switch (color) {
      case 'red':
        // Lightning Bolt
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={fill}>
            <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </Svg>
        );
      case 'blue':
        // Water Waves
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={fill}>
            <Path d="M2 9.5C3.5 8 5.5 8 7 9.5C8.5 11 10.5 11 12 9.5C13.5 8 15.5 8 17 9.5C18.5 11 20.5 11 22 9.5V12C20.5 13.5 18.5 13.5 17 12C15.5 10.5 13.5 10.5 12 12C10.5 13.5 8.5 13.5 7 12C5.5 10.5 3.5 10.5 2 12V9.5ZM2 15.5C3.5 14 5.5 14 7 15.5C8.5 17 10.5 17 12 15.5C13.5 14 15.5 14 17 15.5C18.5 17 20.5 17 22 15.5V18C20.5 19.5 18.5 19.5 17 18C15.5 16.5 13.5 16.5 12 18C10.5 19.5 8.5 19.5 7 18C5.5 16.5 3.5 16.5 2 18V15.5Z" />
          </Svg>
        );
      case 'green':
        // Eco Leaf
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={fill}>
            <Path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25V8.42C12.44 7.69 15.65 7.42 17 8ZM9.26 10.63C7.5 11.5 6.13 13.06 5.5 15.08C6.67 13.2 8.44 11.75 10.57 11.08L9.26 10.63Z" />
          </Svg>
        );
      case 'yellow':
      default:
        // Star
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={fill}>
            <Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </Svg>
        );
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${color} pad`}
      style={({ pressed }) => [
        styles.padContainer,
        { width: size, height: size },
        isActive && [styles.activePad, padConfig.glow],
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={padConfig.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.padSurface,
          {
            borderRadius: MLRadius.xl,
            borderColor: padConfig.borderColor,
            borderWidth: isActive ? 3 : 1.5,
          },
        ]}
      >
        {/* Top-left specular gloss highlight */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glossArc}
        />

        {/* Center Debossed Symbol */}
        <View style={styles.symbolContainer}>{renderSymbol()}</View>

        {/* Inset bottom shadow for 2.5D bevel */}
        <View style={styles.bottomShadowBevel} />
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  padContainer: {
    borderRadius: MLRadius.xl,
    ...MLShadows.lg,
  },
  padSurface: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  glossArc: {
    position: 'absolute',
    top: 3,
    left: 4,
    width: '55%',
    height: '42%',
    borderTopLeftRadius: MLRadius.xl - 2,
    borderBottomRightRadius: MLRadius.xl * 1.5,
  },
  symbolContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
  },
  bottomShadowBevel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderBottomLeftRadius: MLRadius.xl,
    borderBottomRightRadius: MLRadius.xl,
  },
  activePad: {
    transform: [{ scale: 1.05 }],
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
});
