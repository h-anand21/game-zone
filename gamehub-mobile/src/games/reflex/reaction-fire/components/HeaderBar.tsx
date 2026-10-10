// ============================================================
// REACTION FIRE — Header Navigation Bar
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RfColors } from '../theme';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backLabel}>BACK</Text>
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.rightContainer}>
        {rightAction || <View style={{ width: 44 }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(5, 9, 20, 0.65)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  backArrow: {
    fontSize: 16,
    color: RfColors.secondaryCyan,
    fontWeight: '800',
    marginRight: 4,
  },
  backLabel: {
    fontSize: 11,
    color: RfColors.textPrimary,
    fontWeight: '800',
    letterSpacing: 1,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: RfColors.textPrimary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: RfColors.secondaryCyan,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  rightContainer: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
});
