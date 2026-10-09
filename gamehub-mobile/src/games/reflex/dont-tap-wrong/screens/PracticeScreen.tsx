// ============================================================
// DON'T TAP WRONG — Screen 05: Practice Demo
// Interactive 3-step interactive training using live gameplay components
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { HeaderBar } from '../components/common/HeaderBar';
import { TileGrid } from '../components/game/TileGrid';
import { ArcadeButton } from '../components/common/ArcadeButton';
import { NeonBadge } from '../components/common/NeonBadge';
import { generatePracticeBoard } from '../engine/boardGenerator';
import { DtwHaptics } from '../haptics/hapticManager';
import { DtwAudio } from '../audio/audioManager';
import { DtwColors } from '../theme/colors';
import type { TileItem } from '../types';

interface PracticeScreenProps {
  onBack: () => void;
  onStartRealGame: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  onBack,
  onStartRealGame,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [boardTiles, setBoardTiles] = useState<TileItem[]>(() => generatePracticeBoard(1));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleTilePress = (tile: TileItem) => {
    if (tile.type === 'safe') {
      DtwHaptics.safeTap();
      DtwAudio.playSafeTap();
      setFeedback('PERFECT! +1 POINT ✓');

      setTimeout(() => {
        setFeedback(null);
        if (step === 1) {
          setStep(2);
          setBoardTiles(generatePracticeBoard(2));
        } else if (step === 2) {
          setStep(3);
          setBoardTiles(generatePracticeBoard(3));
        } else {
          setIsCompleted(true);
        }
      }, 500);
    } else if (tile.type === 'danger') {
      DtwHaptics.dangerTap();
      DtwAudio.playDangerTap();
      setFeedback('DANGER! Avoid Red Tiles. Try again! ✕');
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  const getStepInstruction = () => {
    if (step === 1) {
      return 'STEP 1: Locate the single GREEN safe tile in the grid and touch it.';
    }
    if (step === 2) {
      return 'STEP 2: Touch the GREEN tile while avoiding the RED danger tile!';
    }
    return 'STEP 3: Multiple targets! Tap any safe GREEN tile and never touch RED.';
  };

  return (
    <BackgroundLayer variant="game">
      <View style={styles.container}>
        <HeaderBar
          title="PRACTICE DEMO"
          subtitle={`STEP ${step} OF 3`}
          onBack={onBack}
        />

        {/* Practice Progress Bar */}
        <View style={styles.statusBar}>
          <NeonBadge
            label={isCompleted ? 'TRAINING COMPLETE' : `OBJECTIVE ${step}/3`}
            color={isCompleted ? DtwColors.safeGreen : DtwColors.cyanAccent}
            size="compact"
          />
          <Text style={styles.freeplayLabel}>ZERO TIME PRESSURE</Text>
        </View>

        {/* Instruction Banner */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionText}>
            {isCompleted ? '🎉 COMBAT TRAINING COMPLETE!' : getStepInstruction()}
          </Text>
          {feedback && (
            <Text
              style={[
                styles.feedbackText,
                feedback.includes('DANGER') ? styles.dangerFeedback : styles.safeFeedback,
              ]}
            >
              {feedback}
            </Text>
          )}
        </View>

        {/* Interactive Tile Grid */}
        <View style={styles.gridContainer}>
          {!isCompleted ? (
            <TileGrid
              tiles={boardTiles}
              onTilePress={handleTilePress}
              disabled={feedback !== null}
            />
          ) : (
            <View style={styles.completeCard}>
              <Text style={styles.trophy}>🏆</Text>
              <Text style={styles.completeTitle}>READY FOR COMBAT!</Text>
              <Text style={styles.completeDesc}>
                You understand how to recognize green tiles, avoid lethal red hazards, and react with speed.
              </Text>
              <ArcadeButton
                title="LAUNCH CLASSIC ARENA (20s)"
                variant="green"
                size="large"
                icon="⚡"
                onPress={onStartRealGame}
                style={styles.launchBtn}
              />
              <ArcadeButton
                title="BACK TO MENU"
                variant="glass"
                onPress={onBack}
                style={styles.backBtn}
              />
            </View>
          )}
        </View>

        {/* Bottom Tips */}
        {!isCompleted && (
          <View style={styles.footerTips}>
            <Text style={styles.tipText}>
              💡 In Classic mode, the timer is 20s and target is 15 correct hits!
            </Text>
          </View>
        )}
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  freeplayLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1.5,
  },
  instructionCard: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(21, 28, 37, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(66, 217, 255, 0.3)',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 12,
    fontWeight: '800',
    color: DtwColors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 6,
  },
  safeFeedback: {
    color: DtwColors.safeGreen,
  },
  dangerFeedback: {
    color: DtwColors.dangerRed,
  },
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  completeCard: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: 'rgba(21, 28, 37, 0.95)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DtwColors.safeGreen,
    shadowColor: DtwColors.safeGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  trophy: {
    fontSize: 48,
    marginBottom: 8,
  },
  completeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: DtwColors.safeGreen,
    letterSpacing: 2,
  },
  completeDesc: {
    fontSize: 12,
    color: DtwColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: 14,
  },
  launchBtn: {
    width: '100%',
    marginBottom: 10,
  },
  backBtn: {
    width: '100%',
  },
  footerTips: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  tipText: {
    fontSize: 11,
    color: DtwColors.textMuted,
    textAlign: 'center',
  },
});

export default PracticeScreen;
