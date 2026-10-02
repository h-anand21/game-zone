// ============================================================
// PATTERN BREAKER — ScreenHeader Component
// Reusable navigation header with back button, screen title & actions
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { IconButton } from '../buttons/IconButton';
import { PBColors, PBTypography } from '../../theme';

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  onSettings?: () => void;
  rightElement?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  onSettings,
  rightElement,
}) => {
  const handleBack = () => {
    if (!onBack) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onBack();
  };

  return (
    <View style={styles.header}>
      {/* Left Back or Placeholder */}
      <View style={styles.sideCol}>
        {onBack ? (
          <IconButton
            name="chevron-back"
            size={40}
            iconSize={22}
            onPress={handleBack}
            accessibilityLabel="Go Back"
          />
        ) : null}
      </View>

      {/* Center Title */}
      <View style={styles.titleCenter}>
        {title ? <Text style={styles.screenTitle}>{title}</Text> : null}
      </View>

      {/* Right Action */}
      <View style={[styles.sideCol, styles.rightCol]}>
        {rightElement ? (
          rightElement
        ) : onSettings ? (
          <IconButton
            name="settings-outline"
            size={40}
            iconSize={19}
            color={PBColors.accent}
            onPress={onSettings}
            accessibilityLabel="Settings"
          />
        ) : null}
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
    paddingVertical: 10,
    minHeight: 56,
  },
  sideCol: {
    width: 48,
    alignItems: 'flex-start',
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    lineHeight: 28,
    textTransform: 'uppercase',
    color: PBColors.textPrimary,
  },
});
