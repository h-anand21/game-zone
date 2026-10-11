// ============================================================
// STACK MASTER — Falling Sliced Fragment
// Physics-animated overhang tumbling downwards with gravity & spin
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BLOCK_HEIGHT } from './BlockView';

interface FallingFragmentProps {
  x: number; // percentage
  width: number; // percentage
  bottom: number; // pixels
  color: string;
  direction: 'left' | 'right';
  onComplete?: () => void;
}

export const FallingFragment: React.FC<FallingFragmentProps> = ({
  x,
  width,
  bottom,
  color,
  direction,
  onComplete,
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const horizontalDistance = direction === 'left' ? -25 : 25;
    const targetRotation = direction === 'left' ? -45 : 45;

    translateY.value = withTiming(350, {
      duration: 650,
      easing: Easing.bezier(0.5, 0, 1, 1),
    });

    translateX.value = withTiming(horizontalDistance, {
      duration: 650,
      easing: Easing.linear,
    });

    rotation.value = withTiming(targetRotation, {
      duration: 650,
      easing: Easing.linear,
    });

    opacity.value = withTiming(0, { duration: 650 }, () => {
      if (onComplete) {
        runOnJS(onComplete)();
      }
    });
  }, [direction, onComplete, opacity, rotation, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.fragment,
        {
          left: `${x}%`,
          width: `${width}%`,
          bottom,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={[color, 'rgba(0,0,0,0.4)']}
        style={styles.gradient}
      >
        <Animated.View style={styles.bevel} />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fragment: {
    position: 'absolute',
    height: BLOCK_HEIGHT,
    zIndex: 10,
  },
  gradient: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  },
  bevel: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});
