import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { GlassCard } from '../components/cards/GlassCard';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { PBColors, PBTypography, PBRadius, PBShadows } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

const CATEGORY_VECTOR_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  NUMBER: 'calculator-outline',
  SHAPE: 'triangle-outline',
  COLOR: 'color-palette-outline',
  COUNT: 'diamond-outline',
  DIRECTION: 'compass-outline',
  MIXED: 'flash-outline',
};

export const ProgressScreen: React.FC = () => {
  const {
    currentScreen,
    setScreen,
    playerLevel,
    playerXP,
    categoryMastery,
    goBack,
  } = usePatternBreakStore();

  const xpNeeded = 500;
  const xpPercent = Math.min(100, Math.round((playerXP / xpNeeded) * 100));

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="PROGRESSION"
          onBack={goBack}
          onSettings={() => setScreen('settings')}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Level & XP Hero Card */}
          <GlassCard variant="cyan" style={styles.heroCard}>
            <View style={styles.levelRow}>
              <View>
                <Text style={styles.levelSubtitle}>OBSERVATORY RANK</Text>
                <Text style={styles.levelTitle}>LEVEL {playerLevel}</Text>
              </View>
              <View style={styles.rankBadge}>
                <Ionicons name="trophy" size={20} color={PBColors.accent} />
              </View>
            </View>

            {/* XP Bar */}
            <View style={styles.xpBarContainer}>
              <View style={styles.xpInfoRow}>
                <Text style={styles.xpLabel}>EXPERIENCE (XP)</Text>
                <Text style={styles.xpNumbers}>
                  {playerXP} / {xpNeeded} XP
                </Text>
              </View>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
              </View>
            </View>
          </GlassCard>

          {/* Pattern Mastery Breakdown */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PATTERN FAMILY MASTERY</Text>
          </View>

          <View style={styles.masteryList}>
            {Object.entries(categoryMastery).map(([cat, data]) => {
              const iconName = CATEGORY_VECTOR_ICONS[cat] || 'shapes-outline';
              const iconColor =
                cat === 'COLOR'
                  ? '#FF6EA7'
                  : cat === 'SHAPE'
                  ? '#FFD54A'
                  : cat === 'COUNT'
                  ? '#38E58C'
                  : PBColors.primary;

              return (
                <GlassCard key={cat} variant="neutral" style={styles.categoryCard}>
                  <View style={styles.catHeader}>
                    <View style={styles.catTitleGroup}>
                      <View style={[styles.catIconCircle, { borderColor: iconColor }]}>
                        <Ionicons name={iconName} size={15} color={iconColor} />
                      </View>
                      <Text style={styles.catName}>{cat}</Text>
                    </View>
                    <Text style={styles.catLvl}>LVL {data.level}</Text>
                  </View>

                  <View style={styles.catBarTrack}>
                    <View
                      style={[
                        styles.catBarFill,
                        {
                          width: `${data.progress}%`,
                          backgroundColor: iconColor,
                        },
                      ]}
                    />
                  </View>
                </GlassCard>
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
    paddingTop: 10,
    gap: 12,
  },
  heroCard: {
    padding: 18,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelSubtitle: {
    fontSize: 10,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1.5,
  },
  levelTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  rankBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 213, 74, 0.15)',
    borderWidth: 1.5,
    borderColor: PBColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankEmoji: {
    fontSize: 24,
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
    fontSize: 10,
    fontWeight: '900',
    color: PBColors.primary,
  },
  xpTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(25, 211, 255, 0.25)',
  },
  xpFill: {
    height: '100%',
    backgroundColor: PBColors.primary,
    borderRadius: 4,
  },
  sectionHeader: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 22,
    textTransform: 'uppercase',
    color: PBColors.textPrimary,
  },
  masteryList: {
    gap: 8,
  },
  categoryCard: {
    padding: 12,
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  catTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  catLvl: {
    fontSize: 10,
    fontWeight: '900',
    color: PBColors.accent,
  },
  catBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
  },
  catBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
