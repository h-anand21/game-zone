// ============================================================
// AIM RUSH — Screen 03: HomeScreen
// Recreated from "Neon Aim Rush Game Hub.png" reference design
// 100% SVG Vector Icons, Medium Title, and Safe Area insets
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { GAME_MODES } from '../config';
import { GameModeConfig, AimRushUserProfile } from '../types';
import {
  SvgBackArrow,
  SvgUserAvatar,
  SvgStatsBarChart,
  SvgTrophy,
  SvgSettingsGear,
  SvgCrown,
  SvgChainLink,
  SvgBullseyeTarget,
  SvgPlayTriangle,
  SvgLightningFlash,
  SvgStar,
  SvgCalendar,
  SvgBook,
  SvgPodium,
  SvgMedal,
} from '../components/icons/AimRushIcons';

interface HomeScreenProps {
  profile: AimRushUserProfile;
  selectedMode: GameModeConfig;
  onSelectMode: (mode: GameModeConfig) => void;
  onStartGame: () => void;
  onOpenModes: () => void;
  onOpenHowToPlay: () => void;
  onOpenMissions: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onExitToHub: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  selectedMode,
  onSelectMode,
  onStartGame,
  onOpenModes,
  onOpenHowToPlay,
  onOpenMissions,
  onOpenStats,
  onOpenSettings,
  onExitToHub,
}) => {
  const insets = useSafeAreaInsets();
  const modesList = Object.values(GAME_MODES);

  return (
    <BackgroundLayer screen="home" overlayDarkness={0.25}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(12, insets.top + 6),
            paddingBottom: Math.max(16, insets.bottom + 8),
          },
        ]}
      >
        {/* 1. TOP HEADER (PLAYER PROFILE + QUICK SVG ICONS) */}
        <View style={styles.topHeader}>
          {/* Left: Player Profile Capsule */}
          <View style={styles.profileCapsule}>
            <Pressable style={styles.exitBackBtn} onPress={onExitToHub}>
              <SvgBackArrow size={16} color={ARColors.white} />
            </Pressable>
            <View style={styles.avatarCircle}>
              <SvgUserAvatar size={18} color={ARColors.cyan} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.playerName}>EXPLORER</Text>
              <View style={styles.levelRow}>
                <Text style={styles.levelText}>Lv. {Math.max(1, Math.floor(profile.totalTargetsHit / 50) + 1)}</Text>
                <View style={styles.xpTrack}>
                  <View
                    style={[
                      styles.xpFill,
                      { width: `${(profile.totalTargetsHit % 50) * 2}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Right: Quick Action Hub Icons */}
          <View style={styles.headerIconsRow}>
            {/* Stats */}
            <Pressable style={styles.headerIconBtn} onPress={onOpenStats}>
              <SvgStatsBarChart size={18} color={ARColors.white} />
              <Text style={styles.iconMiniLabel}>STATS</Text>
            </Pressable>

            {/* Missions */}
            <Pressable style={styles.headerIconBtn} onPress={onOpenMissions}>
              <SvgTrophy size={18} color={ARColors.gold} />
              <View style={styles.notificationDot} />
              <Text style={styles.iconMiniLabel}>MISSIONS</Text>
            </Pressable>

            {/* Settings */}
            <Pressable style={styles.headerIconBtn} onPress={onOpenSettings}>
              <SvgSettingsGear size={18} color={ARColors.white} />
              <Text style={styles.iconMiniLabel}>SETTINGS</Text>
            </Pressable>
          </View>
        </View>

        {/* 2. CENTER BRANDING & RETICLE HERO (PERFECTLY CENTERED IN MOBILE MIDDLE & ENLARGED) */}
        <View style={styles.centerHeroSection}>
          <View style={styles.reticleWrapper}>
            {/* High-Tech Cyber Reticle Targeting Vector */}
            <Svg width={250} height={210} viewBox="0 0 250 210" style={styles.reticleSvg}>
              {/* Outer HUD Corner Brackets */}
              <Path d="M 32 46 L 32 26 L 52 26" stroke={ARColors.cyan} strokeWidth={2.4} fill="none" opacity={0.75} />
              <Path d="M 218 46 L 218 26 L 198 26" stroke={ARColors.cyan} strokeWidth={2.4} fill="none" opacity={0.75} />
              <Path d="M 32 164 L 32 184 L 52 184" stroke={ARColors.cyan} strokeWidth={2.4} fill="none" opacity={0.75} />
              <Path d="M 218 164 L 218 184 L 198 184" stroke={ARColors.cyan} strokeWidth={2.4} fill="none" opacity={0.75} />

              {/* Outer Calibrated Reticle Ring */}
              <Circle cx={125} cy={105} r={92} stroke={ARColors.cyan} strokeWidth={1.4} strokeDasharray="6 4" fill="none" opacity={0.4} />

              {/* Main Concentric Aim Ring */}
              <Circle cx={125} cy={105} r={70} stroke={ARColors.cyan} strokeWidth={2.2} fill="none" opacity={0.85} />

              {/* Inner Sweet-Spot Ring (Lime) */}
              <Circle cx={125} cy={105} r={44} stroke={ARColors.lime} strokeWidth={1.8} strokeDasharray="5 3" fill="none" opacity={0.8} />

              {/* Bullseye Core */}
              <Circle cx={125} cy={105} r={6} fill={ARColors.cyan} opacity={0.9} />
              <Circle cx={125} cy={105} r={2.5} fill="#FFFFFF" />

              {/* Primary Crosshairs with Gap */}
              <Line x1={15} y1={105} x2={52} y2={105} stroke={ARColors.cyan} strokeWidth={2} opacity={0.8} />
              <Line x1={198} y1={105} x2={235} y2={105} stroke={ARColors.cyan} strokeWidth={2} opacity={0.8} />
              <Line x1={125} y1={12} x2={125} y2={45} stroke={ARColors.cyan} strokeWidth={2} opacity={0.8} />
              <Line x1={125} y1={165} x2={125} y2={198} stroke={ARColors.cyan} strokeWidth={2} opacity={0.8} />

              {/* 45-degree Precision Notch Ticks */}
              <Line x1={60} y1={50} x2={69} y2={59} stroke={ARColors.lime} strokeWidth={1.6} opacity={0.65} />
              <Line x1={190} y1={50} x2={181} y2={59} stroke={ARColors.lime} strokeWidth={1.6} opacity={0.65} />
              <Line x1={60} y1={160} x2={69} y2={151} stroke={ARColors.lime} strokeWidth={1.6} opacity={0.65} />
              <Line x1={190} y1={160} x2={181} y2={151} stroke={ARColors.lime} strokeWidth={1.6} opacity={0.65} />
            </Svg>

            {/* Centered Brand Typography */}
            <View style={styles.brandingContent}>
              <View style={styles.systemBadge}>
                <View style={styles.systemDot} />
                <Text style={styles.systemBadgeText}>PRECISION REFLEX ARENA</Text>
              </View>

              <Text style={styles.masterTitle}>AIM RUSH</Text>

              <View style={styles.subtitleCapsule}>
                <Text style={styles.masterSubtitle}>— TARGET CHAIN —</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. TELEMETRY STATS ROW (3 CHAMFERED CARDS WITH SVG ICONS) */}
        <View style={styles.telemetryRow}>
          {/* Card 1: Personal Best */}
          <View style={styles.telemetryCard}>
            <View style={styles.cardIconRow}>
              <SvgCrown size={14} color={ARColors.gold} />
              <Text style={styles.cardHeaderLabel}>PERSONAL BEST</Text>
            </View>
            <Text style={[styles.cardMainValue, { color: ARColors.cyan }]}>
              {profile.personalBestScore}
            </Text>
          </View>

          {/* Card 2: Best Chain */}
          <View style={styles.telemetryCard}>
            <View style={styles.cardIconRow}>
              <SvgChainLink size={14} color={ARColors.lime} />
              <Text style={styles.cardHeaderLabel}>BEST CHAIN</Text>
            </View>
            <Text style={[styles.cardMainValue, { color: ARColors.lime }]}>
              ×{profile.bestChain.toString().padStart(2, '0')}
            </Text>
          </View>

          {/* Card 3: Perfect Hits */}
          <View style={styles.telemetryCard}>
            <View style={styles.cardIconRow}>
              <SvgBullseyeTarget size={14} color={ARColors.cyan} />
              <Text style={styles.cardHeaderLabel}>PERFECT HITS</Text>
            </View>
            <Text style={[styles.cardMainValue, { color: ARColors.white }]}>
              {profile.totalPerfects}
            </Text>
          </View>
        </View>

        {/* 4. MASTER PLAY BUTTON (GLOWING HEX-CHAMFER CTA WITH SVG TRIANGLE) */}
        <Pressable
          style={styles.masterPlayBtn}
          onPress={onStartGame}
          accessibilityRole="button"
          accessibilityLabel="Start Game"
        >
          <View style={styles.playContent}>
            <SvgPlayTriangle size={26} color="#07090C" />
            <Text style={styles.playBtnText}>PLAY</Text>
          </View>
          <Text style={styles.playSubtext}>TOUCH TO START</Text>
        </Pressable>

        {/* 5. ARENA MODES ROW (4 ROUNDED CARDS WITH SVG ICONS) */}
        <View style={styles.modesRow}>
          {modesList.map((m) => {
            const isEquipped = m.id === selectedMode.id;
            const iconColor = isEquipped ? m.color : ARColors.textMuted;

            return (
              <Pressable
                key={m.id}
                style={[
                  styles.modeCard,
                  isEquipped && [
                    styles.modeCardActive,
                    { borderColor: m.color, shadowColor: m.color },
                  ],
                ]}
                onPress={() => onSelectMode(m)}
              >
                {m.id === 'classic' && <SvgBullseyeTarget size={20} color={iconColor} />}
                {m.id === 'rush' && <SvgLightningFlash size={20} color={iconColor} />}
                {m.id === 'precision' && <SvgStar size={20} color={iconColor} />}
                {m.id === 'daily' && <SvgCalendar size={20} color={iconColor} />}

                <Text style={[styles.modeCardTitle, isEquipped && { color: m.color }]}>
                  {m.title}
                </Text>
                <Text style={styles.modeCardSub}>{m.badge}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* 6. BOTTOM UTILITIES BAR (SAFELY ELEVATED ABOVE DEVICE NAV WITH SVG ICONS) */}
        <View style={styles.bottomUtilities}>
          <Pressable style={styles.utilityPill} onPress={onOpenHowToPlay}>
            <SvgBook size={15} color={ARColors.cyan} />
            <Text style={styles.utilityText}>HOW TO PLAY</Text>
          </Pressable>

          <Pressable style={styles.utilityPill} onPress={onOpenStats}>
            <SvgPodium size={15} color={ARColors.lime} />
            <Text style={styles.utilityText}>LEADERBOARD</Text>
          </Pressable>

          <Pressable style={styles.utilityPill} onPress={onOpenMissions}>
            <SvgMedal size={15} color={ARColors.gold} />
            <Text style={styles.utilityText}>ACHIEVEMENTS</Text>
          </Pressable>
        </View>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },

  // 1. Top Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  profileCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exitBackBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(53, 231, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 11,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  levelText: {
    fontSize: 9,
    fontWeight: '800',
    color: ARColors.cyan,
  },
  xpTrack: {
    width: 52,
    height: 4,
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: ARColors.cyan,
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconMiniLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: ARColors.textMuted,
    marginTop: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ARColors.red,
  },

  // 2. Center Hero Section (True Optical Middle of Mobile Screen)
  centerHeroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
  },
  reticleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  reticleSvg: {
    position: 'absolute',
    alignSelf: 'center',
  },
  brandingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 12,
  },
  systemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(53, 231, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(53, 231, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
  },
  systemDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: ARColors.lime,
  },
  systemBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 1.6,
  },
  masterTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 4,
    fontStyle: 'italic',
    textShadowColor: ARColors.cyan,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 16,
    textAlign: 'center',
  },
  subtitleCapsule: {
    backgroundColor: 'rgba(7, 12, 18, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(200, 255, 77, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  masterSubtitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: ARColors.lime,
    letterSpacing: 2.8,
  },

  // 3. Telemetry Row
  telemetryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  telemetryCard: {
    flex: 1,
    backgroundColor: 'rgba(11, 18, 28, 0.88)',
    borderWidth: 1.2,
    borderColor: 'rgba(53, 231, 255, 0.35)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  cardIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  cardHeaderLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 0.8,
  },
  cardMainValue: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // 4. Master Play CTA Button
  masterPlayBtn: {
    width: '100%',
    height: 62,
    backgroundColor: ARColors.cyan,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ARColors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
    marginBottom: 12,
  },
  playContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playBtnText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 3,
    fontStyle: 'italic',
  },
  playSubtext: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 2,
    opacity: 0.85,
    marginTop: -2,
  },

  // 5. Modes Row
  modesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 3,
  },
  modeCardActive: {
    borderWidth: 1.8,
    backgroundColor: 'rgba(15, 25, 38, 0.95)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  modeCardTitle: {
    fontSize: 9.5,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  modeCardSub: {
    fontSize: 7.5,
    fontWeight: '700',
    color: ARColors.textMuted,
    textAlign: 'center',
  },

  // 6. Bottom Utilities Bar
  bottomUtilities: {
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  utilityPill: {
    flex: 1,
    height: 40,
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  utilityText: {
    fontSize: 9,
    fontWeight: '800',
    color: ARColors.white,
    letterSpacing: 0.5,
  },
});
