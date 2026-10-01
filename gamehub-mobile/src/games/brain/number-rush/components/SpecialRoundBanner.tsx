// ============================================================
// Number Rush — Screen 10: SPECIAL ROUND (Rare Lion Rush Reference)
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { NRTheme } from '../theme';

interface SpecialRoundBannerProps {
  multiplier?: number;
}

export const SpecialRoundBanner: React.FC<SpecialRoundBannerProps> = ({
  multiplier = 2,
}) => {
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.6);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 600, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.0, { duration: 600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.4, { duration: 500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const animatedGlow = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glowBorder, animatedStyle]}>
        <Animated.View style={[styles.goldAura, animatedGlow]} />

        <View style={styles.lionIconHolder}>
          <Text style={styles.lionIcon}>🦁</Text>
          <Text style={styles.crownMini}>👑</Text>
        </View>

        <View style={styles.textColumn}>
          <View style={styles.specialPill}>
            <Text style={styles.specialPillText}>SPECIAL EVENT</Text>
          </View>
          <Text style={styles.titleText}>RARE LION RUSH!</Text>
          <Text style={styles.subText}>Double Points Active • Speed Counts!</Text>
        </View>

        <View style={styles.multiplierBadge}>
          <Text style={styles.multiplierVal}>{multiplier}x</Text>
          <Text style={styles.multiplierPts}>PTS</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  glowBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#382504',
    borderWidth: 2.5,
    borderColor: '#FFD700',
    borderRadius: NRTheme.radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 8,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 8,
  },
  goldAura: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
  },
  lionIconHolder: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  lionIcon: {
    fontSize: 26,
  },
  crownMini: {
    position: 'absolute',
    top: -6,
    fontSize: 12,
  },
  textColumn: {
    flex: 1,
  },
  specialPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6D00',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    marginBottom: 2,
  },
  specialPillText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  titleText: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subText: {
    color: '#FFE082',
    fontSize: 10,
    fontWeight: '700',
  },
  multiplierBadge: {
    backgroundColor: '#FF9800',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiplierVal: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    lineHeight: 18,
  },
  multiplierPts: {
    color: '#071324',
    fontWeight: '900',
    fontSize: 8,
  },
});
