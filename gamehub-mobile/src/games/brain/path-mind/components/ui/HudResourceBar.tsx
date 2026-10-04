// ============================================================
// PATH MIND — Component 06: HudResourceBar
// Top-right resource counter (Hearts & Gold Coins)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';
import { pmAssets } from '../../design-system/uiAssets';

interface HudResourceBarProps {
  hearts?: number;
  maxHearts?: number;
  coins?: number;
  stars?: number;
  onCoinsPress?: () => void;
  onHeartsPress?: () => void;
}

export const HudResourceBar: React.FC<HudResourceBarProps> = ({
  hearts = 3,
  maxHearts = 3,
  coins = 850,
  stars,
  onCoinsPress,
  onHeartsPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Hearts Counter */}
      <Pressable onPress={onHeartsPress} style={styles.badge}>
        <Image source={pmAssets.icons.heart} style={styles.icon} resizeMode="contain" />
        <Text style={[pmTypography.hudValue, styles.heartsText]}>
          {hearts}/{maxHearts}
        </Text>
      </Pressable>

      {/* Gold Coins Counter */}
      <Pressable onPress={onCoinsPress} style={styles.badge}>
        <Image source={pmAssets.icons.coin} style={styles.icon} resizeMode="contain" />
        <Text style={[pmTypography.hudValue, styles.coinsText]}>{coins}</Text>
      </Pressable>

      {/* Optional Stars / Echo */}
      {stars !== undefined && (
        <View style={styles.badge}>
          <Image source={pmAssets.icons.star} style={styles.icon} resizeMode="contain" />
          <Text style={[pmTypography.hudValue, styles.starsText]}>{stars}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 18, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: pmColors.stoneBorder,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  icon: {
    width: 20,
    height: 20,
  },
  heartsText: {
    color: pmColors.dangerRed,
  },
  coinsText: {
    color: pmColors.goldBright,
  },
  starsText: {
    color: pmColors.cyan,
  },
});
