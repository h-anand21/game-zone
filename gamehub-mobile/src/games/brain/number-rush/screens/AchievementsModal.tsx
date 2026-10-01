// ============================================================
// Number Rush — Arcade Achievements & Badges Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, WoodPanel, BottomNavBar } from '../components';

export const AchievementsModal: React.FC = () => {
  const { setScreen, achievements, claimAchievement } = useNumberRushStore();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <View style={styles.container}>
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="ACHIEVEMENTS" />

      {/* Progress Header */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryTitle}>TROPHY COLLECTION</Text>
        <Text style={styles.summaryCount}>
          {unlockedCount} / {achievements.length} UNLOCKED
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.list}>
          {achievements.map((ach) => {
            const isCompleted = ach.current >= ach.max || ach.unlocked;
            const progress = Math.min(100, Math.round((ach.current / ach.max) * 100));

            return (
              <WoodPanel
                key={ach.id}
                style={styles.achCard}
                variant={isCompleted ? 'gold' : 'card'}
                hasRivets={false}
              >
                <View style={styles.cardRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      isCompleted && styles.iconCompleted,
                    ]}
                  >
                    <Text style={styles.achIcon}>{ach.icon}</Text>
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={styles.achTitle}>{ach.title}</Text>
                    <Text style={styles.achDesc}>{ach.desc}</Text>

                    {/* Progress Bar */}
                    <View style={styles.progressRow}>
                      <View style={styles.track}>
                        <View
                          style={[
                            styles.fill,
                            { width: `${isCompleted ? 100 : progress}%` },
                            isCompleted && styles.fillCompleted,
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {isCompleted ? 'DONE' : `${ach.current}/${ach.max}`}
                      </Text>
                    </View>
                  </View>

                  {/* Reward Action */}
                  <View style={styles.actionCol}>
                    {ach.rewardCoins > 0 ? (
                      <Pressable
                        onPress={() => claimAchievement(ach.id)}
                        disabled={!isCompleted}
                        style={[
                          styles.claimBtn,
                          !isCompleted && styles.claimBtnLocked,
                        ]}
                      >
                        <Text style={styles.claimIcon}>🪙</Text>
                        <Text style={styles.claimText}>+{ach.rewardCoins}</Text>
                      </Pressable>
                    ) : (
                      <View style={styles.claimedPill}>
                        <Text style={styles.claimedText}>CLAIMED</Text>
                      </View>
                    )}
                  </View>
                </View>
              </WoodPanel>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0D223B',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  summaryTitle: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  summaryCount: {
    color: '#2ED573',
    fontSize: 12,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 16,
  },
  list: {
    gap: 12,
  },
  achCard: {
    padding: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16365E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  iconCompleted: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderColor: '#FFC107',
  },
  achIcon: {
    fontSize: 24,
  },
  infoCol: {
    flex: 1,
  },
  achTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  achDesc: {
    color: '#8CA0BA',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  track: {
    flex: 1,
    height: 7,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  fill: {
    height: '100%',
    backgroundColor: '#1E90FF',
    borderRadius: 4,
  },
  fillCompleted: {
    backgroundColor: '#2ED573',
  },
  progressText: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '800',
  },
  actionCol: {
    marginLeft: 10,
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFE082',
  },
  claimBtnLocked: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
    opacity: 0.6,
  },
  claimIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  claimText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
  },
  claimedPill: {
    backgroundColor: 'rgba(46, 213, 115, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2ED573',
  },
  claimedText: {
    color: '#2ED573',
    fontSize: 10,
    fontWeight: '900',
  },
});
