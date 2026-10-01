// ============================================================
// MEMORY RUSH — 01 Splash Screen (3D Jungle Adventure World)
// Features Cropped MEMORY RUSH Sculpted Plaque & Explorer Hero
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { JungleScreenPlaque } from '../components/JungleScreenPlaque';
import { ExplorerCompanion } from '../components/ExplorerCompanion';
import { StoneNumberTile } from '../components/StoneNumberTile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle floating stone animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for TAP TO START
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar auto advance
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2400,
      useNativeDriver: false,
    }).start(() => {
      onFinish();
    });
  }, [onFinish]);

  const translateY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  const translateY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['8%', '100%'],
  });

  const handleTap = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
    onFinish();
  };

  return (
    <JungleWorldBackground variant="home">
      <Pressable style={styles.container} onPress={handleTap}>
        {/* Floating Number Stones in Environment */}
        <Animated.View
          style={[
            styles.floatingStone,
            { top: '15%', left: 18, transform: [{ translateY: translateY1 }, { rotate: '-12deg' }] },
          ]}
          pointerEvents="none"
        >
          <StoneNumberTile value={7} size={50} state="preview" />
        </Animated.View>

        <Animated.View
          style={[
            styles.floatingStone,
            { top: '20%', right: 18, transform: [{ translateY: translateY2 }, { rotate: '15deg' }] },
          ]}
          pointerEvents="none"
        >
          <StoneNumberTile value={3} size={54} state="correct" />
        </Animated.View>

        <Animated.View
          style={[
            styles.floatingStone,
            { bottom: '26%', left: 24, transform: [{ translateY: translateY2 }, { rotate: '10deg' }] },
          ]}
          pointerEvents="none"
        >
          <StoneNumberTile value={9} size={48} state="preview" />
        </Animated.View>

        <Animated.View
          style={[
            styles.floatingStone,
            { bottom: '28%', right: 28, transform: [{ translateY: translateY1 }, { rotate: '-8deg' }] },
          ]}
          pointerEvents="none"
        >
          <StoneNumberTile value={5} size={46} state="selected" />
        </Animated.View>

        {/* Center Hero Logo Plaque */}
        <View style={styles.centerHero}>
          <JungleScreenPlaque type="memory_rush" height={220} />
          <View style={styles.taglineBadge}>
            <Text style={styles.taglineText}>JUNGLE TEMPLE ADVENTURE</Text>
          </View>
        </View>

        {/* Bottom CTA / Progress */}
        <View style={styles.bottomArea}>
          <Animated.View style={[styles.tapPrompt, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.tapPromptText}>TAP TO START</Text>
          </Animated.View>

          <View style={styles.loadingTrack}>
            <Animated.View style={[styles.loadingFill, { width: widthInterpolate }]} />
          </View>
          <Text style={styles.statusText}>ENTERING TEMPLE ARENA...</Text>
        </View>
      </Pressable>
    </JungleWorldBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  floatingStone: {
    position: 'absolute',
    zIndex: 10,
  },
  centerHero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  taglineBadge: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 16, 12, 0.75)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  taglineText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  tapPrompt: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  tapPromptText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
  loadingTrack: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(10, 16, 12, 0.8)',
    borderWidth: 1.5,
    borderColor: '#718496',
    overflow: 'hidden',
    marginTop: 4,
  },
  loadingFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E2CA92',
    letterSpacing: 1.5,
  },
});
