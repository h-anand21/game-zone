// ============================================================
// REACTION FIRE — Screen 02: First Launch / Intro Onboarding
// 3-slide interactive visual tutorial: WAIT, REACT, IMPROVE
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArcadeButton } from '../components/ArcadeButton';
import { RfColors } from '../theme';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      title: 'STAY FOCUSED',
      subtitle: 'PHASE 01 — WAIT',
      description: 'Wait for the electric blue arena to change. Keep your thumb hovering. Do NOT tap early!',
      icon: '⏳',
      color: RfColors.primaryBlue,
      visual: (
        <View style={[styles.visualCircle, { borderColor: RfColors.primaryBlue }]}>
          <Text style={styles.visualIcon}>⏳</Text>
          <Text style={[styles.visualLabel, { color: RfColors.primaryBlue }]}>BLUE = WAIT</Text>
        </View>
      ),
    },
    {
      title: 'TAP WHEN GREEN',
      subtitle: 'PHASE 02 — REACT',
      description: 'The screen will burst into neon LIME. Touch anywhere in the arena with maximum reflex speed!',
      icon: '⚡',
      color: RfColors.goLime,
      visual: (
        <View style={[styles.visualCircle, { borderColor: RfColors.goLime, backgroundColor: 'rgba(183, 255, 60, 0.1)' }]}>
          <Text style={styles.visualIcon}>⚡</Text>
          <Text style={[styles.visualLabel, { color: RfColors.goLime }]}>LIME = TAP!</Text>
        </View>
      ),
    },
    {
      title: 'BEAT YOUR RECORD',
      subtitle: 'PHASE 03 — IMPROVE',
      description: 'Benchmark your latency in milliseconds. Aim for <350ms to win, and <250ms for Lightning Fast!',
      icon: '🏆',
      color: RfColors.rewardGold,
      visual: (
        <View style={[styles.visualCircle, { borderColor: RfColors.rewardGold, backgroundColor: 'rgba(255, 200, 87, 0.1)' }]}>
          <Text style={styles.visualScoreText}>240 ms</Text>
          <Text style={[styles.visualLabel, { color: RfColors.rewardGold }]}>LIGHTNING FAST</Text>
        </View>
      ),
    },
  ];

  const current = slides[slideIndex];
  const isLast = slideIndex === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setSlideIndex(slideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Skip Control */}
      <View style={styles.topBar}>
        <Text style={styles.stepCounter}>{`0${slideIndex + 1} / 03`}</Text>
        <Pressable onPress={onComplete} style={styles.skipBtn}>
          <Text style={styles.skipText}>SKIP</Text>
        </Pressable>
      </View>

      {/* Main Slide Content */}
      <View style={styles.contentArea}>
        <View style={styles.visualContainer}>{current.visual}</View>

        <Text style={[styles.phaseLabel, { color: current.color }]}>{current.subtitle}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>

        {/* 3-Position Progress Indicator */}
        <View style={styles.indicatorRow}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === slideIndex && [styles.activeDot, { backgroundColor: current.color }],
              ]}
            />
          ))}
        </View>
      </View>

      {/* Navigation Controls */}
      <View style={styles.bottomControls}>
        {slideIndex > 0 ? (
          <Pressable onPress={handlePrev} style={styles.prevBtn}>
            <Text style={styles.prevText}>← PREV</Text>
          </Pressable>
        ) : (
          <View style={{ width: 70 }} />
        )}

        <ArcadeButton
          title={isLast ? 'START ARENA' : 'NEXT →'}
          variant={isLast ? 'lime' : 'blue'}
          size="normal"
          onPress={handleNext}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RfColors.bgMain,
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepCounter: {
    fontSize: 12,
    fontWeight: '900',
    color: RfColors.textMuted,
    letterSpacing: 2,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  skipText: {
    fontSize: 11,
    fontWeight: '800',
    color: RfColors.textSecondary,
    letterSpacing: 1.5,
  },
  contentArea: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  visualContainer: {
    marginBottom: 32,
  },
  visualCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    backgroundColor: 'rgba(10, 23, 41, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 8,
  },
  visualIcon: {
    fontSize: 48,
    marginBottom: 6,
  },
  visualScoreText: {
    fontSize: 34,
    fontWeight: '900',
    color: RfColors.rewardGold,
    marginBottom: 4,
  },
  visualLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  phaseLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: RfColors.textPrimary,
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: RfColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 320,
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  activeDot: {
    width: 24,
    borderRadius: 4,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  prevBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  prevText: {
    fontSize: 12,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1.5,
  },
  actionBtn: {
    minWidth: 160,
  },
});

export default IntroScreen;
