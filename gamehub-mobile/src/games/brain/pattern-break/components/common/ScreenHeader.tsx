// ============================================================
// PATTERN BREAKER — ScreenHeader Component
// Reusable navigation header with back button, screen title & actions
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { IconButton } from '../buttons/IconButton';
import { GameIconButton } from '../buttons/GameIconButton';
import { PBColors, PBTypography, uiAssets } from '../../theme';
import { usePatternBreakStore } from '../../store/patternBreakStore';

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  onSettings?: () => void;
  showSettings?: boolean;
  rightElement?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  onSettings,
  showSettings = true,
  rightElement,
}) => {
  const { setScreen } = usePatternBreakStore();

  const handleBack = () => {
    if (!onBack) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onBack();
  };

  const handleSettings = onSettings || (() => setScreen('settings'));

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

      {/* Right Action: Authentic Settings Icon Button */}
      <View style={[styles.sideCol, styles.rightCol]}>
        {rightElement ? (
          rightElement
        ) : showSettings ? (
          <GameIconButton
            icon={uiAssets.icons.settings}
            fallbackVectorName="settings-sharp"
            size={40}
            onPress={handleSettings}
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
