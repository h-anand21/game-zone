// ============================================================
// STACK MASTER — Screen 12: Daily Challenge & Missions
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { PrimaryButton } from '../ui/PrimaryButton';
import { COLORS } from '../theme/colors';
import { useStackStore } from '../store/stackStore';
import { StackHaptics } from '../utils/haptics';

interface DailyChallengeScreenProps {
  onBack: () => void;
  onPlayDaily: () => void;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({
  onBack,
  onPlayDaily,
}) => {
  const insets = useSafeAreaInsets();
  const dailyStreak = useStackStore((state) => state.dailyStreak);
  const missions = useStackStore((state) => state.missions);
  const claimMission = useStackStore((state) => state.claimMission);

  return (
    <ScreenBackground type="home" dimAmount={0.5}>
      <View style={styles.container}>
        <GameHeader
          title="DAILY TRIAL"
          subtitle="MISSIONS & STREAKS"
          onBack={onBack}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 40) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Daily Streak Card */}
          <LinearGradient
            colors={['#2E143B', '#15081E']}
            style={styles.streakCard}
          >
            <View style={styles.streakHeader}>
              <Text style={styles.streakIcon}>🔥</Text>
              <View>
                <Text style={styles.streakTitle}>{dailyStreak} DAY STREAK</Text>
                <Text style={styles.streakSub}>PLAY DAILY TO EARN BONUS CROWNS</Text>
              </View>
            </View>

            {/* Streak days row */}
            <View style={styles.daysRow}>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isReached = day <= dailyStreak;
                return (
                  <View
                    key={day}
                    style={[
                      styles.dayBox,
                      isReached && styles.dayBoxActive,
                    ]}
                  >
                    <Text style={[styles.dayText, isReached && styles.dayTextActive]}>
                      D{day}
                    </Text>
                    <Text style={styles.dayReward}>
                      {day === 7 ? '👑' : '🪙'}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Play Daily Button */}
            <PrimaryButton
              title="PLAY TODAY'S TRIAL ▶"
              variant="magenta"
              onPress={onPlayDaily}
            />
          </LinearGradient>

          {/* Daily Missions List */}
          <Text style={styles.sectionTitle}>TODAY'S MISSIONS</Text>

          {missions.map((m) => {
            const pct = Math.min(Math.round((m.progress / m.target) * 100), 100);

            return (
              <LinearGradient
                key={m.id}
                colors={['#102E56', '#091C38']}
                style={styles.missionCard}
              >
                <View style={styles.missionInfo}>
                  <Text style={styles.missionTitle}>{m.title}</Text>
                  <Text style={styles.missionDesc}>{m.description}</Text>

                  {/* Progress bar */}
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.progressRatio}>
                    {m.progress} / {m.target} ({pct}%)
                  </Text>
                </View>

                {/* Claim Button / Reward Badge */}
                <View style={styles.missionAction}>
                  {m.claimed ? (
                    <View style={styles.claimedBadge}>
                      <Text style={styles.claimedText}>✓ CLAIMED</Text>
                    </View>
                  ) : m.completed ? (
                    <Pressable
                      onPress={() => {
                        StackHaptics.buttonPress();
                        claimMission(m.id);
                      }}
                      style={styles.claimBtn}
                    >
                      <Text style={styles.claimText}>CLAIM 🪙{m.rewardCoins}</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.lockedReward}>
                      <Text style={styles.rewardCoins}>🪙 {m.rewardCoins}</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            );
          })}
        </ScrollView>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  streakCard: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.magenta,
    padding: 20,
    marginBottom: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.2,
  },
  streakSub: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.magentaLight,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayBox: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(7, 19, 41, 0.75)',
    borderWidth: 1,
    borderColor: '#3B1A4A',
    minWidth: 40,
  },
  dayBoxActive: {
    borderColor: COLORS.magenta,
    backgroundColor: 'rgba(255, 72, 200, 0.25)',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.muted,
  },
  dayTextActive: {
    color: '#FFF',
    fontWeight: '900',
  },
  dayReward: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  missionCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#244B82',
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionInfo: {
    flex: 1,
    marginRight: 12,
  },
  missionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
  },
  missionDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginVertical: 4,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#07162C',
    marginVertical: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.cyan,
    borderRadius: 3,
  },
  progressRatio: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.muted,
  },
  missionAction: {
    minWidth: 90,
    alignItems: 'center',
  },
  claimBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  claimText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#071329',
  },
  claimedBadge: {
    backgroundColor: '#0D3823',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  claimedText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.success,
  },
  lockedReward: {
    backgroundColor: 'rgba(7, 19, 41, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rewardCoins: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.gold,
  },
});
