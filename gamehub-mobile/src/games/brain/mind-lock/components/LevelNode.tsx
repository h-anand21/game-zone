// ============================================================
// Mind Lock — Level Node Component (Map Node)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLShadows, MLTypography } from '../theme';

interface LevelNodeProps {
  levelNumber: number;
  stars: number;
  status: 'completed' | 'current' | 'available' | 'locked';
  onPress: () => void;
  size?: number;
}

export const LevelNode: React.FC<LevelNodeProps> = ({
  levelNumber,
  stars,
  status,
  onPress,
  size = 64,
}) => {
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  const getGradient = (): readonly [string, string, ...string[]] => {
    if (isCompleted) {
      return MLColors.goldGradient as [string, string, ...string[]];
    }
    if (isCurrent || status === 'available') {
      return MLColors.blueGradient as [string, string, ...string[]];
    }
    return ['#586E8A', '#2E3F54', '#172230'] as [string, string, ...string[]];
  };

  const renderStars = () => {
    if (isLocked) return null;
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3].map((star) => (
          <Text
            key={star}
            style={[
              styles.star,
              { color: star <= stars ? MLColors.primary : '#324A68' },
            ]}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.wrapper, { width: size + 16 }]}>
      <Pressable
        onPress={onPress}
        disabled={isLocked}
        style={({ pressed }) => [
          styles.nodeBtn,
          { width: size, height: size, borderRadius: size / 2 },
          isCompleted && MLShadows.glowGold,
          isCurrent && MLShadows.glowBlue,
          pressed && !isLocked && styles.pressed,
        ]}
      >
        <LinearGradient
          colors={getGradient()}
          style={[styles.nodeCircle, { borderRadius: size / 2 }]}
        >
          {/* Top gloss highlight */}
          <LinearGradient
            colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.05)']}
            style={[styles.highlight, { borderRadius: size / 2 }]}
          />

          {isLocked ? (
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="#A8B4C5">
              <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </Svg>
          ) : (
            <Text
              style={[
                styles.levelText,
                { color: isCompleted ? '#0A121D' : '#FFFFFF' },
              ]}
            >
              {String(levelNumber).padStart(2, '0')}
            </Text>
          )}

          {/* Bottom bevel shadow */}
          <View style={styles.bevel} />
        </LinearGradient>
      </Pressable>

      {renderStars()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeBtn: {
    ...MLShadows.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  nodeCircle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: '45%',
  },
  bevel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  levelText: {
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    letterSpacing: 0.5,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    gap: 2,
  },
  star: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pressed: {
    transform: [{ scale: 0.92 }],
  },
});
