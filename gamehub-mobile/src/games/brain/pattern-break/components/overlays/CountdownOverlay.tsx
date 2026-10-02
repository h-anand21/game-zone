// ============================================================
// PATTERN BREAKER — CountdownOverlay Component
// 3, 2, 1, BREAK! cinematic game transition burst
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Mascot } from '../mascot/Mascot';
import { PBColors, PBTypography, PBShadows } from '../../theme';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [count, setCount] = useState<number | string>(3);

  useEffect(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}

    const t1 = setTimeout(() => {
      setCount(2);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {}
    }, 600);

    const t2 = setTimeout(() => {
      setCount(1);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (e) {}
    }, 1200);

    const t3 = setTimeout(() => {
      setCount('BREAK!');
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {}
    }, 1800);

    const t4 = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <View style={styles.overlay}>
      <Mascot pose="ready" size={130} />
      <View style={styles.numberBox}>
        <Text style={[styles.countText, count === 'BREAK!' && styles.breakText]}>
          {count}
        </Text>
      </View>
      <Text style={styles.tagline}>SPOT THE RULE. BREAK THE PATTERN.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(6, 16, 24, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    gap: 16,
  },
  numberBox: {
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 76,
    fontWeight: '900',
    color: PBColors.primary,
    letterSpacing: 2,
    textShadowColor: 'rgba(25, 211, 255, 0.85)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 14,
  },
  breakText: {
    fontSize: 52,
    color: PBColors.accent,
    textShadowColor: 'rgba(255, 213, 74, 0.85)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 14,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '900',
    color: PBColors.textSecondary,
    letterSpacing: 2,
  },
});
