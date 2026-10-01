// ============================================================
// MEMORY RUSH — Native React Native Accessible Number Tile
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';
import type { TileState } from '../types';

interface NumberTileProps {
  value: number;
  state?: TileState;
  size: number;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const NumberTile: React.FC<NumberTileProps> = ({
  value,
  state = 'default',
  size,
  onPress,
  disabled = false,
  style,
}) => {
  const isPreview = state === 'preview';
  const isHidden = state === 'hidden';
  const isSelected = state === 'selected';
  const isCorrect = state === 'correct';
  const isWrong = state === 'wrong';

  const getBorderColor = () => {
    if (isCorrect) return MRColors.successGreen;
    if (isWrong) return MRColors.dangerRose;
    if (isSelected) return MRColors.primaryCyan;
    if (isPreview) return 'rgba(34, 211, 238, 0.4)';
    return 'rgba(255, 255, 255, 0.12)';
  };

  const getGlowStyle = () => {
    if (isCorrect) return styles.glowCorrect;
    if (isWrong) return styles.glowWrong;
    if (isSelected) return styles.glowSelected;
    return null;
  };

  const fontSize = size > 80 ? 32 : size > 65 ? 26 : 22;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isHidden === false && isPreview === false && state === 'disabled'}
      style={({ pressed }) => [
        styles.tileOuter,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.22),
          borderColor: getBorderColor(),
        },
        getGlowStyle(),
        pressed && styles.pressed,
        style,
      ]}
      accessibilityLabel={isPreview ? `Number ${value}` : 'Hidden Tile'}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={
          isCorrect
            ? ['#143823', '#0A2114']
            : isWrong
            ? ['#3D151B', '#240A0E']
            : isSelected
            ? ['#102E42', '#0A1E2C']
            : ['rgba(23, 29, 36, 0.95)', 'rgba(15, 20, 26, 0.98)']
        }
        style={[styles.tileInner, { borderRadius: Math.round(size * 0.22) }]}
      >
        <Text
          style={[
            styles.numberText,
            { fontSize },
            isCorrect && styles.textCorrect,
            isWrong && styles.textWrong,
            isSelected && styles.textSelected,
          ]}
        >
          {isPreview || isCorrect ? value : isHidden ? '?' : ''}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tileOuter: {
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  glowCorrect: {
    borderColor: MRColors.successGreen,
    shadowColor: MRColors.successGreen,
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  glowWrong: {
    borderColor: MRColors.dangerRose,
    shadowColor: MRColors.dangerRose,
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  glowSelected: {
    borderColor: MRColors.primaryCyan,
    shadowColor: MRColors.primaryCyan,
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  tileInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1,
  },
  textCorrect: {
    color: MRColors.successGreen,
  },
  textWrong: {
    color: MRColors.dangerRose,
  },
  textSelected: {
    color: MRColors.cyanBright,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
