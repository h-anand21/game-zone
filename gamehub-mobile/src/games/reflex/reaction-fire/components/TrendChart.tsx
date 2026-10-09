// ============================================================
// REACTION FIRE — SVG Trend Line Chart
// Native vector trend graph plotting recent reaction attempts
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { RfColors } from '../theme';
import type { ReactionAttempt } from '../types';

interface TrendChartProps {
  attempts: ReactionAttempt[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ attempts }) => {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width - 48, 340);
  const chartHeight = 140;
  const padding = 20;

  const validAttempts = attempts
    .filter((a) => a.reactionTimeMs !== null && a.status === 'success')
    .slice(0, 10)
    .reverse();

  if (validAttempts.length < 2) {
    return (
      <View style={[styles.emptyBox, { width: chartWidth, height: chartHeight }]}>
        <Text style={styles.emptyText}>Need at least 2 attempts to plot trend</Text>
      </View>
    );
  }

  const times = validAttempts.map((a) => a.reactionTimeMs!);
  const minMs = Math.min(...times, 200);
  const maxMs = Math.max(...times, 500);

  const getX = (idx: number) =>
    padding + (idx / (validAttempts.length - 1)) * (chartWidth - padding * 2);
  const getY = (val: number) =>
    chartHeight - padding - ((val - minMs) / (maxMs - minMs || 1)) * (chartHeight - padding * 2);

  let pathD = `M ${getX(0)} ${getY(times[0])}`;
  for (let i = 1; i < times.length; i++) {
    pathD += ` L ${getX(i)} ${getY(times[i])}`;
  }

  return (
    <View style={[styles.container, { width: chartWidth, height: chartHeight }]}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Baseline threshold (350ms target line) */}
        <Line
          x1={padding}
          y1={getY(350)}
          x2={chartWidth - padding}
          y2={getY(350)}
          stroke={RfColors.goLime}
          strokeDasharray="4, 4"
          strokeOpacity="0.4"
          strokeWidth="1"
        />

        {/* Data Line */}
        <Path d={pathD} stroke={RfColors.secondaryCyan} strokeWidth="2.5" fill="none" />

        {/* Data Dots */}
        {times.map((val, idx) => (
          <Circle
            key={idx}
            cx={getX(idx)}
            cy={getY(val)}
            r={3.5}
            fill={val < 350 ? RfColors.goLime : RfColors.primaryBlue}
          />
        ))}
      </Svg>

      <View style={styles.axisRow}>
        <Text style={styles.axisLabel}>OLDER</Text>
        <Text style={[styles.axisLabel, { color: RfColors.goLime }]}>350ms BENCHMARK</Text>
        <Text style={styles.axisLabel}>LATEST</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(5, 9, 20, 0.85)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(83, 225, 255, 0.2)',
    alignItems: 'center',
    marginVertical: 8,
  },
  emptyBox: {
    backgroundColor: 'rgba(5, 9, 20, 0.85)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 11,
    color: RfColors.textMuted,
    fontWeight: '700',
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    marginTop: -8,
  },
  axisLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1,
  },
});

export default TrendChart;
