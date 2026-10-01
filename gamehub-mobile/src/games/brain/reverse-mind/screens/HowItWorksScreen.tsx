// ============================================================
// REVERSE MIND — Interactive Visual Tutorial (How It Works)
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { EnvironmentalBackground } from '../components/EnvironmentalBackground';
import { MemoryObject } from '../components/MemoryObject';
import { GlowButton } from '../components/GlowButton';
import { MascotCompanion } from '../components/MascotCompanion';
import { GAME_OBJECTS } from '../data/objects';
import type { AppNavScreen } from '../types';
import { RMTheme } from '../theme';

interface HowItWorksScreenProps {
  onBack: () => void;
  onNavigate: (screen: AppNavScreen) => void;
}

export const HowItWorksScreen: React.FC<HowItWorksScreenProps> = ({ onBack, onNavigate }) => {
  const [step, setStep] = useState<number>(1);

  const dog = GAME_OBJECTS.find((o) => o.id === 'corgi_01')!;
  const car = GAME_OBJECTS.find((o) => o.id === 'car_01')!;
  const star = GAME_OBJECTS.find((o) => o.id === 'star_01')!;

  const originalSeq = [dog, car, star];
  const reversedSeq = [star, car, dog];

  return (
    <EnvironmentalBackground theme="rule-preview">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>HOW TO PLAY</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step === 1 && styles.stepDotActive]} />
          <View style={[styles.stepDot, step === 2 && styles.stepDotActive]} />
          <View style={[styles.stepDot, step === 3 && styles.stepDotActive]} />
        </View>

        {/* Step 1: Memory Phase */}
        {step === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>STEP 1: MEMORIZE THE ORDER</Text>
            <Text style={styles.stepDesc}>
              A sequence of objects appears for a few seconds. Watch the order carefully from First to Last!
            </Text>

            <View style={styles.demoRow}>
              {originalSeq.map((obj, i) => (
                <MemoryObject key={obj.id} object={obj} orderNumber={i + 1} size="md" />
              ))}
            </View>

            <MascotCompanion
              state="thinking"
              size="md"
              showSpeechBubble={true}
              speechText="First: Dog ➔ Second: Car ➔ Third: Star!"
            />
          </View>
        )}

        {/* Step 2: Inversion Phase */}
        {step === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>STEP 2: REVERSE YOUR THINKING</Text>
            <Text style={styles.stepDesc}>
              The sequence disappears. You must enter the objects in EXACT REVERSE ORDER (Last to First)!
            </Text>

            <View style={styles.demoRow}>
              {reversedSeq.map((obj, i) => (
                <MemoryObject key={obj.id} object={obj} orderNumber={i + 1} size="md" state="highlight" />
              ))}
            </View>

            <MascotCompanion
              state="surprised"
              size="md"
              showSpeechBubble={true}
              speechText="Tap Star first, then Car, then Dog!"
            />
          </View>
        )}

        {/* Step 3: Mind Shift Rules */}
        {step === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>STEP 3: WATCH FOR MIND SHIFTS!</Text>
            <Text style={styles.stepDesc}>
              In Mind Shift mode, dynamic rule modifiers appear (e.g. "IGNORE RED"). Skip forbidden items while reversing!
            </Text>

            <View style={styles.ruleAlertPreview}>
              <Text style={styles.ruleAlertTag}>⚠️ MIND SHIFT: IGNORE RED</Text>
              <Text style={styles.ruleAlertDesc}>Skip Red Apple & Red Car!</Text>
            </View>

            <MascotCompanion
              state="excited"
              size="md"
              showSpeechBubble={true}
              speechText="You are ready! Let's conquer Reverse Mind!"
            />
          </View>
        )}

        {/* Navigation Actions */}
        <View style={styles.actions}>
          {step < 3 ? (
            <GlowButton
              title="NEXT STEP"
              variant="gold"
              size="lg"
              onPress={() => setStep(step + 1)}
            />
          ) : (
            <GlowButton
              title="GOT IT! START PLAYING"
              variant="gold"
              size="lg"
              onPress={() => onNavigate('modes')}
            />
          )}
        </View>
      </View>
    </EnvironmentalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingBottom: 24,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  stepDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  stepDotActive: {
    backgroundColor: RMTheme.colors.cyanNeon,
    width: 40,
  },
  stepBox: {
    width: '100%',
    backgroundColor: 'rgba(16, 27, 43, 0.8)',
    borderRadius: RMTheme.radii.xl,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(77, 231, 255, 0.3)',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 12,
    color: RMTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleAlertPreview: {
    backgroundColor: 'rgba(255, 94, 108, 0.2)',
    borderRadius: RMTheme.radii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: RMTheme.colors.coralRed,
    marginVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  ruleAlertTag: {
    fontSize: 12,
    fontWeight: '900',
    color: RMTheme.colors.coralRed,
  },
  ruleAlertDesc: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 2,
    fontWeight: '600',
  },
  actions: {
    width: '100%',
  },
});
