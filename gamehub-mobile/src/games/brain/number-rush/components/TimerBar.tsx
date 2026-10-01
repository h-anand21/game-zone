// ============================================================
// Number Rush — Animated Timer Bar Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NRTheme } from '../theme';

interface TimerBarProps {
  timeLeft: number;
  maxTime: number;
  isFrozen?: boolean;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  timeLeft,
  maxTime,
  isFrozen = false,
}) => {
  const percentage = Math.max(0, Math.min(100, (timeLeft / (maxTime || 1)) * 100));

  let barColor = NRTheme.colors.observeGreen;
  if (isFrozen) {
    barColor = '#00E5FF';
  } else if (percentage < 25) {
    barColor = NRTheme.colors.wrongRed;
  } else if (percentage < 55) {
    barColor = NRTheme.colors.amber;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.clockIcon}>{isFrozen ? '❄️' : '⏱️'}</Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
        {/* Gloss highlight along top */}
        <View style={styles.gloss} />
      </View>

      <View style={styles.timeBadge}>
        <Text style={[styles.timeText, isFrozen && styles.frozenText]}>
          {isFrozen ? 'FROZEN' : `${timeLeft}s`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0C223B',
    borderWidth: 2,
    borderColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginRight: -10,
  },
  clockIcon: {
    fontSize: 16,
  },
  track: {
    flex: 1,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 10,
  },
  gloss: {
    position: 'absolute',
    top: 2,
    left: 8,
    right: 8,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 2,
  },
  timeBadge: {
    marginLeft: 10,
    minWidth: 44,
    alignItems: 'center',
  },
  timeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  frozenText: {
    color: '#00E5FF',
    fontSize: 12,
  },
});
