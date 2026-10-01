// ============================================================
// REVERSE MIND — Daily Challenge Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameBackground } from '../components/GameBackground';
import { GlowButton } from '../components/GlowButton';
import { BottomTabBar } from '../components/BottomTabBar';
import { MascotCompanion } from '../components/MascotCompanion';
import { useReverseMindStore } from '../store/reverseMindStore';
import type { AppNavScreen } from '../types';
import { RMTheme } from '../theme';

interface DailyChallengeScreenProps {
  onStartDaily: () => void;
  onNavigate: (screen: AppNavScreen) => void;
  onBack: () => void;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({
  onStartDaily,
  onNavigate,
  onBack,
}) => {
  const { playerStats } = useReverseMindStore();
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <GameBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>DAILY FLIP CHALLENGE</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Streak Overview Card */}
          <LinearGradient
            colors={['#2A1808', '#1A0E04']}
            style={styles.streakCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.streakHeader}>
              <Text style={styles.streakFlame}>🔥</Text>
              <View>
                <Text style={styles.streakCount}>{playerStats.dailyStreak} DAYS STREAK</Text>
                <Text style={styles.streakSub}>Keep your daily cognitive momentum!</Text>
              </View>
            </View>

            {/* 7-Day Track */}
            <View style={styles.calendarRow}>
              {weekDays.map((day, idx) => {
                const isCompleted = idx < playerStats.dailyStreak;
                const isToday = idx === playerStats.dailyStreak;

                return (
                  <View key={idx} style={styles.dayCol}>
                    <View
                      style={[
                        styles.dayCircle,
                        isCompleted && styles.dayCompleted,
                        isToday && styles.dayToday,
                      ]}
                    >
                      <Text style={styles.dayCheck}>{isCompleted ? '✓' : idx + 1}</Text>
                    </View>
                    <Text style={styles.dayLabel}>{day}</Text>
                  </View>
                );
              })}
            </View>
          </LinearGradient>

          {/* Today's Mission Card */}
          <View style={styles.missionCard}>
            <View style={styles.ruleBadge}>
              <Text style={styles.ruleBadgeText}>TODAY'S SPECIAL RULE</Text>
            </View>
            <Text style={styles.missionTitle}>REVERSE + IGNORE RED</Text>
            <Text style={styles.missionDesc}>
              Memorize the sequence, but skip all RED items during reverse playback!
            </Text>

            <View style={styles.rewardsRow}>
              <View style={styles.rewardPill}>
                <Text style={styles.rewardText}>🪙 +250 Coins</Text>
              </View>
              <View style={styles.rewardPill}>
                <Text style={styles.rewardText}>💎 +5 Gems</Text>
              </View>
              <View style={styles.rewardPill}>
                <Text style={styles.rewardText}>⚡ 2x XP</Text>
              </View>
            </View>
          </View>

          {/* Mascot Guidance */}
          <MascotCompanion
            state="excited"
            size="md"
            showSpeechBubble={true}
            speechText="Today's challenge gives double rewards!"
          />

          {/* Play Button */}
          <View style={styles.actionArea}>
            <GlowButton
              title="START TODAY'S CHALLENGE"
              variant="gold"
              size="lg"
              icon="⚡"
              onPress={onStartDaily}
            />
          </View>
        </ScrollView>

        <BottomTabBar currentScreen="daily" onNavigate={onNavigate} />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  streakCard: {
    width: '100%',
    borderRadius: RMTheme.radii.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FF9800',
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  streakFlame: {
    fontSize: 32,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFE082',
    letterSpacing: 1,
  },
  streakSub: {
    fontSize: 11,
    color: '#FFCC80',
    marginTop: 2,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dayCol: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayCompleted: {
    backgroundColor: '#FF9800',
    borderColor: '#FFA726',
  },
  dayToday: {
    borderColor: RMTheme.colors.cyanNeon,
    borderWidth: 2,
  },
  dayCheck: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8CA0B8',
    marginTop: 4,
  },
  missionCard: {
    width: '100%',
    backgroundColor: 'rgba(16, 27, 43, 0.75)',
    borderRadius: RMTheme.radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(77, 231, 255, 0.3)',
    alignItems: 'center',
    marginBottom: 16,
  },
  ruleBadge: {
    backgroundColor: 'rgba(255, 94, 108, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RMTheme.colors.coralRed,
    marginBottom: 8,
  },
  ruleBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: RMTheme.colors.coralRed,
    letterSpacing: 1.2,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  missionDesc: {
    fontSize: 12,
    color: RMTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  rewardPill: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RMTheme.radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.3)',
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFE082',
  },
  actionArea: {
    width: '100%',
    marginTop: 12,
  },
});
