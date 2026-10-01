// ============================================================
// REVERSE MIND — Interactive Rule Preview Teaching Lab
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { EnvironmentalBackground } from '../components/EnvironmentalBackground';
import { GlowButton } from '../components/GlowButton';
import { MemoryObject } from '../components/MemoryObject';
import { MascotCompanion } from '../components/MascotCompanion';
import { GAME_OBJECTS } from '../data/objects';
import type { GameMode, GameDifficulty } from '../types';
import { RMTheme } from '../theme';

interface RulePreviewScreenProps {
  mode: GameMode;
  difficulty: GameDifficulty;
  onConfirm: () => void;
  onBack: () => void;
}

export const RulePreviewScreen: React.FC<RulePreviewScreenProps> = ({
  mode,
  difficulty,
  onConfirm,
  onBack,
}) => {
  const dog = GAME_OBJECTS.find((o) => o.id === 'corgi_01')!;
  const apple = GAME_OBJECTS.find((o) => o.id === 'apple_01')!; // red
  const star = GAME_OBJECTS.find((o) => o.id === 'star_01')!;

  return (
    <EnvironmentalBackground theme="rule-preview">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>RULE PREVIEW</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Teaching Laboratory Board */}
          <View style={styles.boardCard}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{mode.toUpperCase()} MODE PREVIEW</Text>
            </View>
            <Text style={styles.boardTitle}>ACTIVE MISSION RULES</Text>

            {/* Rule 1: Reverse Order */}
            <View style={styles.ruleItem}>
              <Text style={styles.ruleNum}>1</Text>
              <View style={styles.ruleTextGroup}>
                <Text style={styles.ruleHeader}>Invert Complete Sequence</Text>
                <Text style={styles.ruleBody}>
                  The sequence appears for {difficulty === 'easy' ? '3s' : difficulty === 'medium' ? '2s' : '1.2s'}.
                  Tap items from Last to First.
                </Text>
              </View>
            </View>

            {/* Rule 2: Mind Shift if applicable */}
            {mode === 'mind-shift' && (
              <View style={[styles.ruleItem, styles.mindShiftHighlight]}>
                <Text style={styles.ruleNumRed}>⚡</Text>
                <View style={styles.ruleTextGroup}>
                  <Text style={styles.ruleHeaderRed}>Mind Shift: Ignore Red Objects</Text>
                  <Text style={styles.ruleBody}>
                    Skip all red objects (Red Apple, Red Car, Fox) during reverse input!
                  </Text>
                </View>
              </View>
            )}

            {/* Visual Example Board */}
            <View style={styles.exampleBox}>
              <Text style={styles.exampleTitle}>VISUAL EXAMPLE</Text>

              <View style={styles.sequenceDemo}>
                <MemoryObject object={dog} orderNumber={1} size="sm" />
                <Text style={styles.arrowDemo}>➔</Text>
                <MemoryObject object={apple} orderNumber={2} size="sm" />
                <Text style={styles.arrowDemo}>➔</Text>
                <MemoryObject object={star} orderNumber={3} size="sm" />
              </View>

              <View style={styles.reverseDemo}>
                <Text style={styles.targetLabel}>TARGET REVERSE INPUT:</Text>
                <Text style={styles.targetSeq}>
                  {mode === 'mind-shift' ? '⭐ ➔ 🐕 (Skipped Red Apple)' : '⭐ ➔ 🍎 ➔ 🐕'}
                </Text>
              </View>
            </View>
          </View>

          {/* Mascot Guidance */}
          <MascotCompanion
            state="thinking"
            size="md"
            showSpeechBubble={true}
            speechText="Got the rules? Let's check readiness!"
          />
        </ScrollView>

        <View style={styles.actionWrapper}>
          <GlowButton
            title="I'M READY! PROCEED"
            variant="gold"
            size="lg"
            icon="👍"
            onPress={onConfirm}
          />
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
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  scrollContent: {
    paddingBottom: 20,
  },
  boardCard: {
    backgroundColor: 'rgba(16, 27, 43, 0.85)',
    borderRadius: RMTheme.radii.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(77, 231, 255, 0.3)',
    marginBottom: 16,
  },
  tagBadge: {
    backgroundColor: 'rgba(77, 231, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RMTheme.radii.full,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(77, 231, 255, 0.35)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 1,
  },
  boardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  ruleNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: RMTheme.colors.cyanNeon,
    color: '#07111F',
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
  },
  ruleNumRed: {
    fontSize: 16,
  },
  ruleTextGroup: {
    flex: 1,
  },
  ruleHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ruleHeaderRed: {
    fontSize: 13,
    fontWeight: '800',
    color: RMTheme.colors.coralRed,
  },
  ruleBody: {
    fontSize: 11,
    color: RMTheme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  mindShiftHighlight: {
    backgroundColor: 'rgba(255, 94, 108, 0.12)',
    padding: 10,
    borderRadius: RMTheme.radii.md,
    borderWidth: 1,
    borderColor: RMTheme.colors.coralRed,
  },
  exampleBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: RMTheme.radii.lg,
    padding: 14,
    marginTop: 6,
    alignItems: 'center',
  },
  exampleTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: RMTheme.colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  sequenceDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowDemo: {
    fontSize: 14,
    color: RMTheme.colors.cyanNeon,
    fontWeight: '900',
  },
  reverseDemo: {
    marginTop: 10,
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: RMTheme.colors.textSecondary,
  },
  targetSeq: {
    fontSize: 13,
    fontWeight: '900',
    color: RMTheme.colors.primaryGold,
    marginTop: 2,
  },
  actionWrapper: {
    width: '100%',
  },
});
