// ============================================================
// PATH MIND — Screen 05: HowToPlayScreen
// Chamber Expedition Rules & Step-by-Step Guide
// Pure vector cards, visual icons, rich styling
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { GameBackground } from '../components/ui/GameBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { TitlePlaque } from '../components/ui/TitlePlaque';
import { GameButton } from '../components/ui/GameButton';
import { usePathMindStore } from '../store/pathMindStore';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';
import { pmAssets } from '../design-system/uiAssets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TutorialStep {
  step: number;
  title: string;
  description: string;
  badge: string;
  color: string;
}

const STEPS: TutorialStep[] = [
  {
    step: 1,
    title: 'WATCH THE GLOW',
    description: 'At the start of each chamber, sacred runes light up in sequence from START to GOAL.',
    badge: 'OBSERVE',
    color: pmColors.cyanGlow,
  },
  {
    step: 2,
    title: 'REMEMBER THE SEQUENCE',
    description: 'Commit the path trajectory and rune order to memory before the ancient timer expires.',
    badge: 'MEMORIZE',
    color: pmColors.goldBright,
  },
  {
    step: 3,
    title: 'RETRACE THE ANCIENT TILES',
    description: 'Tap each stone tile in the exact order. Correct steps weave a radiant blue energy beam.',
    badge: 'TRACE',
    color: pmColors.successGreen,
  },
  {
    step: 4,
    title: 'AVOID TRAPS & PRESERVE HEARTS',
    description: 'Wrong tiles shatter sacred energy and deplete hearts. Finish with combo for 3 stars!',
    badge: 'SURVIVE',
    color: pmColors.dangerRed,
  },
];

export const HowToPlayScreen: React.FC = () => {
  const { setScreen, hearts, coins } = usePathMindStore();

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('modes')}
        onSettings={() => setScreen('settings')}
        hearts={hearts}
        coins={coins}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TitlePlaque
          imageSource={pmAssets.plaques.statistics}
          style={styles.titlePlaque}
        />

        {/* Step Cards */}
        <View style={styles.stepsContainer}>
          {STEPS.map((s) => (
            <View key={s.step} style={[styles.stepCard, { borderLeftColor: s.color }]}>
              {/* Step Number Circle */}
              <View style={[styles.stepNumCircle, { backgroundColor: s.color }]}>
                <Text style={styles.stepNumText}>{s.step}</Text>
              </View>

              <View style={styles.stepContent}>
                <View style={styles.stepHeaderRow}>
                  <Text style={[styles.stepTitle, { color: s.color }]}>{s.title}</Text>
                  <View style={[styles.badgePill, { borderColor: s.color }]}>
                    <Text style={[styles.badgeText, { color: s.color }]}>{s.badge}</Text>
                  </View>
                </View>
                <Text style={styles.stepDesc}>{s.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pro Tip Box */}
        <View style={styles.proTipBox}>
          <Text style={styles.tipHeader}>💡 CARTOGRAPHER'S TIP</Text>
          <Text style={styles.tipBody}>
            Trace the line mentally with your eyes as it illuminates. Notice directional turns (e.g. 2 Right, 1 Down, 2 Right) instead of individual coordinates!
          </Text>
        </View>

        {/* CTA Button */}
        <View style={styles.ctaWrap}>
          <GameButton
            label="GOT IT! LET'S PLAY"
            iconName="play"
            variant="gold"
            size="large"
            width={Math.min(SCREEN_WIDTH - 48, 280)}
            height={58}
            onPress={() => setScreen('difficulty')}
            accessibilityLabel="Got it! Let's Play"
          />
        </View>
      </ScrollView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
    alignItems: 'center',
  },
  titlePlaque: {
    width: Math.min(SCREEN_WIDTH - 36, 320),
    marginBottom: 16,
    marginTop: 4,
  },
  stepsContainer: {
    width: '100%',
    gap: 12,
  },
  stepCard: {
    width: '100%',
    backgroundColor: 'rgba(12, 20, 28, 0.92)',
    borderWidth: 2,
    borderLeftWidth: 6,
    borderBottomWidth: 4,
    borderColor: pmColors.stoneBorder,
    borderRadius: pmRadii.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    ...pmShadows.medium,
  },
  stepNumCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#071318',
  },
  stepContent: {
    flex: 1,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  badgePill: {
    borderWidth: 1,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stepDesc: {
    ...pmTypography.bodySmall,
    color: pmColors.textSecondary,
    lineHeight: 18,
  },
  proTipBox: {
    width: '100%',
    backgroundColor: 'rgba(74, 40, 16, 0.75)',
    borderWidth: 1.5,
    borderColor: pmColors.woodHighlight,
    borderRadius: pmRadii.md,
    padding: 12,
    marginTop: 16,
    ...pmShadows.soft,
  },
  tipHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: pmColors.goldBright,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  tipBody: {
    ...pmTypography.caption,
    color: pmColors.textWood,
    lineHeight: 16,
  },
  ctaWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
});
