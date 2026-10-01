// ============================================================
// MEMORY RUSH — 02 Home Screen (Jungle Adventure Temple Hub)
// Features Cropped Sculpted HOME Plaque, 3D PLAY NOW Button & Explorer
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
import * as Haptics from 'expo-haptics';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { JungleScreenPlaque } from '../components/JungleScreenPlaque';
import { JungleImageButton } from '../components/JungleImageButton';
import { ExplorerCompanion } from '../components/ExplorerCompanion';
import { JungleButton } from '../components/JungleButton';
import { WoodPanel } from '../components/WoodPanel';
import { BottomTabBar } from '../components/BottomTabBar';
import { MRIcon } from '../components/MRIcon';
import { MRColors } from '../constants/colors';
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
    setShowExitModal,
    mode,
    setMode,
    dailyChallenge,
  } = useMemoryRushStore();

  const handleQuickPlayMode = (modeId: GameMode) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
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
    <JungleWorldBackground variant="home">
      <View style={styles.container}>
        {/* ==================================================== */}
        {/* 1. TOP PLAYER HUD (Carved Stone Tablet Header) */}
        {/* ==================================================== */}
        <View style={styles.topHud}>
          {/* Left Player Profile Pill */}
          <Pressable
            onPress={() => onNavigate('stats')}
            style={styles.playerPill}
            accessibilityLabel="Player Profile"
          >
            <View style={styles.avatarCircle}>
              <ExplorerCompanion pose="thumbs_up" size={30} />
            </View>
            <View style={styles.playerInfoCol}>
              <Text style={styles.playerName}>EXPLORER</Text>
              <Text style={styles.levelText}>
                LVL {Math.max(1, Math.floor((playerStats.bestScore || 0) / 300))}
              </Text>
            </View>
          </Pressable>

          {/* Right Stats & Action Icons */}
          <View style={styles.rightStatsRow}>
            {/* Streak Flame Badge */}
            <View style={styles.hudStatPill}>
              <MRIcon name="flame" size={15} color="#FF9800" />
              <Text style={styles.hudStatValue}>{playerStats.bestStreak || 0}</Text>
            </View>

            {/* Best Score Star Badge */}
            <View style={styles.hudStatPill}>
              <MRIcon name="star" size={15} color="#FFD700" />
              <Text style={styles.hudStatValue}>
                {(playerStats.bestScore || 0).toLocaleString()}
              </Text>
            </View>

            {/* Settings Gear */}
            <Pressable
              onPress={() => onNavigate('settings')}
              style={styles.hudIconBtn}
              accessibilityLabel="Settings"
            >
              <MRIcon name="settings" size={16} color="#E2CA92" />
            </Pressable>

            {/* Exit Altar Button */}
            <Pressable
              onPress={() => setShowExitModal(true)}
              style={styles.exitIconBtn}
              accessibilityLabel="Exit Temple"
            >
              <MRIcon name="log-out" size={16} color="#EF4444" />
            </Pressable>
          </View>
        </View>

        {/* ==================================================== */}
        {/* 2. SCROLLABLE JUNGLE ADVENTURE CONTENT */}
        {/* ==================================================== */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SCULPTED 3D HOME TITLE PLAQUE WITH EXPLORER */}
          <View style={styles.heroPlaqueWrapper}>
            <JungleScreenPlaque type="home" height={175} />
            <Text style={styles.tagline}>
              REMEMBER FASTER • THINK QUICKER • BEAT YOUR BEST
            </Text>
          </View>

          {/* PRIMARY HERO CTA: CROPPED 3D PLAY NOW BUTTON */}
          <View style={styles.primaryActionSection}>
            <JungleImageButton
              type="play_now"
              height={86}
              zoom={1.08}
              onPress={onStartGame}
            />
            <Text style={styles.activeModeCaption}>ACTIVE MODE: {getModeTitle()}</Text>
          </View>

          {/* 3 CARVED STONE STAT TABLETS */}
          <View style={styles.statsRow}>
            {/* Best Score Tablet */}
            <View style={styles.statTablet}>
              <LinearGradient
                colors={['#4E5E6E', '#2D3844']}
                style={styles.statTabletSurface}
              >
                <View style={styles.statIconBox}>
                  <MRIcon name="trophy" size={20} color="#FFD700" />
                </View>
                <Text style={styles.statNumber}>
                  {(playerStats.bestScore || 0).toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>BEST SCORE</Text>
              </LinearGradient>
            </View>

            {/* Max Streak Tablet */}
            <View style={styles.statTablet}>
              <LinearGradient
                colors={['#4E5E6E', '#2D3844']}
                style={styles.statTabletSurface}
              >
                <View style={styles.statIconBox}>
                  <MRIcon name="zap" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.statNumber}>{playerStats.bestStreak || 0}×</Text>
                <Text style={styles.statLabel}>BEST STREAK</Text>
              </LinearGradient>
            </View>

            {/* Accuracy Tablet */}
            <View style={styles.statTablet}>
              <LinearGradient
                colors={['#4E5E6E', '#2D3844']}
                style={styles.statTabletSurface}
              >
                <View style={styles.statIconBox}>
                  <MRIcon name="target" size={20} color="#10B981" />
                </View>
                <Text style={styles.statNumber}>{playerStats.accuracy || 92}%</Text>
                <Text style={styles.statLabel}>ACCURACY</Text>
              </LinearGradient>
            </View>
          </View>

          {/* DAILY CHALLENGE REWARD PANEL WITH 3D EXPLORER ON CHEST */}
          <WoodPanel variant="sign" style={styles.dailyPanel}>
            <View style={styles.dailyRow}>
              <View style={styles.dailyMascotBox}>
                <ExplorerCompanion pose="treasure_chest" size={54} />
              </View>

              <View style={styles.dailyInfo}>
                <View style={styles.dailyBadge}>
                  <Text style={styles.dailyBadgeText}>DAILY SHRINE</Text>
                </View>
                <Text style={styles.dailyTitle}>Jungle Memory Trial</Text>
                <Text style={styles.dailySub}>
                  {dailyChallenge?.completed ? '✅ Challenge Completed!' : 'Solve today’s puzzle for +250 XP & Gems'}
                </Text>
              </View>

              <Pressable
                onPress={() => onNavigate('daily')}
                style={styles.dailyGoBtn}
                accessibilityLabel="Open Daily Challenge"
              >
                <Text style={styles.dailyGoText}>GO ▶</Text>
              </Pressable>
            </View>
          </WoodPanel>

          {/* EXPLORE MODES SHORTCUT BUTTON */}
          <View style={styles.modeShortcutRow}>
            <JungleButton
              title="CHOOSE CHALLENGE MODE 📜"
              size="md"
              variant="wood"
              onPress={() => onNavigate('mode_select' as any)}
            />
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* 3. CARVED STONE BOTTOM NAVIGATION */}
        <BottomTabBar currentScreen="home" onNavigate={onNavigate} />
      </View>
    </JungleWorldBackground>
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
    paddingBottom: 6,
    zIndex: 10,
  },
  playerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 40, 30, 0.92)',
    borderWidth: 1.5,
    borderColor: '#718496',
    borderRadius: 22,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3E2510',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playerInfoCol: {
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 0.8,
  },
  levelText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFD700',
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
    backgroundColor: 'rgba(26, 40, 30, 0.92)',
    borderWidth: 1.5,
    borderColor: '#546A58',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  hudStatValue: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFF8E7',
  },
  hudIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(26, 40, 30, 0.92)',
    borderWidth: 1.5,
    borderColor: '#546A58',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(80, 20, 20, 0.85)',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
    gap: 12,
  },
  heroPlaqueWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  tagline: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFF8E7',
    letterSpacing: 1.2,
    marginTop: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  primaryActionSection: {
    width: '100%',
    alignItems: 'center',
  },
  activeModeCaption: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 2,
  },
  statTablet: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#141C24',
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 5,
  },
  statTabletSurface: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#687C8E',
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#CAD8E6',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  dailyPanel: {
    marginTop: 2,
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dailyMascotBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#261204',
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dailyInfo: {
    flex: 1,
  },
  dailyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    marginBottom: 4,
  },
  dailyBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
  },
  dailyTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 0.5,
  },
  dailySub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E2CA92',
    marginTop: 2,
  },
  dailyGoBtn: {
    backgroundColor: '#FFD700',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#FFF8E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
  },
  dailyGoText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#3B1E00',
  },
  modeShortcutRow: {
    width: '100%',
    marginTop: 2,
  },
});
