// ============================================================
// PATTERN QUEST — Screen 02: HomeScreen
// Environment-first jungle lake screen (bg_home)
// Clean top explorer HUD, centered CTAs, and elevated bottom navigation
// ============================================================

import React from 'react';
import { View, StyleSheet, Pressable, Image, Text, Dimensions } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameButton } from '../components/buttons/GameButton';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const { currentScreen, setScreen, getUserName, setShowExitModal } = usePatternQuestStore();
  const userName = getUserName();

  return (
    <GameBackground screen="home" overlayDarkness={0.12}>
      <View style={styles.container}>
        {/* Top Header Row with Redesigned Explorer Profile & Resources */}
        <View style={styles.topRow}>
          {/* Left Group: Exit Button + Explorer Profile Card */}
          <View style={styles.topLeftGroup}>
            {/* Authentic Red Stone EXIT Button */}
            <Pressable
              style={styles.exitButton}
              onPress={() => setShowExitModal(true)}
              accessibilityLabel="Exit to GameHub"
            >
              <Image
                source={pqAssets.buttons.exit}
                style={styles.exitButtonImg}
                resizeMode="contain"
              />
            </Pressable>

            {/* Redesigned Premium Explorer Profile Badge */}
            <Pressable
              style={styles.profileBadge}
              onPress={() => setScreen('profile')}
              accessibilityLabel="View Profile"
            >
              {/* Explorer Avatar Ring */}
              <View style={styles.avatarRing}>
                <Image
                  source={pqAssets.icons.chestBackpack}
                  style={styles.avatarIcon}
                  resizeMode="contain"
                />
              </View>

              {/* Explorer Info */}
              <View style={styles.profileInfo}>
                <Text style={styles.userNameText} numberOfLines={1}>
                  {userName}
                </Text>
                <Text style={styles.userRankText}>LVL 1 • EXPLORER</Text>
              </View>
            </Pressable>
          </View>

          {/* Right Group: Resource Counter & Settings */}
          <View style={styles.topRightGroup}>
            {/* Gem / Coin Resource Capsule */}
            <View style={styles.resourcePill}>
              <Image source={pqAssets.hud.gem} style={styles.resourceIcon} resizeMode="contain" />
              <Text style={styles.resourceValue}>450</Text>
            </View>

            {/* Settings Button */}
            <Pressable
              style={styles.iconCircle}
              onPress={() => setScreen('settings')}
              accessibilityLabel="Settings"
            >
              <Image source={pqAssets.icons.settings} style={styles.topIcon} resizeMode="contain" />
            </Pressable>
          </View>
        </View>

        {/* Center Atmospheric Section — Clean unobstructed view of background */}
        <View style={styles.centerSpace} />

        {/* Primary Action Buttons: HOW TO PLAY & PLAY NOW (Elevated for clear visibility) */}
        <View style={styles.playButtonArea}>
          <GameButton
            buttonAsset={pqAssets.buttons.howToPlay}
            onPress={() => setScreen('how_to_play')}
            width={195}
            height={52}
            style={{ marginBottom: 14 }}
          />
          <GameButton
            buttonAsset={pqAssets.buttons.playNow}
            onPress={() => setScreen('ready')}
            width={Math.min(SCREEN_WIDTH - 44, 285)}
            height={78}
          />
        </View>

        {/* Bottom Navigation Bar (Untouched tabs, elevated above safe area) */}
        <BottomNavigation currentScreen={currentScreen} onNavigate={setScreen} />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: pqSpacing.base,
    paddingTop: pqSpacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    marginTop: 4,
  },
  topLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Premium Explorer Profile Badge
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 22, 32, 0.92)',
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderColor: '#C5832B',
    borderRadius: pqSpacing.radiusPill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 7,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: '#00F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    width: 20,
    height: 20,
  },
  profileInfo: {
    justifyContent: 'center',
    paddingRight: 6,
  },
  userNameText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFE27A',
    letterSpacing: 0.5,
  },
  userRankText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#00F0FF',
    letterSpacing: 0.8,
  },

  // Resources & Top Buttons
  resourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 22, 32, 0.88)',
    borderWidth: 1.5,
    borderColor: '#C5832B',
    borderRadius: pqSpacing.radiusPill,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 5,
  },
  resourceIcon: {
    width: 18,
    height: 18,
  },
  resourceValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#00F0FF',
  },
  iconCircle: {
    backgroundColor: 'rgba(12, 22, 32, 0.88)',
    borderWidth: 1.5,
    borderColor: '#3A4B5E',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIcon: {
    width: 22,
    height: 22,
  },

  exitButton: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonImg: {
    width: 76,
    height: 42,
  },

  // Center Atmospheric Section (Clean background view)
  centerSpace: {
    flex: 1,
  },

  // Action Buttons Section
  playButtonArea: {
    alignItems: 'center',
    marginBottom: 140, // Elevated significantly so buttons are clearly visible above bottom navigation
    zIndex: 10,
  },
});
