// ============================================================
// MEMORY RUSH — 04 Difficulty Selection Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { GameBackground } from '../components/GameBackground';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { MRIcon } from '../components/MRIcon';
import { MRColors } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';
import type { GameMode, GameDifficulty } from '../types';

interface DifficultyScreenProps {
  mode: GameMode;
  onConfirm: (difficulty: GameDifficulty) => void;
  onBack: () => void;
}

interface DiffOption {
  id: GameDifficulty;
  title: string;
  gridDesc: string;
  timeDesc: string;
  previewDesc: string;
  tagline: string;
}

const DIFF_OPTIONS: DiffOption[] = [
  {
    id: 'easy',
    title: 'EASY',
    gridDesc: '2 × 3 GRID',
    timeDesc: '30 SEC TIMER',
    previewDesc: '2.5 SEC PREVIEW',
    tagline: 'Start here. Perfect for warming up.',
  },
  {
    id: 'medium',
    title: 'MEDIUM',
    gridDesc: '3 × 4 GRID',
    timeDesc: '20 SEC TIMER',
    previewDesc: '1.5 SEC PREVIEW',
    tagline: 'Find your focus. Balanced rush.',
  },
  {
    id: 'hard',
    title: 'HARD',
    gridDesc: '4 × 4 GRID',
    timeDesc: '15 SEC TIMER',
    previewDesc: '0.8 SEC PREVIEW',
    tagline: 'Enter the rush. Maximum pressure.',
  },
];

export const DifficultyScreen: React.FC<DifficultyScreenProps> = ({
  mode,
  onConfirm,
  onBack,
}) => {
  const { difficulty, setDifficulty, settings, toggleSetting } = useMemoryRushStore();
  const [selectedDiff, setSelectedDiff] = useState<GameDifficulty>(difficulty);

  const handleStart = () => {
    setDifficulty(selectedDiff);
    onConfirm(selectedDiff);
  };

  return (
    <GameBackground theme="home">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <MRIcon name="arrow-left" size={18} color={MRColors.textPrimary} />
          </Pressable>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>{mode.toUpperCase()}</Text>
            <Text style={styles.headerTitleAccent}>SELECT DIFFICULTY</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {DIFF_OPTIONS.map((option) => {
            const isSelected = selectedDiff === option.id;

            return (
              <Pressable
                key={option.id}
                onPress={() => setSelectedDiff(option.id)}
                style={styles.cardWrapper}
              >
                <GlassCard
                  glowing={isSelected}
                  style={isSelected ? { ...styles.cardInner, ...styles.cardSelectedBorder } : styles.cardInner}
                >
                  <View style={styles.cardTopRow}>
                    <Text style={[styles.cardTitle, isSelected && styles.titleSelected]}>
                      {option.title}
                    </Text>
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </View>

                  <Text style={styles.taglineText}>{option.tagline}</Text>

                  <View style={styles.specsRow}>
                    <View style={styles.specBadge}>
                      <Text style={styles.specText}>{option.gridDesc}</Text>
                    </View>
                    <View style={styles.specBadge}>
                      <Text style={styles.specText}>{option.timeDesc}</Text>
                    </View>
                    <View style={styles.specBadge}>
                      <Text style={styles.specText}>{option.previewDesc}</Text>
                    </View>
                  </View>
                </GlassCard>
              </Pressable>
            );
          })}

          {/* Smart Difficulty Toggle */}
          <GlassCard style={styles.smartDiffCard}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextCol}>
                <View style={styles.smartTitleRow}>
                  <MRIcon name="cpu" size={16} color={MRColors.cyanBright} />
                  <Text style={styles.smartTitle}>SMART DIFFICULTY</Text>
                </View>
                <Text style={styles.smartSub}>AUTO-ADJUST PREVIEW DURATION BASED ON ACCURACY</Text>
              </View>
              <Switch
                value={settings.smartDifficulty}
                onValueChange={() => toggleSetting('smartDifficulty')}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(34, 211, 238, 0.4)' }}
                thumbColor={settings.smartDifficulty ? MRColors.primaryCyan : '#8E9AA7'}
              />
            </View>
          </GlassCard>
        </ScrollView>

        {/* Primary CTA */}
        <View style={styles.ctaWrapper}>
          <PrimaryButton
            title="START GAME →"
            size="lg"
            variant="cyan"
            onPress={handleStart}
          />
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MRColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(34, 211, 238, 0.3)',
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.textSecondary,
    letterSpacing: 2,
  },
  headerTitleAccent: {
    fontSize: 18,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  cardWrapper: {
    width: '100%',
  },
  cardInner: {
    padding: 16,
  },
  cardSelectedBorder: {
    borderColor: MRColors.primaryCyan,
    borderWidth: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1.5,
  },
  titleSelected: {
    color: MRColors.cyanBright,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: MRColors.primaryCyan,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MRColors.primaryCyan,
  },
  taglineText: {
    fontSize: 11,
    color: MRColors.textSecondary,
    fontWeight: '700',
    marginVertical: 6,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  specBadge: {
    backgroundColor: 'rgba(34, 211, 238, 0.12)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.25)',
  },
  specText: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1,
  },
  smartDiffCard: {
    marginTop: 6,
    padding: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  smartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  smartTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1,
  },
  smartSub: {
    fontSize: 9,
    color: MRColors.textSecondary,
    fontWeight: '700',
    lineHeight: 12,
  },
  ctaWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
