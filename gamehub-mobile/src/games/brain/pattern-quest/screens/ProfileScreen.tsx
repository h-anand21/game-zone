// ============================================================
// PATTERN QUEST — Screen 16: ProfileScreen
// Ancient Explorer Camp Dashboard: User Profile, Rank, Expeditions
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameHeader } from '../components/common/GameHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

export const ProfileScreen: React.FC = () => {
  const { currentScreen, setScreen, getUserName, userStats } = usePatternQuestStore();
  const userName = getUserName();

  return (
    <GameBackground screen="profile" overlayDarkness={0.25}>
      <GameHeader onBack={() => setScreen('home')} onSettings={() => setScreen('settings')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenPlaque screen="profile" width={280} height={140} style={styles.plaque} />

        {/* Explorer ID Badge */}
        <View style={styles.idCard}>
          <View style={styles.avatarCircle}>
            <Image source={pqAssets.icons.chestBackpack} style={{ width: 44, height: 44 }} resizeMode="contain" />
          </View>

          <View style={styles.idMeta}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[pqTypography.h2, { color: pqColors.textGold }]}>{userName}</Text>
              <Image source={pqAssets.buttons.edit} style={{ width: 80, height: 32 }} resizeMode="contain" />
            </View>
            <Text style={[pqTypography.caption, { color: pqColors.turquoiseLight }]}>
              RANK: APPRENTICE ARCHAEOLOGIST
            </Text>

            <View style={styles.xpRow}>
              <Text style={styles.levelTag}>LVL 1</Text>
              <View style={styles.xpBarTrack}>
                <View style={[styles.xpBarFill, { width: '45%' }]} />
              </View>
              <Text style={styles.xpText}>450/1000 XP</Text>
            </View>
          </View>
        </View>

        {/* Expedition Statistics Board */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionHeader}>EXPEDITION DOSSIER</Text>

          <View style={styles.statGrid}>
            <View style={styles.statTile}>
              <Text style={pqTypography.hudLabel}>SOLVED</Text>
              <Text style={styles.statNumber}>{userStats.patternsSolved}</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={pqTypography.hudLabel}>ACCURACY</Text>
              <Text style={styles.statNumber}>{userStats.accuracy}%</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={pqTypography.hudLabel}>MAX COMBO</Text>
              <Text style={styles.statNumber}>x{userStats.bestCombo}</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={pqTypography.hudLabel}>AVG TIME</Text>
              <Text style={styles.statNumber}>{userStats.averageTimeSeconds}s</Text>
            </View>
          </View>
        </View>

        {/* Mode Mastery */}
        <View style={styles.modeMasteryCard}>
          <Text style={styles.sectionHeader}>MODE PROFICIENCY</Text>

          <View style={styles.modeRow}>
            <Image source={pqAssets.buttons.modePattern} style={styles.modeIcon} resizeMode="contain" />
            <View style={styles.modeMeta}>
              <Text style={pqTypography.bodyBold}>DISCOVER</Text>
              <Text style={pqTypography.caption}>Standard Shape & Color Cycles</Text>
            </View>
            <Text style={styles.masteryRank}>MASTER</Text>
          </View>

          <View style={styles.modeRow}>
            <Image source={pqAssets.buttons.typeMixed} style={styles.modeIcon} resizeMode="contain" />
            <View style={styles.modeMeta}>
              <Text style={pqTypography.bodyBold}>THINK</Text>
              <Text style={pqTypography.caption}>Multi-Attribute Transformations</Text>
            </View>
            <Text style={styles.masteryRank}>ADEPT</Text>
          </View>

          <View style={styles.modeRow}>
            <Image source={pqAssets.buttons.rushMode} style={styles.modeIcon} resizeMode="contain" />
            <View style={styles.modeMeta}>
              <Text style={pqTypography.bodyBold}>RUSH</Text>
              <Text style={pqTypography.caption}>Lightning Speed Chambers</Text>
            </View>
            <Text style={styles.masteryRank}>SCOUT</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation currentScreen={currentScreen} onNavigate={setScreen} />
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: pqSpacing.base,
    paddingBottom: 110,
    alignItems: 'center',
  },
  plaque: {
    marginBottom: pqSpacing.md,
  },
  idCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 26, 36, 0.95)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2,
    borderColor: '#C5832B',
    padding: pqSpacing.base,
    marginBottom: pqSpacing.base,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 2,
    borderColor: pqColors.crystalCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: pqSpacing.md,
  },
  avatarGem: {
    width: 32,
    height: 32,
  },
  idMeta: {
    flex: 1,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  levelTag: {
    fontSize: 10,
    fontWeight: '900',
    color: pqColors.goldBright,
    backgroundColor: 'rgba(197, 131, 43, 0.3)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  xpBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(10, 16, 24, 0.9)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: pqColors.crystalCyan,
  },
  xpText: {
    fontSize: 10,
    color: pqColors.textMuted,
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 33, 0.92)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 1.5,
    borderColor: '#374151',
    padding: pqSpacing.base,
    marginBottom: pqSpacing.base,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: pqColors.textGold,
    letterSpacing: 1.2,
    marginBottom: pqSpacing.md,
    textAlign: 'center',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  statTile: {
    width: '48%',
    backgroundColor: 'rgba(12, 18, 26, 0.8)',
    borderRadius: pqSpacing.radiusSm,
    padding: pqSpacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: pqColors.crystalCyan,
    marginTop: 2,
  },
  modeMasteryCard: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 33, 0.92)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 1.5,
    borderColor: '#374151',
    padding: pqSpacing.base,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pqSpacing.md,
  },
  modeIcon: {
    width: 44,
    height: 32,
    marginRight: pqSpacing.md,
  },
  modeMeta: {
    flex: 1,
  },
  masteryRank: {
    fontSize: 11,
    fontWeight: '900',
    color: pqColors.goldBright,
    backgroundColor: 'rgba(245, 176, 65, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: pqSpacing.radiusPill,
    borderWidth: 1,
    borderColor: pqColors.gold,
  },
});
