import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { MRIcon } from './MRIcon';
import { colors } from '../constants/colors';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  accentColor = colors.accent,
}) => {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <MRIcon name={icon} size={16} color={accentColor} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    padding: 14,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
