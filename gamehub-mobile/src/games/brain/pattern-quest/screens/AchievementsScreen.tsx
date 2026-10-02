// ============================================================
// PATTERN QUEST — Screen 15: AchievementsScreen
// Treasure Chamber Adventure Achievements with Progress Bars
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameHeader } from '../components/common/GameHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

export const AchievementsScreen: React.FC = () => {
  const { currentScreen, setScreen, achievements } = usePatternQuestStore();

  return (
    <GameBackground screen="achievements" overlayDarkness={0.25}>
      <GameHeader onBack={() => setScreen('home')} onSettings={() => setScreen('settings')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenPlaque screen="achievements" width={280} height={140} style={styles.plaque} />

        <View style={styles.achievementsList}>
          {achievements.map((ach) => {
            const isUnlocked = ach.unlocked;
            const progressRatio = Math.min(ach.progress / ach.maxProgress, 1);

            return (
              <View
                key={ach.id}
                style={[
                  styles.achievementCard,
                  isUnlocked && styles.cardUnlocked,
                ]}
              >
                {/* Trophy or Lock Icon */}
                <View style={[styles.iconBox, isUnlocked && styles.iconBoxUnlocked]}>
                  <Image
                    source={isUnlocked ? pqAssets.hud.star : pqAssets.icons.lock}
                    style={styles.achIcon}
                    resizeMode="contain"
                  />
                </View>

                {/* Info */}
                <View style={styles.achInfo}>
                  <View style={styles.titleRow}>
                    <Text style={[pqTypography.h3, { color: isUnlocked ? pqColors.goldBright : '#FFFFFF' }]}>
                      {ach.title}
                    </Text>
                    <Text style={styles.rewardStars}>+{ach.rewardStars} ⭐</Text>
                  </View>

                  <Text style={[pqTypography.caption, styles.achDesc]}>
                    {ach.description}
                  </Text>

                  {/* Progress Bar or Claim Reward */}
                  {isUnlocked ? (
                    <View style={{ marginTop: 8, alignItems: 'flex-start' }}>
                      <Image
                        source={pqAssets.buttons.claimReward}
                        style={{ width: 140, height: 44 }}
                        resizeMode="contain"
                      />
                    </View>
                  ) : (
                    <View style={styles.progressBarWrapper}>
                      <View style={styles.progressBarTrack}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${progressRatio * 100}%`,
                              backgroundColor: pqColors.crystalCyan,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {ach.progress}/{ach.maxProgress}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
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
  achievementsList: {
    width: '100%',
    gap: pqSpacing.md,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 26, 36, 0.92)',
    borderRadius: pqSpacing.radiusMd,
    borderWidth: 2,
    borderColor: '#374151',
    padding: pqSpacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  cardUnlocked: {
    borderColor: '#C5832B',
    backgroundColor: 'rgba(25, 36, 48, 0.96)',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(10, 16, 24, 0.8)',
    borderWidth: 1.5,
    borderColor: '#4A5B6E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: pqSpacing.md,
  },
  iconBoxUnlocked: {
    borderColor: pqColors.gold,
    backgroundColor: 'rgba(245, 176, 65, 0.2)',
  },
  achIcon: {
    width: 28,
    height: 28,
  },
  achInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardStars: {
    fontSize: 12,
    fontWeight: '800',
    color: pqColors.goldBright,
  },
  achDesc: {
    marginTop: 2,
    marginBottom: 6,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(10, 16, 24, 0.9)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: pqColors.textMuted,
  },
});
