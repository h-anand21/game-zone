// ============================================================
// PATTERN BREAKER — Section Title Component
// Clear architectural section divider: Accent pip, title tag & dividing neon rule
// Unmistakably distinct from clickable cards & buttons
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
      {/* Non-Clickable Section Divider Banner */}
      <View style={styles.dividerRow}>
        <View
          style={[
            styles.titlePill,
            {
              borderLeftColor: accentColor,
              backgroundColor: `${accentColor}15`,
            },
          ]}
        >
          <View style={[styles.diamondPip, { backgroundColor: accentColor }]} />
          <Text style={[styles.titleText, { color: accentColor }]}>{title}</Text>
          {badge ? (
            <View
              style={[
                styles.badgePill,
                { borderColor: accentColor, backgroundColor: `${accentColor}20` },
              ]}
            >
              <Text style={[styles.badgeText, { color: accentColor }]}>{badge}</Text>
            </View>
          ) : null}
        </View>

        {/* Clean Sci-Fi Neon Horizontal Divider Line */}
        <View
          style={[
            styles.horizontalRule,
            { backgroundColor: `${accentColor}35` },
          ]}
        />
      </View>

      {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderLeftWidth: 3.5,
    gap: 7,
  },
  diamondPip: {
    width: 6,
    height: 6,
    transform: [{ rotate: '45deg' }],
  },
  titleText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    marginLeft: 4,
  },
  badgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  horizontalRule: {
    flex: 1,
    height: 1.5,
    borderRadius: 1,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '500',
    color: PBColors.textSecondary,
    marginTop: 3,
    marginLeft: 6,
  },
});
