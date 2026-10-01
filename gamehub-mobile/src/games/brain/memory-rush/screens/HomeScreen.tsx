// ============================================================
// MEMORY RUSH — 02 Home Screen Game Hub
// (Clean, Cohesive Arcade Style matching Number Rush & Reverse Mind)
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
import { PrimaryButton } from '../components/PrimaryButton';
import { BottomTabBar } from '../components/BottomTabBar';
import { MRIcon } from '../components/MRIcon';
import { MRColors } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';
import type { AppNavScreen, GameMode } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 44) / 2;

interface HomeScreenProps {
  onStartGame: () => void;
  onNavigate: (screen: AppNavScreen) => void;
}

interface ModeCardDef {
  id: GameMode;
  title: string;
  desc: string;
  icon: string;
  color: string;
  glowBg: string;
}

const CORE_MODES: ModeCardDef[] = [
  {
    id: 'memoryGrid',
    title: 'Memory Grid',
    desc: 'Remember tile spots & recall target',
    icon: 'grid',
    color: '#4DE7FF',
    glowBg: 'rgba(77, 231, 255, 0.15)',
  },
  {
    id: 'sequenceRush',
    title: 'Sequence Rush',
    desc: 'Remember order & tap in sequence',
    icon: 'hash',
    color: '#FFD83D',
    glowBg: 'rgba(255, 216, 61, 0.15)',
  },
  {
    id: 'numberShift',
    title: 'Number Shift',
    desc: 'Spot which number changed mutation',
    icon: 'refresh-cw',
    color: '#FF5E6C',
    glowBg: 'rgba(255, 94, 108, 0.15)',
  },
  {
    id: 'missingNumber',
    title: 'Missing Number',
    desc: 'Find which number vanished from grid',
    icon: 'help-circle',
    color: '#57E389',
    glowBg: 'rgba(87, 227, 137, 0.15)',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onNavigate,
}) => {
  const {
    playerStats,
    setShowExitModal,
    mode,
    setMode,
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
        {/* 1. TOP PLAYER HUD BAR (Clean, Single Line) */}
        {/* ==================================================== */}
        <View style={styles.topHud}>
          {/* Left Player Profile Pill */}
          <Pressable onPress={() => onNavigate('stats')} style={styles.playerPill}>
            <View style={styles.avatarCircle}>
              <MRIcon name="user" size={16} color={MRColors.primaryGold} />
            </View>
            <View style={styles.playerInfoCol}>
              <Text style={styles.playerName}>PLAYER 01</Text>
              <Text style={styles.levelText}>
                LVL {Math.max(1, Math.floor((playerStats.bestScore || 0) / 300))}
              </Text>
            </View>
          </Pressable>

          {/* Right Stats & Action Icons */}
          <View style={styles.rightStatsRow}>
            {/* Streak Badge */}
            <View style={styles.hudStatPill}>
              <MRIcon name="flame" size={14} color="#FF9800" />
              <Text style={styles.hudStatValue}>{playerStats.bestStreak || 0}</Text>
            </View>

            {/* Best Score Badge */}
            <View style={styles.hudStatPill}>
              <MRIcon name="star" size={14} color={MRColors.primaryGold} />
              <Text style={styles.hudStatValue}>{(playerStats.bestScore || 0).toLocaleString()}</Text>
            </View>

            {/* Settings Gear */}
            <Pressable onPress={() => onNavigate('settings')} style={styles.hudIconBtn}>
              <MRIcon name="settings" size={16} color={MRColors.textSecondary} />
            </Pressable>

            {/* Exit Door */}
            <Pressable onPress={() => setShowExitModal(true)} style={styles.exitIconBtn}>
              <MRIcon name="log-out" size={16} color={MRColors.dangerRose} />
            </Pressable>
          </View>
        </View>

        {/* ==================================================== */}
        {/* 2. SCROLLABLE CLEAN ARCADE CONTENT */}
        {/* ==================================================== */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HERO ARCADE SIGNBOARD */}
          <View style={styles.heroSignboard}>
            <LinearGradient
              colors={['#16253C', '#0C1C30', '#07111F']}
              style={styles.signboardInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* Corner Rivets */}
              <View style={[styles.rivet, styles.rivetTL]} />
              <View style={[styles.rivet, styles.rivetTR]} />
              <View style={[styles.rivet, styles.rivetBL]} />
              <View style={[styles.rivet, styles.rivetBR]} />

              <View style={styles.arcadeBadge}>
                <MRIcon name="zap" size={10} color={MRColors.primaryGold} />
                <Text style={styles.arcadeBadgeText}>CYBER BRAIN ARCADE</Text>
              </View>

              <View style={styles.titleRow}>
                <Text style={styles.titleMain}>MEMORY</Text>
                <Text style={styles.titleRush}>RUSH</Text>
              </View>

              <Text style={styles.taglineText}>
                REMEMBER FASTER • THINK QUICKER • BEAT YOUR BEST
              </Text>
            </LinearGradient>
          </View>

          {/* ACTIVE MODE HERO STAGE (Dominant Single PLAY Action) */}
          <LinearGradient
            colors={['rgba(22, 37, 60, 0.92)', 'rgba(9, 20, 36, 0.96)']}
            style={styles.heroStageCard}
          >
            <View style={styles.activeModeRow}>
              <View style={styles.activeModeIndicator}>
                <View style={styles.pulseDot} />
                <Text style={styles.activeModeLabel}>READY TO PLAY:</Text>
                <Text style={styles.activeModeValue}>{getModeTitle()}</Text>
              </View>
              <Pressable onPress={() => onNavigate('difficulty')} style={styles.diffBadge}>
                <MRIcon name="zap" size={11} color={MRColors.primaryGold} />
                <Text style={styles.diffBadgeText}>DIFFICULTY ›</Text>
              </Pressable>
            </View>

            {/* Dominant 2.5D Arcade PLAY NOW Button */}
            <View style={styles.playNowWrapper}>
              <PrimaryButton
                title={`PLAY ${getModeTitle()} ▶`}
                size="lg"
                variant="gold"
                onPress={onStartGame}
              />
            </View>
          </LinearGradient>

          {/* 4 CORE GAME MODES (Balanced 2x2 Clean Grid) */}
          <View style={styles.modeSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <MRIcon name="grid" size={14} color={MRColors.primaryGold} />
                <Text style={styles.sectionHeaderTitle}>CHOOSE GAME MODE</Text>
              </View>
              <Text style={styles.sectionHeaderHint}>4 Brain Challenges</Text>
            </View>

            <View style={styles.modeGrid}>
              {CORE_MODES.map((m) => {
                const isActive = mode === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => handleQuickPlayMode(m.id)}
                    style={({ pressed }) => [
                      styles.modeCard,
                      pressed && styles.cardPressed,
                    ]}
                  >
                    <LinearGradient
                      colors={
                        isActive
                          ? ['rgba(24, 46, 76, 0.96)', 'rgba(10, 24, 44, 0.98)']
                          : ['rgba(15, 30, 52, 0.88)', 'rgba(7, 18, 32, 0.94)']
                      }
                      style={[
                        styles.modeCardGradient,
                        { borderColor: m.color },
                        isActive && styles.modeCardActiveBorder,
                      ]}
                    >
                      <View style={[styles.modeIconBox, { backgroundColor: m.glowBg }]}>
                        <MRIcon name={m.icon} size={22} color={m.color} />
                      </View>

                      <Text style={[styles.modeCardTitle, { color: m.color }]}>
                        {m.title.toUpperCase()}
                      </Text>

                      <Text style={styles.modeCardDesc} numberOfLines={2}>
                        {m.desc}
                      </Text>

                      <View style={styles.modeCardFooter}>
                        <View style={[styles.modePlayCircle, { backgroundColor: m.color }]}>
                          <Text style={styles.modePlayArrow}>▶</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ height: 85 }} />
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
    backgroundColor: 'rgba(16, 27, 43, 0.9)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 216, 61, 0.3)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 12,
    gap: 8,
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#16243A',
    borderWidth: 1.2,
    borderColor: MRColors.primaryGold,
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
  levelText: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.primaryGold,
    letterSpacing: 0.5,
  },
  rightStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hudStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 27, 43, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  hudStatValue: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.textPrimary,
  },
  hudIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 27, 43, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 94, 108, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 94, 108, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 14,
  },

  // Hero Signboard
  heroSignboard: {
    width: '100%',
    shadowColor: MRColors.primaryGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  signboardInner: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 216, 61, 0.35)',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: MRColors.primaryGold,
    opacity: 0.6,
  },
  rivetTL: { top: 8, left: 8 },
  rivetTR: { top: 8, right: 8 },
  rivetBL: { bottom: 8, left: 8 },
  rivetBR: { bottom: 8, right: 8 },
  arcadeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 216, 61, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.25)',
    marginBottom: 6,
  },
  arcadeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.primaryGold,
    letterSpacing: 1.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleMain: {
    fontSize: 28,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  titleRush: {
    fontSize: 28,
    fontWeight: '900',
    color: MRColors.primaryGold,
    letterSpacing: 2,
    textShadowColor: MRColors.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  taglineText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: MRColors.textSecondary,
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
  },

  // Hero Stage Card (Dominant Play Now)
  heroStageCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 216, 61, 0.3)',
    padding: 14,
    gap: 12,
    shadowColor: MRColors.primaryGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  activeModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MRColors.successGreen,
    shadowColor: MRColors.successGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  activeModeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: MRColors.textMuted,
    letterSpacing: 1,
  },
  activeModeValue: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.primaryGold,
    letterSpacing: 1,
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 216, 61, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  diffBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: MRColors.primaryGold,
    letterSpacing: 0.8,
  },
  playNowWrapper: {
    width: '100%',
  },

  // 2x2 Core Modes Grid
  modeSection: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1.5,
  },
  sectionHeaderHint: {
    fontSize: 10,
    fontWeight: '700',
    color: MRColors.textMuted,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  modeCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  modeCardGradient: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  modeCardActiveBorder: {
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  modeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modeCardTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  modeCardDesc: {
    fontSize: 10,
    fontWeight: '600',
    color: MRColors.textSecondary,
    lineHeight: 14,
    flex: 1,
  },
  modeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  modePlayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modePlayArrow: {
    fontSize: 10,
    fontWeight: '900',
    color: '#07111F',
    marginLeft: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
