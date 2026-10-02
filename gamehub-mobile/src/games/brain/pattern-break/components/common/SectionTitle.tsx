// ============================================================
// PATTERN BREAKER — Section Title Component
// High-contrast, glowing Sci-Fi typography for category & mode headers
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { PBColors } from '../../theme';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  accentColor?: string;
  style?: ViewStyle;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  badge,
  accentColor = PBColors.primary,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleRow}>
        <View style={[styles.accentPill, { backgroundColor: accentColor }]} />
        <Text style={[styles.titleText, { color: accentColor }]}>{title}</Text>
        {badge ? (
          <View style={[styles.badgePill, { borderColor: accentColor }]}>
            <Text style={[styles.badgeText, { color: accentColor }]}>{badge}</Text>
          </View>
        ) : null}
      </View>
      {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accentPill: {
    width: 4,
    height: 16,
    borderRadius: 2,
    shadowColor: PBColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  titleText: {
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'rgba(25, 211, 255, 0.12)',
    marginLeft: 'auto',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '500',
    color: PBColors.textSecondary,
    marginTop: 3,
    marginLeft: 12,
    lineHeight: 15,
  },
});
