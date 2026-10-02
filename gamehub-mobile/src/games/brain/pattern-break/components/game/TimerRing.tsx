// ============================================================
// PATTERN BREAKER — TimerRing Component
// Circular SVG countdown timer with pulsing urgency state under 5s
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { PBColors, PBTypography } from '../../theme';

interface TimerRingProps {
  timeLeft: number;
  totalTime?: number;
  size?: number;
}

export const TimerRing: React.FC<TimerRingProps> = ({
  timeLeft,
  totalTime = 20,
  size = 56,
}) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.max(0, Math.min(1, timeLeft / totalTime));
  const strokeDashoffset = circumference - progress * circumference;

  const isCritical = timeLeft <= 5;
  const strokeColor = isCritical ? PBColors.danger : PBColors.primary;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(25, 211, 255, 0.15)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Progress Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center Seconds Label */}
      <View style={styles.labelContainer}>
        <Text style={[styles.timeText, isCritical && styles.criticalText]}>
          {timeLeft}
        </Text>
        <Text style={styles.secSuffix}>s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '900',
    color: PBColors.textPrimary,
    letterSpacing: 0.5,
  },
  criticalText: {
    color: PBColors.danger,
  },
  secSuffix: {
    fontSize: 9,
    fontWeight: '700',
    color: PBColors.textSecondary,
    marginLeft: 1,
  },
});
