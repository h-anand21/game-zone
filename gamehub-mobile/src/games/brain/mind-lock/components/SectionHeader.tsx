// ============================================================
// Mind Lock — Section Header Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MLColors, MLSpacing, MLTypography } from '../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {actionText && onAction && (
        <Pressable onPress={onAction} style={styles.actionBtn}>
          <Text style={styles.actionText}>{actionText} ›</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginVertical: MLSpacing.sm,
    paddingHorizontal: 2,
  },
  left: {
    flex: 1,
  },
  title: {
    color: MLColors.white,
    fontSize: MLTypography.bodyLarge,
    fontWeight: MLTypography.black,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    marginTop: 2,
  },
  actionBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  actionText: {
    color: MLColors.primary,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
});
