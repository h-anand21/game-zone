// ============================================================
// Number Rush — Core Interactive Gameplay Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
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
  } = useNumberRushStore();

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>PREPARING RUSH...</Text>
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
              {currentQuestion.badgeText || '⚡ MENTAL MATH'}
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

  return (
    <View style={styles.container}>
      {/* Top Header HUD */}
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
          <Text style={styles.scoreVal}>{score}</Text>
        </View>

        <ComboBadge combo={combo} />
      </View>

      {/* Dynamic Animated Timer */}
      <TimerBar
        timeLeft={timeLeft}
        maxTime={maxTime}
        isFrozen={isTimeFrozen}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Special Golden Mascot Round Banner */}
        {currentQuestion.isSpecialRound && (
          <SpecialRoundBanner
            multiplier={currentQuestion.specialRoundMultiplier || 2}
          />
        )}

        {/* Question Header Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            {currentQuestion.questionText}
          </Text>
        </View>

        {/* Dynamic Game Challenge Area */}
        <View style={styles.challengeArea}>{renderChallengeContent()}</View>

        {/* Power-Up Action Bar */}
        <PowerUpTray />

        {/* 4 Chunky 2.5D Answer Buttons */}
        <AnswerButtonGroup
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          selectedAnswer={selectedAnswer}
          isSubmitted={isAnswerSubmitted}
          eliminatedOptions={eliminatedOptions}
          onSelectOption={(val) => submitAnswer(val)}
        />
      </ScrollView>

      {/* Milestone Combo Celebration Banner */}
      {showComboCelebration && (
        <ComboMomentOverlay comboValue={comboCelebrationValue} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  roundPill: {
    backgroundColor: '#0F2745',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E4575',
  },
  roundText: {
    color: '#8CA0BA',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2745',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFC107',
  },
  scoreLabel: {
    color: '#FFE082',
    fontSize: 10,
    fontWeight: '900',
    marginRight: 6,
  },
  scoreVal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  questionCard: {
    backgroundColor: '#102744',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: NRTheme.radius.lg,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    marginVertical: 8,
    ...NRTheme.shadows.card,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  challengeArea: {
    width: '100%',
    marginVertical: 4,
    minHeight: 240,
    justifyContent: 'center',
  },
  mathEquationBox: {
    width: '100%',
    padding: 24,
    backgroundColor: '#0D233E',
    borderRadius: NRTheme.radius.xl,
    borderWidth: 2.5,
    borderColor: '#1E90FF',
    alignItems: 'center',
    ...NRTheme.shadows.card,
  },
  mathBadge: {
    color: '#70A1FF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  mathFormula: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  mathHint: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
});
