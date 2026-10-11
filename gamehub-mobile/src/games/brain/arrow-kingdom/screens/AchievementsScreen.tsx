// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 11: Achievements Screen
// Kingdom career badges, milestones, progress bars & tributes
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { FantasyBackground } from '../components/ui/FantasyBackground';
import { WoodHeader } from '../components/ui/WoodHeader';
import { CurrencyBar } from '../components/ui/CurrencyBar';
import { ACHIEVEMENTS } from '../data/achievements';
import { useGameStore } from '../store/gameStore';
import { ArrowHaptics } from '../utils/haptics';

interface AchievementsScreenProps {
  onBack: () => void;
  onOpenShop: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  onBack,
  onOpenShop,
}) => {
  const insets = useSafeAreaInsets();
  const unlockedLevels = useGameStore((state) => state.unlockedLevels);
  const completedLevels = useGameStore((state) => state.completedLevels);
  const unlockedThemes = useGameStore((state) => state.unlockedThemes);
  const dailyStreak = useGameStore((state) => state.dailyStreak);
  const claimedAchievements = useGameStore((state) => state.claimedAchievements);
  const claimAchievementInStore = useGameStore((state) => state.claimAchievement);

  // Calculate stats
  const totalCompleted = Object.keys(completedLevels).length;
  const threeStarCount = Object.values(completedLevels).filter((r) => r.stars === 3).length;

  const getProgress = (id: string, goal: number): number => {
    switch (id) {
      case 'first_clear':
        return Math.min(goal, totalCompleted);
      case 'puzzle_apprentice':
        return Math.min(goal, totalCompleted);
      case 'forest_master':
        return Math.min(goal, Object.keys(completedLevels).filter((k) => Number(k) <= 8).length);
      case 'perfect_tactician':
        return Math.min(goal, threeStarCount);
      case 'theme_collector':
        return Math.min(goal, unlockedThemes.length);
      case 'daily_voyager':
        return Math.min(goal, dailyStreak);
      case 'grand_archmage':
        return Math.min(goal, totalCompleted);
      default:
        return totalCompleted >= 1 ? 1 : 0;
    }
  };

  const handleClaim = (achId: string, coins: number, gems: number) => {
    ArrowHaptics.victory();
    claimAchievementInStore(achId, coins, gems);
  };

  return (
    <FantasyBackground>
      <View style={styles.container}>
        <WoodHeader
          title="ACHIEVEMENTS"
          subtitle="BADGES & TRIBUTES"
          onBack={onBack}
          rightAction={<CurrencyBar onOpenShop={onOpenShop} />}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 36) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {ACHIEVEMENTS.map((ach) => {
            const currentProgress = getProgress(ach.id, ach.goal);
            const isCompleted = currentProgress >= ach.goal;
            const isClaimed = claimedAchievements.includes(ach.id);
            const progressRatio = Math.min(1, currentProgress / ach.goal);

            return (
              <View key={ach.id} style={styles.card}>
                <LinearGradient
                  colors={isClaimed ? ['#0B233D', '#07182B'] : ['#10395C', '#071F36']}
                  style={styles.cardGrad}
                >
                  <View style={styles.row}>
                    <View style={styles.iconBox}>
                      <Text style={styles.iconEmoji}>{ach.icon}</Text>
                    </View>

                    <View style={styles.infoCol}>
                      <Text style={styles.achTitle}>{ach.title}</Text>
                      <Text style={styles.achDesc}>{ach.description}</Text>

                      {/* Progress Bar */}
                      <View style={styles.progressRow}>
                        <View style={styles.track}>
                          <View
                            style={[
                              styles.fill,
                              {
                                width: `${Math.round(progressRatio * 100)}%`,
                                backgroundColor: isCompleted ? COLORS.green : COLORS.blue,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {currentProgress}/{ach.goal}
                        </Text>
                      </View>
                    </View>

                    {/* Claim Button / Status */}
                    <View style={styles.actionCol}>
                      {isClaimed ? (
                        <View style={styles.claimedBadge}>
                          <Text style={styles.claimedText}>CLAIMED ✓</Text>
                        </View>
                      ) : isCompleted ? (
                        <Pressable
                          onPress={() => handleClaim(ach.id, ach.rewardCoins, ach.rewardGems)}
                          style={({ pressed }) => [styles.claimBtn, pressed && styles.btnPressed]}
                        >
                          <LinearGradient colors={['#78F329', '#22C51D']} style={styles.claimBtnGrad}>
                            <Text style={styles.claimBtnText}>CLAIM</Text>
                            <Text style={styles.rewardText}>+{ach.rewardCoins}🪙</Text>
                          </LinearGradient>
                        </Pressable>
                      ) : (
                        <View style={styles.rewardLockedBox}>
                          <Text style={styles.lockedRewardText}>+{ach.rewardCoins}🪙</Text>
                          {ach.rewardGems > 0 ? (
                            <Text style={[styles.lockedRewardText, { color: COLORS.gem }]}>
                              +{ach.rewardGems}💎
                            </Text>
                          ) : null}
                        </View>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3D1C08',
    backgroundColor: '#351503',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
  },
  cardGrad: {
    padding: 14,
    borderRadius: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 22,
  },
  infoCol: {
    flex: 1,
  },
  achTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1,
  },
  achDesc: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
    lineHeight: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.muted,
  },
  actionCol: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  claimBtn: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#127A12',
    overflow: 'hidden',
  },
  btnPressed: {
    transform: [{ scale: 0.96 }],
  },
  claimBtnGrad: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  claimBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#073307',
  },
  rewardText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#073307',
  },
  claimedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  claimedText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.muted,
  },
  rewardLockedBox: {
    alignItems: 'center',
  },
  lockedRewardText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.gold,
  },
});

export default AchievementsScreen;
