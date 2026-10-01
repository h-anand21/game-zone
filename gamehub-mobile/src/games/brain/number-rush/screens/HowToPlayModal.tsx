// ============================================================
// Number Rush — How To Play Tutorial Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, GameButton, WoodPanel } from '../components';
import type { GameModeId } from '../types';

export const HowToPlayModal: React.FC = () => {
  const { setScreen, startCountdown } = useNumberRushStore();
  const [activeTab, setActiveTab] = useState<GameModeId>('animal-count');

  const tutorials: Record<
    GameModeId,
    { title: string; icon: string; steps: { title: string; desc: string }[] }
  > = {
    'animal-count': {
      title: 'Animal Count Tutorial',
      icon: '🐯',
      steps: [
        {
          title: '1. READ THE TARGET',
          desc: 'The question banner tells you which jungle animal to look for (e.g. "How many Tigers?").',
        },
        {
          title: '2. SCAN THE JUNGLE',
          desc: 'Carefully count the target animals hiding among vines and bushes. Beware of distractor animals!',
        },
        {
          title: '3. TAP THE CORRECT BUTTON',
          desc: 'Choose the matching number on the 4 chunky buttons below before the timer runs out!',
        },
        {
          title: '4. STREAK MULTIPLIER',
          desc: 'Consecutive correct answers trigger Combo Multipliers (x2, x3, x5, x10) and Special Rare Rounds!',
        },
      ],
    },
    'quick-rush': {
      title: 'Quick Rush Tutorial',
      icon: '⚡',
      steps: [
        {
          title: '1. HIGH SPEED MATH',
          desc: 'Solve addition, subtraction, multiplication, division, or number series under time pressure.',
        },
        {
          title: '2. COMBO MOMENTUM',
          desc: 'Every fast correct answer extends your timer and boosts your score multiplier!',
        },
        {
          title: '3. ELIMINATE POWER-UP',
          desc: 'Stuck on a tricky question? Use the 50:50 power-up to remove 2 wrong answers.',
        },
      ],
    },
    'emoji-count': {
      title: 'Emoji Count Tutorial',
      icon: '😎',
      steps: [
        {
          title: '1. TARGET EMOJI',
          desc: 'Look at the target emoji requested (e.g., Sunglasses, Rockets, Gems).',
        },
        {
          title: '2. GRID SCANNING',
          desc: 'Rapidly scan the grid rows and columns to sum all instances of that emoji.',
        },
        {
          title: '3. SPEED BONUS',
          desc: 'Tap the correct number quickly for maximum rush bonus points!',
        },
      ],
    },
    'number-box': {
      title: 'Number Box Tutorial',
      icon: '🔢',
      steps: [
        {
          title: '1. 3×3 MATRIX PATTERN',
          desc: 'Look across rows and columns to detect the math rule (Row Sums, Sequence Steps, or Addition).',
        },
        {
          title: '2. SOLVE THE "?" TILE',
          desc: 'Calculate what number must replace the golden mystery "?" tile to satisfy the pattern.',
        },
        {
          title: '3. TAP THE ANSWER',
          desc: 'Select the missing number to clear the matrix and advance to the next level.',
        },
      ],
    },
    'mixed-rush': {
      title: 'Mixed Rush Gauntlet',
      icon: '🌀',
      steps: [
        {
          title: '1. SURPRISE EVERY ROUND',
          desc: 'Rounds dynamically shift between Animals, Emojis, Mental Math, and Matrices!',
        },
        {
          title: '2. TOTAL ADAPTABILITY',
          desc: 'Test both your left brain (calculation) and right brain (visual observation) in one mode!',
        },
      ],
    },
  };

  const activeTutorial = tutorials[activeTab];

  return (
    <View style={styles.container}>
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="HOW TO PLAY" />

      {/* Mode Tabs */}
      <View style={styles.tabsRow}>
        {(['animal-count', 'quick-rush', 'emoji-count', 'number-box'] as GameModeId[]).map(
          (mId) => {
            const isSelected = activeTab === mId;
            return (
              <Pressable
                key={mId}
                onPress={() => setActiveTab(mId)}
                style={[styles.tab, isSelected && styles.activeTab]}
              >
                <Text style={styles.tabIcon}>{tutorials[mId].icon}</Text>
                <Text style={[styles.tabLabel, isSelected && styles.activeTabLabel]}>
                  {mId.split('-')[0].toUpperCase()}
                </Text>
              </Pressable>
            );
          }
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WoodPanel style={styles.guideCard} variant="card">
          <View style={styles.cardHeader}>
            <Text style={styles.headerIcon}>{activeTutorial.icon}</Text>
            <Text style={styles.headerTitle}>{activeTutorial.title}</Text>
          </View>

          <View style={styles.stepsList}>
            {activeTutorial.steps.map((step, idx) => (
              <View key={idx} style={styles.stepItem}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNum}>{idx + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </WoodPanel>

        {/* Power-Ups Guide Panel */}
        <WoodPanel style={styles.powerUpPanel} variant="glass">
          <Text style={styles.powerUpTitle}>POWER-UP GUIDE</Text>
          <View style={styles.powerUpList}>
            <View style={styles.powerUpRow}>
              <Text style={styles.puIcon}>❄️</Text>
              <View style={styles.puCol}>
                <Text style={styles.puName}>FREEZE TIME</Text>
                <Text style={styles.puDesc}>Pauses the countdown timer for 5 whole seconds.</Text>
              </View>
            </View>

            <View style={styles.powerUpRow}>
              <Text style={styles.puIcon}>⚡</Text>
              <View style={styles.puCol}>
                <Text style={styles.puName}>50:50 ELIMINATE</Text>
                <Text style={styles.puDesc}>Removes 2 incorrect choices immediately.</Text>
              </View>
            </View>

            <View style={styles.powerUpRow}>
              <Text style={styles.puIcon}>⏰</Text>
              <View style={styles.puCol}>
                <Text style={styles.puName}>EXTRA TIME</Text>
                <Text style={styles.puDesc}>Instantly adds +5 seconds to your clock.</Text>
              </View>
            </View>

            <View style={styles.powerUpRow}>
              <Text style={styles.puIcon}>💡</Text>
              <View style={styles.puCol}>
                <Text style={styles.puName}>AUTO HINT</Text>
                <Text style={styles.puDesc}>Highlights target animals or the correct answer tile.</Text>
              </View>
            </View>
          </View>
        </WoodPanel>

        <GameButton
          title="START PLAYING NOW"
          icon="▶"
          variant="green"
          size="lg"
          fullWidth
          onPress={() => startCountdown(activeTab, 'easy')}
          style={{ marginTop: 14 }}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: NRTheme.radius.md,
    backgroundColor: '#0E223D',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeTab: {
    backgroundColor: '#1E4575',
    borderColor: '#FFC107',
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#FFC107',
  },
  scrollContent: {
    padding: 16,
  },
  guideCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  stepsList: {
    gap: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNum: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stepDesc: {
    color: '#A2B6CE',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  powerUpPanel: {
    marginTop: 16,
    padding: 16,
  },
  powerUpTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },
  powerUpList: {
    gap: 10,
  },
  powerUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puIcon: {
    fontSize: 22,
    marginRight: 12,
    width: 32,
    textAlign: 'center',
  },
  puCol: {
    flex: 1,
  },
  puName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  puDesc: {
    color: '#8CA0BA',
    fontSize: 11,
  },
});
