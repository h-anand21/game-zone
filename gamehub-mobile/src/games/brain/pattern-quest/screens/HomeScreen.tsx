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

        {/* Center Atmospheric Branding & Title Insignia */}
        <View style={styles.centerSpace}>
          <View style={styles.titleInsigniaWrapper}>
            {/* Top Mystic Glyphs Accent */}
            <View style={styles.glyphAccentRow}>
              <Text style={styles.glyphSymbol}>✦</Text>
              <Text style={styles.glyphDot}>●</Text>
              <Text style={styles.glyphDiamond}>◈</Text>
              <Text style={styles.glyphDot}>●</Text>
              <Text style={styles.glyphSymbol}>✦</Text>
            </View>

            {/* Master Game Title: PATTERN QUEST */}
            <Text style={styles.masterGameTitle}>PATTERN QUEST</Text>

            {/* Subtitle Badge Plaque */}
            <View style={styles.subtitleBadge}>
              <Text style={styles.adventureSubtitle}>✦ SACRED GLYPH EXPEDITION ✦</Text>
            </View>

            {/* Sacred Rune Preview Capsules */}
            <View style={styles.runePreviewRow}>
              <View style={[styles.runePill, { borderColor: '#2ECC71' }]}>
                <Text style={[styles.runeIcon, { color: '#2ECC71' }]}>◯</Text>
              </View>
              <View style={[styles.runePill, { borderColor: '#00F0FF' }]}>
                <Text style={[styles.runeIcon, { color: '#00F0FF' }]}>△</Text>
              </View>
              <View style={[styles.runePill, { borderColor: '#FFE27A' }]}>
                <Text style={[styles.runeIcon, { color: '#FFE27A' }]}>◊</Text>
              </View>
              <View style={[styles.runePill, { borderColor: '#FF7675' }]}>
                <Text style={[styles.runeIcon, { color: '#FF7675' }]}>★</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Primary Action Buttons: HOW TO PLAY & PLAY NOW */}
        <View style={styles.playButtonArea}>
          <GameButton
            buttonAsset={pqAssets.buttons.howToPlay}
            onPress={() => setScreen('how_to_play')}
            width={185}
            height={50}
            style={{ marginBottom: 12 }}
          />
          <GameButton
            buttonAsset={pqAssets.buttons.playNow}
            onPress={() => setScreen('ready')}
            width={Math.min(SCREEN_WIDTH - 50, 280)}
            height={76}
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

  // Center Atmospheric Section
  centerSpace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInsigniaWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  glyphAccentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  glyphSymbol: {
    color: '#00F0FF',
    fontSize: 14,
    fontWeight: '900',
    textShadowColor: '#00F0FF',
    textShadowRadius: 6,
  },
  glyphDot: {
    color: '#FFE27A',
    fontSize: 8,
    opacity: 0.8,
  },
  glyphDiamond: {
    color: '#FFE27A',
    fontSize: 16,
    fontWeight: '900',
    textShadowColor: '#FFE27A',
    textShadowRadius: 8,
  },
  masterGameTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFE27A',
    letterSpacing: 3.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  subtitleBadge: {
    backgroundColor: 'rgba(12, 22, 32, 0.92)',
    borderWidth: 1.5,
    borderColor: '#C5832B',
    borderRadius: pqSpacing.radiusPill,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginTop: 8,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  adventureSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00F0FF',
    letterSpacing: 2,
    textAlign: 'center',
  },
  runePreviewRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  runePill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(12, 22, 32, 0.85)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runeIcon: {
    fontSize: 14,
    fontWeight: '900',
  },

  // Action Buttons Section
  playButtonArea: {
    alignItems: 'center',
    marginBottom: 96, // Ample breathing room above elevated BottomNavigation
    zIndex: 10,
  },
});
