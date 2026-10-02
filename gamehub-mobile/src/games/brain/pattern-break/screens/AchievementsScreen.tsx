// ============================================================
// PATTERN BREAKER — 17 Achievements Screen
// Illustrated achievement crests with unlocked & progress states
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AchievementBadge } from '../components/badges/AchievementBadge';
import { PBColors } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const AchievementsScreen: React.FC = () => {
  const { achievements, setScreen, goBack } = usePatternBreakStore();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="ACHIEVEMENTS"
          onBack={goBack}
          onSettings={() => setScreen('settings')}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerInfo}>
            <View style={styles.badgeCounterRow}>
              <Ionicons name="trophy" size={14} color={PBColors.accent} style={{ marginRight: 6 }} />
              <Text style={styles.badgeCounter}>
                {unlockedCount} / {achievements.length} UNLOCKED
              </Text>
            </View>
          </View>

          {achievements.map((ach) => (
            <AchievementBadge key={ach.id} achievement={ach} />
          ))}

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeCounter: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1.5,
  },
});
