// ============================================================
// REACTION FIRE — Screen 06: Practice Arena
// Zero-pressure 3-attempt sandbox training using the live gameplay arena
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HeaderBar } from '../components/HeaderBar';
import { ReactionArena } from '../components/ReactionArena';
import { ArcadeButton } from '../components/ArcadeButton';
import { NeonBadge } from '../components/NeonBadge';
import { CountdownOverlay } from '../components/CountdownOverlay';
import { getMonotonicNow, getRandomDelayMs, formatMs } from '../logic/timing';
import { getClassification } from '../logic/reactionEngine';
import { RfAudio } from '../audio/audioManager';
import { RfHaptics } from '../haptics/hapticManager';
import { RfColors } from '../theme';
import type { GameplayState, PerformanceClassification } from '../types';

interface PracticeArenaScreenProps {
  onBack: () => void;
  onLaunchClassic: () => void;
}

export const PracticeArenaScreen: React.FC<PracticeArenaScreenProps> = ({
  onBack,
  onLaunchClassic,
}) => {
  const [attempt, setAttempt] = useState(1);
  const [state, setState] = useState<GameplayState>('countdown');
  const [lastMs, setLastMs] = useState<number | null>(null);
  const [lastClass, setLastClass] = useState<PerformanceClassification>('Normal');
  const [completed, setCompleted] = useState(false);
  const [practiceScores, setPracticeScores] = useState<number[]>([]);

  const goTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Starts an individual practice round
  const startRound = () => {
    setState('waiting');
    setLastMs(null);
    const delay = getRandomDelayMs(1000, 3500);

    timerRef.current = setTimeout(() => {
      setState('go');
      goTimeRef.current = getMonotonicNow();
      RfHaptics.signalGo();
      RfAudio.playSignalGo();
    }, delay);
  };

  const handleTouch = () => {
    if (state === 'waiting') {
      // Too early!
      if (timerRef.current) clearTimeout(timerRef.current);
      setState('tooEarly');
      RfHaptics.falseStart();
      RfAudio.playFalseStart();

      setTimeout(() => {
        startRound();
      }, 1200);
    } else if (state === 'go') {
      // Valid hit!
      const elapsed = Math.round(getMonotonicNow() - goTimeRef.current);
      const classification = getClassification(elapsed);

      setLastMs(elapsed);
      setLastClass(classification);
      setState('success');
      RfHaptics.successTap();
      RfAudio.playSuccess();

      setPracticeScores((prev) => [...prev, elapsed]);

      setTimeout(() => {
        if (attempt < 3) {
          setAttempt((prev) => prev + 1);
          startRound();
        } else {
          setCompleted(true);
          setState('finished');
        }
      }, 1000);
    }
  };

  const handleRestartPractice = () => {
    setAttempt(1);
    setCompleted(false);
    setPracticeScores([]);
    setState('countdown');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <HeaderBar
        title="PRACTICE ARENA"
        subtitle={completed ? 'TRAINING COMPLETED' : `ATTEMPT ${attempt} / 3`}
        onBack={onBack}
      />

      {/* Mode Status Strip */}
      <View style={styles.statusStrip}>
        <NeonBadge
          label={completed ? 'TRAINING FINISHED' : `TRIAL ${attempt} / 3`}
          color={completed ? RfColors.goLime : RfColors.secondaryCyan}
          size="compact"
        />
        <Text style={styles.zeroRiskText}>ZERO IMPACT ON RECORDS</Text>
      </View>

      {/* Main Arena / Completion Card */}
      <View style={styles.arenaWrapper}>
        {state === 'countdown' ? (
          <CountdownOverlay onComplete={startRound} />
        ) : !completed ? (
          <ReactionArena
            state={state}
            onTouchArena={handleTouch}
            lastReactionTimeMs={lastMs}
            lastClassification={lastClass}
          />
        ) : (
          <View style={styles.completedCard}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={styles.completedTitle}>PRACTICE COMPLETE!</Text>
            <Text style={styles.completedSub}>
              You have experienced the waiting rhythm and latency triggers.
            </Text>

            <View style={styles.scoresRow}>
              {practiceScores.map((ms, idx) => (
                <View key={idx} style={styles.scorePill}>
                  <Text style={styles.pillLabel}>RUN {idx + 1}</Text>
                  <Text style={styles.pillValue}>{ms} ms</Text>
                </View>
              ))}
            </View>

            <View style={styles.btnCol}>
              <ArcadeButton
                title="LAUNCH CLASSIC TEST"
                variant="lime"
                size="large"
                icon="⚡"
                onPress={onLaunchClassic}
                style={styles.actionBtn}
              />
              <ArcadeButton
                title="REPLAY PRACTICE"
                variant="glass"
                onPress={handleRestartPractice}
                style={styles.actionBtn}
              />
            </View>
          </View>
        )}
      </View>

      {/* Bottom Guidance */}
      {!completed && (
        <View style={styles.footerGuidance}>
          <Text style={styles.guidanceText}>
            💡 Practice reactions are unranked. Focus on pure visual reaction!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RfColors.bgMain,
  },
  statusStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  zeroRiskText: {
    fontSize: 9,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1.5,
  },
  arenaWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCard: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: 'rgba(10, 23, 41, 0.95)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: RfColors.goLime,
    shadowColor: RfColors.goLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
  },
  trophyIcon: {
    fontSize: 44,
    marginBottom: 6,
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: RfColors.goLime,
    letterSpacing: 2,
  },
  completedSub: {
    fontSize: 12,
    color: RfColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: 12,
  },
  scoresRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  scorePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pillLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: RfColors.textMuted,
  },
  pillValue: {
    fontSize: 13,
    fontWeight: '900',
    color: RfColors.secondaryCyan,
    marginTop: 2,
  },
  btnCol: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    width: '100%',
  },
  footerGuidance: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  guidanceText: {
    fontSize: 11,
    color: RfColors.textMuted,
    textAlign: 'center',
  },
});

export default PracticeArenaScreen;
