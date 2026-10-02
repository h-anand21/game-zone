// ============================================================
// PATTERN QUEST — Screen 02: HomeScreen
// Environment-first jungle lake screen (bg_home),
// Pattern Quest plaque, hero interaction, large PLAY NOW button,
// and bottom navigation bar
// ============================================================

import React from 'react';
import { View, StyleSheet, Pressable, Image, Text, Dimensions } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { GameButton } from '../components/buttons/GameButton';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const { currentScreen, setScreen, getUserName, setShowExitModal } = usePatternQuestStore();
  const userName = getUserName();

  return (
    <GameBackground screen="home" overlayDarkness={0.1}>
      <View style={styles.container}>
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <View style={styles.topLeftGroup}>
            {/* Exit to GameHub */}
            <Pressable
              style={styles.iconCircle}
              onPress={() => setShowExitModal(true)}
              accessibilityLabel="Exit to GameHub"
            >
              <Image
                source={pqAssets.icons.arrowLeft}
                style={[styles.topIcon, { tintColor: pqColors.goldBright }]}
                resizeMode="contain"
              />
            </Pressable>

            {/* User Badge */}
            <Pressable style={styles.profileBadge} onPress={() => setScreen('profile')}>
              <Image source={pqAssets.hud.gem} style={styles.gemIcon} resizeMode="contain" />
              <Text style={styles.userNameText}>{userName}</Text>
            </Pressable>
          </View>

          {/* Action Icons: Mail & Settings */}
          <View style={styles.topActions}>
            <Pressable style={styles.iconCircle} onPress={() => setScreen('achievements')}>
              <Image source={pqAssets.buttons.mail} style={styles.topIcon} resizeMode="contain" />
            </Pressable>
            <Pressable style={styles.iconCircle} onPress={() => setScreen('settings')}>
              <Image source={pqAssets.icons.settings} style={styles.topIcon} resizeMode="contain" />
            </Pressable>
          </View>
        </View>

        {/* Center Plaque */}
        <View style={styles.plaqueArea}>
          <ScreenPlaque screen="home" width={Math.min(SCREEN_WIDTH - 40, 310)} height={165} />
        </View>

        {/* Floating Interactive Sacred Rune */}
        <View style={styles.middleInteractiveArea}>
          <View style={styles.sacredGlowCore}>
            <View style={styles.runePillar}>
              <Image source={pqAssets.hud.crystal} style={{ width: 64, height: 60, marginBottom: 4 }} resizeMode="contain" />
              <Image source={pqAssets.buttons.badgeAdventure} style={{ width: 140, height: 42 }} resizeMode="contain" />
            </View>
          </View>
        </View>

        {/* Primary Action Button: PLAY NOW & Quick How To Play */}
        <View style={styles.playButtonArea}>
          <GameButton
            buttonAsset={pqAssets.buttons.howToPlay}
            onPress={() => setScreen('how_to_play')}
            width={180}
            height={48}
            style={{ marginBottom: 6 }}
          />
          <GameButton
            buttonAsset={pqAssets.buttons.playNow}
            onPress={() => setScreen('ready')}
            width={Math.min(SCREEN_WIDTH - 60, 270)}
            height={74}
          />
        </View>

        {/* Bottom Navigation */}
        <BottomNavigation currentScreen={currentScreen} onNavigate={setScreen} />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: pqSpacing.base,
    paddingTop: pqSpacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pqSpacing.sm,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 30, 0.85)',
    borderWidth: 1.5,
    borderColor: pqColors.gold,
    borderRadius: pqSpacing.radiusPill,
    paddingHorizontal: pqSpacing.md,
    paddingVertical: 4,
    gap: 6,
  },
  gemIcon: {
    width: 20,
    height: 20,
  },
  userNameText: {
    ...pqTypography.caption,
    fontWeight: '800',
    color: pqColors.textGold,
  },
  topActions: {
    flexDirection: 'row',
    gap: pqSpacing.sm,
  },
  iconCircle: {
    backgroundColor: 'rgba(15, 23, 30, 0.85)',
    borderWidth: 1.5,
    borderColor: '#3A4B5E',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIcon: {
    width: 28,
    height: 28,
  },
  plaqueArea: {
    alignItems: 'center',
    marginTop: pqSpacing.xs,
  },
  middleInteractiveArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sacredGlowCore: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  runePillar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 20, 28, 0.65)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.5)',
    borderRadius: pqSpacing.radiusLg,
    paddingHorizontal: pqSpacing.lg,
    paddingVertical: pqSpacing.sm,
  },
  runeGlyph: {
    fontSize: 36,
    color: pqColors.crystalCyan,
    textShadowColor: pqColors.crystalCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  runeSub: {
    fontSize: 11,
    fontWeight: '900',
    color: pqColors.textSecondary,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  playButtonArea: {
    alignItems: 'center',
    marginBottom: 88,
    zIndex: 10,
  },
});
