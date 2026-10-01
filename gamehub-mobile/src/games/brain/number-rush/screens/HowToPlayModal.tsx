// ============================================================
// Number Rush — Screen 07: HOW TO PLAY (Jungle Animal Count Tutorial Reference)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, GameButton, MascotIllustration, WoodPanel } from '../components';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const HowToPlayModal: React.FC = () => {
  const { setScreen, startCountdown, selectedMode, difficulty } = useNumberRushStore();

  const handleStart = () => {
    startCountdown(selectedMode, difficulty);
  };

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="TUTORIAL" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. Carved Wooden Billboard Header with Baby Tiger Mascot */}
        <View style={styles.headerBillboard}>
          <View style={styles.mascotOnSign}>
            <MascotIllustration size={80} character="tiger" mood="happy" showAura={false} />
          </View>
          <View style={styles.billboardBody}>
            <Text style={styles.billboardSub}>OFFICIAL JUNGLE GUIDE</Text>
            <Text style={styles.billboardTitle}>HOW TO PLAY</Text>
            <Text style={styles.billboardTagline}>
              Master the Animal Count Rush in 4 Simple Steps
            </Text>
          </View>
        </View>

        {/* 4 Visual Instruction Cards */}
        <View style={styles.cardsContainer}>
          {/* STEP 1: SCAN THE SCENE */}
          <WoodPanel style={styles.stepCard} variant="wood" hasRivets={false}>
            <View style={styles.stepHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP 1</Text>
              </View>
              <Text style={styles.stepTitle}>SCAN THE JUNGLE SCENE</Text>
            </View>

            <Text style={styles.stepDesc}>
              Carefully look at the lush forest clearing. Animals are scattered across different positions and depths.
            </Text>

            {/* Visual Illustrated Component Box */}
            <View style={styles.visualBox}>
              <View style={styles.animalRow}>
                <Text style={styles.visualEmoji}>🐵</Text>
                <Text style={styles.visualEmoji}>🐯</Text>
                <Text style={styles.visualEmoji}>🐵</Text>
                <Text style={styles.visualEmoji}>🐘</Text>
                <Text style={styles.visualEmoji}>🐵</Text>
              </View>
              <Text style={styles.visualCaption}>🌿 3 Monkeys hiding in the trees</Text>
            </View>
          </WoodPanel>

          {/* STEP 2: READ THE MISSION */}
          <WoodPanel style={styles.stepCard} variant="wood" hasRivets={false}>
            <View style={styles.stepHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP 2</Text>
              </View>
              <Text style={styles.stepTitle}>READ THE TARGET QUESTION</Text>
            </View>

            <Text style={styles.stepDesc}>
              Check the carved signboard at the top of the scene. It specifies exactly which wildlife species to count.
            </Text>

            {/* Visual Illustrated Component Box */}
            <View style={styles.visualBox}>
              <View style={styles.questionSignboardThumb}>
                <Text style={styles.signboardEmoji}>🐵</Text>
                <Text style={styles.signboardText}>How many Monkeys?</Text>
              </View>
              <Text style={styles.visualCaption}>🎯 Ignore distractor tigers and elephants</Text>
            </View>
          </WoodPanel>

          {/* STEP 3: CHOOSE THE ANSWER */}
          <WoodPanel style={styles.stepCard} variant="wood" hasRivets={false}>
            <View style={styles.stepHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP 3</Text>
              </View>
              <Text style={styles.stepTitle}>TAP THE MATCHING BUTTON</Text>
            </View>

            <Text style={styles.stepDesc}>
              Choose the correct number on the 4 chunky buttons below before the countdown clock runs out.
            </Text>

            {/* Visual Illustrated Component Box */}
            <View style={styles.visualBox}>
              <View style={styles.miniButtonsRow}>
                <View style={[styles.miniBtn, { borderColor: '#00E5FF' }]}>
                  <Text style={styles.miniBtnText}>2</Text>
                </View>
                <View
                  style={[
                    styles.miniBtn,
                    styles.miniBtnActive,
                    { borderColor: '#2ED573', backgroundColor: '#2ED573' },
                  ]}
                >
                  <Text style={[styles.miniBtnText, { color: '#04160D' }]}>3 ✓</Text>
                </View>
                <View style={[styles.miniBtn, { borderColor: '#FFB800' }]}>
                  <Text style={styles.miniBtnText}>4</Text>
                </View>
                <View style={[styles.miniBtn, { borderColor: '#A55EEA' }]}>
                  <Text style={styles.miniBtnText}>5</Text>
                </View>
              </View>
              <Text style={styles.visualCaption}>✅ Tap button "3" for correct points</Text>
            </View>
          </WoodPanel>

          {/* STEP 4: BE FAST & CHAIN COMBOS */}
          <WoodPanel style={styles.stepCard} variant="wood" hasRivets={false}>
            <View style={styles.stepHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP 4</Text>
              </View>
              <Text style={styles.stepTitle}>BE FAST & CHAIN COMBOS</Text>
            </View>

            <Text style={styles.stepDesc}>
              Consecutive correct answers trigger Streak Multipliers (x2, x3, x5, x10) and trigger Rare Lion Rushes!
            </Text>

            {/* Visual Illustrated Component Box */}
            <View style={styles.visualBox}>
              <View style={styles.comboThumbRow}>
                <Text style={styles.flameIcon}>🔥</Text>
                <Text style={styles.comboThumbText}>COMBO x5!</Text>
                <View style={styles.bonusXpPill}>
                  <Text style={styles.bonusXpText}>+250 XP ⚡</Text>
                </View>
              </View>
              <Text style={styles.visualCaption}>⭐ Unlocks 2x Bonus Rare Mascot Rounds</Text>
            </View>
          </WoodPanel>
        </View>

        {/* Primary Action Button */}
        <GameButton
          title="GOT IT! LET'S RUSH"
          icon="▶"
          variant="green"
          size="lg"
          fullWidth
          onPress={handleStart}
          style={styles.gotItBtn}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  darkVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerBillboard: {
    backgroundColor: 'rgba(7, 27, 52, 0.92)',
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: '#FFC107',
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  mascotOnSign: {
    marginBottom: 4,
  },
  billboardBody: {
    alignItems: 'center',
  },
  billboardSub: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  billboardTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  billboardTagline: {
    color: '#D8E2DD',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  cardsContainer: {
    gap: 14,
    marginBottom: 18,
  },
  stepCard: {
    padding: 14,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepBadge: {
    backgroundColor: '#FF6D00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  stepTitle: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stepDesc: {
    color: '#D8E2DD',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  visualBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  animalRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  visualEmoji: {
    fontSize: 28,
  },
  visualCaption: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  questionSignboardThumb: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#382504',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  signboardEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  signboardText: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '900',
  },
  miniButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  miniBtn: {
    width: 38,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(7, 27, 52, 0.9)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniBtnActive: {
    transform: [{ scale: 1.05 }],
  },
  miniBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  comboThumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flameIcon: {
    fontSize: 24,
  },
  comboThumbText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
  },
  bonusXpPill: {
    backgroundColor: 'rgba(30, 144, 255, 0.3)',
    borderWidth: 1,
    borderColor: '#1E90FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bonusXpText: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '900',
  },
  gotItBtn: {
    marginTop: 4,
  },
});
