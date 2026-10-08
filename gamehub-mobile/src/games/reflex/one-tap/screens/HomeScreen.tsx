// ============================================================
// ONE TAP: PRECISION GAME — HomeScreen
// Menu interface, Hero Rotating Orb, Best Score, Play CTA & Mode Cards
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { OneTapLogo } from '../components/OneTapLogo';
import {
  SvgSettings,
  SvgCrown,
  SvgPlay,
  SvgTarget,
  SvgTimer,
  SvgGrid,
} from '../components/icons/OneTapIcons';
import { OTColors } from '../theme/colors';
import { GameModeId, OneTapUserProfile } from '../types';

interface HomeScreenProps {
  profile: OneTapUserProfile;
  onPlayMode: (mode: GameModeId) => void;
  onOpenModeSelect: () => void;
  onOpenHowToPlay: () => void;
  onOpenTouchDemo: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onPlayMode,
  onOpenModeSelect,
  onOpenHowToPlay,
  onOpenTouchDemo,
  onOpenStats,
  onOpenSettings,
}) => {
  // Continuous gentle rotation for hero orb
  const heroRotation = useSharedValue(0);

  React.useEffect(() => {
    heroRotation.value = withRepeat(
      withTiming(360, { duration: 16000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const heroRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${heroRotation.value}deg` }],
  }));

  return (
    <BackgroundLayer screen="home" overlayDarkness={0.45}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Top Header */}
          <View style={styles.headerRow}>
            <OneTapLogo size="compact" showSubtitle={false} />
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
              onPress={onOpenSettings}
              hitSlop={8}
            >
              <SvgSettings size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Center Hero Orb & Concentric Radiance */}
          <View style={styles.heroSection}>
            <Animated.View style={[styles.heroOrbRings, heroRingStyle]}>
              <Svg width={180} height={180} viewBox="0 0 180 180">
                <Defs>
                  <LinearGradient id="heroGold" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#FFE875" />
                    <Stop offset="100%" stopColor="#D4AF37" stopOpacity={0.3} />
                  </LinearGradient>
                </Defs>
                <Circle cx={90} cy={90} r={82} stroke="url(#heroGold)" strokeWidth={1.8} strokeDasharray="14 8" fill="none" />
                <Circle cx={90} cy={90} r={58} stroke={OTColors.cyan} strokeWidth={1.5} strokeDasharray="8 6" fill="none" opacity={0.65} />
              </Svg>
            </Animated.View>

            {/* Radiant Glowing Core */}
            <View style={styles.heroCenterGlow}>
              <View style={styles.heroCoreDot} />
            </View>

            {/* Hero Subtitle */}
            <View style={styles.heroTitleWrap}>
              <Text style={styles.heroTitle}>ONE TAP</Text>
              <Text style={styles.heroSubtitle}>— PRECISION GAME —</Text>
            </View>
          </View>

          {/* Best Score Capsule */}
          <View style={styles.bestScoreCard}>
            <View style={styles.bestScoreHeader}>
              <SvgCrown size={15} color={OTColors.gold} />
              <Text style={styles.bestScoreLabel}>BEST SCORE</Text>
            </View>
            <Text style={styles.bestScoreValue}>{profile.personalBestScore}</Text>
          </View>

          {/* Primary Giant CTA: PLAY (Classic Mode Quick Launch) */}
          <Pressable
            style={({ pressed }) => [styles.playCta, pressed && styles.playCtaPressed]}
            onPress={() => onPlayMode('classic')}
          >
            <SvgPlay size={24} color="#07090C" />
            <Text style={styles.playCtaText}>PLAY</Text>
          </Pressable>

          {/* Modes Quick Selector */}
          <View style={styles.modesRow}>
            {/* Classic */}
            <Pressable
              style={({ pressed }) => [styles.modeChip, styles.modeChipGold, pressed && styles.btnPressed]}
              onPress={() => onPlayMode('classic')}
            >
              <Text style={[styles.modeChipTitle, { color: OTColors.gold }]}>CLASSIC</Text>
              <Text style={styles.modeChipSub}>10 ROUNDS</Text>
            </Pressable>

            {/* Endless */}
            <Pressable
              style={({ pressed }) => [styles.modeChip, styles.modeChipCyan, pressed && styles.btnPressed]}
              onPress={() => onPlayMode('endless')}
            >
              <Text style={[styles.modeChipTitle, { color: OTColors.cyan }]}>ENDLESS</Text>
              <Text style={styles.modeChipSub}>NO LIMIT</Text>
            </Pressable>

            {/* Rush */}
            <Pressable
              style={({ pressed }) => [styles.modeChip, styles.modeChipRed, pressed && styles.btnPressed]}
              onPress={() => onPlayMode('rush')}
            >
              <Text style={[styles.modeChipTitle, { color: OTColors.red }]}>RUSH</Text>
              <Text style={styles.modeChipSub}>SPEED ↑</Text>
            </Pressable>
          </View>

          {/* Secondary Bottom Navigation Grid */}
          <View style={styles.bottomGrid}>
            <Pressable
              style={({ pressed }) => [styles.gridCard, pressed && styles.btnPressed]}
              onPress={onOpenModeSelect}
            >
              <SvgGrid size={18} color={OTColors.cyan} />
              <Text style={styles.gridCardText}>MODES</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.gridCard, pressed && styles.btnPressed]}
              onPress={onOpenHowToPlay}
            >
              <SvgTarget size={18} color={OTColors.gold} />
              <Text style={styles.gridCardText}>HOW TO PLAY</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.gridCard, pressed && styles.btnPressed]}
              onPress={onOpenTouchDemo}
            >
              <SvgTimer size={18} color={OTColors.lime} />
              <Text style={styles.gridCardText}>TOUCH DEMO</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.gridCard, pressed && styles.btnPressed]}
              onPress={onOpenStats}
            >
              <SvgCrown size={18} color={OTColors.goldLight} />
              <Text style={styles.gridCardText}>STATS</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 21, 28, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  heroSection: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    position: 'relative',
  },
  heroOrbRings: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCenterGlow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: OTColors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
  },
  heroCoreDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFE875',
  },
  heroTitleWrap: {
    position: 'absolute',
    bottom: -15,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: OTColors.cyan,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  heroSubtitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: OTColors.gold,
    letterSpacing: 2,
    marginTop: 2,
  },
  bestScoreCard: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: 'rgba(16, 21, 28, 0.85)',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 26,
  },
  bestScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bestScoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: OTColors.textSecondary,
    letterSpacing: 2,
  },
  bestScoreValue: {
    fontSize: 26,
    fontWeight: '900',
    color: OTColors.gold,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  playCta: {
    width: '100%',
    height: 60,
    borderRadius: 16,
    backgroundColor: OTColors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 18,
    shadowColor: OTColors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  playCtaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  playCtaText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 3,
    fontStyle: 'italic',
  },
  modesRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 14,
  },
  modeChip: {
    flex: 1,
    backgroundColor: 'rgba(16, 21, 28, 0.8)',
    borderRadius: 12,
    borderWidth: 1.2,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modeChipGold: {
    borderColor: 'rgba(255, 215, 0, 0.35)',
  },
  modeChipCyan: {
    borderColor: 'rgba(0, 229, 255, 0.35)',
  },
  modeChipRed: {
    borderColor: 'rgba(255, 77, 97, 0.35)',
  },
  modeChipTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  modeChipSub: {
    fontSize: 8,
    fontWeight: '700',
    color: OTColors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  bottomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 10,
    marginTop: 16,
  },
  gridCard: {
    width: '48%',
    backgroundColor: 'rgba(16, 21, 28, 0.75)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  gridCardText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
