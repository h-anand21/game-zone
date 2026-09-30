// ============================================================
// Find One — Stat Card Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FOColors, FORadius } from '../theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string | React.ReactNode;
  variant?: 'compact' | 'large' | 'highlight';
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  variant = 'compact',
  style,
}) => {
  const isLarge = variant === 'large';
  const isHighlight = variant === 'highlight';

  return (
    <LinearGradient
      colors={
        isHighlight
          ? ['#1C3D61', '#112944', '#0A1A2E']
          : ['#142B45', '#0E2034', '#091624']
      }
      style={[
        styles.card,
        isLarge && styles.cardLarge,
        isHighlight && styles.cardHighlight,
        style,
      ]}
    >
      <View style={styles.iconCircle}>
        {typeof icon === 'string' ? (
          <Text style={styles.iconEmoji}>{icon}</Text>
        ) : (
          icon
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, isHighlight && styles.valueHighlight]}>
          {value}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: FORadius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1C3A5E',
    borderTopColor: '#285182',
    borderBottomWidth: 3,
    borderBottomColor: '#071524',
    gap: 10,
    minWidth: 95,
  },
  cardLarge: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  cardHighlight: {
    borderColor: '#FFC928',
    borderTopColor: '#FFE57F',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  textContainer: {
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: FOColors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 1,
  },
  valueHighlight: {
    color: FOColors.primary,
  },
});
