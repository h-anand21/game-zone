// ============================================================
// MEMORY RUSH — 06 Cinematic Jungle Countdown (3 -> 2 -> 1 -> RUSH!)
// Giant 3D Carved Stone Portal with Pulsing Energy Rings
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { JungleWorldBackground } from './JungleWorldBackground';
import { StoneNumberTile } from './StoneNumberTile';
import { JungleScreenPlaque } from './JungleScreenPlaque';
import { ExplorerCompanion } from './ExplorerCompanion';
import type { GameMode, GameDifficulty } from '../types';

const COUNTDOWN_IMAGES: Record<number, any> = {
  3: require('../../../../../assets/game/countdown/countdown_3.png'),
  2: require('../../../../../assets/game/countdown/countdown_2.png'),
  1: require('../../../../../assets/game/countdown/countdown_1.png'),
  0: require('../../../../../assets/game/countdown/countdown_go.png'),
};

interface CountdownOverlayProps {
  mode: GameMode;
  difficulty: GameDifficulty;
  onFinish: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  mode,
  difficulty,
  onFinish,
}) => {
  const [count, setCount] = useState<number>(3);
  const [isRush, setIsRush] = useState<boolean>(false);
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const pulseRing = useRef(new Animated.Value(1)).current;

  const triggerStepAnim = () => {
    scaleAnim.setValue(0.7);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    triggerStepAnim();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRush(true);
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch (e) {}
          triggerStepAnim();
          setTimeout(() => {
            onFinish();
          }, 650);
          return 0;
        }
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (e) {}
        triggerStepAnim();
        return prev - 1;
      });
    }, 750);

    return () => clearInterval(timer);
  }, [onFinish]);

  const getModeTitle = () => {
    switch (mode) {
      case 'sequenceRush':
        return 'SEQUENCE RUSH';
      case 'numberShift':
        return 'NUMBER SHIFT';
      case 'missingNumber':
        return 'MISSING NUMBER';
      case 'fusionRush':
        return 'FUSION RUSH';
      case 'memoryGrid':
      default:
        return 'MEMORY GRID';
    }
  };

  return (
    <JungleWorldBackground variant="arena">
      <View style={styles.overlay}>
        {/* Top Header Sign */}
        <View style={styles.topInfo}>
          <JungleScreenPlaque type="get_ready" height={110} />
          <View style={styles.headerWoodSign}>
            <Text style={styles.modeTitle}>{getModeTitle()}</Text>
            <View style={styles.diffPill}>
              <Text style={styles.diffText}>{difficulty.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Floating Number Stones in Atmosphere */}
        <View style={[styles.floatingDecor, { top: '28%', left: 24 }]}>
          <StoneNumberTile value={4} size={44} state="preview" disabled />
        </View>
        <View style={[styles.floatingDecor, { top: '30%', right: 26 }]}>
          <StoneNumberTile value={7} size={48} state="correct" disabled />
        </View>

        {/* Center Portal: Giant 3D Stone Number */}
        <Animated.View style={[styles.centerBox, { transform: [{ scale: scaleAnim }] }]}>
          <Image
            source={isRush ? COUNTDOWN_IMAGES[0] : (COUNTDOWN_IMAGES[count] || COUNTDOWN_IMAGES[3])}
            style={isRush ? styles.countdownGoImage : styles.countdownImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Explorer Companion Ready to Rush */}
        <View style={styles.bottomSection}>
          <ExplorerCompanion pose="run_splash" size={135} />
          <View style={styles.bottomPill}>
            <Text style={styles.prepareText}>PREPARE YOUR MEMORY EYE</Text>
          </View>
        </View>
      </View>
    </JungleWorldBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 70,
    zIndex: 99,
  },
  topInfo: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  headerWoodSign: {
    backgroundColor: 'rgba(28, 14, 4, 0.85)',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#C68A4C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  getReadyText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
  },
  modeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1.5,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  diffPill: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: '#718496',
  },
  diffText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
  },
  floatingDecor: {
    position: 'absolute',
    opacity: 0.7,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 240,
    height: 180,
  },
  countdownImage: {
    width: 170,
    height: 170,
  },
  countdownGoImage: {
    width: 240,
    height: 170,
  },
  energyHalo: {
    padding: 12,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 12,
  },
  stoneDialExtrusion: {
    borderRadius: 85,
    backgroundColor: '#0F161C',
    paddingBottom: 8,
  },
  stoneDialSurface: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3.5,
    borderColor: '#7E92A5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  dialTopBevel: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2,
  },
  runeRing: {
    position: 'absolute',
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.35)',
  },
  countText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  rushText: {
    fontSize: 34,
    color: '#FFF8E7',
    letterSpacing: 3,
    textShadowColor: '#B7791F',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  bottomSection: {
    alignItems: 'center',
    width: '100%',
  },
  bottomPill: {
    backgroundColor: 'rgba(10, 18, 12, 0.85)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#546A58',
    marginTop: -8,
  },
  prepareText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#E2CA92',
    letterSpacing: 2,
  },
});
