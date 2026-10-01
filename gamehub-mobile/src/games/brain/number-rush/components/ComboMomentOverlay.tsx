// ============================================================
// Number Rush — Screen 11: COMBO MOMENT (Combo Celebration Reference)
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { NRTheme } from '../theme';
import { MascotIllustration } from './MascotIllustration';

interface ComboMomentOverlayProps {
  comboValue: number;
}

export const ComboMomentOverlay: React.FC<ComboMomentOverlayProps> = ({
  comboValue,
}) => {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 150 });
  }, [comboValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.glowBox, animatedStyle]}>
        {/* Flame Burst & Mascot */}
        <View style={styles.headerRow}>
          <Text style={styles.flame}>🔥</Text>
          <MascotIllustration size={70} character="tiger" mood="celebrate" showAura={false} />
          <Text style={styles.flame}>🔥</Text>
        </View>

        {/* Huge Fiery Combo Number */}
        <Text style={styles.comboNumber}>x{comboValue} COMBO!</Text>
        <Text style={styles.titleText}>ON FIRE!</Text>
        <Text style={styles.subText}>Streak Bonus Multiplier Active!</Text>

        {/* Flying Bonus XP Badge */}
        <View style={styles.bonusBadge}>
          <Text style={styles.bonusText}>+{comboValue * 50} BONUS PTS ⚡</Text>
        </View>
      </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    backgroundColor: 'rgba(4, 11, 22, 0.65)',
  },
  glowBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(25, 14, 4, 0.95)',
    borderWidth: 3.5,
    borderColor: '#FFD700',
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 20,
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  flame: {
    fontSize: 36,
  },
  comboNumber: {
    color: '#FFD700',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#FF6D00',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 2,
  },
  subText: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  bonusBadge: {
    backgroundColor: '#FF6D00',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFE082',
    marginTop: 12,
  },
  bonusText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
});
