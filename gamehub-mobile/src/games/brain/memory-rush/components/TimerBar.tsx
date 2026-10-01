// ============================================================
// MEMORY RUSH — Ancient Temple Canal Fluid Timer Bar
// ============================================================

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';

interface TimerBarProps {
  progress: number; // 0 to 1
  remainingSeconds: number;
}

export const TimerBar: React.FC<TimerBarProps> = ({ progress, remainingSeconds }) => {
  const isUrgent = remainingSeconds <= 5;
  const gradientColors = isUrgent
    ? (['#F87171', '#EF4444', '#DC2626'] as const)
    : (['#FFF275', '#FFD700', '#FFA000'] as const);

  return (
    <View style={styles.container}>
      {/* Stone Carved Canal Track */}
      <View style={styles.track}>
        <LinearGradient
          colors={gradientColors}
          style={[
            styles.fill,
            { width: `${Math.max(0, Math.min(1, progress)) * 100}%` },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      <Text style={[styles.timerText, isUrgent && styles.textUrgent]}>
        {Math.max(0, remainingSeconds).toFixed(1)}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(10, 16, 12, 0.75)',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#607284',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.8,
    minWidth: 38,
    textAlign: 'right',
  },
  textUrgent: {
    color: '#EF4444',
  },
});
