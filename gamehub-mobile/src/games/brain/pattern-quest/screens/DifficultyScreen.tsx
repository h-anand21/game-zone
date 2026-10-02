// ============================================================
// PATTERN QUEST — Screen 05: DifficultyScreen
// Three Carved Stone Pillars (EASY, MEDIUM, HARD) + SMART MODE toggle
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameHeader } from '../components/common/GameHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { GameButton } from '../components/buttons/GameButton';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';
import { PQDifficulty } from '../types';

interface DiffOption {
  key: PQDifficulty;
  title: string;
  tag: string;
  asset: any;
  color: string;
  description: string;
}

const DIFFICULTIES: DiffOption[] = [
  {
    key: 'EASY',
    title: 'TRAIL SCOUT',
    tag: 'EASY',
    asset: pqAssets.buttons.diffEasy,
    color: '#2ECC71',
    description: '4-item sequences • Single rule shifts • Generous timer (30s)',
  },
  {
    key: 'MEDIUM',
    title: 'TEMPLE EXPLORER',
    tag: 'MEDIUM',
    asset: pqAssets.buttons.diffNormal,
    color: '#00F0FF',
    description: '5-item sequences • Rotations & transformations • Dynamic timer (25s)',
  },
  {
    key: 'HARD',
    title: 'PATTERN MASTER',
    tag: 'HARD',
    asset: pqAssets.buttons.diffHard,
    color: '#FFA502',
    description: '6-item sequences • Multi-attribute matrices • Strict timer (20s)',
  },
];

export const DifficultyScreen: React.FC = () => {
  const { difficulty, setDifficulty, smartMode, setSmartMode, setScreen } = usePatternQuestStore();

  const handleSelect = (diff: PQDifficulty) => {
    setDifficulty(diff);
  };

  return (
    <GameBackground screen="difficulty" overlayDarkness={0.25}>
      <GameHeader onBack={() => setScreen('mode_select')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenPlaque screen="difficulty" width={270} height={135} style={styles.plaque} />

        {/* 3 Physical Difficulty Stones */}
        <View style={styles.pillarsContainer}>
          {DIFFICULTIES.map((d) => {
            const isSelected = difficulty === d.key;
            return (
              <Pressable
                key={d.key}
                onPress={() => handleSelect(d.key)}
                style={[
                  styles.pillarCard,
                  { borderColor: isSelected ? d.color : '#374151' },
                  isSelected && styles.pillarSelected,
                ]}
              >
                <Image source={d.asset} style={styles.diffPlaqueImg} resizeMode="contain" />
                <View style={styles.pillarTextCol}>
                  <Text style={[pqTypography.h2, { color: isSelected ? d.color : '#FFFFFF' }]}>
                    {d.title}
                  </Text>
                  <Text style={[pqTypography.caption, styles.diffDesc]}>{d.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Smart Mode Dynamic Switch */}
        <Pressable
          style={styles.smartModeRow}
          onPress={() => setSmartMode(!smartMode)}
        >
          <View style={styles.smartTextCol}>
            <Text style={pqTypography.h3}>SMART DIFFICULTY</Text>
            <Text style={pqTypography.caption}>
              Adapts puzzle complexity in real-time based on your streaks
            </Text>
          </View>
          <Image
            source={smartMode ? pqAssets.icons.toggleOn : pqAssets.icons.toggleOff}
            style={styles.toggleIcon}
            resizeMode="contain"
          />
        </Pressable>

        {/* Action Button: START EXPEDITION */}
        <GameButton
          buttonAsset={pqAssets.buttons.playNow}
          onPress={() => setScreen('ready')}
          width={260}
          height={68}
          style={{ marginTop: pqSpacing.base }}
        />
      </ScrollView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: pqSpacing.base,
    paddingBottom: 40,
    alignItems: 'center',
  },
  plaque: {
    marginBottom: pqSpacing.md,
  },
  pillarsContainer: {
    width: '100%',
    gap: pqSpacing.md,
    marginBottom: pqSpacing.base,
  },
  pillarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 26, 36, 0.95)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2.5,
    borderBottomWidth: 5,
    padding: pqSpacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  pillarSelected: {
    backgroundColor: 'rgba(25, 38, 52, 0.98)',
    transform: [{ scale: 1.02 }],
  },
  diffPlaqueImg: {
    width: 80,
    height: 52,
    marginRight: pqSpacing.md,
  },
  pillarTextCol: {
    flex: 1,
  },
  diffDesc: {
    marginTop: 3,
    fontSize: 12,
  },
  smartModeRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 33, 0.9)',
    borderWidth: 1.5,
    borderColor: pqColors.crystalCyan,
    borderRadius: pqSpacing.radiusMd,
    padding: pqSpacing.base,
    marginBottom: pqSpacing.md,
  },
  smartTextCol: {
    flex: 1,
    marginRight: pqSpacing.md,
  },
  toggleIcon: {
    width: 60,
    height: 34,
  },
});
