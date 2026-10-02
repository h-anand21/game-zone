// ============================================================
// PATTERN QUEST — AnswerTile Component
// Large tactile choice buttons with A, B, C, D badges
// ============================================================

import React, { useRef } from 'react';
import { Pressable, View, Text, StyleSheet, Animated } from 'react-native';
import { pqColors, pqSpacing, pqTypography } from '../../theme';
import { VisualTile } from '../../types';
import { PatternTile } from './PatternTile';

interface AnswerTileProps {
  tile: VisualTile;
  index: number;
  selected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

const AnswerTileComponent: React.FC<AnswerTileProps> = ({
  tile,
  index,
  selected,
  isCorrect,
  isWrong,
  disabled = false,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 70,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const getBorderColor = () => {
    if (isCorrect) return pqColors.successGlow;
    if (isWrong) return pqColors.dangerGlow;
    if (selected) return pqColors.crystalCyan;
    return '#3A4858';
  };

  const getBackgroundColor = () => {
    if (isCorrect) return 'rgba(46, 204, 113, 0.28)';
    if (isWrong) return 'rgba(231, 76, 60, 0.28)';
    if (selected) return 'rgba(0, 240, 255, 0.2)';
    return 'rgba(20, 28, 38, 0.92)';
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.wrapper, disabled && styles.disabled]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Letter Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{LETTERS[index] || ''}</Text>
        </View>

        {/* Tile Content */}
        <PatternTile
          tile={tile}
          size={56}
          highlighted={selected}
          isCorrect={isCorrect}
          isWrong={isWrong}
        />
      </Animated.View>
    </Pressable>
  );
};

export const AnswerTile = React.memo(AnswerTileComponent);

const styles = StyleSheet.create({
  wrapper: {
    width: '48%',
    marginBottom: pqSpacing.md,
  },
  container: {
    height: 94,
    borderRadius: pqSpacing.radiusMd,
    borderWidth: 2.5,
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pqSpacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: pqColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: pqColors.goldBright,
  },
  disabled: {
    opacity: 0.35,
  },
});
