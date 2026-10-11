// ============================================================
// STACK MASTER — Screen 02: First Launch Introduction
// 4-step illustrated interactive onboarding
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { COLORS } from '../theme/colors';
import { StackHaptics } from '../utils/haptics';

interface IntroScreenProps {
  onComplete: () => void;
}

const STEPS = [
  {
    step: 1,
    title: 'A BLOCK MOVES',
    description: 'A vibrant geometric block glides horizontally above your spire in continuous rhythm.',
    icon: '↔️',
    color: COLORS.cyan,
  },
  {
    step: 2,
    title: 'TAP ANYWHERE',
    description: 'Touch anywhere inside the sky arena at the exact moment of alignment to drop the block.',
    icon: '👆',
    color: COLORS.gold,
  },
  {
    step: 3,
    title: 'OVERHANG GETS CUT',
    description: 'Any misaligned section is sliced off and tumbles away into the canyon below!',
    icon: '✂️',
    color: COLORS.magenta,
  },
  {
    step: 4,
    title: 'KEEP STACKING',
    description: 'Land perfect drops to preserve block width, trigger radiant combos, and claim the sky crown!',
    icon: '👑',
    color: COLORS.success,
  },
];

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const insets = useSafeAreaInsets();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = STEPS[currentStepIndex];
  const isLast = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      StackHaptics.buttonPress();
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  return (
    <ScreenBackground type="home" dimAmount={0.5}>
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
        {/* Top bar with Skip button */}
        <View style={styles.topBar}>
          <Text style={styles.badgeText}>ASCENT ACADEMY</Text>
          <Pressable
            onPress={() => {
              StackHaptics.buttonPress();
              onComplete();
            }}
            hitSlop={12}
          >
            <Text style={styles.skipText}>SKIP</Text>
          </Pressable>
        </View>

        {/* Center Card */}
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={['#102E56', '#091C38']}
            style={styles.card}
          >
            {/* Step Icon with glowing ring */}
            <View style={[styles.iconRing, { borderColor: step.color }]}>
              <Text style={styles.iconText}>{step.icon}</Text>
            </View>

            <Text style={[styles.stepTitle, { color: step.color }]}>
              {step.title}
            </Text>

            <Text style={styles.stepDesc}>
              {step.description}
            </Text>

            {/* Pagination dots */}
            <View style={styles.dotsRow}>
              {STEPS.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    idx === currentStepIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Bottom Primary Action */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title={isLast ? "LET'S PLAY!" : 'NEXT STEP'}
            variant={isLast ? 'green' : 'gold'}
            size="large"
            onPress={handleNext}
          />
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.5,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 1,
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#244B82',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.65,
    shadowRadius: 10,
    elevation: 8,
  },
  iconRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#07162C',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 40,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E3B68',
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.cyan,
  },
  bottomSection: {
    width: '100%',
  },
});
