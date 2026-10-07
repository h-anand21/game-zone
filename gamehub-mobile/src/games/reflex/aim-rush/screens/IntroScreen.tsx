// ============================================================
// AIM RUSH — Screen 02: IntroScreen (First Launch)
// Quick tactical orientation: The Screen is the Controller
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';

interface IntroScreenProps {
  onContinue: () => void;
  onSkip: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onContinue, onSkip }) => {
  return (
    <BackgroundLayer screen="other" overlayDarkness={0.4}>
      <Pressable style={styles.container} onPress={onContinue}>
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
            <Text style={styles.ruleText}>✦ Build your chain without missing</Text>
            <Text style={styles.ruleText}>✦ Avoid dangerous red targets</Text>
          </View>
        </View>

        {/* Footer Prompt */}
        <View style={styles.footer}>
          <View style={styles.touchPromptCapsule}>
            <Text style={styles.promptText}>TOUCH ANYWHERE TO CONTINUE ▶</Text>
          </View>
        </View>
      </Pressable>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  topBar: {
    alignItems: 'flex-end',
  },
  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1,
    borderColor: ARColors.border,
  },
  skipText: {
    fontSize: 11,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1,
  },
  centerContent: {
    alignItems: 'center',
  },
  headline: {
    fontSize: 28,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 3,
    marginTop: 18,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 14,
    fontWeight: '900',
    color: ARColors.lime,
    letterSpacing: 2,
    marginTop: 6,
    textAlign: 'center',
  },
  instructionCard: {
    width: '100%',
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.border,
    borderRadius: 16,
    padding: 18,
    marginTop: 26,
    gap: 12,
  },
  ruleText: {
    fontSize: 13,
    fontWeight: '700',
    color: ARColors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
  },
  touchPromptCapsule: {
    backgroundColor: ARColors.cyanSoft,
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  promptText: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.cyan,
    letterSpacing: 1.5,
  },
});
