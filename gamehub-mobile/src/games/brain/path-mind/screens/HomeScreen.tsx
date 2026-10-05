// ============================================================
// PATH MIND — Screen 02: HomeScreen (Master Reference Implementation)
// Pure fantasy world illustration, authentic vector RPG buttons,
// unobstructed background artwork, and tactile navigation
// ============================================================

import React from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable, Image } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { GameButton } from '../components/ui/GameButton';
import { HudResourceBar } from '../components/ui/HudResourceBar';
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
    <GameBackground variant="home" overlayDarkness={0.06}>
      <View style={styles.container}>
        {/* ============================================================ */}
        {/* 1. TOP HUD BAR: Exit, Hearts, Coins & Settings               */}
        {/* ============================================================ */}
        <View style={styles.topBar}>
          {/* Exit to GameHub */}
          <GameButton
            imageSource={pmAssets.buttons.exit}
            label="EXIT"
            variant="red"
            size="small"
            width={76}
            height={36}
            onPress={() => setShowExitModal(true)}
            accessibilityLabel="Exit to GameHub"
          />

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
        {/* 2. ARTWORK STAGE: Clean breathing space                     */}
        {/* Background showcases the majestic Path Mind logo & explorer */}
        {/* ============================================================ */}
        <View style={styles.sceneryStage}>
          {/* Subtle Chamber Region Tag */}
          <View style={styles.expeditionBadge}>
            <Image source={pmAssets.icons.compass} style={styles.badgeIcon} resizeMode="contain" />
            <Text style={styles.expeditionText}>
              CHAMBER {currentLevel} • ANCIENT VALLEY
            </Text>
            <View style={styles.streakPill}>
              <Text style={styles.streakText}>🔥 {streak}</Text>
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 3. PRIMARY ACTIONS: Tactile Vector RPG Buttons               */}
        {/* ============================================================ */}
        <View style={styles.actionSection}>
          {/* PLAY NOW CTA */}
          <GameButton
            imageSource={pmAssets.buttons.playNow}
            label="PLAY NOW"
            size="large"
            width={Math.min(SCREEN_WIDTH - 64, 250)}
            height={68}
            onPress={() => setScreen('modes')}
            accessibilityLabel="Play Now"
          />

          {/* PLAY DAILY CTA */}
          <GameButton
            imageSource={pmAssets.buttons.playDaily}
            label="PLAY DAILY"
            size="medium"
            width={Math.min(SCREEN_WIDTH - 80, 230)}
            height={62}
            onPress={() => setScreen('daily')}
            accessibilityLabel="Play Daily"
            style={{ marginTop: 6 }}
          />

          {/* WORLD MAP & HOW TO PLAY FANTASY BUTTONS */}
          <View style={styles.subActionRow}>
            <GameButton
              imageSource={pmAssets.buttons.worldMapWood}
              label="WORLD MAP"
              size="small"
              width={138}
              height={46}
              onPress={() => setScreen('world_map')}
              accessibilityLabel="World Map"
            />
            <GameButton
              imageSource={pmAssets.buttons.howToPlayCyan}
              label="HOW TO PLAY"
              size="small"
              width={138}
              height={46}
              onPress={() => setScreen('how_to_play')}
              accessibilityLabel="How To Play"
            />
          </View>
        </View>

        {/* ============================================================ */}
        {/* 4. BOTTOM NAVIGATION: Collection & Profile buttons           */}
        {/* ============================================================ */}
        <View style={styles.bottomBar}>
          <GameButton
            imageSource={pmAssets.buttons.collection}
            label="COLLECTION"
            size="small"
            width={140}
            height={48}
            onPress={() => setScreen('collection')}
            accessibilityLabel="Collection"
          />

          <GameButton
            imageSource={pmAssets.buttons.profile}
            label="PROFILE"
            size="small"
            width={140}
            height={48}
            onPress={() => setScreen('profile')}
            accessibilityLabel="Profile"
          />
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
    paddingBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    paddingTop: 4,
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
  sceneryStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 110, // Lets the background's built-in "PATH MIND - REMEMBER THE WAY" logo shine clearly
  },
  expeditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 16, 22, 0.9)',
    borderWidth: 1.5,
    borderColor: '#2D3E4F',
    borderRadius: pmRadii.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 6,
    ...pmShadows.medium,
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
  actionSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  subActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    justifyContent: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 4,
  },
});
