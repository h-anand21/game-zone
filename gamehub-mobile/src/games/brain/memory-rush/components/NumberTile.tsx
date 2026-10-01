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
  sequenceStep?: number;
  isMissing?: boolean;
  isChanged?: boolean;
}

export const NumberTile: React.FC<NumberTileProps> = ({
  value,
  state = 'default',
  size,
  onPress,
  disabled = false,
  style,
  sequenceStep,
  isMissing = false,
  isChanged = false,
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
        gradient: ['#FBBF24', '#D97706', '#B45309'],
        lipColor: '#78350F',
        textColor: '#040B16',
        borderColor: '#FDE68A',
        glow: MRColors.yellowStatus,
      };
    }
    if (isMissing && !isCorrect) {
      return {
        gradient: ['#1A2433', '#111A26', '#090E17'],
        lipColor: '#070C12',
        textColor: MRColors.yellowStatus,
        borderColor: 'rgba(255, 216, 61, 0.5)',
        glow: 'rgba(255, 216, 61, 0.4)',
      };
    }
    if (isPreview) {
      return {
        gradient: ['#1E293B', '#0F172A', '#020617'],
        lipColor: '#090D16',
        textColor: MRColors.yellowStatus,
        borderColor: sequenceStep !== undefined ? MRColors.yellowStatus : 'rgba(255, 216, 61, 0.4)',
        glow: 'rgba(255, 216, 61, 0.45)',
      };
    }
    // Default or Hidden tile
    return {
      gradient: ['#1E293B', '#111827', '#0B0F19'],
      lipColor: '#05070D',
      textColor: isHidden ? MRColors.textMuted : MRColors.textPrimary,
      borderColor: isChanged ? 'rgba(255, 216, 61, 0.6)' : 'rgba(255, 216, 61, 0.22)',
      glow: isChanged ? 'rgba(255, 216, 61, 0.35)' : 'rgba(0, 0, 0, 0.5)',
    };
  };

  const config = getColors();

  const getDisplayText = () => {
    if (isCorrect || isWrong) return value;
    if (isMissing) return '?';
    if (isHidden) return '?';
    return value;
  };

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
      accessibilityLabel={isPreview ? `Number ${value}` : 'Tile'}
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
              {/* Glass Specular Highlight */}
              <View style={styles.topGlassHighlight} />

              {/* Sequence Step Badge Indicator */}
              {sequenceStep !== undefined && (
                <View style={styles.sequenceBadge}>
                  <Text style={styles.sequenceBadgeText}>{sequenceStep}</Text>
                </View>
              )}

              <Text
                style={[
                  styles.numberText,
                  { fontSize, color: config.textColor },
                  (isCorrect || isWrong || isSelected || isPreview) && styles.textShadow,
                ]}
              >
                {getDisplayText()}
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
  sequenceBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: MRColors.yellowStatus,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MRColors.yellowStatus,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  sequenceBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#040B16',
  },
});
