// ============================================================
// Number Rush — Screen 05: MODE PREVIEW (Dynamic Multi-Mode Preview & Selector)
// ============================================================

import React from 'react';
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
import { MODE_CONFIGS } from '../data';
import type { Difficulty, GameModeId } from '../types';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const ModePreviewScreen: React.FC = () => {
  const {
    setScreen,
    startCountdown,
    selectedMode,
    setSelectedMode,
    difficulty,
    setDifficulty,
    stats,
  } = useNumberRushStore();

  const modeConfig = MODE_CONFIGS[selectedMode] || MODE_CONFIGS['animal-count'];

  const handleStartGame = () => {
    startCountdown(selectedMode, difficulty);
  };

  const getHowToPlaySteps = (mode: GameModeId) => {
    switch (mode) {
      case 'quick-rush':
        return [
          'Read the lightning arithmetic equation shown in the center.',
          'Calculate the exact solution in your head at maximum sprint speed.',
          'Tap the correct answer button to chain combo multipliers up to x3.5!',
        ];
      case 'emoji-count':
        return [
          'Look at the target emoji character specified in the challenge badge.',
          'Scan the colorful emoji grid and count all exact matching instances.',
          'Tap the correct count button before the rush countdown runs out!',
        ];
      case 'number-box':
        return [
          'Examine the 3×3 numbers matrix and deduce the hidden row/column pattern.',
          'Calculate what number replaces the mysterious "?" tile.',
          'Tap the matching solution button to clear the puzzle round!',
        ];
      case 'mixed-rush':
        return [
          'Brace for unpredictable rounds alternating math, counting & pattern logic.',
          'Quickly adapt your perception strategy for each new incoming wave.',
          'Rack up high streaks to conquer the global leaderboard halls!',
        ];
      case 'animal-count':
      default:
        return [
          'Scan the lush scene to locate the requested target jungle animal.',
          'Count only the matching creatures and ignore wilderness distractors.',
          'Tap the matching count button before the timer expires!',
        ];
    }
  };

  const steps = getHowToPlaySteps(selectedMode);

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="MODE PREVIEW" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Prominent Mode Switcher Banner */}
        <Pressable
          onPress={() => setScreen('mode-hub')}
          style={({ pressed }) => [
            styles.changeModeBar,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.changeModeLeft}>
            <Text style={styles.changeModeIcon}>🎯</Text>
            <View>
              <Text style={styles.changeModeTitle}>WANT A DIFFERENT CHALLENGE?</Text>
              <Text style={styles.changeModeSub}>Tap to browse all 5 game modes</Text>
            </View>
          </View>
          <View style={styles.changeModeBtn}>
            <Text style={styles.changeModeBtnText}>SWITCH ❯</Text>
          </View>
        </Pressable>

        {/* 3. Mode Header Badge with Mascot */}
        <View style={[styles.modeHeaderCard, { borderColor: modeConfig.themeColor }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.categoryPill, { backgroundColor: modeConfig.themeColor }]}>
              <Text style={styles.categoryPillText}>{modeConfig.category.toUpperCase()} ARENA</Text>
            </View>
            <Text style={styles.modeTitle}>{modeConfig.icon} {modeConfig.name.toUpperCase()}</Text>
            <Text style={styles.modeSubtitle}>{modeConfig.description}</Text>
          </View>
          <View style={styles.mascotHolder}>
            <MascotIllustration size={90} character="tiger" mood="happy" showAura={false} />
          </View>
        </View>

        {/* 4. DYNAMIC GAMEPLAY PREVIEW FRAME */}
        <View style={[styles.previewFrame, { borderColor: modeConfig.themeColor }]}>
          <View style={styles.frameHeader}>
            <Text style={styles.frameBadge}>LIVE GAMEPLAY PREVIEW</Text>
            <Text style={[styles.themeBadge, { color: modeConfig.themeColor }]}>
              {modeConfig.badge}
            </Text>
          </View>

          {/* Render Customized Preview by Mode */}
          {selectedMode === 'animal-count' && (
            <View style={styles.miniScene}>
              <ExpoImage source={JUNGLE_BG} style={styles.miniSceneBg} contentFit="cover" />
              <View style={styles.miniVignette} />
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
              <View style={styles.previewQuestionBanner}>
                <Text style={styles.questionMascot}>🐵</Text>
                <Text style={styles.questionText}>How many Monkeys?</Text>
              </View>
              <View style={styles.answerPillsRow}>
                {['2', '3', '4', '5'].map((ans) => (
                  <View key={ans} style={[styles.ansPill, ans === '3' && styles.ansPillCorrect]}>
                    <Text style={[styles.ansPillText, ans === '3' && styles.ansPillCorrectText]}>
                      {ans}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedMode === 'quick-rush' && (
            <View style={[styles.miniScene, { backgroundColor: '#09182E', justifyContent: 'center' }]}>
              <View style={styles.mathPreviewBox}>
                <Text style={styles.mathExprText}>18 + 27 = ?</Text>
                <View style={styles.mathTimerBadge}>
                  <Text style={styles.mathTimerText}>⚡ 10s SPRINT</Text>
                </View>
              </View>
              <View style={styles.answerPillsRow}>
                {['42', '45', '47', '55'].map((ans) => (
                  <View key={ans} style={[styles.ansPill, ans === '45' && styles.ansPillCorrect]}>
                    <Text style={[styles.ansPillText, ans === '45' && styles.ansPillCorrectText]}>
                      {ans}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedMode === 'emoji-count' && (
            <View style={[styles.miniScene, { backgroundColor: '#211105' }]}>
              <View style={styles.previewQuestionBanner}>
                <Text style={styles.questionMascot}>😎</Text>
                <Text style={styles.questionText}>Count the Cool Emojis!</Text>
              </View>
              <View style={styles.emojiMiniGrid}>
                {['😎', '🤩', '😎', '🥳', '😎', '🤠', '😎', '🤩', '🤠'].map((e, idx) => (
                  <View key={idx} style={styles.emojiMiniTile}>
                    <Text style={{ fontSize: 20 }}>{e}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.answerPillsRow}>
                {['3', '4', '5', '6'].map((ans) => (
                  <View key={ans} style={[styles.ansPill, ans === '4' && styles.ansPillCorrect]}>
                    <Text style={[styles.ansPillText, ans === '4' && styles.ansPillCorrectText]}>
                      {ans}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedMode === 'number-box' && (
            <View style={[styles.miniScene, { backgroundColor: '#1A0C2E' }]}>
              <View style={styles.previewQuestionBanner}>
                <Text style={styles.questionMascot}>🔢</Text>
                <Text style={styles.questionText}>Solve the 3×3 Mystery Tile!</Text>
              </View>
              <View style={styles.matrixMiniGrid}>
                {['2', '4', '6', '3', '6', '9', '4', '8', '?'].map((val, idx) => (
                  <View key={idx} style={[styles.matrixMiniTile, val === '?' && styles.matrixTargetTile]}>
                    <Text style={[styles.matrixMiniText, val === '?' && { color: '#00E5FF' }]}>
                      {val}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.answerPillsRow}>
                {['10', '12', '14', '16'].map((ans) => (
                  <View key={ans} style={[styles.ansPill, ans === '12' && styles.ansPillCorrect]}>
                    <Text style={[styles.ansPillText, ans === '12' && styles.ansPillCorrectText]}>
                      {ans}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedMode === 'mixed-rush' && (
            <View style={[styles.miniScene, { backgroundColor: '#1F1703' }]}>
              <View style={styles.mixedBannerCenter}>
                <Text style={styles.mixedIconLarge}>🌀</Text>
                <Text style={styles.mixedBannerTitle}>CHAMPIONSHIP GAUNTLET</Text>
                <Text style={styles.mixedBannerSub}>Rotating Math • Observation • Matrix Logic</Text>
              </View>
              <View style={styles.answerPillsRow}>
                {['CASUAL', 'SPEED', 'STREAK', 'BOSS'].map((tag, idx) => (
                  <View key={idx} style={[styles.ansPill, idx === 0 && styles.ansPillCorrect]}>
                    <Text style={[styles.ansPillText, idx === 0 && styles.ansPillCorrectText]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 5. Difficulty Selection Segment */}
        <View style={styles.diffSection}>
          <Text style={styles.sectionTitle}>SELECT CHALLENGE LEVEL</Text>

          <View style={styles.diffPillsRow}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
              const isSelected = difficulty === d;
              const color =
                d === 'easy' ? '#2ED573' : d === 'medium' ? '#FFB800' : '#FF4757';
              const label =
                d === 'easy' ? '🟢 EASY (1.0x)' : d === 'medium' ? '🟡 MEDIUM (1.5x)' : '🔴 HARD (2.0x)';

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
          <Text style={styles.tutorialTitle}>HOW TO PLAY: {modeConfig.name.toUpperCase()}</Text>
          {steps.map((st, i) => (
            <View key={i} style={styles.stepRow}>
              <Text style={styles.stepNum}>{i + 1}.</Text>
              <Text style={styles.stepText}>{st}</Text>
            </View>
          ))}
        </WoodPanel>

        {/* 7. Real Best Score Highlight */}
        <View style={styles.bestScoreCard}>
          <Text style={styles.bestScoreLabel}>YOUR BEST SCORE</Text>
          <Text style={styles.bestScoreValue}>
            {stats.bestScore.toLocaleString()} PTS
          </Text>
        </View>

        {/* 8. Large Primary Start Rush CTA Button */}
        <GameButton
          title={`START ${modeConfig.name.toUpperCase()} ▶`}
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
  changeModeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(43, 20, 8, 0.95)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  changeModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  changeModeIcon: {
    fontSize: 22,
  },
  changeModeTitle: {
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  changeModeSub: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '600',
  },
  changeModeBtn: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeModeBtnText: {
    color: '#04160D',
    fontSize: 10,
    fontWeight: '900',
  },
  modeHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(43, 20, 8, 0.92)',
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
    letterSpacing: 1.2,
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
    backgroundColor: 'rgba(43, 20, 8, 0.9)',
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
    backgroundColor: 'rgba(28, 12, 5, 0.95)',
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
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#4A90E2',
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
  mathPreviewBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  mathExprText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  mathTimerBadge: {
    backgroundColor: 'rgba(255, 109, 0, 0.25)',
    borderWidth: 1,
    borderColor: '#FF6D00',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 6,
  },
  mathTimerText: {
    color: '#FF9100',
    fontSize: 10,
    fontWeight: '900',
  },
  emojiMiniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    width: 140,
    alignSelf: 'center',
    marginVertical: 6,
  },
  emojiMiniTile: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixMiniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    width: 130,
    alignSelf: 'center',
    marginVertical: 6,
  },
  matrixMiniTile: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: '#9C27B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixTargetTile: {
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
  },
  matrixMiniText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  mixedBannerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  mixedIconLarge: {
    fontSize: 32,
  },
  mixedBannerTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },
  mixedBannerSub: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  diffSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  diffPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  diffButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(43, 20, 8, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  diffBtnText: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activeDiffBtnText: {
    color: '#04160D',
  },
  tutorialSummaryCard: {
    marginBottom: 16,
    padding: 14,
  },
  tutorialTitle: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  stepNum: {
    color: '#2ED573',
    fontWeight: '900',
    fontSize: 12,
    marginRight: 8,
    width: 14,
  },
  stepText: {
    color: '#D8E2DD',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  bestScoreCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(43, 20, 8, 0.85)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#7A3F1D',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  bestScoreLabel: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bestScoreValue: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  playCta: {
    marginBottom: 10,
  },
});
