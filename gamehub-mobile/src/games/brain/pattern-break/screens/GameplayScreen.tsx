// ============================================================
// PATTERN BREAKER — 09 Main Gameplay Screen
// The central cognitive arena: 3x3 Ancient-Tech Board, Live HUD,
// Breaker Feedback, Radial Power-Ups, Rule Shifts & Countdown
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/background/GameBackground';
import { PatternTile } from '../components/game/PatternTile';
import { TimerRing } from '../components/game/TimerRing';
import { RuleShiftOverlay } from '../components/overlays/RuleShiftOverlay';
import { PowerUpRadialMenu } from '../components/overlays/PowerUpRadialMenu';
import { CountdownOverlay } from '../components/overlays/CountdownOverlay';
import { PauseModal } from '../components/overlays/PauseModal';
import { PBColors, PBTypography, PBRadius, PBShadows } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GameplayScreen: React.FC = () => {
  const {
    currentScreen,
    score,
    round,
    timeLeft,
    currentStreak,
    puzzle,
    tileStates,
    revealedTileIndices,
    powerUps,
    isPaused,
    isRuleShift,
    ruleShiftData,
    scannedRule,
    selectTile,
    startNextRound,
    startNewRun,
    decrementTimer,
    usePowerUp,
    togglePause,
    setScreen,
  } = usePatternBreakStore();

  const [isRadialOpen, setIsRadialOpen] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    text: string;
    sub: string;
    type: 'correct' | 'wrong';
  } | null>(null);

  // 1-second countdown interval
  useEffect(() => {
    if (isPaused || isRuleShift || currentScreen !== 'gameplay') return;

    const timer = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isRuleShift, currentScreen, decrementTimer]);

  const handleTilePress = (index: number) => {
    if (isPaused || isRuleShift || feedbackBanner) return;

    const result = selectTile(index);
    if (result.isBreaker) {
      setFeedbackBanner({
        text: '✓ PERFECT!',
        sub: '+1 POINT • +2 SEC',
        type: 'correct',
      });
      setTimeout(() => {
        setFeedbackBanner(null);
        startNextRound();
      }, 700);
    } else {
      setFeedbackBanner({
        text: 'WRONG PATTERN',
        sub: '−3 SEC PENALTY',
        type: 'wrong',
      });
      setTimeout(() => {
        setFeedbackBanner(null);
      }, 700);
    }
  };

  // Calculate tileSize responsive to mobile width
  const tileSize = Math.min(102, Math.floor((SCREEN_WIDTH - 64) / 3));

  return (
    <GameBackground variant="gameplay">
      <SafeAreaView style={styles.safeArea}>
        {/* ============================================================ */}
        {/* 1. TOP HUD BAR: Score, Round, Pause & TimerRing             */}
        {/* ============================================================ */}
        <View style={styles.topHud}>
          {/* Pause Button */}
          <Pressable
            style={styles.hudIconBtn}
            onPress={togglePause}
            accessibilityLabel="Pause Game"
          >
            <Ionicons name="pause" size={18} color={PBColors.textSecondary} />
          </Pressable>

          {/* Score Counter */}
          <View style={styles.statBox}>
            <Text style={styles.hudLabel}>SCORE</Text>
            <Text style={styles.hudValue}>{score}</Text>
          </View>

          {/* Round Indicator */}
          <View style={styles.statBox}>
            <Text style={styles.hudLabel}>ROUND</Text>
            <Text style={styles.hudValue}>{round.toString().padStart(2, '0')}</Text>
          </View>

          {/* Circular Timer Ring */}
          <TimerRing timeLeft={timeLeft} totalTime={puzzle?.timeLimit || 20} size={50} />
        </View>

        {/* ============================================================ */}
        {/* 2. CATEGORY PILL & ACTIVE STREAK / SCANNED RULE HINT        */}
        {/* ============================================================ */}
        <View style={styles.ruleInfoSection}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>
              {scannedRule ? `RULE: ${scannedRule}` : `${puzzle?.patternType || 'MATRIX'} PATTERN`}
            </Text>
          </View>

          {currentStreak >= 2 ? (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {currentStreak} STREAK</Text>
            </View>
          ) : null}
        </View>

        {/* ============================================================ */}
        {/* 3. FEEDBACK POPUP BANNER (Quick non-blocking notification)   */}
        {/* ============================================================ */}
        {feedbackBanner ? (
          <View
            style={[
              styles.feedbackBanner,
              feedbackBanner.type === 'correct'
                ? styles.bannerCorrect
                : styles.bannerWrong,
            ]}
          >
            <Text style={styles.feedbackTitle}>{feedbackBanner.text}</Text>
            <Text style={styles.feedbackSub}>{feedbackBanner.sub}</Text>
          </View>
        ) : (
          <View style={styles.feedbackPlaceholder} />
        )}

        {/* ============================================================ */}
        {/* 4. MAIN 3x3 ANCIENT-TECH PATTERN BOARD                       */}
        {/* ============================================================ */}
        <View style={styles.boardContainer}>
          <View style={styles.grid3x3}>
            {puzzle?.items.map((item, index) => {
              const isRevealed = revealedTileIndices.includes(index);
              const tileState =
                tileStates[index] || (isRevealed ? 'revealed' : 'default');

              return (
                <PatternTile
                  key={item.id || index}
                  item={item}
                  state={tileState}
                  size={tileSize}
                  onPress={() => handleTilePress(index)}
                  disabled={feedbackBanner !== null}
                />
              );
            })}
          </View>
        </View>

        {/* ============================================================ */}
        {/* 5. BOTTOM ACTIONS: CLUE RADIAL POWER-UP BUTTON               */}
        {/* ============================================================ */}
        <View style={styles.bottomBar}>
          <Pressable
            style={styles.clueButton}
            onPress={() => setIsRadialOpen(true)}
            accessibilityLabel="Open Power-Up Menu"
          >
            <Text style={styles.clueIcon}>💡</Text>
            <Text style={styles.clueText}>CLUE GADGETS</Text>
            <View style={styles.totalChargesPill}>
              <Text style={styles.chargesText}>
                {powerUps.reveal + powerUps.freeze + powerUps.scan}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ============================================================ */}
        {/* OVERLAYS & MODALS                                            */}
        {/* ============================================================ */}
        {/* 3-2-1 Countdown on game start */}
        {currentScreen === 'countdown' && (
          <CountdownOverlay onComplete={() => setScreen('gameplay')} />
        )}

        {/* Mid-game Rule Shift Anomaly */}
        {isRuleShift && ruleShiftData && (
          <RuleShiftOverlay
            fromCategory={ruleShiftData.from}
            toCategory={ruleShiftData.to}
            onComplete={() => {
              usePatternBreakStore.setState({ isRuleShift: false });
            }}
          />
        )}

        {/* Radial Power-Up Menu */}
        <PowerUpRadialMenu
          isOpen={isRadialOpen}
          charges={powerUps}
          onSelect={(type) => usePowerUp(type)}
          onClose={() => setIsRadialOpen(false)}
        />

        {/* Pause Modal */}
        {isPaused && (
          <PauseModal
            score={score}
            round={round}
            onResume={togglePause}
            onRestart={() => {
              togglePause();
              startNewRun();
            }}
            onExit={() => {
              togglePause();
              setScreen('home');
            }}
          />
        )}
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  hudIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(24, 47, 57, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  hudLabel: {
    ...PBTypography.hudLabel,
    color: PBColors.textMuted,
  },
  hudValue: {
    ...PBTypography.hudValue,
    color: '#FFFFFF',
    marginTop: 1,
  },
  ruleInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  categoryPill: {
    backgroundColor: 'rgba(25, 211, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: PBRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(25, 211, 255, 0.45)',
  },
  categoryPillText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: PBColors.primary,
    letterSpacing: 1.2,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 213, 74, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: PBRadius.full,
    borderWidth: 1,
    borderColor: PBColors.accent,
  },
  streakText: {
    fontSize: 10,
    fontWeight: '900',
    color: PBColors.accent,
  },
  feedbackPlaceholder: {
    height: 38,
  },
  feedbackBanner: {
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginHorizontal: 24,
    borderRadius: PBRadius.md,
    borderWidth: 1,
  },
  bannerCorrect: {
    backgroundColor: 'rgba(56, 229, 140, 0.25)',
    borderColor: PBColors.positive,
  },
  bannerWrong: {
    backgroundColor: 'rgba(255, 92, 97, 0.25)',
    borderColor: PBColors.danger,
  },
  feedbackTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  feedbackSub: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid3x3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: SCREEN_WIDTH - 24,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  clueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 47, 57, 0.9)',
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: PBRadius.full,
    borderWidth: 1.5,
    borderColor: PBColors.accent,
    gap: 8,
    ...PBShadows.amberGlow,
  },
  clueIcon: {
    fontSize: 16,
  },
  clueText: {
    fontSize: 12,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1.2,
  },
  totalChargesPill: {
    backgroundColor: 'rgba(255, 213, 74, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  chargesText: {
    fontSize: 10,
    fontWeight: '900',
    color: PBColors.accent,
  },
});
