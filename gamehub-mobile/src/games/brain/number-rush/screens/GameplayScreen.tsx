// ============================================================
// Number Rush — Screen 09: CORE GAMEPLAY (Colourful Jungle Game Reference)
// ============================================================

import React, { useEffect } from 'react';
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
import {
  HeaderHUD,
  TimerBar,
  ComboBadge,
  PowerUpTray,
  AnimalScene,
  EmojiGrid,
  NumberBoxMatrix,
  AnswerButtonGroup,
  SpecialRoundBanner,
  ComboMomentOverlay,
} from '../components';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const GameplayScreen: React.FC = () => {
  const {
    currentQuestion,
    roundNumber,
    totalRounds,
    score,
    combo,
    timeLeft,
    maxTime,
    isTimeFrozen,
    hintActive,
    eliminatedOptions,
    selectedAnswer,
    isAnswerSubmitted,
    submitAnswer,
    showComboCelebration,
    comboCelebrationValue,
    tickTimer,
    isTimerRunning,
  } = useNumberRushStore();

  // Active game tick interval
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
        <View style={styles.darkVignette} />
        <Text style={styles.loadingText}>PREPARING JUNGLE RUSH...</Text>
      </View>
    );
  }

  const renderChallengeContent = () => {
    switch (currentQuestion.mode) {
      case 'animal-count':
        if (currentQuestion.animalData) {
          return (
            <AnimalScene
              animals={currentQuestion.animalData.animals}
              hintActive={hintActive}
            />
          );
        }
        break;

      case 'emoji-count':
        if (currentQuestion.emojiData) {
          return (
            <EmojiGrid
              items={currentQuestion.emojiData.items}
              gridCols={currentQuestion.emojiData.gridCols}
              hintActive={hintActive}
            />
          );
        }
        break;

      case 'number-box':
        if (currentQuestion.numberBoxData) {
          return (
            <NumberBoxMatrix
              grid={currentQuestion.numberBoxData.grid}
              ruleDescription={currentQuestion.numberBoxData.ruleDescription}
              hintActive={hintActive}
            />
          );
        }
        break;

      case 'quick-rush':
      default:
        return (
          <View style={styles.mathEquationBox}>
            <Text style={styles.mathBadge}>
              {currentQuestion.badgeText || '⚡ MENTAL MATH SPRINT'}
            </Text>
            <Text style={styles.mathFormula}>
              {currentQuestion.quickRushData?.expression || currentQuestion.questionText}
            </Text>
            {hintActive && currentQuestion.quickRushData?.hint && (
              <Text style={styles.mathHint}>
                💡 {currentQuestion.quickRushData.hint}
              </Text>
            )}
          </View>
        );
    }

    return null;
  };

  const getTargetIcon = () => {
    if (currentQuestion.animalData) {
      const type = currentQuestion.animalData.targetAnimal;
      return type === 'tiger'
        ? '🐯'
        : type === 'lion'
        ? '🦁'
        : type === 'monkey'
        ? '🐵'
        : type === 'elephant'
        ? '🐘'
        : type === 'giraffe'
        ? '🦒'
        : '🦓';
    }
    if (currentQuestion.emojiData) {
      return currentQuestion.emojiData.targetChar;
    }
    return '🎯';
  };

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD isGameplay />

      {/* In-Game Stats Header Strip */}
      <View style={styles.statsStrip}>
        <View style={styles.roundPill}>
          <Text style={styles.roundText}>
            ROUND {roundNumber}/{totalRounds}
          </Text>
        </View>

        <View style={styles.scorePill}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreVal}>{score.toLocaleString()} 🪙</Text>
        </View>

        <ComboBadge combo={combo} />
      </View>

      {/* 3. Dynamic Animated Timer Bar */}
      <TimerBar
        timeLeft={timeLeft}
        maxTime={maxTime}
        isFrozen={isTimeFrozen}
      />

      {/* 4. Special Round Banner if triggered */}
      {currentQuestion.isSpecialRound && (
        <SpecialRoundBanner multiplier={currentQuestion.specialRoundMultiplier || 2} />
      )}

      {/* 5. Carved Wooden Question Signboard */}
      <View style={styles.questionBanner}>
        <View style={styles.targetThumbnail}>
          <Text style={styles.targetIcon}>{getTargetIcon()}</Text>
        </View>
        <View style={styles.questionTextCol}>
          <Text style={styles.questionMission}>MISSION OBJECTIVE</Text>
          <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
        </View>
      </View>

      {/* 6. Main Interactive Challenge Viewport */}
      <View style={styles.challengeContainer}>
        {renderChallengeContent()}
      </View>

      {/* 7. Power-Up Action Tray */}
      <PowerUpTray />

      {/* 8. 4 Chunky 2.5D Glossy Answer Buttons */}
      <View style={styles.answerContainer}>
        <AnswerButtonGroup
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          selectedAnswer={selectedAnswer}
          isSubmitted={isAnswerSubmitted}
          eliminatedOptions={eliminatedOptions}
          onSelectOption={submitAnswer}
          disabled={isAnswerSubmitted}
        />
      </View>

      {/* 9. Milestone Combo Celebration Overlay */}
      {showComboCelebration && (
        <ComboMomentOverlay comboValue={comboCelebrationValue} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  darkVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 18, 13, 0.6)',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#06120D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  statsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 2,
  },
  roundPill: {
    backgroundColor: 'rgba(7, 27, 52, 0.9)',
    borderWidth: 1.5,
    borderColor: '#00E5FF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roundText: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '900',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.9)',
    borderWidth: 1.5,
    borderColor: '#FFC107',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  scoreLabel: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '900',
    marginRight: 6,
  },
  scoreVal: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '900',
  },
  questionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#382504',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  targetThumbnail: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1E1205',
    borderWidth: 1.5,
    borderColor: '#FFA000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  targetIcon: {
    fontSize: 24,
  },
  questionTextCol: {
    flex: 1,
  },
  questionMission: {
    color: '#FFB800',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  challengeContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    backgroundColor: 'rgba(7, 27, 52, 0.65)',
  },
  mathEquationBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mathBadge: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  mathFormula: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
  },
  mathHint: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 16,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
});
