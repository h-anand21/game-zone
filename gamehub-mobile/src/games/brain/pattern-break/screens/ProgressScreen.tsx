// ============================================================
// PATTERN BREAKER — Progress & Mastery Screen
// Authentic 3D Pattern Family Badges, Level Progression & XP
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { SectionTitle } from '../components/common/SectionTitle';
import { GlassCard } from '../components/cards/GlassCard';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { PBColors, PBRadius, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

interface CategoryConfig {
  name: string;
  asset: ImageSourcePropType;
  color: string;
}

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  NUMBER: { name: 'NUMBER RULES', asset: uiAssets.pattern.number, color: '#19D3FF' },
  SHAPE: { name: 'SHAPE GEOMETRY', asset: uiAssets.pattern.shape, color: '#FFD54A' },
  COLOR: { name: 'COLOR HARMONY', asset: uiAssets.pattern.color, color: '#FF6EA7' },
  COUNT: { name: 'COUNT LOGIC', asset: uiAssets.pattern.count, color: '#38E58C' },
  DIRECTION: { name: 'DIRECTION VECTORS', asset: uiAssets.pattern.direction, color: '#A78BFA' },
  MIXED: { name: 'HYBRID MATRIX', asset: uiAssets.pattern.mixed, color: '#FB923C' },
};

export const ProgressScreen: React.FC = () => {
  const {
    currentScreen,
    setScreen,
    playerLevel,
    playerXP,
    categoryMastery,
    gamesPlayed,
    totalBreakersFound,
    bestStreak,
    goBack,
  } = usePatternBreakStore();

  const xpNeeded = 500;
  const xpPercent = Math.min(100, Math.round((playerXP / xpNeeded) * 100));

  const rankTitle =
    playerLevel >= 15
      ? 'GRAND ARCHON'
      : playerLevel >= 10
      ? 'CHIEF COGNITIVE SCOUT'
      : playerLevel >= 5
      ? 'PATTERN VOYAGER'
      : 'ACADEMY EXPLORER';

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          onBack={goBack}
          onSettings={() => setScreen('settings')}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 3D Sculpted Screen Name Badge */}
          <ScreenPlaque type="progress" height={100} />

          {/* Observatory Hero Progress Card */}
          <GlassCard variant="cyan" style={styles.heroCard}>
            <View style={styles.levelRow}>
              <View style={styles.rankInfo}>
                <View style={styles.rankPill}>
                  <Text style={styles.rankPillText}>{rankTitle}</Text>
                </View>
                <Text style={styles.levelTitle}>LEVEL {playerLevel}</Text>
              </View>
              <View style={styles.rankBadge}>
                <Image
                  source={uiAssets.icons.trophy}
                  style={styles.trophyIcon}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* XP Bar */}
            <View style={styles.xpBarContainer}>
              <View style={styles.xpInfoRow}>
                <Text style={styles.xpLabel}>EXPERIENCE TO NEXT LEVEL</Text>
                <Text style={styles.xpNumbers}>
                  {playerXP} / {xpNeeded} XP ({xpPercent}%)
                </Text>
              </View>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
              </View>
            </View>

            {/* Quick Metrics Strip */}
            <View style={styles.metricsStrip}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>GAMES</Text>
                <Text style={styles.metricValue}>{gamesPlayed}</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>BREAKERS FOUND</Text>
                <Text style={[styles.metricValue, { color: PBColors.primary }]}>
                  {totalBreakersFound}
                </Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>BEST STREAK</Text>
                <Text style={[styles.metricValue, { color: PBColors.accent }]}>
                  {bestStreak}🔥
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Section Header: PATTERN FAMILY MASTERY */}
          <SectionTitle
            title="PATTERN FAMILY MASTERY"
            subtitle="Level up each cognitive domain through practice"
            badge="6 CATEGORIES"
            accentColor={PBColors.primary}
          />

          {/* Authentic 3D Pattern Family Cards */}
          <View style={styles.masteryList}>
            {Object.entries(categoryMastery).map(([cat, data]) => {
              const cfg = CATEGORY_MAP[cat] || {
                name: cat,
                asset: uiAssets.pattern.mixed,
                color: PBColors.primary,
              };

              return (
                <View key={cat} style={styles.masteryCard}>
                  {/* Left: Authentic 3D Carved Badge Artwork */}
                  <View style={styles.badgeContainer}>
                    <Image
                      source={cfg.asset}
                      style={styles.patternBadgeImage}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Right: Info + Level + Progress Bar */}
                  <View style={styles.cardRightContent}>
                    <View style={styles.cardHeaderLine}>
                      <Text style={styles.categoryNameText}>{cfg.name}</Text>
                      <View style={[styles.levelPill, { borderColor: cfg.color }]}>
                        <Text style={[styles.levelPillText, { color: cfg.color }]}>
                          LVL {data.level}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar with Percentage Tag */}
                    <View style={styles.progressRow}>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${Math.max(6, data.progress)}%`,
                              backgroundColor: cfg.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.progressPercentText, { color: cfg.color }]}>
                        {data.progress}%
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        <BottomNavigation currentScreen={currentScreen} onNavigate={setScreen} />
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    gap: 12,
  },
  heroCard: {
    padding: 16,
    gap: 12,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankInfo: {
    gap: 2,
  },
  rankPill: {
    backgroundColor: 'rgba(255, 213, 74, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: PBColors.accent,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  rankPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1.2,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  rankBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 213, 74, 0.15)',
    borderWidth: 1.5,
    borderColor: PBColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyIcon: {
    width: 26,
    height: 26,
  },
  xpBarContainer: {
    gap: 6,
  },
  xpInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: PBColors.textMuted,
    letterSpacing: 1,
  },
  xpNumbers: {
    fontSize: 10.5,
    fontWeight: '900',
    color: PBColors.primary,
  },
  xpTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(25, 211, 255, 0.35)',
  },
  xpFill: {
    height: '100%',
    backgroundColor: PBColors.primary,
    borderRadius: 4,
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingVertical: 8,
    borderRadius: PBRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(25, 211, 255, 0.18)',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(25, 211, 255, 0.2)',
  },

  // Section Header
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 2,
  },
  cyanAccentBar: {
    width: 4,
    height: 26,
    borderRadius: 2,
    backgroundColor: PBColors.primary,
  },
  sectionTextGroup: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#19D3FF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: 10.5,
    fontWeight: '500',
    color: PBColors.textSecondary,
    marginTop: 1,
  },

  // Mastery Cards
  masteryList: {
    gap: 8,
  },
  masteryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 35, 44, 0.9)',
    borderRadius: PBRadius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.22)',
    padding: 10,
    gap: 12,
  },
  badgeContainer: {
    width: 106,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternBadgeImage: {
    width: '100%',
    height: '100%',
  },
  cardRightContent: {
    flex: 1,
    gap: 6,
  },
  cardHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryNameText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  levelPill: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  levelPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barTrack: {
    flex: 1,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  barFill: {
    height: '100%',
    borderRadius: 3.5,
  },
  progressPercentText: {
    fontSize: 11,
    fontWeight: '900',
    minWidth: 32,
    textAlign: 'right',
  },
});
