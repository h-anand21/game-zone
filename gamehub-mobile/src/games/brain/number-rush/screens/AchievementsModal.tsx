// ============================================================
// Number Rush — Screen 18: ACHIEVEMENTS (Jungle Achievements Game UI Reference)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, WoodPanel, BottomNavBar, MascotIllustration } from '../components';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

type AchCategory = 'ALL' | 'GENERAL' | 'GAMEPLAY' | 'STREAK' | 'SPECIAL';

export const AchievementsModal: React.FC = () => {
  const { setScreen, achievements, claimAchievement } = useNumberRushStore();
  const [activeTab, setActiveTab] = useState<AchCategory>('ALL');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const overallPercent = Math.min(100, Math.round((unlockedCount / totalCount) * 100));

  const filteredAchievements = achievements.filter((ach) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'GENERAL') return ach.category === 'score' || ach.category === 'games';
    if (activeTab === 'GAMEPLAY') return ach.category === 'modes' || ach.category === 'accuracy';
    if (activeTab === 'STREAK') return ach.category === 'combo' || ach.category === 'streak';
    if (activeTab === 'SPECIAL') return ach.category === 'special';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="ACHIEVEMENTS" />

      {/* 3. Category Tabs Bar */}
      <View style={styles.tabsRow}>
        {(['ALL', 'GENERAL', 'GAMEPLAY', 'STREAK', 'SPECIAL'] as AchCategory[]).map(
          (tab) => {
            const isSelected = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, isSelected && styles.activeTab]}
              >
                <Text style={[styles.tabText, isSelected && styles.activeTabText]}>
                  {tab}
                </Text>
              </Pressable>
            );
          }
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 4. Carved Billboard Header with Tiger Mascot */}
        <View style={styles.headerBillboard}>
          <View style={styles.mascotHolder}>
            <MascotIllustration size={75} character="tiger" mood="happy" showAura={false} />
          </View>
          <View style={styles.billboardBody}>
            <Text style={styles.billboardSub}>TROPHY COLLECTION</Text>
            <Text style={styles.billboardTitle}>ACHIEVEMENTS</Text>
          </View>
        </View>

        {/* 5. Summary Progress Bar */}
        <WoodPanel style={styles.summaryCard} variant="glass" hasRivets={false}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.summaryTitle}>TOTAL COMPLETION</Text>
            <Text style={styles.summaryVal}>
              {unlockedCount} / {totalCount} ({overallPercent}%)
            </Text>
          </View>
          <View style={styles.summaryTrack}>
            <View style={[styles.summaryFill, { width: `${overallPercent}%` }]} />
          </View>
        </WoodPanel>

        {/* 6. List of Achievement Cards */}
        <View style={styles.list}>
          {filteredAchievements.map((ach) => {
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
                  {/* Icon Badge */}
                  <View
                    style={[
                      styles.iconCircle,
                      isCompleted && styles.iconCompleted,
                    ]}
                  >
                    <Text style={styles.achIcon}>{ach.icon}</Text>
                  </View>

                  <View style={styles.infoCol}>
                    <View style={styles.titleRow}>
                      <Text style={styles.achTitle}>{ach.title}</Text>
                      {isCompleted && (
                        <View style={styles.unlockedPill}>
                          <Text style={styles.unlockedText}>UNLOCKED</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.achDesc}>{ach.desc}</Text>

                    {/* Progress Track */}
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
                        {isCompleted ? 'COMPLETED' : `${ach.current}/${ach.max}`}
                      </Text>
                    </View>
                  </View>

                  {/* Reward Action */}
                  <View style={styles.actionCol}>
                    {ach.rewardCoins > 0 && !ach.unlocked ? (
                      <Pressable
                        onPress={() => claimAchievement(ach.id)}
                        disabled={!isCompleted}
                        style={({ pressed }) => [
                          styles.claimBtn,
                          !isCompleted && styles.claimBtnLocked,
                          pressed && styles.btnPressed,
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

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Global Bottom Navigation */}
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
  },
  darkVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(7, 27, 52, 0.75)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  activeTab: {
    backgroundColor: '#2ED573',
  },
  tabText: {
    color: '#8CA0BA',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#04160D',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerBillboard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
    padding: 12,
    marginBottom: 12,
  },
  mascotHolder: {
    marginRight: 10,
  },
  billboardBody: {
    flex: 1,
  },
  billboardSub: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  billboardTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  summaryCard: {
    padding: 12,
    marginBottom: 14,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryTitle: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  summaryVal: {
    color: '#2ED573',
    fontSize: 11,
    fontWeight: '900',
  },
  summaryTrack: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryFill: {
    height: '100%',
    backgroundColor: '#2ED573',
    borderRadius: 5,
  },
  list: {
    gap: 10,
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
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconCompleted: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 193, 7, 0.25)',
  },
  achIcon: {
    fontSize: 24,
  },
  infoCol: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  achTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  unlockedPill: {
    backgroundColor: 'rgba(46, 213, 115, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  unlockedText: {
    color: '#2ED573',
    fontSize: 8,
    fontWeight: '900',
  },
  achDesc: {
    color: '#8CA0BA',
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 6,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#00E5FF',
    borderRadius: 3,
  },
  fillCompleted: {
    backgroundColor: '#2ED573',
  },
  progressText: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '800',
  },
  actionCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimBtn: {
    backgroundColor: '#FFB800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
  },
  claimBtnLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  btnPressed: {
    transform: [{ scale: 0.95 }],
  },
  claimIcon: {
    fontSize: 12,
  },
  claimText: {
    color: '#071324',
    fontSize: 10,
    fontWeight: '900',
  },
  claimedPill: {
    backgroundColor: 'rgba(46, 213, 115, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2ED573',
  },
  claimedText: {
    color: '#2ED573',
    fontSize: 9,
    fontWeight: '900',
  },
});
