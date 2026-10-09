// ============================================================
// REACTION FIRE — Countdown Overlay Component
// Fast staged 3-2-1 countdown
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { RfColors } from '../theme';
import { RfHaptics } from '../haptics/hapticManager';
import { RfAudio } from '../audio/audioManager';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [count, setCount] = useState<number | string>(3);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const triggerStep = (val: number | string) => {
    setCount(val);
    scaleAnim.setValue(0.5);

    RfHaptics.countdownTick();
    RfAudio.playCountdownTick();

    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 40,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    triggerStep(3);

    const t1 = setTimeout(() => triggerStep(2), 700);
    const t2 = setTimeout(() => triggerStep(1), 1400);
    const t3 = setTimeout(() => {
      onComplete();
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.countText}>{count}</Text>
      </Animated.View>
      <Text style={styles.standbyText}>GET READY</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 9, 20, 0.75)',
    zIndex: 50,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: RfColors.primaryBlue,
    backgroundColor: 'rgba(10, 23, 41, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: RfColors.primaryBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 8,
  },
  countText: {
    fontSize: 54,
    fontWeight: '900',
    color: RfColors.primaryBlue,
  },
  standbyText: {
    fontSize: 13,
    fontWeight: '900',
    color: RfColors.textSecondary,
    letterSpacing: 3,
    marginTop: 16,
  },
});

export default CountdownOverlay;
