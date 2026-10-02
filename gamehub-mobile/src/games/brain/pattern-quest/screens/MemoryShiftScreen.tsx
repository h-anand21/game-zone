// ============================================================
// PATTERN QUEST — Screen 11: MemoryShiftScreen
// Temporary Memory Mode: Sequence shows -> REMEMBER! -> Hides -> WHAT DID YOU SEE?
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Animated } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameHeader } from '../components/common/GameHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { PatternTile } from '../components/game/PatternTile';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqColors, pqSpacing, pqTypography } from '../theme';
import { VisualTile } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MEM_SHAPES = ['triangle', 'circle', 'square', 'star', 'diamond'] as const;
const MEM_COLORS = ['#00F0FF', '#FFD700', '#FF4757', '#2ED573', '#A55EEA'];

export const MemoryShiftScreen: React.FC = () => {
  const { setScreen, score, submitAnswer, nextPuzzle } = usePatternQuestStore();

  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [targetSequence, setTargetSequence] = useState<VisualTile[]>([]);
  const [options, setOptions] = useState<VisualTile[][]>([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Generate sequence on mount
  useEffect(() => {
    generateMemoryChallenge();
  }, []);

  const generateMemoryChallenge = () => {
    const seq: VisualTile[] = [
      { id: '1', shape: MEM_SHAPES[0], color: MEM_COLORS[0], rotation: 0, size: 'medium', style: 'filled' },
      { id: '2', shape: MEM_SHAPES[1], color: MEM_COLORS[1], rotation: 0, size: 'medium', style: 'filled' },
      { id: '3', shape: MEM_SHAPES[2], color: MEM_COLORS[2], rotation: 0, size: 'medium', style: 'filled' },
      { id: '4', shape: MEM_SHAPES[3], color: MEM_COLORS[3], rotation: 0, size: 'medium', style: 'filled' },
    ];

    // Create 3 subtle distractors with one rune swapped
    const opt0 = [...seq];
    const opt1 = [seq[0], seq[2], seq[1], seq[3]]; // swapped middle
    const opt2 = [seq[0], seq[1], seq[3], seq[2]]; // swapped end
    const opt3 = [{ ...seq[0], color: MEM_COLORS[4] }, seq[1], seq[2], seq[3]]; // wrong color

    const allOpts = [opt0, opt1, opt2, opt3].sort(() => Math.random() - 0.5);
    const correctIdx = allOpts.findIndex((o) => o === opt0);

    setTargetSequence(seq);
    setOptions(allOpts);
    setCorrectIndex(correctIdx);
    setPhase('memorize');
    setSecondsLeft(4);
    setFeedback('idle');
  };

  // Memorize countdown
  useEffect(() => {
    if (phase !== 'memorize') return;

    if (secondsLeft <= 0) {
      setPhase('recall');
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, secondsLeft]);

  const handleSelectOption = (idx: number) => {
    if (feedback !== 'idle') return;
    if (idx === correctIndex) {
      setFeedback('correct');
      setTimeout(() => {
        generateMemoryChallenge();
      }, 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setPhase('memorize');
        setSecondsLeft(3);
        setFeedback('idle');
      }, 1400);
    }
  };

  return (
    <GameBackground screen="memory_shift" overlayDarkness={0.25}>
      <GameHeader onBack={() => setScreen('home')} />

      <View style={styles.container}>
        <ScreenPlaque screen="memory_shift" width={260} height={130} style={styles.plaque} />

        {/* Phase Header */}
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseTitle}>
            {phase === 'memorize' ? '⚡ REMEMBER THE SEQUENCE!' : '❓ WHAT DID YOU SEE?'}
          </Text>
          {phase === 'memorize' && (
            <Text style={styles.timerSub}>Hiding in {secondsLeft}s...</Text>
          )}
        </View>

        {/* Board */}
        <View style={styles.board}>
          {phase === 'memorize' ? (
            <View style={styles.sequenceRow}>
              {targetSequence.map((t) => (
                <PatternTile key={t.id} tile={t} size={56} highlighted />
              ))}
            </View>
          ) : (
            <View style={styles.hiddenNotice}>
              <Text style={styles.hiddenText}>SEQUENCE STORED IN MEMORY</Text>
            </View>
          )}
        </View>

        {/* Recall Options */}
        {phase === 'recall' && (
          <View style={styles.optionsList}>
            {options.map((opt, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleSelectOption(idx)}
                style={[
                  styles.optionCard,
                  feedback === 'correct' && idx === correctIndex && styles.correctCard,
                  feedback === 'wrong' && idx !== correctIndex && styles.wrongCard,
                ]}
              >
                <Text style={styles.optionLetter}>{String.fromCharCode(65 + idx)}</Text>
                <View style={styles.optionTilesRow}>
                  {opt.map((t, tIdx) => (
                    <PatternTile key={tIdx} tile={t} size={42} />
                  ))}
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: pqSpacing.base,
    alignItems: 'center',
  },
  plaque: {
    marginBottom: pqSpacing.xs,
  },
  phaseBadge: {
    alignItems: 'center',
    marginBottom: pqSpacing.sm,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: pqColors.crystalCyan,
    letterSpacing: 1,
  },
  timerSub: {
    ...pqTypography.caption,
    color: pqColors.goldBright,
    marginTop: 2,
  },
  board: {
    width: '100%',
    backgroundColor: 'rgba(18, 26, 36, 0.95)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2,
    borderColor: '#9B51E0',
    padding: pqSpacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    marginBottom: pqSpacing.md,
  },
  sequenceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  hiddenNotice: {
    padding: pqSpacing.sm,
  },
  hiddenText: {
    ...pqTypography.caption,
    fontWeight: '800',
    color: pqColors.textMuted,
    letterSpacing: 1.5,
  },
  optionsList: {
    width: '100%',
    gap: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 33, 0.95)',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: pqSpacing.radiusMd,
    paddingHorizontal: pqSpacing.md,
    paddingVertical: 6,
  },
  correctCard: {
    borderColor: pqColors.successGlow,
    backgroundColor: 'rgba(46, 204, 113, 0.25)',
  },
  wrongCard: {
    borderColor: pqColors.dangerGlow,
    backgroundColor: 'rgba(231, 76, 60, 0.25)',
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: '900',
    color: pqColors.textGold,
    marginRight: pqSpacing.md,
    width: 20,
  },
  optionTilesRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
