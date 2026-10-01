import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { GameBackground } from '../components/GameBackground';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { BottomTabBar, TabType } from '../components/BottomTabBar';
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
  const currentProgress = dailyChallenge.currentRound || 0;
  const totalRounds = dailyChallenge.totalRounds || 10;
  const progressPercent = Math.min(100, Math.round((currentProgress / totalRounds) * 100));

  return (
    <GameBackground variant="daily">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>DAILY SPECIAL</Text>
            <Text style={styles.headerTitle}>TODAY'S RUSH</Text>
          </View>

          {/* Hero Challenge Card */}
          <GlassCard variant="glow" style={styles.heroCard}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Feather name="zap" size={12} color={colors.accent} />
                <Text style={styles.badgeText}>SPECIAL MISSION</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(250, 204, 21, 0.15)' }]}>
                <Feather name="star" size={12} color={colors.warning} />
                <Text style={[styles.badgeText, { color: colors.warning }]}>+500 XP</Text>
              </View>
            </View>

            <Text style={styles.challengeTitle}>10 ROUNDS</Text>
            <Text style={styles.challengeSubtitle}>ONE ATTEMPT. NO MISTAKES.</Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>PROGRESS</Text>
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
                <Feather name="check-circle" size={24} color={colors.success} />
                <Text style={styles.completedText}>DAILY COMPLETE ✓</Text>
                {dailyChallenge.score !== undefined && (
                  <Text style={styles.completedSub}>
                    SCORE: {dailyChallenge.score.toLocaleString()}
                  </Text>
                )}
              </View>
            ) : (
              <PrimaryButton
                title={currentProgress > 0 ? "CONTINUE DAILY →" : "START DAILY →"}
                onPress={onStartDaily}
                style={styles.startButton}
              />
            )}
          </GlassCard>

          {/* Rules & Rewards info */}
          <GlassCard style={styles.infoCard}>
            <Text style={styles.infoTitle}>CHALLENGE RULES</Text>
            <View style={styles.ruleItem}>
              <Feather name="shield" size={16} color={colors.accent} />
              <Text style={styles.ruleText}>Fixed round order across all 5 memory modes.</Text>
            </View>
            <View style={styles.ruleItem}>
              <Feather name="clock" size={16} color={colors.accent} />
              <Text style={styles.ruleText}>Strict timer pressure. Focus is key.</Text>
            </View>
            <View style={styles.ruleItem}>
              <Feather name="award" size={16} color={colors.warning} />
              <Text style={styles.ruleText}>Earn +500 XP and streak multiplier bonuses.</Text>
            </View>
          </GlassCard>

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomTabBar currentScreen="daily" onNavigate={(scr) => onNavigateTab(scr as any)} />
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  heroCard: {
    padding: 24,
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
    letterSpacing: 1,
  },
  challengeTitle: {
    fontSize: 32,
    fontWeight: typography.fontWeight.black,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  challengeSubtitle: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 24,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 5,
  },
  startButton: {
    width: '100%',
  },
  completedBox: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  completedText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    letterSpacing: 1,
  },
  completedSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoCard: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  ruleText: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
  },
});
