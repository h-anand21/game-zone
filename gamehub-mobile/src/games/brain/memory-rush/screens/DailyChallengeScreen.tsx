// ============================================================
// MEMORY RUSH — 12 Daily Challenge Screen (Treasure Shrine)
// Golden Chest, 7-Day Road, Task Tablets & Tactile 3D Altar Button
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { JungleHeaderHUD } from '../components/JungleHeaderHUD';
import { WoodPanel } from '../components/WoodPanel';
import { StonePanel } from '../components/StonePanel';
import { JungleButton } from '../components/JungleButton';
import { BottomTabBar, TabType } from '../components/BottomTabBar';
import { MRIcon } from '../components/MRIcon';
import { MRColors } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';

interface DailyChallengeScreenProps {
  onStartDaily: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({
  onStartDaily,
  onNavigateTab,
}) => {
  const { dailyChallenge } = useMemoryRushStore();

  const isCompleted = dailyChallenge.completed;
  const currentProgress = dailyChallenge.roundsCleared || 0;
  const totalRounds = dailyChallenge.totalRounds || 10;
  const progressPercent = Math.min(100, Math.round((currentProgress / totalRounds) * 100));

  return (
    <JungleWorldBackground variant="daily">
      <SafeAreaView style={styles.container}>
        {/* Header HUD */}
        <JungleHeaderHUD
          title="DAILY CHALLENGE"
          subtitle="TREASURE SHRINE"
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Shrine Wood Plaque */}
          <WoodPanel variant="sign" style={styles.heroWood}>
            <View style={styles.heroInner}>
              <View style={styles.badgeRow}>
                <View style={styles.missionBadge}>
                  <MRIcon name="zap" size={13} color="#FFD700" />
                  <Text style={styles.missionBadgeText}>SACRED TRIAL</Text>
                </View>
                <View style={styles.rewardBadge}>
                  <Text style={styles.rewardBadgeText}>🎁 +500 XP • 3 GEMS</Text>
                </View>
              </View>

              <Text style={styles.chestEmoji}>🏺</Text>
              <Text style={styles.challengeTitle}>10 ROUND TRIAL</Text>
              <Text style={styles.challengeSub}>ONE EXPEDITION. NO SECOND CHANCES.</Text>

              {/* Carved Stone Progress Track */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>SHRINE PROGRESS</Text>
                  <Text style={styles.progressValue}>
                    {currentProgress} / {totalRounds} ROUNDS
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
              </View>

              {isCompleted ? (
                <View style={styles.completedBox}>
                  <MRIcon name="check-circle" size={24} color="#10B981" />
                  <Text style={styles.completedText}>SHRINE CONQUERED ✓</Text>
                  {dailyChallenge.score !== undefined && (
                    <Text style={styles.completedSub}>
                      EXPEDITION SCORE: {dailyChallenge.score.toLocaleString()} PTS
                    </Text>
                  )}
                </View>
              ) : (
                <JungleButton
                  title={currentProgress > 0 ? "CONTINUE TRIAL ▶" : "ENTER TRIAL ▶"}
                  size="hero"
                  variant="gold"
                  onPress={onStartDaily}
                />
              )}
            </View>
          </WoodPanel>

          {/* Shrine Rules Stone Tablet */}
          <StonePanel variant="carved" style={styles.rulesStone}>
            <Text style={styles.rulesTitle}>TEMPLE TRIAL CODEX</Text>

            <View style={styles.ruleItem}>
              <View style={styles.ruleIconPill}>
                <MRIcon name="shield" size={15} color="#FFD700" />
              </View>
              <Text style={styles.ruleText}>
                Fixed challenge sequence spanning all 5 memory game modes.
              </Text>
            </View>

            <View style={styles.ruleItem}>
              <View style={styles.ruleIconPill}>
                <MRIcon name="clock" size={15} color="#38BDF8" />
              </View>
              <Text style={styles.ruleText}>
                Elevated speed requirements. Razor-sharp mental focus required.
              </Text>
            </View>

            <View style={styles.ruleItem}>
              <View style={styles.ruleIconPill}>
                <MRIcon name="award" size={15} color="#10B981" />
              </View>
              <Text style={styles.ruleText}>
                Unlocks exclusive daily streak multiplier and ancient runes.
              </Text>
            </View>
          </StonePanel>

          <View style={{ height: 90 }} />
        </ScrollView>

        <BottomTabBar currentScreen="daily" onNavigate={(scr) => onNavigateTab(scr as any)} />
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
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  missionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  missionBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
  },
  rewardBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34D399',
  },
  rewardBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#34D399',
    letterSpacing: 0.8,
  },
  chestEmoji: {
    fontSize: 44,
    marginVertical: 4,
  },
  challengeTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor: '#4A2800',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  challengeSub: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 1.2,
    marginTop: 2,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D1DEC8',
    letterSpacing: 1,
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
  },
  progressTrack: {
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#607284',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  completedBox: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#10B981',
    width: '100%',
  },
  completedText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 1.2,
  },
  completedSub: {
    fontSize: 11,
    color: '#E2CA92',
    fontWeight: '700',
  },
  rulesStone: {
    width: '100%',
  },
  rulesTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  ruleIconPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1.5,
    borderColor: '#607284',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleText: {
    fontSize: 12,
    color: '#D1DEC8',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
});
