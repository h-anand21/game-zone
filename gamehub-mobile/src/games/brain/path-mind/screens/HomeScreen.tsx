// ============================================================
// PATH MIND — Screen 02: HomeScreen (Master Reference Implementation)
// Full-screen Pixel Adventure background, Hero Title Plaque,
// Tactical Button Family, Resource HUD, and Explorer Hero
// ============================================================

import React from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable, Image } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { TitlePlaque } from '../components/ui/TitlePlaque';
import { GameButton } from '../components/ui/GameButton';
import { HudResourceBar } from '../components/ui/HudResourceBar';
import { ExplorerCharacter } from '../components/ui/ExplorerCharacter';
import { usePathMindStore } from '../store/pathMindStore';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';
import { pmAssets } from '../design-system/uiAssets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const {
    setScreen,
    setShowExitModal,
    hearts,
    coins,
    streak,
    currentLevel,
  } = usePathMindStore();

  return (
    <GameBackground variant="home" overlayDarkness={0.12}>
      <View style={styles.container}>
        {/* ============================================================ */}
        {/* 1. TOP HUD BAR: Exit, Title, Hearts & Coins                  */}
        {/* ============================================================ */}
        <View style={styles.topBar}>
          {/* Exit to GameHub */}
          <Pressable
            style={styles.iconCircle}
            onPress={() => setShowExitModal(true)}
            accessibilityLabel="Exit to GameHub"
          >
            <Image
              source={pmAssets.buttons.wood}
              style={styles.iconBg}
              resizeMode="stretch"
            />
            <Text style={styles.backArrowText}>←</Text>
          </Pressable>

          {/* Right Resource Counters & Settings */}
          <View style={styles.topRightGroup}>
            <HudResourceBar hearts={hearts} coins={coins} />
            <Pressable
              style={styles.iconCircleSmall}
              onPress={() => setScreen('settings')}
              accessibilityLabel="Open Settings"
            >
              <Image
                source={pmAssets.icons.settings}
                style={styles.settingsIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 2. CENTER HERO: PATH MIND Title Plaque                       */}
        {/* ============================================================ */}
        <View style={styles.titleArea}>
          <TitlePlaque
            title="PATH MIND"
            subtitle="REMEMBER THE WAY"
            variant="gold"
            size="large"
            style={styles.titlePlaque}
          />

          {/* Daily Streak & Expedition Region Badge */}
          <View style={styles.expeditionBadge}>
            <Image source={pmAssets.icons.compass} style={styles.badgeIcon} resizeMode="contain" />
            <Text style={styles.expeditionText}>
              CHAMBER {currentLevel} • ANCIENT VALLEY
            </Text>
            <View style={styles.streakPill}>
              <Text style={styles.streakText}>🔥 {streak} STREAK</Text>
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 3. HERO ENVIRONMENT: Explorer Character                     */}
        {/* ============================================================ */}
        <View style={styles.heroArea}>
          <ExplorerCharacter size={80} mood="idle" />
        </View>

        {/* ============================================================ */}
        {/* 4. ACTIONS STACK: Play Now, Build Path, Play Daily           */}
        {/* ============================================================ */}
        <View style={styles.actionSection}>
          {/* Main Primary Action: PLAY NOW */}
          <GameButton
            label="PLAY NOW"
            icon={pmAssets.icons.crown}
            variant="gold"
            size="large"
            width={Math.min(SCREEN_WIDTH - 60, 270)}
            height={66}
            onPress={() => setScreen('modes')}
            accessibilityLabel="Play Game"
          />

          {/* Secondary Action: BUILD YOUR PATH */}
          <GameButton
            label="BUILD YOUR PATH"
            icon={pmAssets.icons.map}
            variant="wood"
            size="medium"
            width={Math.min(SCREEN_WIDTH - 80, 240)}
            height={52}
            onPress={() => setScreen('builder')}
            accessibilityLabel="Build Custom Path"
            style={{ marginTop: 10 }}
          />

          {/* Tertiary Action: PLAY DAILY */}
          <GameButton
            label="PLAY DAILY"
            icon={pmAssets.icons.star}
            variant="cyan"
            size="medium"
            width={Math.min(SCREEN_WIDTH - 80, 240)}
            height={50}
            onPress={() => setScreen('daily')}
            accessibilityLabel="Play Daily Challenge"
            style={{ marginTop: 8 }}
          />
        </View>

        {/* ============================================================ */}
        {/* 5. BOTTOM NAVIGATION: Profile & Collection                   */}
        {/* ============================================================ */}
        <View style={styles.bottomBar}>
          <Pressable
            style={styles.navCard}
            onPress={() => setScreen('profile')}
            accessibilityLabel="Open Profile"
          >
            <Image source={pmAssets.icons.backpack} style={styles.navIcon} resizeMode="contain" />
            <Text style={styles.navLabel}>PROFILE</Text>
          </Pressable>

          <Pressable
            style={styles.navCard}
            onPress={() => setScreen('collection')}
            accessibilityLabel="Open Relic Collection"
          >
            <Image source={pmAssets.icons.chest} style={styles.navIcon} resizeMode="contain" />
            <Text style={styles.navLabel}>COLLECTION</Text>
          </Pressable>
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    paddingTop: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...pmShadows.medium,
  },
  iconBg: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  backArrowText: {
    fontSize: 20,
    fontWeight: '900',
    color: pmColors.textGold,
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(10, 18, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: pmColors.stoneBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...pmShadows.soft,
  },
  settingsIcon: {
    width: 20,
    height: 20,
  },
  titleArea: {
    alignItems: 'center',
    marginTop: 8,
  },
  titlePlaque: {
    width: Math.min(SCREEN_WIDTH - 40, 310),
  },
  expeditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 16, 22, 0.88)',
    borderWidth: 1.5,
    borderColor: '#263745',
    borderRadius: pmRadii.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
    gap: 6,
  },
  badgeIcon: {
    width: 14,
    height: 14,
  },
  expeditionText: {
    ...pmTypography.caption,
    color: pmColors.textCyan,
    letterSpacing: 0.8,
  },
  streakPill: {
    backgroundColor: 'rgba(255, 159, 26, 0.25)',
    borderWidth: 1,
    borderColor: pmColors.warningOrange,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  streakText: {
    fontSize: 9,
    fontWeight: '900',
    color: pmColors.goldBright,
  },
  heroArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 6,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 24, 34, 0.92)',
    borderWidth: 1.5,
    borderColor: pmColors.stoneBorder,
    borderRadius: pmRadii.lg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    ...pmShadows.soft,
  },
  navIcon: {
    width: 22,
    height: 22,
  },
  navLabel: {
    ...pmTypography.caption,
    fontSize: 11,
    color: pmColors.textGold,
  },
});
