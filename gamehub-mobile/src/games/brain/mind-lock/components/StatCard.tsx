// ============================================================
// Mind Lock — Stat Card Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subValue,
  trend,
  style,
}) => {
  return (
    <LinearGradient
      colors={['#172A42', '#0E1A29']}
      style={[styles.card, style]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {trend && (
        <View style={styles.trendRow}>
          <Text style={styles.trendText}>{trend}</Text>
        </View>
      )}
      {subValue && <Text style={styles.subValue}>{subValue}</Text>}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: MLSpacing.sm + 2,
    paddingHorizontal: MLSpacing.md,
    borderRadius: MLRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    ...MLShadows.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MLSpacing.xs,
    marginBottom: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.semibold,
  },
  value: {
    color: MLColors.white,
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    letterSpacing: 0.5,
  },
  trendRow: {
    marginTop: 2,
  },
  trendText: {
    color: MLColors.success,
    fontSize: 10,
    fontWeight: MLTypography.bold,
  },
  subValue: {
    color: MLColors.textDim,
    fontSize: 10,
    marginTop: 2,
  },
});
