// ============================================================
// REACTION FIRE — SVG Distribution Histogram
// Visual distribution of reaction times by performance category
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { RfColors } from '../theme';
import type { ReactionAttempt } from '../types';

interface DistributionChartProps {
  attempts: ReactionAttempt[];
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ attempts }) => {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width - 48, 340);
  const chartHeight = 120;

  const validAttempts = attempts.filter((a) => a.reactionTimeMs !== null && a.status === 'success');

  // Buckets:
  // 1: < 250 ms (Lightning)
  // 2: 250-349 ms (Fast)
  // 3: 350-499 ms (Good)
  // 4: 500+ ms (Normal)
  const buckets = [
    { label: '<250ms', count: 0, color: RfColors.goLime },
    { label: '250-350', count: 0, color: RfColors.secondaryCyan },
    { label: '350-500', count: 0, color: RfColors.primaryBlue },
    { label: '500ms+', count: 0, color: RfColors.rewardGold },
  ];

  validAttempts.forEach((a) => {
    const ms = a.reactionTimeMs!;
    if (ms < 250) buckets[0].count += 1;
    else if (ms < 350) buckets[1].count += 1;
    else if (ms < 500) buckets[2].count += 1;
    else buckets[3].count += 1;
  });

  const maxCount = Math.max(...buckets.map((b) => b.count), 1);
  const barWidth = 44;
  const gap = (chartWidth - 40 - barWidth * 4) / 3;

  return (
    <View style={[styles.container, { width: chartWidth }]}>
      <Svg width={chartWidth} height={chartHeight}>
        {buckets.map((bucket, idx) => {
          const x = 20 + idx * (barWidth + gap);
          const barHeight = Math.max(6, (bucket.count / maxCount) * (chartHeight - 34));
          const y = chartHeight - 24 - barHeight;

          return (
            <React.Fragment key={idx}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill={bucket.color}
                opacity={0.85}
              />
            </React.Fragment>
          );
        })}
      </Svg>

      <View style={styles.labelsRow}>
        {buckets.map((bucket, idx) => (
          <View key={idx} style={{ width: barWidth, alignItems: 'center' }}>
            <Text style={styles.countText}>{bucket.count}</Text>
            <Text style={[styles.labelText, { color: bucket.color }]}>{bucket.label}</Text>
          </View>
        ))}
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
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    marginTop: -16,
  },
  countText: {
    fontSize: 10,
    fontWeight: '900',
    color: RfColors.textPrimary,
    marginBottom: 2,
  },
  labelText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default DistributionChart;
