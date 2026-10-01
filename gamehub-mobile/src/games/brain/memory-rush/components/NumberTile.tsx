// ============================================================
// MEMORY RUSH — 3D Carved Stone Number Tile
// Tactile stone tablet with carved rune bevels & glowing numerals
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
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

  const lipHeight = Math.max(4, Math.round(size * 0.08));
  const borderRadius = Math.round(size * 0.22);
  const fontSize = size > 80 ? 36 : size > 65 ? 30 : size > 50 ? 24 : 18;

  // Jungle stone colors with high-visibility vibrant cartoon contrast
  const getVisualConfig = () => {
    if (isCorrect) {
      return {
        gradient: ['#34D399', '#10B981', '#047857'] as const,
        lipColor: '#064E3B',
        textColor: '#FFFFFF',
        borderColor: '#A7F3D0',
        glow: 'rgba(16, 185, 129, 0.75)',
        textShadowColor: 'rgba(0, 50, 20, 0.8)',
      };
    }
    if (isWrong) {
      return {
        gradient: ['#F87171', '#EF4444', '#B91C1C'] as const,
        lipColor: '#7F1D1D',
        textColor: '#FFFFFF',
        borderColor: '#FECACA',
        glow: 'rgba(239, 68, 68, 0.8)',
        textShadowColor: 'rgba(80, 0, 0, 0.8)',
      };
    }
    if (isSelected) {
      return {
        gradient: ['#FDE047', '#EAB308', '#CA8A04'] as const,
        lipColor: '#713F12',
        textColor: '#3A1E00',
        borderColor: '#FEF08A',
        glow: 'rgba(234, 179, 8, 0.7)',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
      };
    }
    if (isMissing && !isCorrect) {
      return {
        gradient: ['#475569', '#334155', '#1E293B'] as const,
        lipColor: '#0F172A',
        textColor: '#FDE047',
        borderColor: '#FACC15',
        glow: 'rgba(250, 204, 21, 0.5)',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
      };
    }
    if (isPreview) {
      // Warm mystical carved stone with glowing golden number
      return {
        gradient: ['#4A5B6E', '#324151', '#212D3A'] as const,
        lipColor: '#141D26',
        textColor: '#FFD700',
        borderColor: sequenceStep !== undefined ? '#FFD700' : '#8FA4BB',
        glow: 'rgba(255, 215, 0, 0.5)',
        textShadowColor: 'rgba(0, 0, 0, 0.9)',
      };
    }
    if (isHidden) {
      // Ancient closed carved slab
      return {
        gradient: ['#3A4857', '#283441', '#1B242E'] as const,
        lipColor: '#0E141B',
        textColor: 'rgba(255, 255, 255, 0.35)',
        borderColor: '#4E6175',
        glow: 'rgba(0, 0, 0, 0.4)',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
      };
    }
    // Default interactive state
    return {
      gradient: ['#425263', '#2D3A47', '#1E2833'] as const,
      lipColor: '#121921',
      textColor: '#FFFFFF',
      borderColor: isChanged ? '#FBBF24' : '#5C7085',
      glow: isChanged ? 'rgba(251, 191, 36, 0.45)' : 'rgba(0, 0, 0, 0.4)',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
    };
  };

  const config = getVisualConfig();

  const getDisplayText = () => {
    if (isCorrect || isWrong) return value;
    if (isMissing) return '?';
    if (isHidden) return '?';
    return value;
  };

  const handlePress = () => {
    if (disabled) return;
    if (onPress) onPress();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || (isHidden === false && isPreview === false && state === 'disabled')}
      style={({ pressed }) => [
        styles.outer,
        {
          width: size,
          height: size + lipHeight,
        },
        style,
      ]}
      accessibilityLabel={isPreview ? `Number ${value}` : 'Stone Tile'}
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
              {/* Beveled Top Highlight Rim */}
              <View style={styles.topBevel} />

              {/* Chiseled Stone Edge Border */}
              <View style={[styles.chiseledRing, { borderRadius: borderRadius - 3 }]} />

              {/* Sequence Step Badge Indicator */}
              {sequenceStep !== undefined && (
                <View style={styles.sequenceBadge}>
                  <Text style={styles.sequenceBadgeText}>{sequenceStep}</Text>
                </View>
              )}

              {/* Tactile 3D Number Glyph */}
              <Text
                style={[
                  styles.numberText,
                  {
                    fontSize,
                    color: config.textColor,
                    textShadowColor: config.textShadowColor,
                  },
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

export const StoneNumberTile = NumberTile;

const styles = StyleSheet.create({
  outer: {
    margin: 4,
  },
  lipWrapper: {
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  tileFace: {
    borderWidth: 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  topBevel: {
    position: 'absolute',
    top: 1,
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 1,
  },
  chiseledRing: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.35)',
    pointerEvents: 'none',
  },
  numberText: {
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  sequenceBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    borderWidth: 1.5,
    borderColor: '#FFF59D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  sequenceBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#3B1E00',
  },
});

