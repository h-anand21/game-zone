// ============================================================
// Block Blast — Animated Combo & Score Toast Banner
// ============================================================

import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ComboToastProps {
  visible: boolean;
  title: string;
  pointsEarned: number;
  streak: number;
  onHide?: () => void;
}

export const ComboToast: React.FC<ComboToastProps> = ({
  visible,
  title,
  pointsEarned,
  streak,
  onHide,
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.sequence([
        Animated.spring(anim, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.delay(900),
        Animated.timing(anim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide?.();
      });
    }
  }, [visible, title, pointsEarned, streak]);

  if (!visible) return null;

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -10],
  });

  const isHighStreak = streak >= 3;
  const gradientColors: [string, string] = isHighStreak
    ? ['#FFD600', '#FF1744']
    : streak >= 2
    ? ['#00E5FF', '#D500F9']
    : ['#00E676', '#0091EA'];

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          transform: [{ scale }, { translateY }],
          opacity: anim,
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.toastCard}
      >
        <Text style={styles.toastTitle}>{title}</Text>
        <Text style={styles.toastPoints}>+{pointsEarned} PTS</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '38%',
    alignSelf: 'center',
    zIndex: 99999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  toastCard: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#07111F',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  toastPoints: {
    fontSize: 14,
    fontWeight: '900',
    color: '#07111F',
    marginTop: 2,
  },
});
