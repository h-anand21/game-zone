// ============================================================
// PATTERN BREAKER — 03 Home Screen
// Clean, cinematic focus on world artwork, Scout & Robot,
// Majestic "PATTERN BREAKER" Title & authentic Sci-Fi "PLAY NOW" CTA
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBackground } from '../components/background/GameBackground';
import { Mascot } from '../components/mascot/Mascot';
import { RobotCompanion } from '../components/mascot/RobotCompanion';
import { GameButton } from '../components/buttons/GameButton';
import { GameIconButton } from '../components/buttons/GameIconButton';
import { IconButton } from '../components/buttons/IconButton';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { PBColors, PBShadows, PBRadius, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const HomeScreen: React.FC = () => {
  const {
    currentScreen,
    setScreen,
    setShowExitModal,
  } = usePatternBreakStore();

  return (
    <GameBackground variant="home" blurRadius={0}>
      <SafeAreaView style={styles.safeArea}>
        {/* ============================================================ */}
        {/* TOP BAR: Exit to GameHub & Settings                          */}
        {/* ============================================================ */}
        <View style={styles.topBar}>
          <IconButton
            name="chevron-back"
            size={44}
            iconSize={22}
            color={PBColors.textSecondary}
            onPress={() => setShowExitModal(true)}
            accessibilityLabel="Exit to GameHub"
          />

          <GameIconButton
            icon={uiAssets.icons.settings}
            size={44}
            onPress={() => setScreen('settings')}
            accessibilityLabel="Open Settings"
          />
        </View>

        {/* ============================================================ */}
        {/* CENTER CONTENT: Mascot Duo, Title & "PLAY NOW" CTA           */}
        {/* ============================================================ */}
        <View style={styles.centerSection}>
          {/* Mascot Duo with Floating Robot */}
          <View style={styles.mascotArea}>
            <View style={styles.floatingBot}>
              <RobotCompanion size={46} mood="happy" />
            </View>
            <Mascot pose="confident" size={155} />
          </View>

          {/* Official Game Title: PATTERN BREAKER */}
          <View style={styles.titleWrapper}>
            <Text style={styles.titleTop}>PATTERN</Text>
            <Text style={styles.titleBottom}>BREAKER</Text>
            <Text style={styles.subtitle}>Train your eyes. Sharpen your mind.</Text>
          </View>

          {/* Single Dominant Action: Authentic Sci-Fi PLAY NOW Image CTA */}
          <View style={styles.playNowWrapper}>
            <GameButton
              asset={uiAssets.actions.playNow}
              width="88%"
              height={84}
              onPress={() => setScreen('play_mode')}
              accessibilityLabel="Play Now"
              soundType="heavy"
            />
          </View>
        </View>

        {/* ============================================================ */}
        {/* BOTTOM NAVIGATION (HOME, PLAY, PROGRESS, PROFILE)            */}
        {/* ============================================================ */}
        <BottomNavigation currentScreen={currentScreen} onNavigate={setScreen} />
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  mascotArea: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  floatingBot: {
    position: 'absolute',
    top: -12,
    right: -24,
  },
  titleWrapper: {
    alignItems: 'center',
    marginVertical: 2,
  },
  titleTop: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 3,
    lineHeight: 36,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  titleBottom: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 3,
    lineHeight: 38,
    textTransform: 'uppercase',
    color: PBColors.primary,
    textShadowColor: 'rgba(25, 211, 255, 0.85)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: PBColors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.8,
  },
  playNowWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});
