// ============================================================
// PATH MIND — Component: ModeBadge
// Small Fantasy Capsule Badge with Accent Border & Condensed Typography
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';

interface ModeBadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
}

export const ModeBadge: React.FC<ModeBadgeProps> = ({
  label,
  color = '#2ECC71',
  backgroundColor,
}) => {
  return (
    <View
      style={[
        styles.badge,
        {
          borderColor: color,
          backgroundColor: backgroundColor || 'rgba(10, 18, 26, 0.85)',
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
    gap: 4,
    marginBottom: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  text: {
    fontFamily: pmTypography.caption.fontFamily,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
