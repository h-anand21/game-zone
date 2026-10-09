// ============================================================
// DON'T TAP WRONG — Screen 04: How to Play
// Step-by-step visual training with native coded diagrams
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { HeaderBar } from '../components/common/HeaderBar';
import { ArcadeButton } from '../components/common/ArcadeButton';
import { DtwColors } from '../theme/colors';

interface HowToPlayScreenProps {
  onBack: () => void;
  onOpenPractice: () => void;
  onStartClassic: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({
  onBack,
  onOpenPractice,
  onStartClassic,
}) => {
  const steps = [
    {
      num: '01',
      title: 'FIND',
      desc: 'Scan the 3×3 grid instantly. Identify glowing neon GREEN safe tiles.',
      color: DtwColors.cyanAccent,
      preview: (
        <View style={styles.diagramGrid}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <View
              key={i}
              style={[
                styles.diagramCell,
                i === 4 && styles.diagramGreenCell,
              ]}
            >
              {i === 4 && <Text style={styles.diagramCheck}>✓</Text>}
            </View>
          ))}
        </View>
      ),
    },
    {
      num: '02',
      title: 'TAP',
      desc: 'Touch the green tile directly with zero delay. Every millisecond counts.',
      color: DtwColors.safeGreen,
      preview: (
        <View style={styles.tapDemoBox}>
          <View style={[styles.diagramCell, styles.diagramGreenCell, styles.largeDemoCell]}>
            <Text style={styles.diagramCheckLarge}>✓</Text>
            <Text style={styles.diagramTapPrompt}>TOUCH</Text>
          </View>
          <Text style={styles.arrowIcon}>👆</Text>
        </View>
      ),
    },
    {
      num: '03',
      title: 'AVOID',
      desc: 'NEVER tap RED tiles! Touching red instantly destroys your run in Classic & Survival.',
      color: DtwColors.dangerRed,
      preview: (
        <View style={styles.diagramGrid}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <View
              key={i}
              style={[
                styles.diagramCell,
                (i === 1 || i === 7) && styles.diagramRedCell,
              ]}
            >
              {(i === 1 || i === 7) && <Text style={styles.diagramCross}>✕</Text>}
            </View>
          ))}
        </View>
      ),
    },
    {
      num: '04',
      title: 'SCORE',
      desc: 'Each valid green hit awards +1 Point and reshuffles the grid into a fresh layout.',
      color: DtwColors.streakGold,
      preview: (
        <View style={styles.scoreDemoBox}>
          <Text style={styles.scorePlusOne}>+1</Text>
          <Text style={styles.scoreSub}>PTS</Text>
        </View>
      ),
    },
    {
      num: '05',
      title: 'SURVIVE',
      desc: 'Complete at least 15 correct taps in 20 seconds without a single mistake to win!',
      color: DtwColors.safeGreenHighlight,
      preview: (
        <View style={styles.targetDemoBox}>
          <Text style={styles.targetBigNum}>15 / 20s</Text>
          <Text style={styles.targetBadge}>TARGET SECURED</Text>
        </View>
      ),
    },
  ];

  return (
    <BackgroundLayer variant="lobby">
      <View style={styles.container}>
        <HeaderBar
          title="HOW TO PLAY"
          subtitle="COMBAT TRAINING MANUAL"
          onBack={onBack}
        />

        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {steps.map((step) => (
            <View key={step.num} style={[styles.stepCard, { borderColor: step.color }]}>
              <View style={styles.stepHeader}>
                <View style={[styles.numBadge, { backgroundColor: step.color }]}>
                  <Text style={styles.numText}>{step.num}</Text>
                </View>
                <Text style={[styles.stepTitle, { color: step.color }]}>{step.title}</Text>
              </View>

              <Text style={styles.stepDesc}>{step.desc}</Text>

              <View style={styles.diagramContainer}>{step.preview}</View>
            </View>
          ))}

          {/* Action Buttons */}
          <View style={styles.actionBlock}>
            <ArcadeButton
              title="START INTERACTIVE PRACTICE"
              variant="cyan"
              icon="🎯"
              size="large"
              onPress={onOpenPractice}
              style={styles.actionBtn}
            />

            <ArcadeButton
              title="PLAY CLASSIC ARENA (20s)"
              variant="green"
              icon="⚡"
              onPress={onStartClassic}
              style={styles.actionBtn}
            />
          </View>
        </ScrollView>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollList: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  stepCard: {
    backgroundColor: 'rgba(21, 28, 37, 0.9)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  numBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#080B10',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: DtwColors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  diagramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  diagramGrid: {
    width: 108,
    height: 108,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(8, 11, 16, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  diagramCell: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagramGreenCell: {
    backgroundColor: '#162D0B',
    borderWidth: 1.5,
    borderColor: DtwColors.safeGreen,
  },
  diagramRedCell: {
    backgroundColor: '#300F13',
    borderWidth: 1.5,
    borderColor: DtwColors.dangerRed,
  },
  diagramCheck: {
    fontSize: 14,
    fontWeight: '900',
    color: DtwColors.safeGreen,
  },
  diagramCross: {
    fontSize: 14,
    fontWeight: '900',
    color: DtwColors.dangerRed,
  },
  tapDemoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  largeDemoCell: {
    width: 58,
    height: 58,
    borderRadius: 14,
  },
  diagramCheckLarge: {
    fontSize: 22,
    fontWeight: '900',
    color: DtwColors.safeGreen,
  },
  diagramTapPrompt: {
    fontSize: 8,
    fontWeight: '900',
    color: DtwColors.safeGreen,
    letterSpacing: 1,
  },
  arrowIcon: {
    fontSize: 32,
  },
  scoreDemoBox: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 214, 90, 0.12)',
    borderWidth: 1.5,
    borderColor: DtwColors.streakGold,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  scorePlusOne: {
    fontSize: 32,
    fontWeight: '900',
    color: DtwColors.streakGold,
  },
  scoreSub: {
    fontSize: 12,
    fontWeight: '800',
    color: DtwColors.streakGold,
    letterSpacing: 1,
  },
  targetDemoBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(184, 255, 69, 0.12)',
    borderWidth: 1.5,
    borderColor: DtwColors.safeGreen,
    alignItems: 'center',
  },
  targetBigNum: {
    fontSize: 22,
    fontWeight: '900',
    color: DtwColors.safeGreen,
    letterSpacing: 2,
  },
  targetBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: DtwColors.safeGreenHighlight,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  actionBlock: {
    marginTop: 8,
    gap: 12,
  },
  actionBtn: {
    width: '100%',
  },
});

export default HowToPlayScreen;
