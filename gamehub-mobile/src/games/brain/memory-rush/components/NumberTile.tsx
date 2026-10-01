// ============================================================
// MEMORY RUSH — 2.5D Chunky Arcade Number Tile (Native RN Text)
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

  const lipHeight = Math.max(3, Math.round(size * 0.06));
  const borderRadius = Math.round(size * 0.24);
  const fontSize = size > 80 ? 34 : size > 65 ? 28 : size > 50 ? 22 : 18;

  const getColors = () => {
    if (isCorrect) {
      return {
        gradient: ['#22C55E', '#16A34A', '#15803D'],
        lipColor: '#166534',
        textColor: '#FFFFFF',
        borderColor: '#86EFAC',
        glow: MRColors.successGreen,
      };
    }
    if (isWrong) {
      return {
        gradient: ['#F43F5E', '#E11D48', '#BE123C'],
        lipColor: '#881337',
        textColor: '#FFFFFF',
        borderColor: '#FECDD3',
        glow: MRColors.dangerRose,
      };
    }
    if (isSelected) {
      return {
        gradient: ['#38BDF8', '#0284C7', '#0369A1'],
        lipColor: '#075985',
        textColor: '#FFFFFF',
        borderColor: '#BAE6FD',
        glow: MRColors.primaryCyan,
      };
    }
    if (isPreview) {
      return {
        gradient: ['#1E293B', '#0F172A', '#020617'],
        lipColor: '#090D16',
        textColor: MRColors.cyanBright,
        borderColor: MRColors.primaryCyan,
        glow: 'rgba(34, 211, 238, 0.4)',
      };
    }
    // Hidden / Default tile state
    return {
      gradient: ['#1E293B', '#111827', '#0B0F19'],
      lipColor: '#05070D',
      textColor: MRColors.textSecondary,
      borderColor: 'rgba(34, 211, 238, 0.25)',
      glow: 'rgba(0, 0, 0, 0.5)',
    };
  };

  const config = getColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || (isHidden === false && isPreview === false && state === 'disabled')}
      style={({ pressed }) => [
        styles.outer,
        {
          width: size,
          height: size + lipHeight,
        },
        style,
      ]}
      accessibilityLabel={isPreview ? `Number ${value}` : 'Hidden Tile'}
      accessibilityRole="button"
    >
      {({ pressed }) => (
        <View
          style={[
            styles.lipWrapper,
            {
              width: size,
              height: size + lipHeight,
              backgroundColor: config.lipColor,
              borderRadius,
            },
          ]}
        >
          <View
            style={[
              styles.tileFace,
              {
                width: size,
                height: size,
                marginTop: pressed ? lipHeight : 0,
                borderRadius,
                borderColor: config.borderColor,
                shadowColor: config.glow,
              },
            ]}
          >
            <LinearGradient
              colors={config.gradient as any}
              style={[styles.gradient, { borderRadius }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* Glass Specular Spec */}
              <View style={styles.topGlassHighlight} />

              <Text
                style={[
                  styles.numberText,
                  { fontSize, color: config.textColor },
                  (isCorrect || isWrong || isSelected) && styles.textShadow,
                ]}
              >
                {isPreview || isCorrect || isWrong ? value : isHidden ? '?' : ''}
              </Text>
            </LinearGradient>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outer: {
    margin: 4,
  },
  lipWrapper: {
    overflow: 'hidden',
    position: 'relative',
  },
  tileFace: {
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  topGlassHighlight: {
    position: 'absolute',
    top: 2,
    left: '12%',
    right: '12%',
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 1,
  },
  numberText: {
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
});
