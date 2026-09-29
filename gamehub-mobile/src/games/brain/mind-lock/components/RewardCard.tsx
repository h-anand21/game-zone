// ============================================================
// Mind Lock — Reward Card Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLTypography } from '../theme';

interface RewardCardProps {
  category: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  category,
  title,
  subtitle,
  icon,
  accentColor = MLColors.primary,
}) => {
  return (
    <LinearGradient
      colors={['#172B45', '#0E1C2D']}
      style={[
        styles.card,
        {
          borderColor: accentColor,
          borderWidth: 1.5,
          shadowColor: accentColor,
          shadowRadius: 10,
          shadowOpacity: 0.4,
        },
      ]}
    >
      <Text style={styles.category}>{category}</Text>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle} numberOfLines={2}>
        {subtitle}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 12,
    borderRadius: MLRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    ...MLShadows.sm,
  },
  category: {
    color: MLColors.textMuted,
    fontSize: 9,
    fontWeight: MLTypography.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  title: {
    color: MLColors.white,
    fontSize: MLTypography.bodySmall,
    fontWeight: MLTypography.black,
    textAlign: 'center',
    marginTop: 2,
  },
  subtitle: {
    color: MLColors.textMuted,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 12,
  },
});
