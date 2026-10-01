// ============================================================
// MEMORY RUSH — 05 How To Play Screen (Visual Jungle Tutorial)
// 4 Visual Steps on Carved Stone & Parchment with 3D Number Tiles
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { JungleHeaderHUD } from '../components/JungleHeaderHUD';
import { WoodPanel } from '../components/WoodPanel';
import { StoneNumberTile } from '../components/StoneNumberTile';
import { JungleButton } from '../components/JungleButton';
import { MRIcon } from '../components/MRIcon';
import { MRColors } from '../constants/colors';

interface HowToPlayScreenProps {
  onGotIt: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({ onGotIt }) => {
  return (
    <JungleWorldBackground variant="forest">
      <View style={styles.container}>
        {/* Header HUD */}
        <JungleHeaderHUD
          title="HOW TO PLAY"
          subtitle="EXPLORER GUIDE"
          onBack={onGotIt}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* STEP 1: LOOK */}
          <WoodPanel variant="dark" style={styles.stepWood}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <MRIcon name="eye" size={14} color="#FFD700" />
                <Text style={styles.stepNum}>STEP 01</Text>
              </View>
              <Text style={styles.stepTitle}>LOOK & SCAN</Text>
            </View>
            <Text style={styles.stepDesc}>
              Watch the numbers carved on the stone altar during the short preview.
            </Text>
            <View style={styles.demoTilesRow}>
              <StoneNumberTile value={4} size={46} state="preview" disabled />
              <StoneNumberTile value={8} size={46} state="preview" disabled />
              <StoneNumberTile value={2} size={46} state="preview" disabled />
            </View>
          </WoodPanel>

          {/* STEP 2: REMEMBER */}
          <WoodPanel variant="dark" style={styles.stepWood}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <MRIcon name="grid" size={14} color="#38BDF8" />
                <Text style={styles.stepNum}>STEP 02</Text>
              </View>
              <Text style={styles.stepTitle}>REMEMBER</Text>
            </View>
            <Text style={styles.stepDesc}>
              The stone tiles flip over into mystery runes. Hold their positions in your mind!
            </Text>
            <View style={styles.demoTilesRow}>
              <StoneNumberTile value={4} size={46} state="hidden" disabled />
              <StoneNumberTile value={8} size={46} state="hidden" disabled />
              <StoneNumberTile value={2} size={46} state="hidden" disabled />
            </View>
          </WoodPanel>

          {/* STEP 3: ANSWER */}
          <WoodPanel variant="dark" style={styles.stepWood}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <MRIcon name="zap" size={14} color="#10B981" />
                <Text style={styles.stepNum}>STEP 03</Text>
              </View>
              <Text style={styles.stepTitle}>ANSWER QUICKLY</Text>
            </View>
            <Text style={styles.stepDesc}>
              Tap the correct stone position before the ancient timer expires.
            </Text>
            <View style={styles.answerDemoBox}>
              <Text style={styles.answerPromptText}>TARGET: FIND 8</Text>
              <View style={styles.demoTilesRow}>
                <StoneNumberTile value={4} size={46} state="hidden" disabled />
                <StoneNumberTile value={8} size={46} state="correct" disabled />
                <StoneNumberTile value={2} size={46} state="hidden" disabled />
              </View>
            </View>
          </WoodPanel>

          {/* STEP 4: SCORE & COMBO */}
          <WoodPanel variant="sign" style={styles.stepWood}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <MRIcon name="star" size={14} color="#FFD700" />
                <Text style={styles.stepNum}>STEP 04</Text>
              </View>
              <Text style={styles.stepTitle}>SCORE & BUILD COMBO</Text>
            </View>
            <Text style={styles.stepDesc}>
              Streak correct answers together to trigger multiplier bonuses and climb the temple ranks!
            </Text>
            <View style={styles.comboDemoBox}>
              <Text style={styles.comboText}>🔥 COMBO ×5</Text>
              <Text style={styles.scoreText}>+250 PTS</Text>
            </View>
          </WoodPanel>

          <View style={{ height: 16 }} />
        </ScrollView>

        <View style={styles.ctaWrapper}>
          <JungleButton
            title="GOT IT! ENTER TEMPLE ▶"
            size="hero"
            variant="gold"
            onPress={onGotIt}
          />
        </View>
      </View>
    </JungleWorldBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  stepWood: {
    width: '100%',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  stepNum: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1,
  },
  stepDesc: {
    fontSize: 12,
    color: '#D1DEC8',
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 8,
  },
  demoTilesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 4,
  },
  answerDemoBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  answerPromptText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  comboDemoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    marginTop: 6,
  },
  comboText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFA000',
    letterSpacing: 1,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 1,
  },
  ctaWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
});
