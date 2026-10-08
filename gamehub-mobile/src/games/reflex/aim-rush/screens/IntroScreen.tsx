// ============================================================
// AIM RUSH — Screen 02: IntroScreen (First Launch)
// Quick tactical orientation: The Screen is the Controller
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line } from 'react-native-svg';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';

interface IntroScreenProps {
  onContinue: () => void;
  onSkip: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onContinue, onSkip }) => {
  const insets = useSafeAreaInsets();

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.35}>
      <Pressable
        style={[
          styles.container,
          {
            paddingTop: Math.max(12, insets.top + 6),
            paddingBottom: Math.max(16, insets.bottom + 8),
          },
        ]}
        onPress={onContinue}
      >
        {/* Skip Button Top Right */}
        <View style={styles.topBar}>
          <Pressable style={styles.skipBtn} onPress={onSkip}>
            <Text style={styles.skipText}>SKIP</Text>
          </Pressable>
        </View>

        {/* Tactical Intro Content */}
        <View style={styles.centerContent}>
          <Svg width={96} height={96} viewBox="0 0 96 96">
            <Circle cx={48} cy={48} r={40} stroke={ARColors.cyan} strokeWidth={2} fill="none" />
            <Circle cx={48} cy={48} r={20} stroke={ARColors.lime} strokeWidth={2} fill="none" />
            <Circle cx={48} cy={48} r={5} fill={ARColors.cyan} />
            <Line x1={8} y1={48} x2={22} y2={48} stroke={ARColors.cyan} strokeWidth={2} />
            <Line x1={74} y1={48} x2={88} y2={48} stroke={ARColors.cyan} strokeWidth={2} />
            <Line x1={48} y1={8} x2={48} y2={22} stroke={ARColors.cyan} strokeWidth={2} />
            <Line x1={48} y1={74} x2={48} y2={88} stroke={ARColors.cyan} strokeWidth={2} />
          </Svg>

          <Text style={styles.headline}>TARGET CHAIN</Text>
          <Text style={styles.subheadline}>HIT. CHAIN. RUSH.</Text>

          <View style={styles.instructionCard}>
            <Text style={styles.ruleText}>✦ Touch targets directly with your fingers</Text>
            <Text style={styles.ruleText}>✦ Hit dead-center for PERFECT scores</Text>
            <Text style={styles.ruleText}>✦ Build combo chains to activate RUSH mode</Text>
            <Text style={[styles.ruleText, { color: ARColors.red }]}>
              ✦ Avoid RED danger targets
            </Text>
          </View>
        </View>

        {/* Bottom Tap Anywhere Callout */}
        <View style={styles.bottomTapSection}>
          <Text style={styles.tapText}>TAP ANYWHERE TO ENTER ARENA</Text>
          <Text style={styles.tapSubtext}>✦ SCREEN IS YOUR CONTROLLER ✦</Text>
        </View>
      </Pressable>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topBar: {
    alignItems: 'flex-end',
  },
  skipBtn: {
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 11,
    fontWeight: '900',
    color: ARColors.textMuted,
    letterSpacing: 1.5,
  },
  centerContent: {
    alignItems: 'center',
    gap: 12,
  },
  headline: {
    fontSize: 28,
    fontWeight: '900',
    color: ARColors.cyan,
    letterSpacing: 3,
    fontStyle: 'italic',
    marginTop: 8,
  },
  subheadline: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.lime,
    letterSpacing: 2,
  },
  instructionCard: {
    backgroundColor: 'rgba(10, 16, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(53, 231, 255, 0.35)',
    borderRadius: 16,
    padding: 18,
    gap: 10,
    marginTop: 12,
    width: '100%',
  },
  ruleText: {
    fontSize: 12,
    fontWeight: '700',
    color: ARColors.white,
    lineHeight: 18,
  },
  bottomTapSection: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 8,
  },
  tapText: {
    fontSize: 13,
    fontWeight: '900',
    color: ARColors.cyan,
    letterSpacing: 1.5,
  },
  tapSubtext: {
    fontSize: 9,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1.2,
  },
});
