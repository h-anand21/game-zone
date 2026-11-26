// ============================================================
// Block Puzzle — Carved Wooden Combo & Score Ribbon Banner
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WOOD_PALETTE } from './woodTheme';
import { ComboSparkleIcon } from './WoodBlockIcons';

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
  const [anim] = useState(() => new Animated.Value(0));
  const onHideRef = useRef(onHide);

  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

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
        onHideRef.current?.();
      });
    }
  }, [visible, title, pointsEarned, streak, anim]);

  if (!visible) return null;

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 1],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -10],
  });

  const gradientColors: [string, string] =
    streak >= 3
      ? ['#FFF099', '#F59E0B']
      : streak >= 2
      ? ['#FCE283', '#E49B23']
      : ['#F7D070', '#D98E24'];

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
        end={{ x: 0, y: 1 }}
        style={styles.toastCard}
      >
        <View style={styles.titleRow}>
          <ComboSparkleIcon size={17} />
          <Text style={styles.toastTitle}>{title}</Text>
          <ComboSparkleIcon size={17} />
        </View>
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
    shadowColor: '#1E0C02',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 12,
  },
  toastCard: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: WOOD_PALETTE.goldCtaBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toastTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: WOOD_PALETTE.goldCtaText,
    letterSpacing: 1.1,
    textAlign: 'center',
  },
  toastPoints: {
    fontSize: 13,
    fontWeight: '900',
    color: WOOD_PALETTE.goldCtaText,
    marginTop: 2,
  },
});
