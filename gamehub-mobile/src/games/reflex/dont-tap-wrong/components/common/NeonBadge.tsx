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
  style?: ViewStyle;
}

export const NeonBadge: React.FC<NeonBadgeProps> = ({
  label,
  color = DtwColors.safeGreen,
  icon,
  style,
}) => {
  return (
    <View
      style={[
        styles.badge,
        {
          borderColor: color,
          shadowColor: color,
        },
        style,
      ]}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.2,
    backgroundColor: 'rgba(8, 11, 16, 0.7)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    fontSize: 12,
    marginRight: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
