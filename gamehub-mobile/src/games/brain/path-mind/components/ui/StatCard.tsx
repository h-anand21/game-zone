// ============================================================
// PATH MIND — Component 10: StatCard
// Standardized statistics & progress metric card
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType, ViewStyle } from 'react-native';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';

interface StatCardProps {
  icon?: ImageSourcePropType;
  label: string;
  value: string | number;
  subValue?: string;
  variant?: 'gold' | 'cyan' | 'green' | 'purple';
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subValue,
  variant = 'cyan',
  style,
}) => {
  const getValueColor = () => {
    switch (variant) {
      case 'gold':
        return pmColors.goldBright;
      case 'green':
        return pmColors.successGlow;
      case 'purple':
        return pmColors.relicPurpleGlow;
      case 'cyan':
      default:
        return pmColors.cyan;
    }
  };

  return (
    <View style={[styles.card, style]}>
      {icon && <Image source={icon} style={styles.icon} resizeMode="contain" />}
      <Text style={styles.labelText}>{label}</Text>
      <Text style={[styles.valueText, { color: getValueColor() }]}>{value}</Text>
      {subValue && <Text style={styles.subText}>{subValue}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(12, 20, 28, 0.94)',
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    borderColor: pmColors.stoneBorder,
    borderRadius: pmRadii.lg,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    ...pmShadows.medium,
  },
  icon: {
    width: 26,
    height: 26,
    marginBottom: 4,
  },
  labelText: {
    ...pmTypography.caption,
    color: pmColors.textSecondary,
    marginBottom: 2,
    textAlign: 'center',
  },
  valueText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subText: {
    fontSize: 9,
    fontWeight: '700',
    color: pmColors.textMuted,
    marginTop: 2,
  },
});
