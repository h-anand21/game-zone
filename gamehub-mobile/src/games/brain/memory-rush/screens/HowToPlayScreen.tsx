// ============================================================
// MEMORY RUSH — 05 How To Play Screen (Under 10 Seconds Tutorial)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GameBackground } from '../components/GameBackground';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { MRColors } from '../constants/colors';

interface HowToPlayScreenProps {
  onGotIt: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({ onGotIt }) => {
  return (
    <GameBackground theme="home">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>HOW TO PLAY</Text>
          <Text style={styles.subtitle}>MASTER MEMORY RUSH IN 3 STEPS</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* STEP 1 */}
          <GlassCard style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNum}>STEP 1</Text>
              </View>
              <Text style={styles.stepTitle}>LOOK</Text>
            </View>
            <Text style={styles.stepDesc}>Memorize the numbers shown during preview.</Text>
            <View style={styles.visualBox}>
              <Text style={styles.visualText}>4   8   2   |   7   1   9</Text>
            </View>
          </GlassCard>

          {/* STEP 2 */}
          <GlassCard style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNum}>STEP 2</Text>
              </View>
              <Text style={styles.stepTitle}>REMEMBER</Text>
            </View>
            <Text style={styles.stepDesc}>The grid hides into mystery tiles.</Text>
            <View style={styles.visualBox}>
              <Text style={styles.visualText}>?   ?   ?   |   ?   ?   ?</Text>
            </View>
          </GlassCard>

          {/* STEP 3 */}
          <GlassCard style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNum}>STEP 3</Text>
              </View>
              <Text style={styles.stepTitle}>RESPOND</Text>
            </View>
            <Text style={styles.stepDesc}>Answer the memory task before time runs out!</Text>
            <View style={styles.visualBox}>
              <Text style={styles.visualText}>FIND 7 ➔ TAP CORRECT POSITION</Text>
            </View>
          </GlassCard>
        </ScrollView>

        <View style={styles.ctaWrapper}>
          <PrimaryButton
            title="GOT IT →"
            size="lg"
            onPress={onGotIt}
          />
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: MRColors.cyanBright,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  stepCard: {
    padding: 14,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  stepBadge: {
    backgroundColor: MRColors.cyanMuted,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
  },
  stepNum: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1,
  },
  stepDesc: {
    fontSize: 12,
    color: MRColors.textSecondary,
    fontWeight: '600',
  },
  visualBox: {
    marginTop: 10,
    backgroundColor: 'rgba(8, 10, 13, 0.8)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  visualText: {
    fontSize: 12,
    fontWeight: '800',
    color: MRColors.cyanBright,
    letterSpacing: 1.5,
  },
  ctaWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
