// ============================================================
// Mind Lock — Screen 6: Correct Feedback Screen
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { SequenceIndicator } from '../components/SequenceIndicator';
import { MemoryPadGrid } from '../components/MemoryPadGrid';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Confetti';
import { ProgressBar } from '../components/ProgressBar';
import { useMindLockStore } from '../store/mindLockStore';

export const CorrectFeedbackScreen: React.FC = () => {
  const { round, score, currentStreak, sequence, setScreen } = useMindLockStore();
  const [countdownProgress, setCountdownProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setCountdownProgress(progress);

      if (progress >= 1) {
        clearInterval(interval);
        setScreen('gameplay');
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Confetti & Golden Stars Burst */}
      <Confetti />

      {/* Top Header */}
      <ScreenHeader
        variant="gameplay"
        round={round}
        score={score}
      />

      <SequenceIndicator
        total={Math.max(sequence.length, 6)}
        current={sequence.length}
      />

      {/* CORRECT! Header Badge */}
      <View style={styles.correctBanner}>
        <LinearGradient
          colors={['#85F274', '#55D63F', '#249C12']}
          style={styles.correctPill}
        >
          <View style={styles.checkCircle}>
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
              <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </Svg>
          </View>
          <Text style={styles.correctText}>CORRECT!</Text>
        </LinearGradient>
        <Text style={styles.subtitle}>Great memory!</Text>
      </View>

      {/* Celebrating Mascot with Streak Speech Bubble */}
      <View style={styles.mascotArea}>
        <Mascot mood="correct" size={200} />
        <View style={styles.streakBubble}>
          <Text style={styles.flameIcon}>🔥</Text>
          <View>
            <Text style={styles.streakLabel}>Streak</Text>
            <Text style={styles.streakMultiplier}>x{currentStreak}</Text>
          </View>
        </View>
      </View>

      {/* Background Pad Console */}
      <View style={styles.gridHolder}>
        <MemoryPadGrid
          activePad={null}
          disabled={true}
          onPadPress={() => {}}
        />
      </View>

      {/* Next Round Countdown Progress Bar */}
      <View style={styles.bottomBar}>
        <ProgressBar
          progress={countdownProgress}
          colorVariant="green"
          height={8}
          label="Next Round in 1..."
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MLColors.background,
    justifyContent: 'space-between',
    paddingBottom: MLSpacing.xl,
  },
  correctBanner: {
    alignItems: 'center',
    marginVertical: MLSpacing.xs,
  },
  correctPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: MLRadius.pill,
    gap: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...MLShadows.glowGreen,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctText: {
    color: '#0A121D',
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
  },
  subtitle: {
    color: MLColors.cream,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
    marginTop: 4,
  },
  mascotArea: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: -10,
    zIndex: 10,
  },
  streakBubble: {
    position: 'absolute',
    right: '18%',
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: MLRadius.pill,
    gap: 4,
    ...MLShadows.md,
  },
  flameIcon: {
    fontSize: 16,
  },
  streakLabel: {
    color: '#556677',
    fontSize: 9,
    fontWeight: MLTypography.bold,
  },
  streakMultiplier: {
    color: '#0A121D',
    fontSize: 13,
    fontWeight: MLTypography.black,
  },
  gridHolder: {
    alignItems: 'center',
    opacity: 0.85,
  },
  bottomBar: {
    width: '88%',
    alignSelf: 'center',
  },
});
