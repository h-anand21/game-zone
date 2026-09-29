// ============================================================
// Mind Lock — Screen 3: Home Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Mascot } from '../components/Mascot';
import { MindLockLogo } from '../components/MindLockLogo';
import { StatCard } from '../components/StatCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { BottomNavigation } from '../components/BottomNavigation';
import { useMindLockStore } from '../store/mindLockStore';

export const HomeScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const { stats, selectedMode, selectMode, startGame, setScreen } = useMindLockStore();

  const quickModes = [
    {
      id: 'classic' as const,
      title: 'Classic',
      subtitle: 'Original Mode',
      locked: false,
      icon: (
        <View style={styles.miniPadIcon}>
          <View style={[styles.miniSquare, { backgroundColor: MLColors.padRed }]} />
          <View style={[styles.miniSquare, { backgroundColor: MLColors.padBlue }]} />
          <View style={[styles.miniSquare, { backgroundColor: MLColors.padGreen }]} />
          <View style={[styles.miniSquare, { backgroundColor: MLColors.padYellow }]} />
        </View>
      ),
    },
    {
      id: 'speed' as const,
      title: 'Speed',
      subtitle: 'Fast Patterns',
      locked: true,
      icon: <Text style={styles.emojiIcon}>⚡</Text>,
    },
    {
      id: 'endless' as const,
      title: 'Endless',
      subtitle: 'How Far Can You Go?',
      locked: true,
      icon: <Text style={styles.emojiIcon}>♾️</Text>,
    },
    {
      id: 'daily' as const,
      title: 'Daily',
      subtitle: 'New Puzzle Everyday',
      locked: false,
      hasDot: true,
      icon: <Text style={styles.emojiIcon}>📅</Text>,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Universal Screen Header */}
      <ScreenHeader variant="home" />

      {/* Scrollable Home Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* MIND LOCK 3D Vector Procedural Logo */}
        <View style={styles.logoContainer}>
          <MindLockLogo width={Math.min(width * 0.8, 300)} showTagline={true} />
        </View>

        {/* Mascot on Podium with Floating Pads */}
        <View style={styles.mascotPodium}>
          <Mascot mood="home" size={240} />
        </View>

        {/* Player Stats Bar */}
        <View style={styles.statsRow}>
          <StatCard
            label="Best Score"
            value={stats.bestScore}
            icon={<Text style={styles.statIcon}>🏆</Text>}
          />
          <StatCard
            label="Streak"
            value={stats.bestStreak}
            icon={<Text style={styles.statIcon}>🔥</Text>}
          />
          <StatCard
            label="Games Played"
            value={stats.totalGames}
            icon={<Text style={styles.statIcon}>🎯</Text>}
          />
        </View>

        {/* Main Action: PLAY Button */}
        <View style={styles.playButtonWrapper}>
          <PrimaryButton
            title="PLAY"
            size="lg"
            onPress={() => startGame(selectedMode)}
          />
        </View>

        {/* Quick Game Mode Selector Cards */}
        <View style={styles.modesHeaderRow}>
          <Text style={styles.modesTitle}>GAME MODES</Text>
          <Pressable onPress={() => setScreen('modes')}>
            <Text style={styles.viewAllText}>View All ›</Text>
          </Pressable>
        </View>

        <View style={styles.modesGrid}>
          {quickModes.map((m) => {
            const isSelected = selectedMode === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  if (m.id === 'daily') {
                    setScreen('daily');
                  } else if (!m.locked) {
                    selectMode(m.id);
                  } else {
                    setScreen('modes');
                  }
                }}
                style={[
                  styles.modeCard,
                  isSelected && styles.modeCardSelected,
                ]}
              >
                <LinearGradient
                  colors={
                    isSelected
                      ? ['#1B3352', '#0E1E31']
                      : ['#14243A', '#0A1421']
                  }
                  style={styles.modeCardInner}
                >
                  {/* Lock or Notification dot */}
                  {m.locked && (
                    <View style={styles.lockBadge}>
                      <Svg width="12" height="12" viewBox="0 0 24 24" fill={MLColors.textDim}>
                        <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                      </Svg>
                    </View>
                  )}
                  {m.hasDot && <View style={styles.redDot} />}

                  <View style={styles.modeIconWrapper}>{m.icon}</View>
                  <Text style={styles.modeName}>{m.title}</Text>
                  <Text style={styles.modeDesc} numberOfLines={1}>
                    {m.subtitle}
                  </Text>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Tabs Navigation */}
      <BottomNavigation currentTab="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MLColors.background,
  },
  scrollContent: {
    paddingHorizontal: MLSpacing.base,
    paddingBottom: MLSpacing.xl,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: -8,
  },
  logo: {
    // Crisp render
  },
  taglinePill: {
    backgroundColor: 'rgba(18, 35, 56, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: MLRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
    marginTop: -4,
  },
  taglineText: {
    color: MLColors.cream,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
    letterSpacing: 0.5,
  },
  mascotPodium: {
    marginVertical: MLSpacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: MLSpacing.sm,
    width: '100%',
    marginBottom: MLSpacing.lg,
  },
  statIcon: {
    fontSize: 16,
  },
  playButtonWrapper: {
    width: '100%',
    maxWidth: 340,
    marginBottom: MLSpacing.lg,
  },
  modesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: MLSpacing.sm,
    paddingHorizontal: 2,
  },
  modesTitle: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
  },
  viewAllText: {
    color: MLColors.primary,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MLSpacing.sm,
    width: '100%',
  },
  modeCard: {
    width: '48%',
    borderRadius: MLRadius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    ...MLShadows.sm,
  },
  modeCardSelected: {
    borderColor: MLColors.primary,
    ...MLShadows.glowGold,
  },
  modeCardInner: {
    padding: MLSpacing.md,
    alignItems: 'center',
    position: 'relative',
    minHeight: 110,
    justifyContent: 'center',
  },
  modeIconWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  miniPadIcon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 24,
    height: 24,
    gap: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniSquare: {
    width: 9,
    height: 9,
    borderRadius: 2,
  },
  emojiIcon: {
    fontSize: 24,
  },
  modeName: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
  },
  modeDesc: {
    color: MLColors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  redDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MLColors.danger,
  },
});
