// ============================================================
// PATTERN BREAKER — 18 Profile & Analytics Screen
// Real cognitive analytics, dynamic strength matrix & GameHub universal identity
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { SectionTitle } from '../components/common/SectionTitle';
import { Mascot } from '../components/mascot/Mascot';
import { GlassCard } from '../components/cards/GlassCard';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { PBColors, PBRadius, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';
import { useProfileStore } from '@/store';

const CATEGORY_ASSET_MAP: Record<string, { title: string; asset: any; color: string }> = {
  NUMBER: { title: 'NUMERICAL', asset: uiAssets.pattern.number, color: '#19D3FF' },
  SHAPE: { title: 'GEOMETRIC', asset: uiAssets.pattern.shape, color: '#FFD54A' },
  COLOR: { title: 'CHROMATIC', asset: uiAssets.pattern.color, color: '#FF6EA7' },
  COUNT: { title: 'QUANTITY', asset: uiAssets.pattern.count, color: '#38E58C' },
  DIRECTION: { title: 'SPATIAL', asset: uiAssets.pattern.direction, color: '#A78BFA' },
  MIXED: { title: 'HYBRID', asset: uiAssets.pattern.mixed, color: '#FB923C' },
};

export const ProfileScreen: React.FC = () => {
  const {
    currentScreen,
    setScreen,
    gamesPlayed,
    bestScore,
    bestStreak,
    totalBreakersFound,
    totalWrongTaps,
    reactionTimes,
    categoryMastery,
    playerLevel,
    playerXP,
    goBack,
  } = usePatternBreakStore();

  const { displayName, username, updateDisplayName, setDisplayName } = useProfileStore();

  // Name Editing State
  const [isEditingName, setIsEditingName] = useState(false);
  const currentProfileName =
    displayName && displayName !== 'Guest Player'
      ? displayName
      : username && username !== '@guest'
      ? username
      : 'GameHub Scout';
  const [inputName, setInputName] = useState(currentProfileName);

  const handleSaveName = () => {
    const trimmed = inputName.trim();
    if (trimmed.length > 0) {
      setDisplayName(trimmed);
      if (updateDisplayName) {
        updateDisplayName(trimmed);
      }
    }
    setIsEditingName(false);
  };

  // Real Calculated Metrics
  const totalAttempts = totalBreakersFound + totalWrongTaps;
  const accuracy = totalAttempts > 0 ? Math.round((totalBreakersFound / totalAttempts) * 100) : 100;
  const avgReaction =
    reactionTimes && reactionTimes.length > 0
      ? (reactionTimes.reduce((acc, val) => acc + val, 0) / reactionTimes.length).toFixed(1) + 's'
      : '--';

  // Dynamic Strengths & Weaknesses
  const sortedCategories = Object.entries(categoryMastery).sort(
    (a, b) => b[1].level * 100 + b[1].progress - (a[1].level * 100 + a[1].progress)
  );
  const strongestEntry = sortedCategories[0] || ['NUMBER', { level: 1, progress: 0 }];
  const weakestEntry = sortedCategories[sortedCategories.length - 1] || ['MIXED', { level: 1, progress: 0 }];

  const strongestMeta = CATEGORY_ASSET_MAP[strongestEntry[0]] || CATEGORY_ASSET_MAP.NUMBER;
  const weakestMeta = CATEGORY_ASSET_MAP[weakestEntry[0]] || CATEGORY_ASSET_MAP.MIXED;

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
          <ScreenPlaque type="profile_stats" height={105} />

          {/* Hero Profile Identification Card */}
          <GlassCard variant="cyan" style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Mascot pose="proud" size={84} />
              <View style={styles.profileDetails}>
                <View style={styles.rankPill}>
                  <Text style={styles.rankPillText}>{rankTitle}</Text>
                </View>

                {/* Universal GameHub Player Name + Edit Trigger */}
                <View style={styles.nameRow}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {currentProfileName}
                  </Text>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => {
                      setInputName(currentProfileName);
                      setIsEditingName(true);
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="pencil" size={14} color={PBColors.primary} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.subIdentity}>GameHub Universal Identity</Text>
                <Text style={styles.levelText}>
                  LEVEL {playerLevel} • {playerXP} XP
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Core Analytics Section */}
          <SectionTitle
            title="CORE PERFORMANCE METRICS"
            subtitle="Real-time gameplay diagnostics tracked from live runs"
            badge="LIVE STATS"
            accentColor={PBColors.primary}
            style={{ marginTop: 4 }}
          />

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>GAMES PLAYED</Text>
              <Text style={styles.statVal}>{gamesPlayed}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BEST SCORE</Text>
              <Text style={[styles.statVal, { color: PBColors.primary }]}>{bestScore}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BEST STREAK</Text>
              <View style={styles.streakValueRow}>
                <Ionicons name="flame" size={18} color={PBColors.accent} style={{ marginRight: 3 }} />
                <Text style={[styles.statVal, { color: PBColors.accent }]}>{bestStreak}</Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>AVG REACTION</Text>
              <Text style={[styles.statVal, { color: PBColors.positive }]}>{avgReaction}</Text>
            </View>
          </View>

          {/* Dynamic Diagnostic Strength Cards */}
          <SectionTitle
            title="COGNITIVE PROFICIENCY RADAR"
            subtitle="Calculated dynamically from your rule family progress"
            badge="ACCURACY: "
            accentColor={PBColors.accent}
            style={{ marginTop: 6 }}
          />

          <View style={styles.analysisRow}>
            {/* Strongest Pattern */}
            <GlassCard variant="cyan" style={styles.analysisCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="shield-checkmark" size={15} color={PBColors.primary} />
                <Text style={styles.analysisHeader}>STRONGEST</Text>
              </View>
              <View style={styles.patternAssetBox}>
                <Image
                  source={strongestMeta.asset}
                  style={styles.patternAssetImg}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.analysisAccuracy, { color: PBColors.primary }]}>
                LVL {strongestEntry[1].level} • {strongestEntry[1].progress}%
              </Text>
            </GlassCard>

            {/* Training Needed */}
            <GlassCard variant="amber" style={styles.analysisCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="trending-up" size={15} color={PBColors.accent} />
                <Text style={styles.analysisHeader}>NEEDS PRACTICE</Text>
              </View>
              <View style={styles.patternAssetBox}>
                <Image
                  source={weakestMeta.asset}
                  style={styles.patternAssetImg}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.analysisAccuracy, { color: PBColors.accent }]}>
                LVL {weakestEntry[1].level} • {weakestEntry[1].progress}%
              </Text>
            </GlassCard>
          </View>

          {/* Overall Accuracy Banner */}
          <View style={styles.accuracyBanner}>
            <View style={styles.accuracyLeft}>
              <Ionicons name="ribbon-outline" size={20} color={PBColors.positive} />
              <View>
                <Text style={styles.accuracyTitle}>OVERALL ACCURACY</Text>
                <Text style={styles.accuracySubtitle}>
                  {totalBreakersFound} Breakers Found • {totalWrongTaps} Wrong Taps
                </Text>
              </View>
            </View>
            <Text style={styles.accuracyPercent}>{accuracy}%</Text>
          </View>

          {/* Achievements Shortcut Link */}
          <Pressable
            style={styles.achievementsShortcut}
            onPress={() => setScreen('achievements')}
          >
            <View style={styles.shortcutLeft}>
              <Image
                source={uiAssets.icons.trophy}
                style={styles.trophyIcon}
                resizeMode="contain"
              />
              <Text style={styles.shortcutTitle}>VIEW ALL ACHIEVEMENTS</Text>
            </View>
            <Text style={styles.shortcutArrow}>➔</Text>
          </Pressable>

          <View style={{ height: 24 }} />
        </ScrollView>

        <BottomNavigation currentScreen={currentScreen} onNavigate={setScreen} />

        {/* Global Name Customizer Modal */}
        <Modal
          visible={isEditingName}
          transparent
          animationType="fade"
          onRequestClose={() => setIsEditingName(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Ionicons name="person-circle-outline" size={28} color={PBColors.primary} />
                <Text style={styles.modalTitle}>UPDATE PLAYER NAME</Text>
              </View>
              <Text style={styles.modalSubtitle}>
                This name is your global GameHub handle and will sync across all 35 games.
              </Text>

              <TextInput
                value={inputName}
                onChangeText={setInputName}
                style={styles.modalInput}
                placeholder="Enter player name..."
                placeholderTextColor={PBColors.textMuted}
                autoFocus
                maxLength={20}
              />

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setIsEditingName(false)}
                >
                  <Text style={styles.cancelBtnText}>CANCEL</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={handleSaveName}
                >
                  <Text style={styles.saveBtnText}>SAVE NAME</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingTop: 8,
    gap: 12,
  },
  profileCard: {
    padding: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileDetails: {
    flex: 1,
    gap: 3,
  },
  rankPill: {
    backgroundColor: 'rgba(25, 211, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: PBColors.primary,
  },
  rankPillText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: PBColors.primary,
    letterSpacing: 0.8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    maxWidth: '82%',
  },
  editBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(25, 211, 255, 0.15)',
    borderWidth: 1,
    borderColor: PBColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subIdentity: {
    fontSize: 9.5,
    fontWeight: '700',
    color: PBColors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.accent,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48.5%',
    backgroundColor: 'rgba(24, 47, 57, 0.88)',
    borderRadius: PBRadius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(25, 211, 255, 0.18)',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analysisRow: {
    flexDirection: 'row',
    gap: 10,
  },
  analysisCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    gap: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  analysisHeader: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  patternAssetBox: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  patternAssetImg: {
    width: 100,
    height: 38,
  },
  analysisAccuracy: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  accuracyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(24, 47, 57, 0.9)',
    padding: 14,
    borderRadius: PBRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 140, 0.35)',
  },
  accuracyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accuracyTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  accuracySubtitle: {
    fontSize: 9.5,
    color: PBColors.textMuted,
    marginTop: 2,
  },
  accuracyPercent: {
    fontSize: 20,
    fontWeight: '900',
    color: PBColors.positive,
  },
  trophyIcon: {
    width: 22,
    height: 22,
  },
  achievementsShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(24, 47, 57, 0.95)',
    padding: 16,
    borderRadius: PBRadius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 213, 74, 0.4)',
    marginTop: 2,
  },
  shortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shortcutTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1,
  },
  shortcutArrow: {
    fontSize: 16,
    color: PBColors.accent,
    fontWeight: '900',
  },
  // Name Edit Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#0F222B',
    borderRadius: PBRadius.lg,
    padding: 20,
    borderWidth: 1.5,
    borderColor: PBColors.primary,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: PBColors.textSecondary,
    lineHeight: 16,
  },
  modalInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: PBRadius.md,
    borderWidth: 1.5,
    borderColor: PBColors.primary,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: PBRadius.md,
    borderWidth: 1,
  },
  cancelBtn: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cancelBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 1,
  },
  saveBtn: {
    borderColor: PBColors.primary,
    backgroundColor: 'rgba(25, 211, 255, 0.25)',
  },
  saveBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.primary,
    letterSpacing: 1,
  },
});
