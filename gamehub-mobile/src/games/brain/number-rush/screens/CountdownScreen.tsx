// ============================================================
// Number Rush — Screen 08: COUNTDOWN (Jungle Countdown Get Ready Reference)
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { MascotIllustration } from '../components/MascotIllustration';
import { MODE_CONFIGS } from '../data';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const CountdownScreen: React.FC = () => {
  const { countdownValue, selectedMode, difficulty } = useNumberRushStore();
  const modeMeta = MODE_CONFIGS[selectedMode];

  const numberScale = useSharedValue(0.4);
  const numberOpacity = useSharedValue(0);

  useEffect(() => {
    // Pulse animation each second of countdown
    numberScale.value = 0.3;
    numberOpacity.value = 0.2;

    numberScale.value = withSpring(1, { damping: 10, stiffness: 180 });
    numberOpacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) });
  }, [countdownValue]);

  const animatedNumberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numberScale.value }],
    opacity: numberOpacity.value,
  }));

  const isRush = countdownValue === 0;

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Mode Badge */}
      <View style={styles.topBadge}>
        <Text style={styles.modeIcon}>{modeMeta?.icon || '🐯'}</Text>
        <Text style={styles.modeTitle}>{modeMeta?.name || 'Animal Count'}</Text>
        <View style={styles.diffPill}>
          <Text style={styles.diffText}>{difficulty.toUpperCase()}</Text>
        </View>
      </View>

      {/* 3. Carved Wooden Banner: GET READY! */}
      <View style={styles.getReadyBanner}>
        <Text style={styles.getReadyText}>GET READY!</Text>
      </View>

      {/* 4. Mascot in Dynamic Cheering Pose */}
      <View style={styles.mascotHolder}>
        <MascotIllustration size={180} character="tiger" mood="celebrate" />
      </View>

      {/* 5. Giant Dramatic 3D Countdown Number */}
      <View style={styles.counterBox}>
        <Animated.View style={[styles.numberWrapper, animatedNumberStyle]}>
          <Text
            style={[
              styles.counterText,
              isRush && styles.rushText,
            ]}
          >
            {isRush ? 'RUSH!' : countdownValue}
          </Text>
        </Animated.View>
      </View>

      {/* 6. Gameplay Tip Pill */}
      <View style={styles.tipPill}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={styles.tipText}>
          {selectedMode === 'animal-count'
            ? 'Scan the jungle canopy quickly! Count only the requested species!'
            : selectedMode === 'emoji-count'
            ? 'Scan grid rows rapidly to locate all target emojis!'
            : 'Maintain your answer streak for maximum combo multipliers!'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  darkVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.92)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  modeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  modeTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    marginRight: 8,
  },
  diffPill: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  diffText: {
    color: '#04160D',
    fontWeight: '900',
    fontSize: 9,
  },
  getReadyBanner: {
    backgroundColor: '#382504',
    borderWidth: 2.5,
    borderColor: '#FFD700',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 8,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  getReadyText: {
    color: '#FFE082',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  mascotHolder: {
    marginVertical: 10,
  },
  counterBox: {
    minHeight: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 105,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: '#FF6D00',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 20,
  },
  rushText: {
    fontSize: 78,
    color: '#2ED573',
    textShadowColor: '#0E5C35',
    letterSpacing: 3,
  },
  tipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 40, 72, 0.85)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFC107',
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: 320,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    color: '#D8E2DD',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
});
