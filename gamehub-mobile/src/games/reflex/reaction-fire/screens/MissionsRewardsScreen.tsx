// ============================================================
// REACTION FIRE — Screen 10: Missions & Achievements
// Daily/Weekly mission tracks, XP rewards, level progression & badges
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { HeaderBar } from '../components/HeaderBar';
import { MissionCard } from '../components/MissionCard';
import { calculateLevel } from '../logic/missions';
import { RfColors } from '../theme';
import type { MissionItem, AchievementItem, ReactionStats } from '../types';

interface MissionsRewardsScreenProps {
  stats: ReactionStats;
  missions: MissionItem[];
  achievements: AchievementItem[];
  onClaimReward: (missionId: string) => void;
  onBack: () => void;
}

export const MissionsRewardsScreen: React.FC<MissionsRewardsScreenProps> = ({
  stats,
  missions,
  achievements,
  onClaimReward,
  onBack,
}) => {
  const [tab, setTab] = useState<'missions' | 'achievements'>('missions');
  const { level, currentXp, nextLevelXp } = calculateLevel(stats.xp);
  const xpPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

  return (
    <View style={styles.container}>
      <HeaderBar
        title="MISSIONS & AWARDS"
        subtitle="COMBAT MERIT TRACK"
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Level Progression Banner */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.levelTitle}>COMBAT OPERATIVE</Text>
              <Text style={styles.levelNumber}>LEVEL {level}</Text>
            </View>
            <View style={styles.xpBox}>
              <Text style={styles.xpText}>TOTAL {stats.xp} XP</Text>
            </View>
          </View>

          {/* XP Progress Bar */}
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
          </View>
          <Text style={styles.xpProgressLabel}>
            {currentXp} / {nextLevelXp} XP TO LEVEL {level + 1}
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabBtn, tab === 'missions' && styles.tabBtnActive]}
            onPress={() => setTab('missions')}
          >
            <Text style={[styles.tabText, tab === 'missions' && styles.tabTextActive]}>
              ACTIVE MISSIONS
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, tab === 'achievements' && styles.tabBtnActive]}
            onPress={() => setTab('achievements')}
          >
            <Text style={[styles.tabText, tab === 'achievements' && styles.tabTextActive]}>
              ACHIEVEMENTS
            </Text>
          </Pressable>
        </View>

        {/* Missions Tab */}
        {tab === 'missions' ? (
          <View style={styles.listSection}>
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} onClaim={onClaimReward} />
            ))}
          </View>
        ) : (
          /* Achievements Tab */
          <View style={styles.listSection}>
            {achievements.map((ach) => (
              <View
                key={ach.id}
                style={[styles.achCard, ach.unlocked && styles.achCardUnlocked]}
              >
                <Text style={styles.achIcon}>{ach.icon}</Text>
                <View style={styles.achInfo}>
                  <Text style={[styles.achTitle, ach.unlocked && { color: RfColors.goLime }]}>
                    {ach.title}
                  </Text>
                  <Text style={styles.achDesc}>{ach.description}</Text>
                </View>
                <View style={[styles.statusTag, ach.unlocked && styles.statusTagUnlocked]}>
                  <Text style={styles.statusTagText}>
                    {ach.unlocked ? '✓ UNLOCKED' : 'LOCKED'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RfColors.bgMain,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  levelCard: {
    backgroundColor: 'rgba(10, 23, 41, 0.95)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(183, 255, 60, 0.35)',
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1.5,
  },
  levelNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: RfColors.goLime,
    letterSpacing: 1,
    marginTop: 2,
  },
  xpBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 200, 87, 0.15)',
    borderWidth: 1,
    borderColor: RfColors.rewardGold,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '900',
    color: RfColors.rewardGold,
  },
  xpTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: RfColors.goLime,
    borderRadius: 4,
  },
  xpProgressLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1,
    marginTop: 6,
    textAlign: 'right',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 23, 41, 0.8)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(39, 183, 255, 0.2)',
    borderWidth: 1,
    borderColor: RfColors.primaryBlue,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1,
  },
  tabTextActive: {
    color: RfColors.primaryBlue,
    fontWeight: '900',
  },
  listSection: {
    gap: 8,
  },
  achCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 23, 41, 0.8)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
  },
  achCardUnlocked: {
    borderColor: 'rgba(183, 255, 60, 0.35)',
    backgroundColor: 'rgba(30, 62, 5, 0.25)',
  },
  achIcon: {
    fontSize: 26,
  },
  achInfo: {
    flex: 1,
  },
  achTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: RfColors.textPrimary,
  },
  achDesc: {
    fontSize: 10,
    color: RfColors.textSecondary,
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  statusTagUnlocked: {
    backgroundColor: 'rgba(183, 255, 60, 0.15)',
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: RfColors.textMuted,
  },
});

export default MissionsRewardsScreen;
