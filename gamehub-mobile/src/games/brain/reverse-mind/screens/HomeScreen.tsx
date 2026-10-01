// ============================================================
// REVERSE MIND — Home Screen Game Hub (Compact Mind Focus & Exit Support)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameBackground } from '../components/GameBackground';
import { ReverseMindLogo } from '../components/ReverseMindLogo';
import { GlowButton } from '../components/GlowButton';
import { BottomTabBar } from '../components/BottomTabBar';
import {
  PlayIconSvg,
  FlameIconSvg,
  BrainIconSvg,
  TargetIconSvg,
} from '../components/SvgIcons';
import { useReverseMindStore } from '../store/reverseMindStore';
import type { GameMode, AppNavScreen } from '../types';
import { RMTheme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeScreenProps {
  onStartGame: (mode: GameMode) => void;
  onNavigate: (screen: AppNavScreen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onNavigate,
}) => {
  const { playerStats, setShowExitModal } = useReverseMindStore();

  return (
    <GameBackground theme="home">
      <View style={styles.container}>
        {/* Top Player HUD Header Bar */}
        <View style={styles.topHud}>
          {/* Left Profile Pill */}
          <Pressable onPress={() => onNavigate('profile')} style={styles.playerPill}>
            <View style={styles.avatarCircle}>
              <Image
                source={require('../../../../../assets/images/rm_char_boy_study.jpg')}
                style={styles.avatarImg}
                resizeMode="cover"
              />
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>Himanshu</Text>
              <View style={styles.levelProgressRow}>
                <Text style={styles.levelText}>Lv. {playerStats.level}</Text>
                <View style={styles.miniProgressTrack}>
                  <View style={styles.miniProgressFill} />
                </View>
              </View>
            </View>
          </Pressable>

          {/* Right Stats: Streak, Mind Score, Settings / Exit */}
          <View style={styles.rightStatsRow}>
            {/* Streak */}
            <View style={styles.statPill}>
              <FlameIconSvg size={16} color="#FF9800" />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue}>{playerStats.dailyStreak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>

            {/* Mind Score */}
            <View style={styles.statPill}>
              <BrainIconSvg size={16} color="#4DE7FF" />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue}>{playerStats.coins}</Text>
                <Text style={styles.statLabel}>Mind Score</Text>
              </View>
            </View>

            {/* Settings Gear */}
            <Pressable onPress={() => onNavigate('settings')} style={styles.settingsBtn}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </Pressable>

            {/* Exit Door Icon */}
            <Pressable onPress={() => setShowExitModal(true)} style={styles.exitBtn}>
              <Text style={styles.exitIcon}>🚪</Text>
            </Pressable>
          </View>
        </View>

        {/* Scrollable Main Game Hub */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Title Banner */}
          <View style={styles.logoContainer}>
            <ReverseMindLogo size="md" showSubtitle={true} />
          </View>

          {/* Sleek Mind Matrix Hero Stage (Compact, Focused on Brain & Companions) */}
          <LinearGradient
            colors={['rgba(15, 40, 68, 0.85)', 'rgba(8, 23, 41, 0.90)']}
            style={styles.compactMindBanner}
          >
            <View style={styles.mindBadgePair}>
              <View style={styles.corgiCircleHalo}>
                <Image
                  source={require('../../../../../assets/images/rm_char_corgi_hero.jpg')}
                  style={styles.avatarImg}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.brainIconGlow}>
                <Text style={styles.brainEmoji}>🧠</Text>
              </View>
            </View>

            <View style={styles.mindBannerTextCol}>
              <Text style={styles.mindBannerTitle}>SYNAPSE INVERSION</Text>
              <Text style={styles.mindBannerSub}>
                Invert sequences, dodge color shifts & boost working memory speed!
              </Text>
            </View>
          </LinearGradient>

          {/* Large Golden PLAY NOW Button */}
          <View style={styles.playNowWrapper}>
            <GlowButton
              title="PLAY NOW"
              variant="gold"
              size="lg"
              icon={<PlayIconSvg size={24} color="#07111F" />}
              onPress={() => onStartGame('classic')}
            />
          </View>

          {/* 4 Core Game Mode Cards Grid */}
          <View style={styles.modeSection}>
            <View style={styles.modeGrid}>
              {/* 1. CLASSIC */}
              <Pressable
                onPress={() => onStartGame('classic')}
                style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
              >
                <LinearGradient
                  colors={['rgba(15, 40, 68, 0.92)', 'rgba(8, 23, 41, 0.95)']}
                  style={[styles.modeCardGradient, { borderColor: '#4DE7FF' }]}
                >
                  <View style={styles.modeCardIconBox}>
                    <Image
                      source={require('../../../../../assets/images/rm_char_corgi_hero.jpg')}
                      style={styles.corgiThumb}
                    />
                  </View>
                  <Text style={styles.modeTitle}>CLASSIC</Text>
                  <Text style={styles.modeDesc}>
                    Remember & reverse the sequence
                  </Text>
                  <View style={[styles.playCircle, { backgroundColor: '#4DE7FF' }]}>
                    <PlayIconSvg size={14} color="#07111F" />
                  </View>
                </LinearGradient>
              </Pressable>

              {/* 2. QUICK FLIP */}
              <Pressable
                onPress={() => onStartGame('quick-flip')}
                style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
              >
                <LinearGradient
                  colors={['rgba(42, 18, 69, 0.92)', 'rgba(22, 9, 43, 0.95)']}
                  style={[styles.modeCardGradient, { borderColor: '#B57CFF' }]}
                >
                  <View style={styles.modeCardIconBox}>
                    <Text style={styles.emojiBadge}>⏰🔥</Text>
                  </View>
                  <Text style={styles.modeTitle}>QUICK FLIP</Text>
                  <Text style={styles.modeDesc}>
                    Fast mode. How quickly can you reverse?
                  </Text>
                  <View style={[styles.playCircle, { backgroundColor: '#B57CFF' }]}>
                    <PlayIconSvg size={14} color="#07111F" />
                  </View>
                </LinearGradient>
              </Pressable>

              {/* 3. MIND SHIFT */}
              <Pressable
                onPress={() => onStartGame('mind-shift')}
                style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
              >
                <LinearGradient
                  colors={['rgba(59, 32, 10, 0.92)', 'rgba(33, 17, 4, 0.95)']}
                  style={[styles.modeCardGradient, { borderColor: '#FF9100' }]}
                >
                  <View style={styles.modeCardIconBox}>
                    <Text style={styles.emojiBadge}>🤖🧠</Text>
                  </View>
                  <Text style={styles.modeTitle}>MIND SHIFT</Text>
                  <Text style={styles.modeDesc}>
                    Rules keep changing. Stay alert!
                  </Text>
                  <View style={[styles.playCircle, { backgroundColor: '#FF9100' }]}>
                    <PlayIconSvg size={14} color="#07111F" />
                  </View>
                </LinearGradient>
              </Pressable>

              {/* 4. DAILY FLIP */}
              <Pressable
                onPress={() => onNavigate('daily')}
                style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
              >
                <LinearGradient
                  colors={['rgba(14, 51, 38, 0.92)', 'rgba(7, 29, 21, 0.95)']}
                  style={[styles.modeCardGradient, { borderColor: '#00E676' }]}
                >
                  <View style={styles.modeCardIconBox}>
                    <Text style={styles.emojiBadge}>📅👑</Text>
                  </View>
                  <Text style={styles.modeTitle}>DAILY FLIP</Text>
                  <Text style={styles.modeDesc}>
                    A new challenge every day
                  </Text>
                  <View style={[styles.playCircle, { backgroundColor: '#00E676' }]}>
                    <PlayIconSvg size={14} color="#07111F" />
                  </View>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* Quick Access Utility Cards (4 across) */}
          <View style={styles.quickUtilsGrid}>
            <Pressable onPress={() => onNavigate('stats')} style={styles.utilCard}>
              <LinearGradient colors={['rgba(22, 37, 59, 0.9)', 'rgba(11, 21, 36, 0.9)']} style={styles.utilGradient}>
                <Text style={styles.utilIcon}>📊</Text>
                <Text style={styles.utilName}>Progress</Text>
                <Text style={styles.utilSub}>View stats ➔</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => onNavigate('stats')} style={styles.utilCard}>
              <LinearGradient colors={['rgba(36, 26, 56, 0.9)', 'rgba(19, 12, 33, 0.9)']} style={styles.utilGradient}>
                <Text style={styles.utilIcon}>🏆</Text>
                <Text style={styles.utilName}>Achievements</Text>
                <Text style={styles.utilSub}>Badges ➔</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => onNavigate('practice')} style={styles.utilCard}>
              <LinearGradient colors={['rgba(48, 36, 16, 0.9)', 'rgba(28, 19, 7, 0.9)']} style={styles.utilGradient}>
                <Text style={styles.utilIcon}>🃟</Text>
                <Text style={styles.utilName}>Collection</Text>
                <Text style={styles.utilSub}>Items ➔</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => onNavigate('practice')} style={styles.utilCard}>
              <LinearGradient colors={['rgba(16, 45, 39, 0.9)', 'rgba(8, 26, 22, 0.9)']} style={styles.utilGradient}>
                <TargetIconSvg size={18} color="#00E676" />
                <Text style={styles.utilName}>Practice</Text>
                <Text style={styles.utilSub}>Train mind ➔</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>

        {/* Bottom Curved Glass Navigation Bar */}
        <BottomTabBar currentScreen="home" onNavigate={onNavigate} />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
  },
  topHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  playerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 24, 40, 0.85)',
    borderRadius: RMTheme.radii.full,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: 'rgba(77, 231, 255, 0.25)',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFD83D',
    marginRight: 6,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  playerInfo: {
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  levelProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFD83D',
  },
  miniProgressTrack: {
    width: 28,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  miniProgressFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#FFD83D',
  },
  rightStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 24, 40, 0.85)',
    borderRadius: RMTheme.radii.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 4,
  },
  statTextCol: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 11,
  },
  statLabel: {
    fontSize: 7,
    fontWeight: '700',
    color: '#94A3B8',
  },
  settingsBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(10, 24, 40, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsIcon: {
    fontSize: 13,
  },
  exitBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  exitIcon: {
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 28,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 2,
    marginBottom: 4,
  },
  compactMindBanner: {
    width: SCREEN_WIDTH - 24,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(77, 231, 255, 0.35)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    shadowColor: '#4DE7FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  mindBadgePair: {
    position: 'relative',
    marginRight: 12,
  },
  corgiCircleHalo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4DE7FF',
  },
  brainIconGlow: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#07111F',
    borderWidth: 1,
    borderColor: '#FFD83D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainEmoji: {
    fontSize: 12,
  },
  mindBannerTextCol: {
    flex: 1,
  },
  mindBannerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFD83D',
    letterSpacing: 1.2,
  },
  mindBannerSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E0EAEF',
    marginTop: 3,
    lineHeight: 14,
  },
  playNowWrapper: {
    width: '100%',
    marginVertical: 8,
  },
  modeSection: {
    width: '100%',
    marginTop: 2,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  modeCard: {
    width: (SCREEN_WIDTH - 32) / 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modeCardGradient: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    minHeight: 132,
    justifyContent: 'space-between',
  },
  modeCardIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 4,
  },
  corgiThumb: {
    width: '100%',
    height: '100%',
  },
  emojiBadge: {
    fontSize: 16,
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginTop: 2,
  },
  modeDesc: {
    fontSize: 9.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginVertical: 3,
    lineHeight: 12,
  },
  playCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  quickUtilsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    gap: 6,
  },
  utilCard: {
    width: (SCREEN_WIDTH - 42) / 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  utilGradient: {
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilIcon: {
    fontSize: 15,
    marginBottom: 2,
  },
  utilName: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
    textAlign: 'center',
  },
  utilSub: {
    fontSize: 7.5,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
