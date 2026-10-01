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
    tagline: 'Start here.',
  },
  {
    id: 'medium',
    title: 'MEDIUM',
    gridDesc: '3 × 4 GRID',
    timeDesc: '20 SEC TIMER',
    previewDesc: '1.5 SEC PREVIEW',
    tagline: 'Find your focus.',
  },
  {
    id: 'hard',
    title: 'HARD',
    gridDesc: '4 × 4 GRID',
    timeDesc: '15 SEC TIMER',
    previewDesc: '0.8 SEC PREVIEW',
    tagline: 'Enter the rush.',
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
            <Text style={styles.backText}>←</Text>
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
                  style={[
                    styles.cardInner,
                    isSelected && styles.cardSelectedBorder,
                  ]}
                >
                  <View style={styles.cardTopRow}>
                    <Text style={[styles.cardTitle, isSelected && styles.titleSelected]}>
                      {option.title}
                    </Text>
                    <View style={styles.radioOuter}>
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
                <Text style={styles.smartTitle}>SMART DIFFICULTY</Text>
                <Text style={styles.smartSub}>AUTO-ADJUST PREVIEW BASED ON ACCURACY</Text>
              </View>
              <Switch
                value={settings.smartDifficulty}
                onValueChange={() => toggleSetting('smartDifficulty')}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: MRColors.cyanMuted }}
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  backText: {
    fontSize: 18,
    color: MRColors.textPrimary,
    fontWeight: 'bold',
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 12,
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
    borderColor: MRColors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MRColors.primaryCyan,
  },
  taglineText: {
    fontSize: 12,
    color: MRColors.textSecondary,
    fontWeight: '600',
    marginVertical: 6,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  specBadge: {
    backgroundColor: 'rgba(34, 211, 238, 0.10)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.2)',
  },
  specText: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1,
  },
  smartDiffCard: {
    marginTop: 6,
    padding: 14,
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
  smartTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1,
  },
  smartSub: {
    fontSize: 9,
    color: MRColors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  ctaWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
