// ============================================================
// Number Rush — Screen 05: MODE PREVIEW (Animal Count Jungle Game Menu Reference)
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
import { HeaderHUD, GameButton, WoodPanel, MascotIllustration } from '../components';
import type { Difficulty } from '../types';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const ModePreviewScreen: React.FC = () => {
  const {
    setScreen,
    startCountdown,
    selectedMode,
    difficulty,
    setDifficulty,
    stats,
  } = useNumberRushStore();

  const handleStartGame = () => {
    startCountdown(selectedMode, difficulty);
  };

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('category')} title="MODE PREVIEW" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. Mode Header Badge with Mascot */}
        <View style={styles.modeHeaderCard}>
          <View style={styles.headerLeft}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>OBSERVE ARENA</Text>
            </View>
            <Text style={styles.modeTitle}>ANIMAL COUNT</Text>
            <Text style={styles.modeSubtitle}>
              Spot & Count Jungle Wildlife Under Time Pressure
            </Text>
          </View>
          <View style={styles.mascotHolder}>
            <MascotIllustration size={90} character="tiger" mood="happy" showAura={false} />
          </View>
        </View>

        {/* 4. REAL CONSTRUCTED GAMEPLAY PREVIEW FRAME */}
        <View style={styles.previewFrame}>
          <View style={styles.frameHeader}>
            <Text style={styles.frameBadge}>LIVE GAMEPLAY PREVIEW</Text>
            <Text style={styles.themeBadge}>🌿 JUNGLE SAFARI</Text>
          </View>

          {/* Constructed Mini-Scene with Real Animals */}
          <View style={styles.miniScene}>
            <ExpoImage source={JUNGLE_BG} style={styles.miniSceneBg} contentFit="cover" />
            <View style={styles.miniVignette} />

            {/* Floating Animals in Scene */}
            <View style={[styles.animalSpot, { top: '18%', left: '15%' }]}>
              <Text style={styles.animalEmoji}>🐵</Text>
            </View>
            <View style={[styles.animalSpot, { top: '22%', right: '20%' }]}>
              <Text style={styles.animalEmoji}>🐯</Text>
            </View>
            <View style={[styles.animalSpot, { bottom: '26%', left: '30%' }]}>
              <Text style={styles.animalEmoji}>🐵</Text>
            </View>
            <View style={[styles.animalSpot, { bottom: '22%', right: '15%' }]}>
              <Text style={styles.animalEmoji}>🐘</Text>
            </View>
            <View style={[styles.animalSpot, { top: '48%', left: '55%' }]}>
              <Text style={styles.animalEmoji}>🐵</Text>
            </View>

            {/* Question Signboard Thumbnail */}
            <View style={styles.previewQuestionBanner}>
              <Text style={styles.questionMascot}>🐵</Text>
              <Text style={styles.questionText}>How many Monkeys?</Text>
            </View>

            {/* Answer Pills Preview */}
            <View style={styles.answerPillsRow}>
              {['2', '3', '4', '5'].map((ans, i) => (
                <View
                  key={ans}
                  style={[
                    styles.ansPill,
                    ans === '3' && styles.ansPillCorrect,
                  ]}
                >
                  <Text
                    style={[
                      styles.ansPillText,
                      ans === '3' && styles.ansPillCorrectText,
                    ]}
                  >
                    {ans}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 5. Difficulty Selection Segment */}
        <View style={styles.diffSection}>
          <View style={styles.diffHeaderRow}>
            <Text style={styles.sectionTitle}>SELECT CHALLENGE LEVEL</Text>
            <Pressable onPress={() => setScreen('difficulty')}>
              <Text style={styles.viewDiffText}>DETAILS ⚙️</Text>
            </Pressable>
          </View>

          <View style={styles.diffPillsRow}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
              const isSelected = difficulty === d;
              const color =
                d === 'easy' ? '#2ED573' : d === 'medium' ? '#FFB800' : '#FF4757';
              const label =
                d === 'easy' ? 'CASUAL (1.0x)' : d === 'medium' ? 'STANDARD (1.5x)' : 'INSANE (2.0x)';

              return (
                <Pressable
                  key={d}
                  onPress={() => setDifficulty(d)}
                  style={[
                    styles.diffButton,
                    isSelected && { backgroundColor: color, borderColor: '#FFFFFF' },
                  ]}
                >
                  <Text
                    style={[
                      styles.diffBtnText,
                      isSelected && styles.activeDiffBtnText,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 6. How To Play Summary Card */}
        <WoodPanel style={styles.tutorialSummaryCard} variant="card" hasRivets={false}>
          <Text style={styles.tutorialTitle}>HOW TO PLAY</Text>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>1.</Text>
            <Text style={styles.stepText}>
              Scan the lush scene to locate the requested target animal.
            </Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>2.</Text>
            <Text style={styles.stepText}>
              Sum up only the matching animals and ignore forest distractors.
            </Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>3.</Text>
            <Text style={styles.stepText}>
              Tap the matching number button before the sprint timer expires!
            </Text>
          </View>
        </WoodPanel>

        {/* 7. Best Score Highlight */}
        <View style={styles.bestScoreCard}>
          <Text style={styles.bestScoreLabel}>YOUR BEST SCORE</Text>
          <Text style={styles.bestScoreValue}>
            {stats.bestScore > 0 ? stats.bestScore.toLocaleString() : '2,840'} PTS ⭐⭐⭐
          </Text>
        </View>

        {/* 8. Large PLAY NOW CTA Button */}
        <GameButton
          title="PLAY NOW"
          icon="▶"
          variant="green"
          size="lg"
          fullWidth
          onPress={handleStartGame}
          style={styles.playCta}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  modeHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.92)',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFD700',
    padding: 14,
    marginBottom: 14,
  },
  headerLeft: {
    flex: 1,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#2ED573',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  categoryPillText: {
    color: '#04160D',
    fontSize: 9,
    fontWeight: '900',
  },
  modeTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  modeSubtitle: {
    color: '#D8E2DD',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  mascotHolder: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewFrame: {
    backgroundColor: 'rgba(7, 27, 52, 0.9)',
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: '#FFC107',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  frameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 40, 72, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  frameBadge: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  themeBadge: {
    color: '#2ED573',
    fontSize: 9,
    fontWeight: '900',
  },
  miniScene: {
    height: 180,
    position: 'relative',
    justifyContent: 'space-between',
    padding: 10,
  },
  miniSceneBg: {
    ...StyleSheet.absoluteFill,
  },
  miniVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  animalSpot: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  animalEmoji: {
    fontSize: 26,
  },
  previewQuestionBanner: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#382504',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 5,
  },
  questionMascot: {
    fontSize: 16,
    marginRight: 6,
  },
  questionText: {
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '900',
  },
  answerPillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 5,
  },
  ansPill: {
    width: 38,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(7, 27, 52, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ansPillCorrect: {
    backgroundColor: '#2ED573',
    borderColor: '#FFFFFF',
  },
  ansPillText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  ansPillCorrectText: {
    color: '#04160D',
  },
  diffSection: {
    marginBottom: 16,
  },
  diffHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  viewDiffText: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '900',
  },
  diffPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(7, 27, 52, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diffBtnText: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '900',
  },
  activeDiffBtnText: {
    color: '#071324',
  },
  tutorialSummaryCard: {
    padding: 14,
    marginBottom: 14,
  },
  tutorialTitle: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  stepNum: {
    color: '#2ED573',
    fontWeight: '900',
    fontSize: 12,
    width: 20,
  },
  stepText: {
    flex: 1,
    color: '#D8E2DD',
    fontSize: 11,
    lineHeight: 15,
  },
  bestScoreCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(11, 40, 72, 0.8)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    paddingVertical: 10,
    marginBottom: 16,
  },
  bestScoreLabel: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bestScoreValue: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  playCta: {
    marginBottom: 10,
  },
});
