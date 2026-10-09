// ============================================================
// DON'T TAP WRONG — Personal Best Celebration Banner
// Animated celebratory banner shown only when a record is broken
// ============================================================

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { DtwColors } from '../../theme/colors';

interface PersonalBestCelebrationProps {
  score: number;
  previousBest: number;
}

export const PersonalBestCelebration: React.FC<PersonalBestCelebrationProps> = ({
  score,
  previousBest,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 10,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim, glowAnim]);

  const diff = score - previousBest;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Text style={styles.crown}>👑</Text>
      <Text style={styles.title}>NEW PERSONAL BEST!</Text>
      <View style={styles.statRow}>
        <Text style={styles.prevText}>PREVIOUS: {previousBest}</Text>
        <Text style={styles.divider}>•</Text>
        <Text style={styles.newText}>NEW: {score}</Text>
        {diff > 0 && <Text style={styles.diffBadge}>+{diff}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 214, 90, 0.14)',
    borderWidth: 1.5,
    borderColor: DtwColors.streakGold,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: DtwColors.streakGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 6,
  },
  crown: {
    fontSize: 26,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: DtwColors.streakGold,
    letterSpacing: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  prevText: {
    fontSize: 11,
    color: DtwColors.textMuted,
    fontWeight: '700',
  },
  divider: {
    color: DtwColors.textMuted,
  },
  newText: {
    fontSize: 12,
    fontWeight: '900',
    color: DtwColors.safeGreen,
  },
  diffBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: DtwColors.textOnGreen,
    backgroundColor: DtwColors.safeGreen,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default PersonalBestCelebration;
