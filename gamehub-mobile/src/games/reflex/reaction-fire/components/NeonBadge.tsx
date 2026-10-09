// ============================================================
// REACTION FIRE — Neon Badge Component
// Sleek glowing pill badge for modes, targets, and stats
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { RfColors } from '../theme';

interface NeonBadgeProps {
  label: string;
  color?: string;
  icon?: string;
  size?: 'compact' | 'normal';
  style?: ViewStyle;
}

export const NeonBadge: React.FC<NeonBadgeProps> = ({
  label,
  color = RfColors.goLime,
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
    backgroundColor: 'rgba(5, 9, 20, 0.75)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  badgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
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
