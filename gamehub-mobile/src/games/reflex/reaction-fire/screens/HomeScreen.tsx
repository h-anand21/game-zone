// ============================================================
// REACTION FIRE — Screen 03: Game Home Dashboard
// Hero radar arena, career quick-stats, primary play action, and mode routes
// ============================================================

import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line } from 'react-native-svg';
import { ArcadeButton } from '../components/ArcadeButton';
import { RfColors } from '../theme';
import { formatMs } from '../logic/timing';
import type { ReactionStats, GameModeId } from '../types';

interface HomeScreenProps {
  stats: ReactionStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPlayMode: (mode: GameModeId) => void;
  onOpenModeSelect: () => void;
  onOpenDaily: () => void;
  onOpenHowToPlay: () => void;
  onOpenPractice: () => void;
  onOpenMissions: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onExitToHub: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  soundEnabled,
  onToggleSound,
  onPlayMode,
  onOpenModeSelect,
  onOpenDaily,
  onOpenHowToPlay,
  onOpenPractice,
  onOpenMissions,
  onOpenStats,
  onOpenSettings,
  onExitToHub,
}) => {
  const insets = useSafeAreaInsets();
  const radarSpin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(radarSpin, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, [radarSpin]);

  const spinInterpolation = radarSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={onOpenSettings} style={styles.headerBtn}>
          <Text style={styles.headerBtnIcon}>⚙️</Text>
        </Pressable>

        <Pressable onPress={onExitToHub} style={styles.hubBtn}>
          <Text style={styles.hubBtnText}>✕ HUB</Text>
        </Pressable>

        <Pressable onPress={onToggleSound} style={styles.headerBtn}>
          <Text style={styles.headerBtnIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 32) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Block */}
        <View style={styles.titleArea}>
          <Text style={styles.titlePrefix}>REFLEX ARENA</Text>
          <Text style={styles.titleMain}>REACTION</Text>
          <Text style={styles.titleFire}>FIRE</Text>
          <Text style={styles.tagline}>YOUR REFLEX. YOUR RECORD.</Text>
        </View>

        {/* Quick Stats Strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>PERSONAL BEST</Text>
            <Text style={[styles.statValue, { color: RfColors.goLime }]}>
              {formatMs(stats.bestTimeMs)}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>GAMES PLAYED</Text>
            <Text style={[styles.statValue, { color: RfColors.secondaryCyan }]}>
              {stats.completedGames}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>COMBAT LEVEL</Text>
            <Text style={[styles.statValue, { color: RfColors.rewardGold }]}>
              LVL {stats.level}
            </Text>
          </View>
        </View>

        {/* Hero Interactive Radar Illustration */}
        <View style={styles.heroRadarContainer}>
          <Animated.View style={[styles.rotatingRingWrapper, { transform: [{ rotate: spinInterpolation }] }]}>
            <Svg width={180} height={180} viewBox="0 0 180 180">
              <Circle
                cx="90"
                cy="90"
                r="84"
                stroke={RfColors.secondaryCyan}
                strokeWidth="1.5"
                strokeDasharray="6, 8"
                strokeOpacity="0.4"
                fill="none"
              />
              <Circle
                cx="90"
                cy="90"
                r="60"
                stroke={RfColors.primaryBlue}
                strokeWidth="1.5"
                strokeOpacity="0.5"
                fill="none"
              />
              <Circle
                cx="90"
                cy="90"
                r="36"
                stroke={RfColors.goLime}
                strokeWidth="2"
                strokeOpacity="0.75"
                fill="none"
              />
              <Line x1="90" y1="10" x2="90" y2="170" stroke={RfColors.secondaryCyan} strokeWidth="1" strokeOpacity="0.3" />
              <Line x1="10" y1="90" x2="170" y2="90" stroke={RfColors.secondaryCyan} strokeWidth="1" strokeOpacity="0.3" />
            </Svg>
          </Animated.View>

          {/* Core Target Center */}
          <View style={styles.radarCore}>
            <Text style={styles.coreIcon}>⚡</Text>
            <Text style={styles.coreLabel}>READY</Text>
          </View>
        </View>

        {/* Dominant Primary Action */}
        <View style={styles.primaryActionContainer}>
          <ArcadeButton
            title="PLAY CLASSIC TEST"
            variant="lime"
            size="large"
            icon="⚡"
            onPress={() => onPlayMode('classic')}
            style={styles.mainPlayBtn}
          />
        </View>

        {/* Secondary Action Cards Grid */}
        <View style={styles.cardsGrid}>
          <Pressable
            style={({ pressed }) => [styles.gridCard, pressed && styles.cardPressed]}
            onPress={onOpenModeSelect}
          >
            <Text style={styles.cardIcon}>🎮</Text>
            <Text style={styles.cardTitle}>MODE SELECT</Text>
            <Text style={styles.cardDesc}>5-Round, Endurance & Fakeout</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.gridCard, styles.dailyCard, pressed && styles.cardPressed]}
            onPress={onOpenDaily}
          >
            <Text style={styles.cardIcon}>🌟</Text>
            <Text style={[styles.cardTitle, { color: RfColors.rewardGold }]}>DAILY TEST</Text>
            <Text style={styles.cardDesc}>Sub-300ms Benchmark</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.gridCard, pressed && styles.cardPressed]}
            onPress={onOpenMissions}
          >
            <Text style={styles.cardIcon}>🎯</Text>
            <Text style={styles.cardTitle}>MISSIONS</Text>
            <Text style={styles.cardDesc}>Daily XP & Achievements</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.gridCard, pressed && styles.cardPressed]}
            onPress={onOpenPractice}
          >
            <Text style={styles.cardIcon}>🛡️</Text>
            <Text style={[styles.cardTitle, { color: RfColors.secondaryCyan }]}>PRACTICE</Text>
            <Text style={styles.cardDesc}>Zero-Pressure Arena</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.gridCard, pressed && styles.cardPressed]}
            onPress={onOpenStats}
          >
            <Text style={styles.cardIcon}>📊</Text>
            <Text style={styles.cardTitle}>STATISTICS</Text>
            <Text style={styles.cardDesc}>Trend & Distribution Charts</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.gridCard, pressed && styles.cardPressed]}
            onPress={onOpenHowToPlay}
          >
            <Text style={styles.cardIcon}>📖</Text>
            <Text style={styles.cardTitle}>HOW TO PLAY</Text>
            <Text style={styles.cardDesc}>Rules & Timing Guide</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RfColors.bgMain,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnIcon: {
    fontSize: 16,
  },
  hubBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 77, 99, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 99, 0.3)',
  },
  hubBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: RfColors.signalRed,
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  titleArea: {
    alignItems: 'center',
    marginVertical: 10,
  },
  titlePrefix: {
    fontSize: 10,
    fontWeight: '800',
    color: RfColors.secondaryCyan,
    letterSpacing: 3,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  titleMain: {
    fontSize: 32,
    fontWeight: '900',
    color: RfColors.textPrimary,
    letterSpacing: 3,
  },
  titleFire: {
    fontSize: 38,
    fontWeight: '900',
    color: RfColors.goLime,
    letterSpacing: 4,
    marginTop: -8,
    textShadowColor: RfColors.goLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '800',
    color: RfColors.textSecondary,
    letterSpacing: 2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  statsStrip: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(10, 23, 41, 0.85)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroRadarContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  rotatingRingWrapper: {
    position: 'absolute',
    width: 180,
    height: 180,
  },
  radarCore: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(10, 23, 41, 0.95)',
    borderWidth: 2,
    borderColor: RfColors.goLime,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: RfColors.goLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 8,
  },
  coreIcon: {
    fontSize: 24,
    color: RfColors.goLime,
  },
  coreLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: RfColors.goLime,
    letterSpacing: 1,
  },
  primaryActionContainer: {
    width: '100%',
    marginVertical: 10,
  },
  mainPlayBtn: {
    width: '100%',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginTop: 6,
  },
  gridCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(10, 23, 41, 0.8)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dailyCard: {
    borderColor: 'rgba(255, 200, 87, 0.3)',
    backgroundColor: 'rgba(255, 200, 87, 0.08)',
  },
  cardPressed: {
    opacity: 0.75,
  },
  cardIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: RfColors.textPrimary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 9,
    color: RfColors.textMuted,
    lineHeight: 13,
  },
});

export default HomeScreen;
