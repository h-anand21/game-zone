// ============================================================
// REVERSE MIND — Reusable Illustrated Object Card
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { GameObject } from '../types';
import { RMTheme } from '../theme';

interface ObjectCardProps {
  object?: GameObject;
  orderNumber?: number;
  size?: 'sm' | 'md' | 'lg';
  isHighlighted?: boolean;
  isSelected?: boolean;
  isWrong?: boolean;
  isEmptySlot?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export const ObjectCard: React.FC<ObjectCardProps> = ({
  object,
  orderNumber,
  size = 'md',
  isHighlighted = false,
  isSelected = false,
  isWrong = false,
  isEmptySlot = false,
  onPress,
  disabled = false,
}) => {
  const cardDimensions =
    size === 'sm'
      ? { width: 54, height: 64, iconSize: 26, fontSize: 9 }
      : size === 'lg'
      ? { width: 88, height: 104, iconSize: 46, fontSize: 13 }
      : { width: 68, height: 80, iconSize: 34, fontSize: 11 };

  if (isEmptySlot) {
    return (
      <View
        style={[
          styles.emptySlot,
          { width: cardDimensions.width, height: cardDimensions.height },
          isHighlighted && styles.slotHighlighted,
        ]}
      >
        {orderNumber !== undefined && (
          <View style={styles.slotBadge}>
            <Text style={styles.slotBadgeText}>{orderNumber}</Text>
          </View>
        )}
        <Text style={styles.questionMark}>?</Text>
      </View>
    );
  }

  const borderColor = isWrong
    ? RMTheme.colors.coralRed
    : isHighlighted
    ? RMTheme.colors.primaryGold
    : object?.borderColor || RMTheme.colors.cyanNeon;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={({ pressed }) => [
        styles.wrapper,
        { width: cardDimensions.width, height: cardDimensions.height },
        pressed && styles.pressed,
        isSelected && styles.selectedOpacity,
      ]}
    >
      <LinearGradient
        colors={[RMTheme.colors.bgCardElevated, RMTheme.colors.bgCard]}
        style={[
          styles.cardBody,
          { borderColor },
          isHighlighted && styles.glowGold,
          isWrong && styles.glowRed,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Number Badge for Sequences */}
        {orderNumber !== undefined && (
          <View
            style={[
              styles.orderBadge,
              { backgroundColor: isHighlighted ? RMTheme.colors.primaryGold : RMTheme.colors.cyanNeon },
            ]}
          >
            <Text style={styles.orderBadgeText}>{orderNumber}</Text>
          </View>
        )}

        {/* Object Vector / Symbol Icon */}
        <Text style={{ fontSize: cardDimensions.iconSize }}>
          {object?.symbol || '❓'}
        </Text>

        {/* Object Name Label */}
        {object?.name && (
          <Text
            numberOfLines={1}
            style={[
              styles.nameText,
              { fontSize: cardDimensions.fontSize },
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
  slotHighlighted: {
    borderColor: RMTheme.colors.cyanNeon,
    backgroundColor: 'rgba(77, 231, 255, 0.12)',
  },
  slotBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8CA0B8',
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
    borderColor: RMTheme.colors.primaryGold,
  },
  glowRed: {
    shadowColor: RMTheme.colors.coralRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    borderColor: RMTheme.colors.coralRed,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  selectedOpacity: {
    opacity: 0.4,
  },
});
