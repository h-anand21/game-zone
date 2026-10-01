// ============================================================
// REVERSE MIND — Home Screen Game Hub (SVG Vector Buttons & Icons)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameBackground } from '../components/GameBackground';
import { ReverseMindLogo } from '../components/ReverseMindLogo';
import { MascotCompanion } from '../components/MascotCompanion';
import { GlowButton } from '../components/GlowButton';
import { BottomTabBar } from '../components/BottomTabBar';
import {
  PlayIconSvg,
  CoinIconSvg,
  GemIconSvg,
  FlameIconSvg,
  ReverseArrowIconSvg,
  LightningIconSvg,
  BrainIconSvg,
  TargetIconSvg,
} from '../components/SvgIcons';
import { useReverseMindStore } from '../store/reverseMindStore';
import type { GameMode, AppNavScreen } from '../types';
import { RMTheme } from '../theme';

interface HomeScreenProps {
  onStartGame: (mode: GameMode) => void;
  onNavigate: (screen: AppNavScreen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onNavigate,
}) => {
  const { playerStats } = useReverseMindStore();

  return (
    <GameBackground>
      <View style={styles.container}>
        {/* Top Player HUD Bar */}
        <View style={styles.topHud}>
          <Pressable onPress={() => onNavigate('profile')} style={styles.playerProfilePill}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👦</Text>
            </View>
            <View style={styles.playerMeta}>
              <Text style={styles.playerName}>Agent Mind</Text>
              <Text style={styles.playerLevel}>LVL {playerStats.level}</Text>
            </View>
          </Pressable>

          {/* Currencies: Coins & Gems (Pure SVG) */}
          <View style={styles.currencyRow}>
            <View style={styles.currencyBadge}>
              <CoinIconSvg size={16} />
              <Text style={styles.currencyText}>{playerStats.coins}</Text>
            </View>
            <View style={[styles.currencyBadge, styles.gemBadge]}>
              <GemIconSvg size={16} />
              <Text style={styles.currencyText}>{playerStats.gems}</Text>
            </View>
          </View>
        </View>

        {/* Scrollable Hub Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo Title */}
          <View style={styles.logoWrapper}>
            <ReverseMindLogo size="md" showSubtitle={true} />
          </View>

          {/* Mascot Center Stage with Interactive Bubble */}
          <View style={styles.mascotStage}>
            <MascotCompanion
              state="thinking"
              size="md"
              showSpeechBubble={true}
              speechText="Can you reverse 5 items in 2 seconds?"
            />
          </View>

          {/* Big Chunky Primary CTA (Pure SVG Icon) */}
          <View style={styles.ctaWrapper}>
            <GlowButton
              title="PLAY NOW"
              variant="gold"
              size="lg"
              icon={<PlayIconSvg size={24} color="#07111F" />}
              onPress={() => onNavigate('modes')}
            />
          </View>

          {/* Daily Streak Banner (SVG Flame) */}
          <Pressable onPress={() => onNavigate('daily')} style={styles.dailyBanner}>
            <LinearGradient
              colors={['#2A1810', '#1A0E08']}
              style={styles.dailyGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.dailyIconBox}>
                <FlameIconSvg size={24} color="#FF9800" />
              </View>
              <View style={styles.dailyTextBox}>
                <Text style={styles.dailyTitle}>{playerStats.dailyStreak}-DAY STREAK ACTIVE</Text>
                <Text style={styles.dailyDesc}>Today's Rule: Reverse + Ignore Red items!</Text>
              </View>
              <Text style={styles.dailyArrow}>➔</Text>
            </LinearGradient>
          </Pressable>

          {/* Mode Quick Pick Grid */}
          <View style={styles.modesSection}>
            <Text style={styles.sectionTitle}>SELECT GAME MODE</Text>

            <View style={styles.modesGrid}>
              {/* Classic Mode */}
              <Pressable
                onPress={() => onStartGame('classic')}
                style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
              >
                <LinearGradient
                  colors={['#162842', '#0F1C30']}
                  style={[styles.modeCardGradient, { borderColor: RMTheme.colors.cyanNeon }]}
                >
                  <View style={styles.modeIconBox}>
                    <ReverseArrowIconSvg size={28} color={RMTheme.colors.cyanNeon} />
                  </View>
                  <Text style={styles.modeName}>CLASSIC</Text>
                  <Text style={styles.modeSub}>Remember & Reverse</Text>
                </LinearGradient>
              </Pressable>

              {/* Quick Flip */}
              <Pressable
                onPress={() => onStartGame('quick-flip')}
                style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
              >
                <LinearGradient
                  colors={['#27194A', '#190E33']}
                  style={[styles.modeCardGradient, { borderColor: RMTheme.colors.purpleNeon }]}
                >
                  <View style={styles.modeIconBox}>
                    <LightningIconSvg size={28} color={RMTheme.colors.purpleNeon} />
                  </View>
                  <Text style={styles.modeName}>QUICK FLIP</Text>
                  <Text style={styles.modeSub}>High Speed Rush</Text>
                </LinearGradient>
              </Pressable>

              {/* Mind Shift */}
              <Pressable
                onPress={() => onStartGame('mind-shift')}
                style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
              >
                <LinearGradient
                  colors={['#3B220C', '#241407']}
                  style={[styles.modeCardGradient, { borderColor: RMTheme.colors.orangeNeon }]}
                >
                  <View style={styles.modeIconBox}>
                    <BrainIconSvg size={28} color={RMTheme.colors.orangeNeon} />
                  </View>
                  <Text style={styles.modeName}>MIND SHIFT</Text>
                  <Text style={styles.modeSub}>Dynamic Rules</Text>
                </LinearGradient>
              </Pressable>

              {/* Practice */}
              <Pressable
                onPress={() => onStartGame('practice')}
                style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
              >
                <LinearGradient
                  colors={['#102E24', '#0A1C16']}
                  style={[styles.modeCardGradient, { borderColor: RMTheme.colors.emeraldGreen }]}
                >
                  <View style={styles.modeIconBox}>
                    <TargetIconSvg size={28} color={RMTheme.colors.emeraldGreen} />
                  </View>
                  <Text style={styles.modeName}>PRACTICE</Text>
                  <Text style={styles.modeSub}>No Timer Pressure</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Curved Glass Tab Bar */}
        <BottomTabBar currentScreen="home" onNavigate={onNavigate} />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  topHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  playerProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RMTheme.radii.full,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E3250',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  playerMeta: {
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  playerLevel: {
    fontSize: 9,
    fontWeight: '700',
    color: RMTheme.colors.cyanNeon,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: RMTheme.radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.3)',
    gap: 6,
  },
  gemBadge: {
    borderColor: 'rgba(77, 231, 255, 0.3)',
  },
  currencyText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
    alignItems: 'center',
  },
  logoWrapper: {
    marginTop: 6,
    marginBottom: 10,
  },
  mascotStage: {
    marginVertical: 4,
  },
  ctaWrapper: {
    width: '100%',
    marginVertical: 14,
  },
  dailyBanner: {
    width: '100%',
    borderRadius: RMTheme.radii.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FF9800',
    marginBottom: 20,
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  dailyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  dailyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dailyTextBox: {
    flex: 1,
  },
  dailyTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFE082',
    letterSpacing: 1,
  },
  dailyDesc: {
    fontSize: 11,
    color: '#FFCC80',
    fontWeight: '600',
    marginTop: 2,
  },
  dailyArrow: {
    fontSize: 16,
    color: '#FFE082',
    fontWeight: '900',
    marginLeft: 6,
  },
  modesSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: RMTheme.colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  modeCard: {
    width: '48%',
    borderRadius: RMTheme.radii.lg,
    overflow: 'hidden',
  },
  modeCardGradient: {
    padding: 14,
    borderRadius: RMTheme.radii.lg,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  modeIconBox: {
    marginBottom: 6,
  },
  modeName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  modeSub: {
    fontSize: 10,
    color: RMTheme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
