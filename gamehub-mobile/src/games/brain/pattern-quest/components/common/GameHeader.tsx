// ============================================================
// PATTERN QUEST — GameHeader Component
// Authentic adventure HUD top bar with back/pause and counters
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../../theme';

interface GameHeaderProps {
  title?: string;
  onBack?: () => void;
  onSettings?: () => void;
  showCoins?: boolean;
  showStars?: boolean;
  coins?: number;
  stars?: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  onBack,
  onSettings,
  showCoins = true,
  showStars = true,
  coins = 450,
  stars = 18,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {onBack && (
          <Pressable style={styles.iconButton} onPress={onBack}>
            <Image
              source={pqAssets.buttons.back}
              style={styles.backImage}
              resizeMode="contain"
            />
          </Pressable>
        )}
        {title && <Text style={[pqTypography.h2, styles.titleText]}>{title}</Text>}
      </View>

      <View style={styles.rightSection}>
        {showCoins && (
          <View style={styles.counterBadge}>
            <Image source={pqAssets.hud.coin} style={styles.counterIcon} resizeMode="contain" />
            <Text style={pqTypography.hudValue}>{coins}</Text>
          </View>
        )}
        {showStars && (
          <View style={styles.counterBadge}>
            <Image source={pqAssets.hud.star} style={styles.counterIcon} resizeMode="contain" />
            <Text style={pqTypography.hudValue}>{stars}</Text>
          </View>
        )}
        {onSettings && (
          <Pressable style={styles.iconButtonSmall} onPress={onSettings}>
            <Image
              source={pqAssets.icons.settings}
              style={styles.settingsIcon}
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
    paddingHorizontal: pqSpacing.base,
    paddingVertical: pqSpacing.sm,
    zIndex: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pqSpacing.sm,
  },
  iconButton: {
    marginRight: pqSpacing.sm,
  },
  backImage: {
    width: 90,
    height: 38,
  },
  titleText: {
    marginLeft: pqSpacing.xs,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 28, 38, 0.85)',
    borderWidth: 1.5,
    borderColor: pqColors.goldDeep,
    borderRadius: pqSpacing.radiusPill,
    paddingHorizontal: pqSpacing.sm,
    paddingVertical: 3,
  },
  counterIcon: {
    width: 22,
    height: 22,
    marginRight: 4,
  },
  iconButtonSmall: {
    padding: 4,
  },
  settingsIcon: {
    width: 32,
    height: 32,
  },
});
