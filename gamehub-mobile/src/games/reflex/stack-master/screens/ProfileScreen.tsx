// ============================================================
// STACK MASTER — Screen 14: Player Profile & Achievements
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { COLORS } from '../theme/colors';
import { useStackStore } from '../store/stackStore';
import { StackHaptics } from '../utils/haptics';

interface ProfileScreenProps {
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const playerLevel = useStackStore((state) => state.playerLevel);
  const playerXp = useStackStore((state) => state.playerXp);
  const playerTitle = useStackStore((state) => state.playerTitle);
  const bestScore = useStackStore((state) => state.bestScore);
  const bestHeight = useStackStore((state) => state.bestHeight);
  const totalRuns = useStackStore((state) => state.totalRuns);
  const achievements = useStackStore((state) => state.achievements);
  const claimAchievement = useStackStore((state) => state.claimAchievement);

  const xpCurrent = playerXp % 100;
  const xpTarget = 100;

  return (
    <ScreenBackground type="home" dimAmount={0.5}>
      <View style={styles.container}>
        <GameHeader
          title="PLAYER PROFILE"
          subtitle="BADGES & RANKS"
          onBack={onBack}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 40) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <LinearGradient
            colors={['#102E56', '#091C38']}
            style={styles.profileCard}
          >
            <View style={styles.avatarRing}>
              <Text style={styles.avatarEmoji}>👑</Text>
            </View>

            <Text style={styles.playerName}>STACK ARCHITECT</Text>
            <Text style={styles.titleBadge}>{playerTitle}</Text>

            {/* Level and XP Bar */}
            <View style={styles.xpSection}>
              <View style={styles.xpLabels}>
                <Text style={styles.lvlText}>LEVEL {playerLevel}</Text>
                <Text style={styles.xpText}>{xpCurrent} / {xpTarget} XP</Text>
              </View>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: `${xpCurrent}%` }]} />
              </View>
            </View>

            {/* Quick Career Summary */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNum}>{bestHeight}</Text>
                <Text style={styles.summaryLabel}>MAX HEIGHT</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNum, { color: COLORS.gold }]}>{bestScore}</Text>
                <Text style={styles.summaryLabel}>BEST SCORE</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNum, { color: COLORS.cyan }]}>{totalRuns}</Text>
                <Text style={styles.summaryLabel}>RUNS</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Kingdom Achievements */}
          <Text style={styles.sectionHeader}>ACHIEVEMENTS</Text>
          {achievements.map((ach) => {
            const pct = Math.min(Math.round((ach.current / ach.target) * 100), 100);

            return (
              <LinearGradient
                key={ach.id}
                colors={['#102E56', '#091C38']}
                style={styles.achCard}
              >
                <View style={styles.achIconBox}>
                  <Text style={styles.achIcon}>{ach.icon}</Text>
                </View>

                <View style={styles.achInfo}>
                  <Text style={styles.achTitle}>{ach.title}</Text>
                  <Text style={styles.achDesc}>{ach.description}</Text>

                  <View style={styles.achTrack}>
                    <View style={[styles.achFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.achRatio}>
                    {ach.current} / {ach.target} ({pct}%)
                  </Text>
                </View>

                <View style={styles.achAction}>
                  {ach.claimed ? (
                    <View style={styles.claimedPill}>
                      <Text style={styles.claimedText}>✓</Text>
                    </View>
                  ) : ach.completed ? (
                    <Pressable
                      onPress={() => {
                        StackHaptics.buttonPress();
                        claimAchievement(ach.id);
                      }}
                      style={styles.claimBtn}
                    >
                      <Text style={styles.claimText}>CLAIM 💎</Text>
                    </Pressable>
                  ) : (
                    <Text style={styles.lockIcon}>🔒</Text>
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
  profileCard: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#244B82',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#07162C',
    borderWidth: 2.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  titleBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cyan,
    marginTop: 2,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  xpSection: {
    width: '100%',
    marginVertical: 14,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lvlText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFF',
  },
  xpText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.muted,
  },
  xpTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#07162C',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: COLORS.cyan,
  },
  summaryRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.muted,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#1E3B68',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  achCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#244B82',
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#07162C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achIcon: {
    fontSize: 22,
  },
  achInfo: {
    flex: 1,
    marginRight: 10,
  },
  achTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF',
  },
  achDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginVertical: 3,
  },
  achTrack: {
    width: '100%',
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#07162C',
    overflow: 'hidden',
    marginVertical: 3,
  },
  achFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
  },
  achRatio: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.muted,
  },
  achAction: {
    minWidth: 60,
    alignItems: 'center',
  },
  claimBtn: {
    backgroundColor: COLORS.magenta,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  claimText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF',
  },
  claimedPill: {
    backgroundColor: '#0D3823',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimedText: {
    color: COLORS.success,
    fontWeight: '900',
  },
  lockIcon: {
    fontSize: 16,
  },
});
