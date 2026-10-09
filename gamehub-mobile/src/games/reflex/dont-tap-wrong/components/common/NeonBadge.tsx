// ============================================================
// DON'T TAP WRONG — Neon Badge
// Sleek glowing pill badge for stats, modes, and targets
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { DtwColors } from '../../theme/colors';

interface NeonBadgeProps {
  label: string;
  color?: string;
  icon?: string;
  size?: 'compact' | 'normal' | 'large' | string;
  style?: ViewStyle;
}

export const NeonBadge: React.FC<NeonBadgeProps> = ({
  label,
  color = DtwColors.safeGreen,
  icon,
  size = 'normal',
  style,
}) => {
  const isCompact = size === 'compact';

  return (
    <View
      style={[
        styles.badge,
        isCompact && styles.badgeCompact,
        {
          borderColor: color,
          shadowColor: color,
        },
        style,
      ]}
    >
      {icon ? <Text style={[styles.icon, isCompact && styles.iconCompact]}>{icon}</Text> : null}
      <Text style={[styles.label, isCompact && styles.labelCompact, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.2,
    backgroundColor: 'rgba(8, 11, 16, 0.72)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  badgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
  },
  icon: {
    fontSize: 12,
    marginRight: 6,
  },
  iconCompact: {
    fontSize: 10,
    marginRight: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  labelCompact: {
    fontSize: 9,
    letterSpacing: 0.8,
  },
});
