// ============================================================
// AIM RUSH — Screen 05: HowToPlayScreen
// 3-Step Interactive Tutorial with safe area handling
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Line } from 'react-native-svg';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';

interface HowToPlayScreenProps {
  onStartPractice: () => void;
  onBack: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({
  onStartPractice,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.35}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(12, insets.top + 6),
            paddingBottom: Math.max(16, insets.bottom + 8),
          },
        ]}
      >
        {/* Top Header */}
        <View style={styles.topBar}>
          <Pressable style={styles.iconCircle} onPress={onBack}>
            <Ionicons name="arrow-back" size={18} color={ARColors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>HOW TO PLAY</Text>
          <Text style={styles.stepIndicator}>STEP {step}/3</Text>
        </View>

        {/* Dynamic Step Content */}
        <View style={styles.card}>
          {step === 1 && (
            <View style={styles.stepContent}>
              <Svg width={110} height={110} viewBox="0 0 100 100">
                <Circle cx={50} cy={50} r={44} stroke={ARColors.cyan} strokeWidth={2.5} fill="none" />
                <Circle cx={50} cy={50} r={20} stroke={ARColors.lime} strokeWidth={2} fill="none" />
                <Circle cx={50} cy={50} r={5} fill={ARColors.cyan} />
                <Line x1={10} y1={50} x2={25} y2={50} stroke={ARColors.cyan} strokeWidth={2} />
                <Line x1={75} y1={50} x2={90} y2={50} stroke={ARColors.cyan} strokeWidth={2} />
                <Line x1={50} y1={10} x2={50} y2={25} stroke={ARColors.cyan} strokeWidth={2} />
                <Line x1={50} y1={75} x2={50} y2={90} stroke={ARColors.cyan} strokeWidth={2} />
              </Svg>

              <Text style={styles.stepTitle}>1. TOUCH THE TARGET</Text>
              <Text style={styles.stepDesc}>
                Tap directly on targets anywhere they appear across the screen. There are no gameplay buttons — the entire screen is your controller.
              </Text>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContent}>
              <View style={styles.pointsGrid}>
                <View style={styles.pointRow}>
                  <Text style={[styles.pointScore, { color: ARColors.lime }]}>+25 PERFECT</Text>
                  <Text style={styles.pointLabel}>Dead center sweet spot</Text>
                </View>
                <View style={styles.pointRow}>
                  <Text style={[styles.pointScore, { color: ARColors.cyan }]}>+15 GREAT</Text>
                  <Text style={styles.pointLabel}>Concentric inner zone</Text>
                </View>
                <View style={styles.pointRow}>
                  <Text style={[styles.pointScore, { color: ARColors.white }]}>+10 GOOD</Text>
                  <Text style={styles.pointLabel}>Outer perimeter zone</Text>
                </View>
              </View>

              <Text style={styles.stepTitle}>2. BUILD YOUR CHAIN</Text>
              <Text style={styles.stepDesc}>
                Consecutive hits increase your Chain Multiplier (×02, ×03, ×05...). Missing or tapping danger targets resets your chain!
              </Text>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContent}>
              <View style={styles.targetsRow}>
                <View style={styles.targetIconBox}>
                  <Text style={styles.targetIconEmoji}>🎯</Text>
                  <Text style={styles.targetIconName}>NORMAL</Text>
                </View>
                <View style={styles.targetIconBox}>
                  <Text style={styles.targetIconEmoji}>⚡</Text>
                  <Text style={styles.targetIconName}>MOVING</Text>
                </View>
                <View style={styles.targetIconBox}>
                  <Text style={styles.targetIconEmoji}>❌</Text>
                  <Text style={[styles.targetIconName, { color: ARColors.red }]}>DANGER</Text>
                </View>
              </View>

              <Text style={styles.stepTitle}>3. SURVIVE THE RUSH</Text>
              <Text style={styles.stepDesc}>
                As difficulty ramps, targets shrink, spawn faster, and begin moving. Red targets penalize your score and cost 1 life. Avoid them!
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Navigation (Safely positioned above gesture bar) */}
        <View style={styles.footerRow}>
          {step > 1 ? (
            <Pressable style={styles.prevBtn} onPress={() => setStep(step - 1)}>
              <Text style={styles.prevBtnText}>PREV</Text>
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {step < 3 ? (
            <Pressable style={styles.nextBtn} onPress={() => setStep(step + 1)}>
              <Text style={styles.nextBtnText}>NEXT STEP ▶</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.practiceBtn} onPress={onStartPractice}>
              <Text style={styles.practiceBtnText}>START PRACTICE ▶</Text>
            </Pressable>
          )}
        </View>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  stepIndicator: {
    fontSize: 11,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: 'rgba(10, 16, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 330,
  },
  stepContent: {
    alignItems: 'center',
    gap: 14,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.8,
    marginTop: 6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  stepDesc: {
    fontSize: 12.5,
    fontWeight: '600',
    color: ARColors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  pointsGrid: {
    width: '100%',
    gap: 8,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pointScore: {
    fontSize: 12,
    fontWeight: '900',
  },
  pointLabel: {
    fontSize: 10.5,
    color: ARColors.textSecondary,
  },
  targetsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  targetIconBox: {
    alignItems: 'center',
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 12,
    padding: 10,
    width: 74,
  },
  targetIconEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  targetIconName: {
    fontSize: 9,
    fontWeight: '900',
    color: ARColors.white,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prevBtn: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  nextBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: ARColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 1.2,
  },
  practiceBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: ARColors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 1.2,
  },
});
