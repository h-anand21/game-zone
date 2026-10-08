// ============================================================
// AIM RUSH — Screen 11: StatsScreen
// Recreated from "AIM RUSH Neon Stats Dashboard.png" reference
// 100% SVG Vector Icons, Sci-Fi Telemetry dashboard & multi-metric grids
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { AimRushUserProfile } from '../types';
import {
  SvgBackArrow,
  SvgStatsBarChart,
  SvgBullseyeTarget,
  SvgTrophy,
  SvgPlayTriangle,
  SvgCrown,
  SvgChainLink,
  SvgStar,
  SvgClose,
  SvgClock,
} from '../components/icons/AimRushIcons';

interface StatsScreenProps {
  profile: AimRushUserProfile;
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ profile, onBack }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'overview' | 'modes' | 'records'>('overview');

  const totalAttempts = profile.totalTargetsHit + profile.totalMisses;
  const careerAccuracy =
    totalAttempts > 0
      ? Math.round((profile.totalTargetsHit / totalAttempts) * 100)
      : 0;

  const playMinutes = Math.floor(profile.totalPlayTimeSeconds / 60);
  const playSeconds = profile.totalPlayTimeSeconds % 60;

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.35}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(12, insets.top + 6),
            paddingBottom: Math.max(16, insets.bottom + 8),
          },
        ]}
      >
        {/* 1. TOP HEADER & TITLE */}
        <View style={styles.topHeader}>
          <Pressable style={styles.backBtn} onPress={onBack}>
            <SvgBackArrow size={18} color={ARColors.white} />
          </Pressable>

          <View style={styles.brandTitleBox}>
            <Text style={styles.headerTitle}>STATS</Text>
            <Text style={styles.headerSub}>YOUR PERFORMANCE TELEMETRY</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* 2. TABS ROW (SVG) */}
        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tabBtn, activeTab === 'overview' && styles.tabBtnActive]}
            onPress={() => setActiveTab('overview')}
          >
            <SvgStatsBarChart size={14} color={activeTab === 'overview' ? ARColors.gold : ARColors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'overview' && { color: ARColors.gold }]}>OVERVIEW</Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'modes' && styles.tabBtnActive]}
            onPress={() => setActiveTab('modes')}
          >
            <SvgBullseyeTarget size={14} color={activeTab === 'modes' ? ARColors.cyan : ARColors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'modes' && { color: ARColors.cyan }]}>MODES</Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'records' && styles.tabBtnActive]}
            onPress={() => setActiveTab('records')}
          >
            <SvgTrophy size={14} color={activeTab === 'records' ? ARColors.lime : ARColors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'records' && { color: ARColors.lime }]}>RECORDS</Text>
          </Pressable>
        </View>

        {/* 3. DASHBOARD METRICS */}
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {/* Top 4 Key Metric Capsules */}
          <View style={styles.topFourRow}>
            <View style={styles.miniCapsule}>
              <SvgPlayTriangle size={15} color={ARColors.cyan} />
              <Text style={styles.miniLabel}>GAMES</Text>
              <Text style={styles.miniValue}>{profile.totalRuns}</Text>
            </View>

            <View style={styles.miniCapsule}>
              <SvgCrown size={15} color={ARColors.gold} />
              <Text style={styles.miniLabel}>BEST SCORE</Text>
              <Text style={[styles.miniValue, { color: ARColors.gold }]}>
                {profile.personalBestScore}
              </Text>
            </View>

            <View style={styles.miniCapsule}>
              <SvgChainLink size={15} color={ARColors.lime} />
              <Text style={styles.miniLabel}>MAX CHAIN</Text>
              <Text style={[styles.miniValue, { color: ARColors.lime }]}>
                x{profile.bestChain}
              </Text>
            </View>

            <View style={styles.miniCapsule}>
              <SvgBullseyeTarget size={15} color={ARColors.cyan} />
              <Text style={styles.miniLabel}>PERFECTS</Text>
              <Text style={styles.miniValue}>{profile.totalPerfects}</Text>
            </View>
          </View>

          {/* Accuracy & Estimated Reaction Bars */}
          <View style={styles.accuracyBarCard}>
            <View style={styles.barHeader}>
              <View style={styles.barLabelGroup}>
                <SvgBullseyeTarget size={16} color={ARColors.cyan} />
                <Text style={styles.barTitle}>OVERALL ACCURACY</Text>
              </View>
              <Text style={styles.barValue}>{careerAccuracy}%</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${careerAccuracy}%`, backgroundColor: ARColors.cyan }]} />
            </View>
          </View>

          {/* 4 Detailed Quad Cells */}
          <View style={styles.quadGrid}>
            <View style={[styles.quadCell, { borderColor: ARColors.lime }]}>
              <SvgBullseyeTarget size={20} color={ARColors.lime} />
              <Text style={styles.quadLabel}>TOTAL HITS</Text>
              <Text style={[styles.quadValue, { color: ARColors.lime }]}>
                {profile.totalTargetsHit}
              </Text>
            </View>

            <View style={[styles.quadCell, { borderColor: ARColors.red }]}>
              <SvgClose size={20} color={ARColors.red} />
              <Text style={styles.quadLabel}>TOTAL MISSES</Text>
              <Text style={[styles.quadValue, { color: ARColors.red }]}>
                {profile.totalMisses}
              </Text>
            </View>

            <View style={[styles.quadCell, { borderColor: ARColors.cyan }]}>
              <SvgStar size={20} color={ARColors.cyan} fill={ARColors.cyan} />
              <Text style={styles.quadLabel}>PERFECT SWEET-SPOTS</Text>
              <Text style={[styles.quadValue, { color: ARColors.cyan }]}>
                {profile.totalPerfects}
              </Text>
            </View>

            <View style={[styles.quadCell, { borderColor: ARColors.gold }]}>
              <SvgChainLink size={20} color={ARColors.gold} />
              <Text style={styles.quadLabel}>LONGEST CHAIN</Text>
              <Text style={[styles.quadValue, { color: ARColors.gold }]}>
                x{profile.bestChain}
              </Text>
            </View>
          </View>

          {/* Gameplay Time Card */}
          <View style={styles.timeCard}>
            <SvgClock size={20} color={ARColors.white} />
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>TOTAL GAMEPLAY TIME</Text>
              <Text style={styles.timeValue}>
                {playMinutes}m {playSeconds}s
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* 4. BOTTOM ACTION (SAFELY POSITIONED ABOVE GESTURE NAV) */}
        <Pressable style={styles.bottomBackBtn} onPress={onBack}>
          <SvgBackArrow size={16} color={ARColors.white} />
          <Text style={styles.bottomBackText}>BACK TO HUB</Text>
        </Pressable>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: ARColors.cyan,
    letterSpacing: 2.5,
    fontStyle: 'italic',
  },
  headerSub: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  tabBtn: {
    flex: 1,
    height: 38,
    backgroundColor: 'rgba(10, 16, 26, 0.85)',
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabBtnActive: {
    borderColor: ARColors.cyan,
    backgroundColor: 'rgba(12, 22, 36, 0.95)',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '900',
    color: ARColors.textMuted,
    letterSpacing: 1,
  },
  scrollList: {
    gap: 12,
    paddingBottom: 16,
  },
  topFourRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniCapsule: {
    flex: 1,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.2,
    borderColor: 'rgba(53, 231, 255, 0.35)',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 3,
  },
  miniLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  miniValue: {
    fontSize: 14,
    fontWeight: '900',
    color: ARColors.white,
  },
  accuracyBarCard: {
    backgroundColor: 'rgba(10, 16, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(53, 231, 255, 0.4)',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1,
  },
  barValue: {
    fontSize: 14,
    fontWeight: '900',
    color: ARColors.cyan,
  },
  track: {
    width: '100%',
    height: 8,
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  quadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quadCell: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  quadLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 0.8,
  },
  quadValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  timeInfo: {
    gap: 2,
  },
  timeLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '900',
    color: ARColors.white,
  },
  bottomBackBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 16, 26, 0.95)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  bottomBackText: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.5,
  },
});
