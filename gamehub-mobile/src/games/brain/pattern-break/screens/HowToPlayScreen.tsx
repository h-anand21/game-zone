// ============================================================
// PATTERN BREAKER — 07 How To Play Screen
// Visual demonstration: 4 follow the rule, 1 breaks it!
// Mascot points toward breaker, clean CTA
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { Mascot } from '../components/mascot/Mascot';
import { PatternTile } from '../components/game/PatternTile';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { GlassCard } from '../components/cards/GlassCard';
import { PBColors, PBTypography, PBRadius, PBShadows } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const HowToPlayScreen: React.FC = () => {
  const { setScreen, startNewRun, goBack } = usePatternBreakStore();

  const handleStartGame = () => {
    startNewRun();
  };

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="HOW TO PLAY"
          onBack={goBack}
          onSettings={() => setScreen('settings')}
        />

        <View style={styles.centerContainer}>
          {/* Mascot Pointing Toward the Demo Board */}
          <View style={styles.mascotArea}>
            <Mascot pose="pointing" size={110} />
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                Every board hides <Text style={styles.boldCyan}>one single mistake</Text>. Find it!
              </Text>
            </View>
          </View>

          {/* Interactive Demo Demonstration */}
          <GlassCard variant="cyan" style={styles.demoCard}>
            <Text style={styles.demoTitle}>DEMO: ARITHMETIC (+2 STEP)</Text>

            {/* Sequence Row: 2, 4, 6, [9: Breaker!], 10 */}
            <View style={styles.demoRow}>
              <PatternTile
                item={{ id: '1', type: 'number', value: 2, color: '#19D3FF' }}
                onPress={() => {}}
                size={54}
              />
              <PatternTile
                item={{ id: '2', type: 'number', value: 4, color: '#19D3FF' }}
                onPress={() => {}}
                size={54}
              />
              <PatternTile
                item={{ id: '3', type: 'number', value: 6, color: '#19D3FF' }}
                onPress={() => {}}
                size={54}
              />
              {/* THE BREAKER */}
              <PatternTile
                item={{ id: '4', type: 'number', value: 9, color: '#FFD54A' }}
                state="revealed"
                onPress={() => {}}
                size={54}
              />
              <PatternTile
                item={{ id: '5', type: 'number', value: 10, color: '#19D3FF' }}
                onPress={() => {}}
                size={54}
              />
            </View>

            {/* Visual breakdown labels */}
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownItem}>
                <Text style={styles.checkIcon}>✓ ✓ ✓ ✓</Text>
                <Text style={styles.breakdownLabel}>Follow Rule</Text>
              </View>
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownItem}>
                <Text style={styles.crossIcon}>✕ [9]</Text>
                <Text style={[styles.breakdownLabel, { color: PBColors.accent }]}>Breaks Rule!</Text>
              </View>
            </View>
          </GlassCard>

          {/* Core Rules Callout */}
          <View style={styles.rulesPills}>
            <View style={styles.rulePill}>
              <Ionicons name="flash-outline" size={16} color={PBColors.accent} />
              <Text style={styles.ruleText}>Tap breaker before time expires</Text>
            </View>
            <View style={styles.rulePill}>
              <Ionicons name="disc-outline" size={16} color={PBColors.primary} />
              <Text style={styles.ruleText}>Correct tap adds +2s & +1 Point</Text>
            </View>
            <View style={styles.rulePill}>
              <Ionicons name="warning-outline" size={16} color={PBColors.danger} />
              <Text style={styles.ruleText}>Wrong tap deducts -3s penalty</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <PrimaryButton
            title="LET'S PLAY ▶"
            variant="cyan"
            size="lg"
            onPress={handleStartGame}
          />
        </View>
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    gap: 14,
  },
  mascotArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: 'rgba(24, 47, 57, 0.95)',
    padding: 12,
    borderRadius: PBRadius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.35)',
  },
  speechText: {
    fontSize: 12,
    color: PBColors.textPrimary,
    lineHeight: 17,
  },
  boldCyan: {
    fontWeight: '900',
    color: PBColors.primary,
  },
  demoCard: {
    padding: 16,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 15,
    fontWeight: '900',
    color: PBColors.positive,
  },
  crossIcon: {
    fontSize: 15,
    fontWeight: '900',
    color: PBColors.accent,
  },
  breakdownLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: PBColors.textMuted,
    marginTop: 2,
  },
  breakdownDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  rulesPills: {
    gap: 8,
  },
  rulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 35, 44, 0.85)',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: PBRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(25, 211, 255, 0.2)',
    gap: 10,
  },
  ruleEmoji: {
    fontSize: 15,
  },
  ruleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: PBColors.textSecondary,
  },
  bottomBar: {
    padding: 16,
  },
});
