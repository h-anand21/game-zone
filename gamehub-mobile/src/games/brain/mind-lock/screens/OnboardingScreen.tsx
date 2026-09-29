// ============================================================
// Mind Lock — Screen 2: Onboarding Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLSpacing, MLTypography } from '../theme';
import { Mascot } from '../components/Mascot';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useMindLockStore } from '../store/mindLockStore';

export const OnboardingScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const { finishOnboarding } = useMindLockStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'WATCH',
      tagline: 'Memorize the Pattern',
      description: 'Watch carefully as the memory pads light up one by one in a unique sequence.',
      mood: 'gameplay' as const,
      color: MLColors.padRed,
    },
    {
      title: 'REMEMBER',
      tagline: 'Keep the Order in Mind',
      description: 'Every round adds a new random step to the sequence. Test your short-term memory.',
      mood: 'daily' as const,
      color: MLColors.padBlue,
    },
    {
      title: 'REPEAT',
      tagline: 'Crack the Mind Lock',
      description: 'Tap the pads in the exact same order. Build long streaks and unlock new worlds!',
      mood: 'victory' as const,
      color: MLColors.padGreen,
    },
  ];

  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      finishOnboarding();
    }
  };

  return (
    <LinearGradient
      colors={['#0D1D2F', '#07111C', '#03080F']}
      style={styles.container}
    >
      {/* Top Skip Button */}
      <View style={styles.topBar}>
        <SecondaryButton
          title="SKIP"
          size="sm"
          onPress={finishOnboarding}
          style={styles.skipBtn}
        />
      </View>

      {/* Main Slide Content */}
      <View style={styles.centerContent}>
        <View style={styles.mascotHolder}>
          <Mascot mood={slide.mood} size={240} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: slide.color }]}>{slide.title}</Text>
          <Text style={styles.tagline}>{slide.tagline}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        {/* Slide Indicator Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentSlide && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom Action Button */}
      <View style={styles.bottomBar}>
        <PrimaryButton
          title={currentSlide === slides.length - 1 ? 'GET STARTED' : 'NEXT'}
          onPress={handleNext}
          size="lg"
          showPlayIcon={currentSlide === slides.length - 1}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MLSpacing.lg,
    paddingTop: 48,
    paddingBottom: MLSpacing.xl,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skipBtn: {
    minWidth: 70,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotHolder: {
    marginVertical: MLSpacing.lg,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: MLSpacing.md,
  },
  title: {
    fontSize: MLTypography.hero,
    fontWeight: MLTypography.black,
    letterSpacing: 2,
    marginBottom: 4,
  },
  tagline: {
    color: MLColors.white,
    fontSize: MLTypography.h4,
    fontWeight: MLTypography.bold,
    marginBottom: MLSpacing.sm,
  },
  description: {
    color: MLColors.textMuted,
    fontSize: MLTypography.body,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: MLSpacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E324A',
  },
  dotActive: {
    width: 24,
    backgroundColor: MLColors.primary,
  },
  bottomBar: {
    width: '100%',
    paddingBottom: MLSpacing.sm,
  },
});
