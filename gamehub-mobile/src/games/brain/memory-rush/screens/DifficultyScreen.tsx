// ============================================================
// MEMORY RUSH — 04 Difficulty Select Screen (Temple Trial Setup)
// Features Cropped SELECT DIFFICULTY Plaque & START GAME Button
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
import * as Haptics from 'expo-haptics';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { JungleScreenPlaque } from '../components/JungleScreenPlaque';
import { JungleImageButton } from '../components/JungleImageButton';
import { JungleHeaderHUD } from '../components/JungleHeaderHUD';
import { StonePanel } from '../components/StonePanel';
import { WoodPanel } from '../components/WoodPanel';
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
  badge: string;
  gridDesc: string;
  timeDesc: string;
  previewDesc: string;
  tagline: string;
  accent: string;
}

const DIFF_OPTIONS: DiffOption[] = [
  {
    id: 'easy',
    title: 'EASY',
    badge: 'STARTER',
    gridDesc: '2 × 3 GRID',
    timeDesc: '30s TIME',
    previewDesc: '2.5s PREVIEW',
    tagline: 'Gentle start. Great for warming up your memory eye.',
    accent: '#34D399',
  },
  {
    id: 'medium',
    title: 'MEDIUM',
    badge: 'FOCUSED',
    gridDesc: '3 × 4 GRID',
    timeDesc: '20s TIME',
    previewDesc: '1.5s PREVIEW',
    tagline: 'Standard temple challenge. High focus required.',
    accent: '#FFD700',
  },
  {
    id: 'hard',
    title: 'HARD',
    badge: 'MEMORY PRO',
    gridDesc: '4 × 4 GRID',
    timeDesc: '15s TIME',
    previewDesc: '0.8s PREVIEW',
    tagline: 'Extreme pressure! Rapid eye and photographic recall.',
    accent: '#EF4444',
  },
];

export const DifficultyScreen: React.FC<DifficultyScreenProps> = ({
  mode,
  onConfirm,
  onBack,
}) => {
  const { difficulty, setDifficulty, settings, toggleSetting } = useMemoryRushStore();
  const [selectedDiff, setSelectedDiff] = useState<GameDifficulty>(difficulty);

  const handleSelect = (diff: GameDifficulty) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    setSelectedDiff(diff);
  };

  const handleStart = () => {
    setDifficulty(selectedDiff);
    onConfirm(selectedDiff);
  };

  return (
    <JungleWorldBackground variant="forest">
      <View style={styles.container}>
        {/* Jungle Header with Back Button */}
        <JungleHeaderHUD onBack={onBack} />

        {/* Sculpted SELECT DIFFICULTY Title Plaque */}
        <View style={styles.plaqueHolder}>
          <JungleScreenPlaque type="select_difficulty" height={150} />
          <Text style={styles.modeSubtitle}>MODE: {mode.toUpperCase()}</Text>
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
                onPress={() => handleSelect(option.id)}
                style={styles.cardWrapper}
                accessibilityLabel={`Select ${option.title} difficulty`}
              >
                <StonePanel
                  variant={isSelected ? 'carved' : 'slate'}
                  activeBorder={isSelected ? option.accent : undefined}
                  style={styles.panelContainer}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.titleWithBadge}>
                      <Text style={[styles.cardTitle, isSelected && { color: option.accent }]}>
                        {option.title}
                      </Text>
                      <View style={[styles.starterPill, { borderColor: option.accent }]}>
                        <Text style={[styles.starterText, { color: option.accent }]}>
                          {option.badge}
                        </Text>
                      </View>
                    </View>

                    {/* Radio Stone Ring */}
                    <View style={[styles.radioOuter, isSelected && { borderColor: option.accent }]}>
                      {isSelected && <View style={[styles.radioInner, { backgroundColor: option.accent }]} />}
                    </View>
                  </View>

                  <Text style={styles.taglineText}>{option.tagline}</Text>

                  {/* Tablet Specs */}
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
                </StonePanel>
              </Pressable>
            );
          })}

          {/* Smart Difficulty Wood Board */}
          <WoodPanel variant="dark" style={styles.smartDiffPanel}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextCol}>
                <View style={styles.smartTitleRow}>
                  <MRIcon name="cpu" size={16} color="#FFD700" />
                  <Text style={styles.smartTitle}>SMART DIFFICULTY</Text>
                </View>
                <Text style={styles.smartSub}>
                  Auto-adjust preview time dynamically based on your accuracy
                </Text>
              </View>
              <Switch
                value={settings.smartDifficulty}
                onValueChange={() => toggleSetting('smartDifficulty')}
                trackColor={{ false: 'rgba(0, 0, 0, 0.4)', true: 'rgba(255, 215, 0, 0.45)' }}
                thumbColor={settings.smartDifficulty ? '#FFD700' : '#8E9AA7'}
              />
            </View>
          </WoodPanel>

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Primary 3D START GAME Button */}
        <View style={styles.ctaWrapper}>
          <JungleImageButton
            type="start_game"
            height={78}
            zoom={1.08}
            onPress={handleStart}
          />
        </View>
      </View>
    </JungleWorldBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
  },
  plaqueHolder: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  modeSubtitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 16,
    gap: 8,
  },
  cardWrapper: {
    width: '100%',
  },
  panelContainer: {
    width: '100%',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  starterPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  starterText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#718496',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taglineText: {
    fontSize: 11.5,
    color: '#D1DEC8',
    fontWeight: '600',
    marginVertical: 8,
    lineHeight: 16,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  specBadge: {
    backgroundColor: 'rgba(10, 16, 12, 0.75)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  specText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.8,
  },
  smartDiffPanel: {
    marginTop: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  smartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  smartTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1,
  },
  smartSub: {
    fontSize: 10.5,
    color: '#D2955A',
    fontWeight: '600',
    lineHeight: 14,
  },
  ctaWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 22,
    paddingTop: 4,
    alignItems: 'center',
  },
});
