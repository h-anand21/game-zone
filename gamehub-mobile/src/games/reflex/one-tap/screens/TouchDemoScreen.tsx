// ============================================================
// ONE TAP: PRECISION GAME — TouchDemoScreen
// Interactive 3-round training arena teaching player zero-penalty timing
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { OneTapLogo } from '../components/OneTapLogo';
import { TimingTrack } from '../components/TimingTrack';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { SvgBackArrow, SvgPlay } from '../components/icons/OneTapIcons';
import { OTColors } from '../theme/colors';
import { HitEvaluation, TargetZoneData } from '../types';
import { TimingEngine } from '../engine/timingEngine';
import { ScoringEngine } from '../engine/scoringEngine';
import { OneTapHaptics } from '../haptics/hapticManager';

interface TouchDemoScreenProps {
  onBack: () => void;
  onStartRealGame: () => void;
}

export const TouchDemoScreen: React.FC<TouchDemoScreenProps> = ({
  onBack,
  onStartRealGame,
}) => {
  const [demoRound, setDemoRound] = useState(1);
  const [target, setTarget] = useState<TargetZoneData>(() =>
    TimingEngine.generateTargetZone(0, 'classic')
  );
  const [evaluation, setEvaluation] = useState<HitEvaluation | null>(null);

  // Reanimated shared value for needle
  const needlePos = useSharedValue(0);
  const travelDurationMs = 1500;
  const startTimeRef = useRef(Date.now());
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const loop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const { position } = TimingEngine.calculateNeedlePosition(
        elapsed,
        travelDurationMs
      );
      needlePos.value = position;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [demoRound]);

  // Full-screen tap handler
  const handleTouchAnywhere = () => {
    const currentNeedle = needlePos.value;
    const evalResult = ScoringEngine.evaluateHit(
      currentNeedle,
      target,
      1,
      false,
      220
    );

    setEvaluation(evalResult);

    // Haptics
    if (evalResult.tier === 'perfect') OneTapHaptics.perfect();
    else if (evalResult.tier === 'great') OneTapHaptics.great();
    else if (evalResult.tier === 'good') OneTapHaptics.good();
    else OneTapHaptics.miss();

    // Advance demo round or reset
    setTimeout(() => {
      setDemoRound((prev) => (prev < 3 ? prev + 1 : 1));
      setTarget(TimingEngine.generateTargetZone(demoRound, 'classic'));
    }, 700);
  };

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.45}>
      <SafeAreaView style={styles.safeArea}>
        {/* Full-Screen Touch Area */}
        <Pressable
          style={styles.fullScreenPressable}
          onPress={handleTouchAnywhere}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Pressable
              style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
              onPress={onBack}
              hitSlop={8}
            >
              <SvgBackArrow size={20} color="#FFFFFF" />
            </Pressable>
            <OneTapLogo size="compact" showSubtitle={true} />
            <View style={styles.spacer} />
          </View>

          {/* Title Header */}
          <View style={styles.titleSection}>
            <Text style={styles.titleText}>TOUCH DEMO</Text>
            <Text style={styles.subTitleText}>TRY IT HERE BEFORE THE REAL GAME</Text>
          </View>

          {/* Demo Frame Card */}
          <View style={styles.demoCard}>
            <View style={styles.demoHeader}>
              <View>
                <Text style={styles.demoRoundLabel}>ROUND</Text>
                <Text style={styles.demoRoundValue}>{demoRound} / 3</Text>
              </View>
              <View style={styles.demoInfoPill}>
                <Text style={styles.demoInfoText}>
                  ℹ Practice mode. Zero score penalty.
                </Text>
              </View>
            </View>

            {/* Live Timing Track */}
            <View style={styles.trackContainer}>
              <TimingTrack
                needlePos={needlePos}
                target={target}
                isFeverActive={false}
              />
            </View>

            {/* Hit Feedback Popups */}
            <FeedbackBanner evaluation={evaluation} />

            {/* Instruction Callout */}
            <View style={styles.instructionWrap}>
              <Text style={styles.instructionTitle}>✦ TAP ANYWHERE ✦</Text>
              <Text style={styles.instructionSub}>
                When the marker is inside the target zone, touch anywhere on the screen!
              </Text>
            </View>
          </View>

          {/* Bottom Action CTA */}
          <View style={styles.bottomSection}>
            <Pressable
              style={({ pressed }) => [styles.playCta, pressed && styles.btnPressed]}
              onPress={onStartRealGame}
            >
              <Text style={styles.playCtaText}>START REAL GAME</Text>
              <SvgPlay size={20} color="#07090C" />
            </Pressable>
          </View>
        </Pressable>
      </SafeAreaView>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fullScreenPressable: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 21, 28, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  spacer: {
    width: 44,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  subTitleText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: OTColors.gold,
    letterSpacing: 2,
    marginTop: 4,
  },
  demoCard: {
    backgroundColor: 'rgba(16, 21, 28, 0.9)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    padding: 18,
    alignItems: 'center',
  },
  demoHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  demoRoundLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: OTColors.textMuted,
    letterSpacing: 1.5,
  },
  demoRoundValue: {
    fontSize: 16,
    fontWeight: '900',
    color: OTColors.gold,
    letterSpacing: 1,
  },
  demoInfoPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  demoInfoText: {
    fontSize: 8.5,
    color: OTColors.textSecondary,
    fontWeight: '700',
  },
  trackContainer: {
    width: '100%',
    marginVertical: 10,
  },
  instructionWrap: {
    alignItems: 'center',
    marginTop: 6,
  },
  instructionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: OTColors.cyan,
    letterSpacing: 2,
  },
  instructionSub: {
    fontSize: 9.5,
    color: OTColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },
  bottomSection: {
    width: '100%',
    marginTop: 10,
  },
  playCta: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: OTColors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: OTColors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  playCtaText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
});
