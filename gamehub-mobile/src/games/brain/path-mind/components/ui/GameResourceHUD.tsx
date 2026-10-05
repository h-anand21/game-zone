// ============================================================
// PATH MIND — Component: GameResourceHUD
// Global Reusable Fantasy HUD: Hearts, Coins & Sacred Crystals
// Stone & metal frames, tactile icons, and readable numbers
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';
import { pmAssets } from '../../design-system/uiAssets';

interface GameResourceHUDProps {
  hearts?: number;
  maxHearts?: number;
  coins?: number;
  crystals?: number;
  onHeartsPress?: () => void;
  onCoinsPress?: () => void;
  onCrystalsPress?: () => void;
}

export const GameResourceHUD: React.FC<GameResourceHUDProps> = ({
  hearts = 3,
  maxHearts = 3,
  coins = 850,
  crystals = 12,
  onHeartsPress,
  onCoinsPress,
  onCrystalsPress,
}) => {
  return (
    <View style={styles.container}>
      {/* 1. HEARTS: 3/3 */}
      <Pressable
        onPress={onHeartsPress}
        style={({ pressed }) => [styles.pill, styles.pillHearts, pressed && styles.pressed]}
        accessibilityLabel={`Hearts: ${hearts} of ${maxHearts}`}
      >
        <Image source={pmAssets.icons.heart} style={styles.icon} resizeMode="contain" />
        <Text style={[pmTypography.hudValue, styles.textHearts]}>
          {hearts}/{maxHearts}
        </Text>
      </Pressable>

      {/* 2. COINS: ◉ 850 */}
      <Pressable
        onPress={onCoinsPress}
        style={({ pressed }) => [styles.pill, styles.pillCoins, pressed && styles.pressed]}
        accessibilityLabel={`Coins: ${coins}`}
      >
        <Image source={pmAssets.icons.coin} style={styles.icon} resizeMode="contain" />
        <Text style={[pmTypography.hudValue, styles.textCoins]}>{coins}</Text>
        <View style={styles.plusBox}>
          <Text style={styles.plusText}>+</Text>
        </View>
      </Pressable>

      {/* 3. CRYSTALS / GEMS: ◆ 12 */}
      <Pressable
        onPress={onCrystalsPress}
        style={({ pressed }) => [styles.pill, styles.pillCrystals, pressed && styles.pressed]}
        accessibilityLabel={`Crystals: ${crystals}`}
      >
        <Image source={pmAssets.icons.gem} style={styles.icon} resizeMode="contain" />
        <Text style={[pmTypography.hudValue, styles.textCrystals]}>{crystals}</Text>
        <View style={styles.plusBox}>
          <Text style={styles.plusText}>+</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 16, 24, 0.94)',
    borderWidth: 1.5,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    gap: 4,
    ...pmShadows.soft,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  pillHearts: {
    borderColor: 'rgba(255, 71, 87, 0.5)',
  },
  pillCoins: {
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  pillCrystals: {
    borderColor: 'rgba(0, 240, 255, 0.5)',
  },
  icon: {
    width: 15,
    height: 15,
  },
  textHearts: {
    fontSize: 11,
    color: '#FF7B88',
    fontWeight: '900',
  },
  textCoins: {
    fontSize: 11,
    color: pmColors.goldBright,
    fontWeight: '900',
  },
  textCrystals: {
    fontSize: 11,
    color: pmColors.cyanGlow,
    fontWeight: '900',
  },
  plusBox: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 1,
  },
  plusText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 11,
  },
});
