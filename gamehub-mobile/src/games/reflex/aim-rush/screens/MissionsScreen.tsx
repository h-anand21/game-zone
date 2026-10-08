// ============================================================
// AIM RUSH — Screen 10: MissionsScreen
// Recreated from "AIM RUSH Missions HUD.png" reference
// Trophy header, progress bars, golden claim buttons, and safe areas
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { AimRushMission } from '../types';
import { AimRushStorage } from '../storage/aimRushStorage';

interface MissionsScreenProps {
  onBack: () => void;
}

export const MissionsScreen: React.FC<MissionsScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [missions, setMissions] = useState<AimRushMission[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'achievements'>('daily');

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    const list = await AimRushStorage.getMissions();
    setMissions(list);
  };

  const handleClaim = async (id: string) => {
    const updated = await AimRushStorage.claimMission(id);
    setMissions(updated);
  };

  const handleClaimAll = async () => {
    let current = [...missions];
    for (const m of current) {
      if (m.completed && !m.claimed) {
        current = await AimRushStorage.claimMission(m.id);
      }
    }
    setMissions(current);
  };

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
            <Ionicons name="arrow-back" size={18} color={ARColors.white} />
          </Pressable>
          <View style={styles.brandTitleBox}>
            <Ionicons name="trophy" size={24} color={ARColors.gold} />
            <Text style={styles.headerTitle}>MISSIONS</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.headerSub}>COMPLETE MISSIONS • EARN REWARDS • LEVEL UP</Text>

        {/* 2. TAB SELECTOR */}
        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tabBtn, activeTab === 'daily' && styles.tabBtnActive]}
            onPress={() => setActiveTab('daily')}
          >
            <Ionicons name="calendar-outline" size={14} color={activeTab === 'daily' ? ARColors.gold : ARColors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'daily' && { color: ARColors.gold }]}>DAILY</Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'weekly' && styles.tabBtnActive]}
            onPress={() => setActiveTab('weekly')}
          >
            <Ionicons name="time-outline" size={14} color={activeTab === 'weekly' ? ARColors.cyan : ARColors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'weekly' && { color: ARColors.cyan }]}>WEEKLY</Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'achievements' && styles.tabBtnActive]}
            onPress={() => setActiveTab('achievements')}
          >
            <Ionicons name="medal-outline" size={14} color={activeTab === 'achievements' ? ARColors.lime : ARColors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'achievements' && { color: ARColors.lime }]}>ACHIEVEMENTS</Text>
          </Pressable>
        </View>

        {/* 3. MISSIONS LIST */}
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {missions.map((m) => {
            const progressRatio = Math.min(1, m.current / m.target);
            const progressPercent = Math.round(progressRatio * 100);

            return (
              <View key={m.id} style={styles.missionCard}>
                <View style={styles.cardTopRow}>
                  <View style={styles.missionIconBox}>
                    <Ionicons name="disc" size={20} color={ARColors.cyan} />
                  </View>

                  <View style={styles.missionTitleBox}>
                    <Text style={styles.missionTitle}>{m.title}</Text>
                    <Text style={styles.missionDesc}>{m.description}</Text>
                  </View>

                  <View style={styles.coinRewardBox}>
                    <Ionicons name="sparkles" size={14} color={ARColors.gold} />
                    <Text style={styles.coinRewardText}>+{m.rewardCoins}</Text>
                  </View>
                </View>

                {/* Progress Rail */}
                <View style={styles.progressRow}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                  </View>
                  <Text style={styles.progressText}>
                    {m.current} / {m.target}
                  </Text>
                </View>

                {/* Claim Button / Status */}
                {m.claimed ? (
                  <View style={styles.claimedBadge}>
                    <Text style={styles.claimedText}>CLAIMED ✓</Text>
                  </View>
                ) : m.completed ? (
                  <Pressable style={styles.claimBtn} onPress={() => handleClaim(m.id)}>
                    <Text style={styles.claimBtnText}>CLAIM REWARD</Text>
                  </Pressable>
                ) : (
                  <View style={styles.inProgressBadge}>
                    <Text style={styles.inProgressText}>IN PROGRESS</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* 4. BOTTOM ACTION BAR (SAFELY POSITIONED ABOVE GESTURE NAV) */}
        <View style={styles.bottomBar}>
          <Pressable style={styles.bottomBackBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={16} color={ARColors.white} />
            <Text style={styles.bottomBackText}>BACK</Text>
          </Pressable>

          <Pressable style={styles.claimAllBtn} onPress={handleClaimAll}>
            <Ionicons name="gift-outline" size={18} color="#07090C" />
            <Text style={styles.claimAllText}>CLAIM ALL</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  headerSub: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.gold,
    letterSpacing: 1.2,
    textAlign: 'center',
    marginVertical: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
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
  missionCard: {
    backgroundColor: 'rgba(10, 16, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(53, 231, 255, 0.35)',
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  missionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ARColors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionTitleBox: {
    flex: 1,
    marginHorizontal: 10,
  },
  missionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1,
  },
  missionDesc: {
    fontSize: 10,
    color: ARColors.textSecondary,
    marginTop: 2,
  },
  coinRewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: ARColors.gold,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  coinRewardText: {
    fontSize: 11,
    fontWeight: '900',
    color: ARColors.gold,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ARColors.cyan,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  claimBtn: {
    width: '100%',
    height: 40,
    backgroundColor: ARColors.gold,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 1.2,
  },
  claimedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  claimedText: {
    fontSize: 10,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  inProgressBadge: {
    alignSelf: 'flex-start',
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  inProgressText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: ARColors.cyan,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 10,
  },
  bottomBackBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  bottomBackText: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1,
  },
  claimAllBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 14,
    backgroundColor: ARColors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  claimAllText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 1.5,
  },
});
