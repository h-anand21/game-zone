// ============================================================
// MEMORY RUSH — 02 Home Screen Game Hub
// (Full Arcade Polish inspired by Reverse Mind, Number Rush, Mind Lock & Find One)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameBackground } from '../components/GameBackground';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { BottomTabBar } from '../components/BottomTabBar';
import { MRIcon } from '../components/MRIcon';
import { MRColors, MRButtonThemes, GAME_MODES } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';
import type { AppNavScreen, GameMode } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeScreenProps {
  onStartGame: () => void;
  onNavigate: (screen: AppNavScreen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onNavigate,
}) => {
  const {
    playerStats,
    dailyChallenge,
    setShowExitModal,
    mode,
    setMode,
    startNewGame,
  } = useMemoryRushStore();

  const handleQuickPlayMode = (modeId: GameMode) => {
    setMode(modeId);
    onStartGame();
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'sequenceRush':
        return 'SEQUENCE RUSH';
      case 'numberShift':
        return 'NUMBER SHIFT';
      case 'missingNumber':
        return 'MISSING NUMBER';
      case 'fusionRush':
        return 'FUSION RUSH';
      case 'memoryGrid':
      default:
        return 'MEMORY GRID';
    }
  };

  return (
    <GameBackground theme="home">
      <View style={styles.container}>
        {/* ==================================================== */}
        {/* 1. TOP PLAYER HUD HEADER (Same as Reverse Mind / Number Rush) */}
        {/* ==================================================== */}
        <View style={styles.topHud}>
          {/* Left Player Profile Pill */}
          <Pressable onPress={() => onNavigate('stats')} style={styles.playerPill}>
            <View style={styles.avatarCircle}>
              <MRIcon name="user" size={18} color={MRColors.yellowStatus} />
            </View>
            <View style={styles.playerInfoCol}>
              <Text style={styles.playerName}>PLAYER 01</Text>
              <View style={styles.levelProgressRow}>
                <Text style={styles.levelText}>Lv. {Math.max(1, Math.floor(playerStats.bestScore / 300))}</Text>
                <View style={styles.miniProgressTrack}>
                  <View style={[styles.miniProgressFill, { width: `${playerStats.accuracy}%` }]} />
                </View>
              </View>
            </View>
          </Pressable>

          {/* Right Stats & Controls */}
          <View style={styles.rightStatsRow}>
            {/* Streak Badge */}
            <View style={styles.hudStatPill}>
              <MRIcon name="flame" size={14} color={MRColors.yellowStatus} />
              <Text style={styles.hudStatValue}>{playerStats.bestStreak}</Text>
            </View>

            {/* Mind Score */}
            <View style={styles.hudStatPill}>
              <MRIcon name="target" size={14} color={MRColors.yellowStatus} />
              <Text style={styles.hudStatValue}>{(playerStats.bestScore).toLocaleString()}</Text>
            </View>

            {/* Settings Button */}
            <Pressable onPress={() => onNavigate('settings')} style={styles.hudIconBtn}>
              <MRIcon name="cpu" size={16} color={MRColors.yellowStatus} />
            </Pressable>

            {/* Exit Door */}
            <Pressable onPress={() => setShowExitModal(true)} style={styles.exitIconBtn}>
              <MRIcon name="log-out" size={16} color={MRColors.dangerRose} />
            </Pressable>
          </View>
        </View>

        {/* ==================================================== */}
        {/* 2. SCROLLABLE ARCADE GAMEPLAY HUB */}
        {/* ==================================================== */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HERO ARCADE SIGNBOARD LOGO */}
          <View style={styles.heroSignboard}>
            <LinearGradient
              colors={['#16243A', '#0D1F34', '#07111F']}
              style={styles.signboardInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* Corner Glowing Rivets */}
              <View style={[styles.rivet, styles.rivetTL]} />
              <View style={[styles.rivet, styles.rivetTR]} />
              <View style={[styles.rivet, styles.rivetBL]} />
              <View style={[styles.rivet, styles.rivetBR]} />

              <View style={styles.arcadeBadge}>
                <MRIcon name="zap" size={10} color={MRColors.yellowStatus} />
                <Text style={styles.arcadeBadgeText}>CYBER BRAIN ARCADE</Text>
              </View>

              <View style={styles.titleRow}>
                <Text style={styles.titleMain}>MEMORY</Text>
                <Text style={styles.titleRush}>RUSH</Text>
              </View>

              <Text style={styles.taglineText}>
                REMEMBER FASTER • THINK QUICKER • BEAT YOUR BEST
              </Text>

              {/* Floating Decorative 3D Number Halos */}
              <View style={[styles.floatingNumHalo, styles.haloLeft]}>
                <Text style={styles.haloNum}>7</Text>
              </View>
              <View style={[styles.floatingNumHalo, styles.haloRight]}>
                <Text style={[styles.haloNum, { color: MRColors.yellowStatus }]}>4</Text>
              </View>
            </LinearGradient>
          </View>

          {/* ACTIVE MODE HERO STAGE (Massive 2.5D CTA Action) */}
          <GlassCard glowing style={styles.heroActionCard}>
            <View style={styles.activeModeRow}>
              <View style={styles.activeModeIndicator}>
                <View style={styles.greenPulseDot} />
                <Text style={styles.activeModeLabel}>ACTIVE MODE:</Text>
                <Text style={styles.activeModeValue}>{getModeTitle()}</Text>
              </View>
              <Pressable onPress={() => onNavigate('modes')} style={styles.changeModeLink}>
                <Text style={styles.changeModeText}>CHANGE ›</Text>
              </Pressable>
            </View>

            {/* Dominant 2.5D Arcade PLAY NOW Button */}
            <View style={styles.playNowWrapper}>
              <PrimaryButton
                title="PLAY NOW →"
                size="lg"
                variant="gold"
                onPress={onStartGame}
              />
            </View>
          </GlassCard>

          {/* QUICK STATS METERS (3 Chunky Arcade Metric Displays) */}
          <View style={styles.quickStatsRow}>
            <LinearGradient
              colors={['#16243A', '#0D1F34']}
              style={styles.statMeterCard}
            >
              <MRIcon name="star" size={16} color={MRColors.yellowStatus} />
              <Text style={styles.statMeterLabel}>BEST SCORE</Text>
              <Text style={styles.statMeterValYellow}>{playerStats.bestScore.toLocaleString()}</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#16243A', '#0D1F34']}
              style={styles.statMeterCard}
            >
              <MRIcon name="flame" size={16} color={MRColors.yellowStatus} />
              <Text style={styles.statMeterLabel}>BEST STREAK</Text>
              <Text style={styles.statMeterValWhite}>×{playerStats.bestStreak}</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#16243A', '#0D1F34']}
              style={styles.statMeterCard}
            >
              <MRIcon name="target" size={16} color={MRColors.successGreen} />
              <Text style={styles.statMeterLabel}>ACCURACY</Text>
              <Text style={styles.statMeterValYellow}>{playerStats.accuracy}%</Text>
            </LinearGradient>
          </View>

          {/* QUICK MODE LAUNCHER (Direct Jump to 5 Modes) */}
          <View style={styles.modesSection}>
            <View style={styles.sectionHeaderRow}>
              <MRIcon name="grid" size={16} color={MRColors.yellowStatus} />
              <Text style={styles.sectionHeaderTitle}>QUICK MODE SELECT</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeCardsScroll}>
              {GAME_MODES.map((m) => {
                const isSelected = mode === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => handleQuickPlayMode(m.id as GameMode)}
                    style={({ pressed }) => [
                      styles.modeMiniCard,
                      isSelected && styles.modeMiniCardSelected,
                      pressed && styles.cardPressed,
                    ]}
                  >
                    <View style={styles.modeMiniHeader}>
                      <Text style={[styles.modeMiniTitle, isSelected && styles.modeMiniTitleSelected]}>
                        {m.title.toUpperCase()}
                      </Text>
                      {isSelected && (
                        <View style={styles.activeCheck}>
                          <Text style={styles.activeCheckText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.modeMiniDesc}>{m.desc}</Text>
                    <View style={styles.modePlayRow}>
                      <Text style={styles.modePlayBtnText}>RUSH ›</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* DAILY CHALLENGE ARCADE BANNER */}
          <LinearGradient
            colors={['#1A2C46', '#0E1D30', '#07111F']}
            style={styles.dailyBanner}
          >
            <View style={styles.dailyLeftCol}>
              <View style={styles.dailyBadgePill}>
                <MRIcon name="star" size={12} color={MRColors.yellowStatus} />
                <Text style={styles.dailyBadgeText}>DAILY MEMORY RUSH</Text>
              </View>
              <Text style={styles.dailyTitle}>10 ROUNDS • ONE ATTEMPT</Text>
              <Text style={styles.dailyRewardText}>★ +500 XP SPECIAL REWARD</Text>
            </View>

            <Pressable
              onPress={() => onNavigate('daily')}
              style={({ pressed }) => [
                styles.dailyPlayBtn,
                pressed && styles.cardPressed,
              ]}
            >
              <LinearGradient
                colors={['#FFD83D', '#EAB308', '#CA8A04']}
                style={styles.dailyPlayGradient}
              >
                <Text style={styles.dailyPlayBtnText}>PLAY →</Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* 3. FLOATING GLASS BOTTOM NAVIGATION */}
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
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  playerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 27, 43, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(77, 231, 255, 0.3)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 12,
    gap: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16243A',
    borderWidth: 1.2,
    borderColor: MRColors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInfoCol: {
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 0.5,
  },
  levelProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  levelText: {
    fontSize: 9,
    fontWeight: '800',
    color: MRColors.yellowStatus,
  },
  miniProgressTrack: {
    width: 44,
    height: 4,
    backgroundColor: '#07111F',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: MRColors.primaryCyan,
  },
  rightStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hudStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 27, 43, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 5,
  },
  hudStatValue: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.textPrimary,
  },
  hudIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(16, 27, 43, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(77, 231, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 94, 108, 0.15)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 94, 108, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  heroSignboard: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 216, 61, 0.4)',
    shadowColor: MRColors.yellowStatus,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  signboardInner: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  rivet: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B28704',
    borderWidth: 1,
    borderColor: '#FFF59D',
  },
  rivetTL: { top: 8, left: 8 },
  rivetTR: { top: 8, right: 8 },
  rivetBL: { bottom: 8, left: 8 },
  rivetBR: { bottom: 8, right: 8 },
  arcadeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 216, 61, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.4)',
    marginBottom: 6,
  },
  arcadeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  titleMain: {
    fontSize: 34,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 3,
  },
  titleRush: {
    fontSize: 40,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 4,
    textShadowColor: MRColors.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  taglineText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: MRColors.textSecondary,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  floatingNumHalo: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 216, 61, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloLeft: {
    top: 24,
    left: 16,
  },
  haloRight: {
    top: 24,
    right: 16,
  },
  haloNum: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.yellowStatus,
  },
  heroActionCard: {
    padding: 16,
  },
  activeModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activeModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MRColors.successGreen,
    shadowColor: MRColors.successGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  activeModeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: MRColors.textMuted,
    letterSpacing: 1,
  },
  activeModeValue: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1,
  },
  changeModeLink: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 216, 61, 0.15)',
  },
  changeModeText: {
    fontSize: 10,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1,
  },
  playNowWrapper: {
    width: '100%',
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statMeterCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 216, 61, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 3,
  },
  statMeterLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: MRColors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  statMeterValCyan: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.yellowStatus,
  },
  statMeterValWhite: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.textPrimary,
  },
  statMeterValYellow: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.yellowStatus,
  },
  modesSection: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.textSecondary,
    letterSpacing: 1.5,
  },
  modeCardsScroll: {
    gap: 10,
    paddingRight: 16,
  },
  modeMiniCard: {
    width: 140,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 27, 43, 0.90)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 12,
    justifyContent: 'space-between',
  },
  modeMiniCardSelected: {
    borderColor: MRColors.yellowStatus,
    backgroundColor: 'rgba(22, 36, 58, 0.95)',
  },
  modeMiniHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeMiniTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 0.5,
  },
  modeMiniTitleSelected: {
    color: MRColors.yellowStatus,
  },
  activeCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: MRColors.yellowStatus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCheckText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#040B16',
  },
  modeMiniDesc: {
    fontSize: 9.5,
    color: MRColors.textSecondary,
    fontWeight: '700',
    marginVertical: 8,
    lineHeight: 13,
  },
  modePlayRow: {
    alignSelf: 'flex-start',
  },
  modePlayBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1,
  },
  dailyBanner: {
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 216, 61, 0.35)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyLeftCol: {
    flex: 1,
    paddingRight: 10,
  },
  dailyBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 216, 61, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.35)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  dailyBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1,
  },
  dailyTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 0.5,
  },
  dailyRewardText: {
    fontSize: 10,
    fontWeight: '800',
    color: MRColors.primaryCyan,
    marginTop: 3,
  },
  dailyPlayBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  dailyPlayGradient: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyPlayBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#040B16',
    letterSpacing: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.95 }],
  },
});
