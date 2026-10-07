// ============================================================
// AIM RUSH — Screen 03: HomeScreen
// Hero target, personal telemetry, mode selector, and instant launch
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { GameModeConfig, AimRushUserProfile } from '../types';

interface HomeScreenProps {
  profile: AimRushUserProfile;
  selectedMode: GameModeConfig;
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
  onStartGame,
  onOpenModes,
  onOpenHowToPlay,
  onOpenMissions,
  onOpenStats,
  onOpenSettings,
  onExitToHub,
}) => {
  return (
    <BackgroundLayer screen="home" overlayDarkness={0.32}>
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <Pressable
            style={styles.iconCircle}
            onPress={onExitToHub}
            accessibilityRole="button"
            accessibilityLabel="Exit to GameHub"
          >
            <Ionicons name="arrow-back" size={20} color={ARColors.white} />
          </Pressable>

          <View style={styles.topRightGroup}>
            <Pressable
              style={styles.iconCircle}
              onPress={onOpenSettings}
              accessibilityRole="button"
              accessibilityLabel="Settings"
            >
              <Ionicons name="settings-sharp" size={20} color={ARColors.white} />
            </Pressable>
          </View>
        </View>

        {/* Center Hero Identity */}
        <View style={styles.heroSection}>
          {/* Hero Target Emblem */}
          <View style={styles.targetEmblem}>
            <Svg width={130} height={130} viewBox="0 0 130 130">
              <Defs>
                <RadialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={ARColors.cyan} stopOpacity="0.4" />
                  <Stop offset="100%" stopColor={ARColors.cyan} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle cx={65} cy={65} r={60} fill="url(#heroGlow)" />
              <Circle cx={65} cy={65} r={56} stroke={ARColors.cyan} strokeWidth={2.5} fill="none" strokeDasharray="8, 6" />
              <Circle cx={65} cy={65} r={36} stroke={ARColors.lime} strokeWidth={2} fill="none" />
              <Circle cx={65} cy={65} r={16} stroke={ARColors.white} strokeWidth={1.5} fill="none" />
              <Circle cx={65} cy={65} r={5} fill={ARColors.cyan} />
              <Line x1={5} y1={65} x2={22} y2={65} stroke={ARColors.cyan} strokeWidth={2} />
              <Line x1={108} y1={65} x2={125} y2={65} stroke={ARColors.cyan} strokeWidth={2} />
              <Line x1={65} y1={5} x2={65} y2={22} stroke={ARColors.cyan} strokeWidth={2} />
              <Line x1={65} y1={108} x2={65} y2={125} stroke={ARColors.cyan} strokeWidth={2} />
            </Svg>
          </View>

          <Text style={styles.titleText}>AIM RUSH</Text>
          <Text style={styles.subtitleText}>✦ TARGET CHAIN ✦</Text>

          {/* Telemetry Record Capsule */}
          <View style={styles.recordCapsule}>
            <View style={styles.recordItem}>
              <Text style={styles.recordLabel}>PERSONAL BEST</Text>
              <Text style={styles.recordValue}>{profile.personalBestScore}</Text>
            </View>
            <View style={styles.recordDivider} />
            <View style={styles.recordItem}>
              <Text style={styles.recordLabel}>MAX CHAIN</Text>
              <Text style={[styles.recordValue, { color: ARColors.lime }]}>
                ×{profile.bestChain.toString().padStart(2, '0')}
              </Text>
            </View>
          </View>

          {/* Current Selected Mode Preview */}
          <Pressable style={styles.modePill} onPress={onOpenModes}>
            <Text style={styles.modePillPrefix}>ACTIVE MODE:</Text>
            <Text style={[styles.modePillTitle, { color: selectedMode.color }]}>
              {selectedMode.title}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={ARColors.cyan} />
          </Pressable>
        </View>

        {/* Bottom Interactive Area */}
        <View style={styles.bottomSection}>
          {/* Main Hero Launch CTA */}
          <Pressable
            style={styles.launchButton}
            onPress={onStartGame}
            accessibilityRole="button"
            accessibilityLabel="Enter Arena"
          >
            <Text style={styles.launchButtonText}>ENTER ARENA ▶</Text>
          </Pressable>

          {/* Secondary Action Grid */}
          <View style={styles.navRow}>
            <Pressable style={styles.navBtn} onPress={onOpenModes}>
              <Ionicons name="game-controller-outline" size={16} color={ARColors.cyan} />
              <Text style={styles.navBtnText}>MODES</Text>
            </Pressable>

            <Pressable style={styles.navBtn} onPress={onOpenHowToPlay}>
              <Ionicons name="help-circle-outline" size={16} color={ARColors.cyan} />
              <Text style={styles.navBtnText}>HOW TO PLAY</Text>
            </Pressable>

            <Pressable style={styles.navBtn} onPress={onOpenMissions}>
              <Ionicons name="trophy-outline" size={16} color={ARColors.gold} />
              <Text style={styles.navBtnText}>MISSIONS</Text>
            </Pressable>

            <Pressable style={styles.navBtn} onPress={onOpenStats}>
              <Ionicons name="bar-chart-outline" size={16} color={ARColors.lime} />
              <Text style={styles.navBtnText}>STATS</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRightGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  heroSection: {
    alignItems: 'center',
  },
  targetEmblem: {
    marginBottom: 12,
  },
  titleText: {
    fontSize: 36,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 4,
    textAlign: 'center',
    textShadowColor: ARColors.cyan,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 2,
    marginTop: 4,
  },
  recordCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.border,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 22,
    gap: 18,
  },
  recordItem: {
    alignItems: 'center',
  },
  recordDivider: {
    width: 1,
    height: 28,
    backgroundColor: ARColors.border,
  },
  recordLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1.2,
  },
  recordValue: {
    fontSize: 18,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1,
    marginTop: 2,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 16,
    gap: 6,
  },
  modePillPrefix: {
    fontSize: 10,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 0.8,
  },
  modePillTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  launchButton: {
    width: '100%',
    height: 58,
    backgroundColor: ARColors.cyan,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ARColors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  },
  launchButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 2,
  },
  navRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 6,
  },
  navBtn: {
    flex: 1,
    height: 48,
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navBtnText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.white,
    letterSpacing: 0.5,
  },
});
