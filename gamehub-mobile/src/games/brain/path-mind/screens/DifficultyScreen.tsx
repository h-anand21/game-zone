// ============================================================
// PATH MIND — Screen 04: DifficultyScreen
// Difficulty Selection & Custom Expedition Rules
// Pure vector cards, responsive layout, seamless navigation
// ============================================================

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { TitlePlaque } from '../components/ui/TitlePlaque';
import { GameButton } from '../components/ui/GameButton';
import { usePathMindStore } from '../store/pathMindStore';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';
import { pmAssets } from '../design-system/uiAssets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DifficultyOption {
  id: 'EASY' | 'MEDIUM' | 'HARD' | 'CUSTOM';
  title: string;
  gridDesc: string;
  timeDesc: string;
  runesDesc: string;
  reward: string;
  color: string;
  badge: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  {
    id: 'EASY',
    title: 'APPRENTICE (EASY)',
    gridDesc: '4x4 Stone Grid',
    timeDesc: '5.0s Memorization',
    runesDesc: '4 - 5 Sacred Runes',
    reward: '+10 COINS • 1 STAR',
    color: pmColors.successGreen,
    badge: 'RELAXED EXPEDITION',
  },
  {
    id: 'MEDIUM',
    title: 'PATHFINDER (MEDIUM)',
    gridDesc: '5x5 Stone Grid',
    timeDesc: '3.5s Memorization',
    runesDesc: '6 - 7 Sacred Runes',
    reward: '+25 COINS • 2 STARS',
    color: pmColors.goldBright,
    badge: 'BALANCED PUZZLE',
  },
  {
    id: 'HARD',
    title: 'TEMPLE MASTER (HARD)',
    gridDesc: '6x6 Stone Grid',
    timeDesc: '2.5s Memorization',
    runesDesc: '8 - 10 Sacred Runes',
    reward: '+50 COINS • 3 STARS',
    color: pmColors.dangerRed,
    badge: 'INTENSE CHALLENGE',
  },
  {
    id: 'CUSTOM',
    title: 'CUSTOM EXPEDITION',
    gridDesc: 'Custom 4x4 - 6x6 Board',
    timeDesc: 'Adjustable Timer',
    runesDesc: 'Free Path Complexity',
    reward: 'Training Mode',
    color: pmColors.cyanGlow,
    badge: 'CUSTOM RULES',
  },
];

export const DifficultyScreen: React.FC = () => {
  const { setScreen, selectedDifficulty, hearts, coins } = usePathMindStore();
  const [currentDiff, setCurrentDiff] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'CUSTOM'>(
    selectedDifficulty || 'EASY'
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSelect = (diff: 'EASY' | 'MEDIUM' | 'HARD' | 'CUSTOM') => {
    setCurrentDiff(diff);
    usePathMindStore.setState({ selectedDifficulty: diff });
    // Smooth auto-scroll to the start button on card selection
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  const handleStartGame = () => {
    usePathMindStore.setState({ selectedDifficulty: currentDiff });
    setScreen('gameplay');
  };

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('modes')}
        onSettings={() => setScreen('settings')}
        hearts={hearts}
        coins={coins}
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TitlePlaque
          imageSource={pmAssets.plaques.customDifficulty}
          style={styles.titlePlaque}
        />

        {/* Difficulty Cards */}
        <View style={styles.cardList}>
          {DIFFICULTIES.map((item) => {
            const isSelected = currentDiff === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelect(item.id)}
                style={({ pressed }) => [
                  styles.diffCard,
                  { borderColor: isSelected ? item.color : pmColors.stoneBorder },
                  isSelected && {
                    backgroundColor: 'rgba(16, 28, 40, 0.96)',
                    borderLeftWidth: 6,
                    borderLeftColor: item.color,
                  },
                  pressed && styles.pressed,
                ]}
              >
                {/* Header row */}
                <View style={styles.cardHeader}>
                  <View style={[styles.badgePill, { borderColor: item.color }]}>
                    <Text style={[styles.badgeText, { color: item.color }]}>{item.badge}</Text>
                  </View>
                  <Text style={[styles.rewardText, { color: item.color }]}>{item.reward}</Text>
                </View>

                {/* Title */}
                <Text style={[styles.diffTitle, { color: item.color }]}>{item.title}</Text>

                {/* Specs row */}
                <View style={styles.specsRow}>
                  <View style={styles.specChip}>
                    <Text style={styles.specLabel}>GRID</Text>
                    <Text style={styles.specValue}>{item.gridDesc}</Text>
                  </View>
                  <View style={styles.specChip}>
                    <Text style={styles.specLabel}>MEMORY TIME</Text>
                    <Text style={styles.specValue}>{item.timeDesc}</Text>
                  </View>
                  <View style={styles.specChip}>
                    <Text style={styles.specLabel}>PATH LENGTH</Text>
                    <Text style={styles.specValue}>{item.runesDesc}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Primary CTA Buttons */}
        <View style={styles.ctaSection}>
          <GameButton
            imageSource={pmAssets.buttons.letsPlayGold}
            label="LET'S PLAY"
            size="large"
            width={Math.min(SCREEN_WIDTH - 48, 250)}
            height={66}
            onPress={handleStartGame}
            accessibilityLabel="Start Expedition"
          />

          <View style={styles.subButtonRow}>
            <GameButton
              imageSource={pmAssets.buttons.howToPlayWood}
              label="HOW TO PLAY"
              size="small"
              width={145}
              height={48}
              onPress={() => setScreen('how_to_play')}
              accessibilityLabel="How To Play"
            />
            <GameButton
              imageSource={pmAssets.buttons.worldMapGreen}
              label="WORLD MAP"
              size="small"
              width={145}
              height={48}
              onPress={() => setScreen('world_map')}
              accessibilityLabel="World Map"
            />
          </View>
        </View>
      </ScrollView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
    alignItems: 'center',
  },
  titlePlaque: {
    width: Math.min(SCREEN_WIDTH - 36, 320),
    marginBottom: 16,
    marginTop: 4,
  },
  cardList: {
    width: '100%',
    gap: 12,
  },
  diffCard: {
    width: '100%',
    backgroundColor: 'rgba(12, 20, 28, 0.92)',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: pmRadii.lg,
    padding: 14,
    ...pmShadows.medium,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgePill: {
    borderWidth: 1,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  diffTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  specChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: pmRadii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#243442',
  },
  specLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: pmColors.textMuted,
    letterSpacing: 0.5,
  },
  specValue: {
    fontSize: 11,
    fontWeight: '700',
    color: pmColors.textPrimary,
    marginTop: 1,
  },
  ctaSection: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  subButtonRow: {
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
    marginTop: 4,
  },
});
