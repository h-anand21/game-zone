// ============================================================
// PATH MIND — Component 05: GameHeader
// Standardized top navigation bar with back button & resource HUD
// ============================================================

import React from 'react';
import { View, StyleSheet, Pressable, Image, Text } from 'react-native';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmAssets } from '../../design-system/uiAssets';
import { HudResourceBar } from './HudResourceBar';

interface GameHeaderProps {
  title?: string;
  onBack?: () => void;
  onSettings?: () => void;
  showResources?: boolean;
  hearts?: number;
  coins?: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  onBack,
  onSettings,
  showResources = true,
  hearts,
  coins,
}) => {
  return (
    <View style={styles.container}>
      {/* Left Action: Back Button */}
      <View style={styles.leftSlot}>
        {onBack && (
          <Pressable
            onPress={onBack}
            style={styles.iconCircle}
            accessibilityLabel="Go Back"
          >
            <Image
              source={pmAssets.buttons.wood}
              style={styles.iconBg}
              resizeMode="stretch"
            />
            <Text style={styles.backArrowText}>←</Text>
          </Pressable>
        )}
      </View>

      {/* Center: Title */}
      <View style={styles.centerSlot}>
        {title && (
          <Text style={[pmTypography.displaySub, styles.headerTitle]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      {/* Right Action: Resources HUD & Settings */}
      <View style={styles.rightSlot}>
        {showResources && <HudResourceBar hearts={hearts} coins={coins} />}
        {onSettings && (
          <Pressable
            onPress={onSettings}
            style={[styles.iconCircle, { width: 40, height: 40 }]}
            accessibilityLabel="Settings"
          >
            <Image
              source={pmAssets.icons.settings}
              style={{ width: 22, height: 22 }}
              resizeMode="contain"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 52,
    zIndex: 20,
  },
  leftSlot: {
    minWidth: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  rightSlot: {
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  iconBg: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  backArrowText: {
    fontSize: 22,
    fontWeight: '900',
    color: pmColors.textGold,
  },
  headerTitle: {
    textAlign: 'center',
  },
});
