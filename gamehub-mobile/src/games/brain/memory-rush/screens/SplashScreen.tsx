// ============================================================
// MEMORY RUSH — 01 Splash Screen (3D Jungle Adventure World)
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
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
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
        {/* Floating Number Stones in Environment (Layer 2) */}
        <Animated.View
          style={[
            styles.floatingStone,
            { top: '16%', left: 24, transform: [{ translateY: translateY1 }, { rotate: '-12deg' }] },
          ]}
          pointerEvents="none"
        >
          <StoneNumberTile value={7} size={54} state="preview" />
        </Animated.View>

        <Animated.View
          style={[
            styles.floatingStone,
            { top: '22%', right: 28, transform: [{ translateY: translateY2 }, { rotate: '15deg' }] },
          ]}
          pointerEvents="none"
        >
          <StoneNumberTile value={3} size={60} state="correct" />
        </Animated.View>

        <Animated.View
          style={[
            styles.floatingStone,
            { bottom: '26%', left: 32, transform: [{ translateY: translateY2 }, { rotate: '10deg' }] },
          ]}
          pointerEvents="none"
        >
          <StoneNumberTile value={9} size={52} state="preview" />
        </Animated.View>

        <Animated.View
          style={[
            styles.floatingStone,
            { bottom: '28%', right: 36, transform: [{ translateY: translateY1 }, { rotate: '-8deg' }] },
          ]}
          pointerEvents="none"
        >
          <StoneNumberTile value={5} size={50} state="selected" />
        </Animated.View>

        {/* Center Title Object (Layer 3 & 4) */}
        <View style={styles.centerHero}>
          <View style={styles.titleExtrusion}>
            <LinearGradient
              colors={['#8B4513', '#5E2B08', '#381602']}
              style={styles.woodPlaque}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              <View style={styles.plaqueBevel} />
              <Text style={styles.titleTop}>MEMORY</Text>
              <Text style={styles.titleBottom}>RUSH</Text>
              <View style={styles.taglineBadge}>
                <Text style={styles.taglineText}>JUNGLE TEMPLE ADVENTURE</Text>
              </View>
            </LinearGradient>
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
    paddingVertical: 60,
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
  titleExtrusion: {
    borderRadius: 28,
    backgroundColor: '#1C0B01',
    paddingBottom: 8,
    width: Math.min(SCREEN_WIDTH - 40, 340),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.65,
    shadowRadius: 14,
    elevation: 12,
  },
  woodPlaque: {
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#C68A4C',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  plaqueBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 230, 180, 0.55)',
  },
  titleTop: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 4,
    lineHeight: 46,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  titleBottom: {
    fontSize: 54,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 6,
    lineHeight: 58,
    textShadowColor: '#5C3400',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  taglineBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  taglineText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.8,
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
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
    backgroundColor: 'rgba(20, 30, 20, 0.8)',
    borderWidth: 1.5,
    borderColor: '#718496',
    overflow: 'hidden',
    marginTop: 6,
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
