// ============================================================
// REVERSE MIND — Unified Reusable MemoryObject Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { GameObject, MemoryObjectState } from '../types';
import { RMTheme } from '../theme';

interface MemoryObjectProps {
  object?: GameObject;
  state?: MemoryObjectState;
  orderNumber?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onPress?: () => void;
}

export const MemoryObject: React.FC<MemoryObjectProps> = ({
  object,
  state = 'idle',
  orderNumber,
  size = 'md',
  showLabel = true,
  onPress,
}) => {
  const dimensions =
    size === 'sm'
      ? { width: 54, height: 64, iconSize: 26, fontSize: 9 }
      : size === 'lg'
      ? { width: 88, height: 104, iconSize: 46, fontSize: 13 }
      : { width: 68, height: 80, iconSize: 34, fontSize: 11 };

  if (state === 'hidden') {
    return (
      <View style={[styles.emptySlot, { width: dimensions.width, height: dimensions.height }]}>
        <Text style={styles.questionMark}>?</Text>
      </View>
    );
  }

  const getBorderColor = () => {
    switch (state) {
      case 'correct':
        return RMTheme.colors.emeraldGreen;
      case 'wrong':
        return RMTheme.colors.coralRed;
      case 'highlight':
      case 'selected':
        return RMTheme.colors.primaryGold;
      case 'flipping':
        return RMTheme.colors.purpleNeon;
      case 'disabled':
        return 'rgba(255,255,255,0.15)';
      case 'idle':
      default:
        return object?.borderColor || RMTheme.colors.cyanNeon;
    }
  };

  const borderColor = getBorderColor();

  return (
    <Pressable
      onPress={onPress}
      disabled={state === 'disabled' || !onPress}
      style={({ pressed }) => [
        styles.wrapper,
        { width: dimensions.width, height: dimensions.height },
        pressed && styles.pressed,
        (state === 'disabled' || state === 'selected') && styles.faded,
      ]}
    >
      <LinearGradient
        colors={[
          state === 'correct'
            ? '#1B4D2E'
            : state === 'wrong'
            ? '#4D1B1F'
            : RMTheme.colors.bgCardElevated,
          RMTheme.colors.bgCard,
        ]}
        style={[
          styles.cardBody,
          { borderColor },
          state === 'highlight' && styles.glowGold,
          state === 'correct' && styles.glowEmerald,
          state === 'wrong' && styles.glowCoral,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Order badge for sequences */}
        {orderNumber !== undefined && (
          <View
            style={[
              styles.orderBadge,
              {
                backgroundColor:
                  state === 'correct'
                    ? RMTheme.colors.emeraldGreen
                    : state === 'wrong'
                    ? RMTheme.colors.coralRed
                    : RMTheme.colors.cyanNeon,
              },
            ]}
          >
            <Text style={styles.orderBadgeText}>{orderNumber}</Text>
          </View>
        )}

        {/* Vector Symbol */}
        <Text style={{ fontSize: dimensions.iconSize }}>
          {state === 'flipping' ? '⟲' : object?.symbol || '❓'}
        </Text>

        {/* Object Label */}
        {showLabel && object?.name && state !== 'flipping' && (
          <Text
            numberOfLines={1}
            style={[
              styles.nameText,
              { fontSize: dimensions.fontSize },
              object.color === 'red' && styles.nameRed,
            ]}
          >
            {object.name}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RMTheme.radii.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  cardBody: {
    flex: 1,
    borderRadius: RMTheme.radii.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  emptySlot: {
    borderRadius: RMTheme.radii.md,
    borderWidth: 2,
    borderColor: 'rgba(77, 231, 255, 0.35)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(13, 31, 52, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionMark: {
    fontSize: 26,
    fontWeight: '900',
    color: 'rgba(77, 231, 255, 0.4)',
  },
  orderBadge: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#07111F',
  },
  nameText: {
    fontWeight: '700',
    color: RMTheme.colors.textPrimary,
    marginTop: 2,
    textAlign: 'center',
  },
  nameRed: {
    color: '#FF8A80',
  },
  glowGold: {
    shadowColor: RMTheme.colors.primaryGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  glowEmerald: {
    shadowColor: RMTheme.colors.emeraldGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  glowCoral: {
    shadowColor: RMTheme.colors.coralRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  faded: {
    opacity: 0.4,
  },
});
