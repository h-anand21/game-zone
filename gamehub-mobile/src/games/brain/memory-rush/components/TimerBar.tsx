// ============================================================
// MEMORY RUSH — Visual Electric Cyan Progress Timer Bar
// ============================================================

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MRColors } from '../constants/colors';

interface TimerBarProps {
  progress: number; // 0 to 1
  remainingSeconds: number;
}

export const TimerBar: React.FC<TimerBarProps> = ({ progress, remainingSeconds }) => {
  const isUrgent = remainingSeconds <= 5;
  const barColor = isUrgent ? MRColors.dangerRose : MRColors.primaryCyan;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
              backgroundColor: barColor,
              shadowColor: barColor,
            },
          ]}
        />
      </View>
      <Text style={[styles.timerText, isUrgent && styles.textUrgent]}>
        {remainingSeconds.toFixed(1)}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.2)',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1,
    minWidth: 42,
    textAlign: 'right',
  },
  textUrgent: {
    color: MRColors.dangerRose,
  },
});
