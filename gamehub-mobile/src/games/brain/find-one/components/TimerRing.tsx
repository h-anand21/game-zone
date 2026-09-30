// ============================================================
// Find One — Circular Countdown Timer Ring Component
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';
import { FOColors } from '../theme';

interface TimerRingProps {
  seconds: number;
  maxSeconds?: number;
  size?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const TimerRing: React.FC<TimerRingProps> = ({
  seconds,
  maxSeconds = 20,
  size = 94,
}) => {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(seconds / maxSeconds);
  const pulseAnim = useSharedValue(1);

  const isLowTime = seconds <= 5;

  useEffect(() => {
    const targetProgress = Math.max(0, Math.min(1, seconds / maxSeconds));
    progress.value = withTiming(targetProgress, { duration: 400 });

    if (isLowTime) {
      pulseAnim.value = withRepeat(
        withSequence(withTiming(1.08, { duration: 250 }), withTiming(1, { duration: 250 })),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 200 });
    }
  }, [seconds, maxSeconds, isLowTime]);

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const strokeColor = isLowTime ? '#FF4B4B' : '#FFC928';

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedContainerStyle]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <SvgLinearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={isLowTime ? '#FFA2A2' : '#FFE885'} />
            <Stop offset="100%" stopColor={isLowTime ? '#FF2E2E' : '#FF9F00'} />
          </SvgLinearGradient>
        </Defs>

        {/* Outer Dark Ring Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#071726"
          strokeWidth={strokeWidth}
          fill="#050E17"
        />

        {/* Animated Countdown Arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#timerGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedCircleProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          fill="none"
        />
      </Svg>

      {/* Center Digital Timer Text */}
      <View style={styles.centerContent}>
        <Text style={[styles.clockEmoji, isLowTime && styles.clockEmojiLow]}>⏱️</Text>
        <Text style={[styles.timeText, isLowTime && styles.timeTextLow]}>
          {seconds.toFixed(0)}s
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockEmoji: {
    fontSize: 14,
    marginBottom: -2,
  },
  clockEmojiLow: {
    transform: [{ scale: 1.15 }],
  },
  timeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  timeTextLow: {
    color: '#FF5252',
  },
});
