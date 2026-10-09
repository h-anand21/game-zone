// ============================================================
// DON'T TAP WRONG — Screen 06: Countdown Screen
// High-energy readiness sequence: READY -> 3 -> 2 -> 1 -> GO!
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { DtwColors } from '../theme/colors';
import { DtwHaptics } from '../haptics/hapticManager';
import { DtwAudio } from '../audio/audioManager';
import { DTW_MODES } from '../config';
import type { GameModeId } from '../types';

interface CountdownScreenProps {
  modeId: GameModeId;
  onCountdownComplete: () => void;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({
  modeId,
  onCountdownComplete,
}) => {
  const [stage, setStage] = useState<'READY' | '3' | '2' | '1' | 'GO!'>('READY');
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(1)).current;

  const mode = DTW_MODES[modeId];

  const animatePhase = (val: 'READY' | '3' | '2' | '1' | 'GO!') => {
    setStage(val);
    scaleAnim.setValue(0.5);
    ringScale.setValue(0.7);
    ringOpacity.setValue(1);

    if (val === 'GO!') {
      DtwHaptics.countdownGo();
      DtwAudio.playCountdownGo();
    } else {
      DtwHaptics.countdownTick();
      DtwAudio.playCountdownTick();
    }

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 12,
      }),
      Animated.timing(ringScale, {
        toValue: 1.6,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(ringOpacity, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    // Stage 1: READY
    animatePhase('READY');

    const t1 = setTimeout(() => {
      animatePhase('3');
    }, 650);

    const t2 = setTimeout(() => {
      animatePhase('2');
    }, 1300);

    const t3 = setTimeout(() => {
      animatePhase('1');
    }, 1950);

    const t4 = setTimeout(() => {
      animatePhase('GO!');
    }, 2600);

    const t5 = setTimeout(() => {
      onCountdownComplete();
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const isGo = stage === 'GO!';
  const activeColor = isGo ? DtwColors.safeGreen : DtwColors.cyanAccent;

  return (
    <BackgroundLayer variant="game">
      <View style={styles.container}>
        {/* Top Mode Label */}
        <View style={styles.topHeader}>
          <Text style={styles.modePrefix}>DEPLOYING TO</Text>
          <Text style={[styles.modeName, { color: mode.badgeColor }]}>{mode.name}</Text>
          <Text style={styles.modeTarget}>
            {mode.durationSeconds > 0
              ? `${mode.durationSeconds}s BLITZ • TARGET ${mode.targetScore}`
              : 'ENDLESS SURVIVAL • 1 LIFE'}
          </Text>
        </View>

        {/* Center Animated Rings & Counter */}
        <View style={styles.centerStage}>
          {/* Expanding Neon Pulse Ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                borderColor: activeColor,
                transform: [{ scale: ringScale }],
                opacity: ringOpacity,
              },
            ]}
          />

          {/* Core Circle Box */}
          <View style={[styles.coreCircle, { borderColor: activeColor }]}>
            <Animated.Text
              style={[
                styles.stageText,
                { color: activeColor, transform: [{ scale: scaleAnim }] },
                isGo && styles.goText,
              ]}
            >
              {stage}
            </Animated.Text>
          </View>
        </View>

        {/* Bottom Directive */}
        <View style={styles.bottomBar}>
          <Text style={styles.directiveText}>PREPARE TOUCH TARGETS</Text>
          <Text style={styles.directiveSub}>TAP GREEN • NEVER TAP RED</Text>
        </View>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  topHeader: {
    alignItems: 'center',
  },
  modePrefix: {
    fontSize: 10,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  modeName: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  modeTarget: {
    fontSize: 11,
    fontWeight: '800',
    color: DtwColors.textSecondary,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  centerStage: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
  },
  coreCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(8, 11, 16, 0.92)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  stageText: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 3,
  },
  goText: {
    fontSize: 54,
    color: DtwColors.safeGreen,
    textShadowColor: DtwColors.safeGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  bottomBar: {
    alignItems: 'center',
  },
  directiveText: {
    fontSize: 12,
    fontWeight: '800',
    color: DtwColors.textPrimary,
    letterSpacing: 2,
  },
  directiveSub: {
    fontSize: 11,
    fontWeight: '800',
    color: DtwColors.safeGreen,
    letterSpacing: 1.5,
    marginTop: 4,
  },
});

export default CountdownScreen;
