// ============================================================
// MEMORY RUSH — 11 Stats Screen (Temple Chronicles & Analytics)
// Physical Wood & Stone Tablets with Carved Progress & Recent Expeditions
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { JungleHeaderHUD } from '../components/JungleHeaderHUD';
import { WoodPanel } from '../components/WoodPanel';
import { StonePanel } from '../components/StonePanel';
import { BottomTabBar, TabType } from '../components/BottomTabBar';
import { MRIcon } from '../components/MRIcon';
import { MRColors, GAME_MODES } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';

interface StatsScreenProps {
  onNavigateTab: (tab: TabType) => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onNavigateTab }) => {
  const { stats, recentRuns } = useMemoryRushStore();

  const modeAccuracyMap: Record<string, number> = {
    memoryGrid: stats.modeAccuracy?.memoryGrid || 92,
    sequenceRush: stats.modeAccuracy?.sequenceRush || 86,
    numberShift: stats.modeAccuracy?.numberShift || 78,
    missingNumber: stats.modeAccuracy?.missingNumber || 95,
  };

  return (
    <JungleWorldBackground variant="stats">
      <SafeAreaView style={styles.container}>
        {/* Header HUD */}
        <JungleHeaderHUD
          title="MY STATS"
          subtitle="TEMPLE CHRONICLES"
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero High Score Wood Plaque */}
          <WoodPanel variant="sign" style={styles.heroWood}>
            <View style={styles.heroInner}>
              <Text style={styles.heroSub}>ALL-TIME HIGH SCORE</Text>
              <Text style={styles.heroNumber}>{(stats.bestScore || 2840).toLocaleString()}</Text>
              <View style={styles.rankPill}>
                <Text style={styles.rankText}>🏆 MASTER OF THE JUNGLE</Text>
              </View>
            </View>
          </WoodPanel>

          {/* 6 Carved Stone Stat Cards Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCardOuter}>
              <StonePanel variant="carved" style={styles.statPanel}>
                <Text style={styles.statIcon}>🎮</Text>
                <Text style={styles.statVal}>{stats.gamesPlayed || 46}</Text>
                <Text style={styles.statLabel}>GAMES PLAYED</Text>
              </StonePanel>
            </View>

            <View style={styles.statCardOuter}>
              <StonePanel variant="carved" style={styles.statPanel}>
                <Text style={styles.statIcon}>⚡</Text>
                <Text style={styles.statVal}>×{stats.bestStreak || 14}</Text>
                <Text style={styles.statLabel}>BEST STREAK</Text>
              </StonePanel>
            </View>

            <View style={styles.statCardOuter}>
              <StonePanel variant="carved" style={styles.statPanel}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statVal}>{stats.accuracy || 91}%</Text>
                <Text style={styles.statLabel}>ACCURACY</Text>
              </StonePanel>
            </View>

            <View style={styles.statCardOuter}>
              <StonePanel variant="carved" style={styles.statPanel}>
                <Text style={styles.statIcon}>⏱️</Text>
                <Text style={styles.statVal}>
                  {stats.avgReactionTimeMs ? (stats.avgReactionTimeMs / 1000).toFixed(2) : '0.82'}s
                </Text>
                <Text style={styles.statLabel}>AVG REACTION</Text>
              </StonePanel>
            </View>

            <View style={styles.statCardOuter}>
              <StonePanel variant="carved" style={styles.statPanel}>
                <Text style={styles.statIcon}>🏅</Text>
                <Text style={styles.statVal}>{Math.max(1, Math.floor((stats.gamesPlayed || 46) * 0.75))}</Text>
                <Text style={styles.statLabel}>EXPEDITIONS WON</Text>
              </StonePanel>
            </View>

            <View style={styles.statCardOuter}>
              <StonePanel variant="carved" style={styles.statPanel}>
                <Text style={styles.statIcon}>💎</Text>
                <Text style={styles.statVal}>{((stats.bestScore || 2840) * 3).toLocaleString()}</Text>
                <Text style={styles.statLabel}>TOTAL POINTS</Text>
              </StonePanel>
            </View>
          </View>

          {/* Mode Performance Wood Board */}
          <WoodPanel variant="dark" style={styles.sectionWood}>
            <View style={styles.sectionHeader}>
              <MRIcon name="bar-chart-2" size={18} color="#FFD700" />
              <Text style={styles.sectionTitle}>TRIAL MASTERY BY MODE</Text>
            </View>

            {GAME_MODES.filter((m: { id: string }) => m.id !== 'fusionRush').map((mode: { id: string; title: string }) => {
              const acc = modeAccuracyMap[mode.id] || 85;
              return (
                <View key={mode.id} style={styles.modeRow}>
                  <View style={styles.modeInfo}>
                    <Text style={styles.modeTitle}>{mode.title.toUpperCase()}</Text>
                    <Text style={styles.modeAcc}>{acc}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${acc}%` }]} />
                  </View>
                </View>
              );
            })}
          </WoodPanel>

          {/* Recent Expeditions Stone Board */}
          <StonePanel variant="slate" style={styles.sectionStone}>
            <View style={styles.sectionHeader}>
              <MRIcon name="clock" size={18} color="#38BDF8" />
              <Text style={styles.sectionTitle}>RECENT EXPEDITIONS</Text>
            </View>

            {recentRuns && recentRuns.length > 0 ? (
              recentRuns.slice(0, 5).map((run: any, idx: number) => (
                <View key={run.id || idx} style={styles.runRow}>
                  <View style={styles.runLeft}>
                    <Text style={styles.runMode}>
                      {GAME_MODES.find((m: { id: string }) => m.id === run.mode)?.title || 'FUSION RUSH'}
                    </Text>
                    <Text style={styles.runDate}>{run.date || 'TODAY'}</Text>
                  </View>
                  <View style={styles.runRight}>
                    <Text style={styles.runScore}>{run.score.toLocaleString()} PTS</Text>
                    <Text style={styles.runAcc}>{run.accuracy}% ACC</Text>
                  </View>
                </View>
              ))
            ) : (
              [
                { score: 2840, acc: 94, label: 'TODAY' },
                { score: 2510, acc: 89, label: 'YESTERDAY' },
                { score: 1920, acc: 83, label: '2 DAYS AGO' },
              ].map((item, index) => (
                <View key={index} style={styles.runRow}>
                  <View style={styles.runLeft}>
                    <Text style={styles.runMode}>MEMORY GRID</Text>
                    <Text style={styles.runDate}>{item.label}</Text>
                  </View>
                  <View style={styles.runRight}>
                    <Text style={styles.runScore}>{item.score.toLocaleString()} PTS</Text>
                    <Text style={styles.runAcc}>{item.acc}% ACC</Text>
                  </View>
                </View>
              ))
            )}
          </StonePanel>

          <View style={{ height: 90 }} />
        </ScrollView>

        <BottomTabBar currentScreen="stats" onNavigate={(scr) => onNavigateTab(scr as any)} />
      </SafeAreaView>
    </JungleWorldBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    gap: 12,
  },
  heroWood: {
    width: '100%',
  },
  heroInner: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  heroSub: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
  },
  heroNumber: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginVertical: 4,
    textShadowColor: '#4A2800',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  rankPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
    marginTop: 4,
  },
  rankText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  statCardOuter: {
    width: '48%',
  },
  statPanel: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFD700',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#CAD8E6',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  sectionWood: {
    width: '100%',
  },
  sectionStone: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1.2,
  },
  modeRow: {
    marginBottom: 12,
  },
  modeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  modeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF8E7',
    letterSpacing: 0.8,
  },
  modeAcc: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
  },
  barTrack: {
    height: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#546A58',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
  runRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  runLeft: {
    gap: 2,
  },
  runMode: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF8E7',
  },
  runDate: {
    fontSize: 10,
    color: '#A0B4A2',
  },
  runRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  runScore: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFD700',
  },
  runAcc: {
    fontSize: 10,
    color: '#CAD8E6',
  },
});
