// ============================================================
// STACK MASTER — Combo & Milestone Feedback Popup
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../theme/colors';

interface ComboFeedbackProps {
  type: 'perfect' | 'combo' | 'milestone';
  value?: number;
  triggerKey: number; // Increment to re-trigger
}

export const ComboFeedback: React.FC<ComboFeedbackProps> = ({
  type,
  value = 0,
  triggerKey,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (triggerKey === 0) return;

    scale.value = 0;
    opacity.value = 1;
    translateY.value = 0;

    scale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withTiming(1, { duration: 150 })
    );

    translateY.value = withTiming(-30, {
      duration: 700,
      easing: Easing.out(Easing.ease),
    });

    opacity.value = withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 300 })
    );
  }, [triggerKey, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (triggerKey === 0) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      {type === 'perfect' && (
        <Text style={[styles.feedbackText, styles.perfectText]}>
          ✨ PERFECT!
        </Text>
      )}

      {type === 'combo' && (
        <Text style={[styles.feedbackText, styles.comboText]}>
          🔥 COMBO x{value}!
        </Text>
      )}

      {type === 'milestone' && (
        <Text style={[styles.feedbackText, styles.milestoneText]}>
          👑 HEIGHT {value}!
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '38%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  feedbackText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  perfectText: {
    color: '#FFF',
    textShadowColor: COLORS.cyan,
  },
  comboText: {
    color: COLORS.gold,
    textShadowColor: COLORS.magenta,
  },
  milestoneText: {
    color: '#FFD34E',
    fontSize: 32,
    textShadowColor: '#B8820B',
  },
});
