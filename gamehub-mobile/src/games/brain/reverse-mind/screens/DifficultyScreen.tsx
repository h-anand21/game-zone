// ============================================================
// REVERSE MIND — Dedicated Difficulty Selection Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EnvironmentalBackground } from '../components/EnvironmentalBackground';
import { GlowButton } from '../components/GlowButton';
import type { GameDifficulty, GameMode, AppNavScreen } from '../types';
import { RMTheme } from '../theme';

interface DifficultyScreenProps {
  selectedMode: GameMode;
  onConfirm: (difficulty: GameDifficulty) => void;
  onBack: () => void;
}

interface DifficultyMeta {
  id: GameDifficulty;
  title: string;
  badge: string;
  color: string;
  objects: string;
  duration: string;
  mistakes: string;
  desc: string;
  recommended?: boolean;
}

const DIFFICULTIES: DifficultyMeta[] = [
  {
    id: 'easy',
    title: 'EASY CHALLENGE',
    badge: 'BEGINNER FRIENDLY',
    color: RMTheme.colors.emeraldGreen,
    objects: '3 – 5 Items',
    duration: '3.0 Seconds',
    mistakes: '2 Mistakes Allowed',
    desc: 'Large objects, longer display window, minimal distractions.',
    recommended: true,
  },
  {
    id: 'medium',
    title: 'MEDIUM CHALLENGE',
    badge: 'BALANCED INVERSION',
    color: RMTheme.colors.primaryGold,
    objects: '4 – 6 Items',
    duration: '2.0 Seconds',
    mistakes: '1 Mistake Allowed',
    desc: 'Mixed categories, faster display, moderate cognitive speed.',
  },
  {
    id: 'hard',
    title: 'HARD MASTER',
    badge: 'EXPERT MEMORY',
    color: RMTheme.colors.coralRed,
    objects: '5 – 8 Items',
    duration: '1.2 Seconds',
    mistakes: '0 Mistakes (Instant Fail)',
    desc: 'Decoy items, flash display, zero margin for error.',
  },
];

export const DifficultyScreen: React.FC<DifficultyScreenProps> = ({
  selectedMode,
  onConfirm,
  onBack,
}) => {
  const [selected, setSelected] = useState<GameDifficulty>('easy');

  return (
    <EnvironmentalBackground theme="difficulty">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>CHOOSE DIFFICULTY</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.cardsContainer}>
            {DIFFICULTIES.map((diff) => {
              const isSelected = selected === diff.id;

              return (
                <Pressable
                  key={diff.id}
                  onPress={() => setSelected(diff.id)}
                  style={({ pressed }) => [
                    styles.diffCard,
                    isSelected && { borderColor: diff.color },
                    pressed && styles.pressed,
                  ]}
                >
                  <LinearGradient
                    colors={['#18263A', '#0D1624']}
                    style={styles.cardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.topRow}>
                      <View style={[styles.badgePill, { backgroundColor: diff.color + '25', borderColor: diff.color }]}>
                        <Text style={[styles.badgeText, { color: diff.color }]}>{diff.badge}</Text>
                      </View>
                      {diff.recommended && (
                        <View style={styles.recommendedTag}>
                          <Text style={styles.recommendedText}>RECOMMENDED</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.cardTitle}>{diff.title}</Text>
                    <Text style={styles.cardDesc}>{diff.desc}</Text>

                    <View style={styles.statsGrid}>
                      <View style={styles.statBox}>
                        <Text style={styles.statVal}>{diff.objects}</Text>
                        <Text style={styles.statKey}>Sequence Length</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statVal}>{diff.duration}</Text>
                        <Text style={styles.statKey}>Memorize Time</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statVal}>{diff.mistakes}</Text>
                        <Text style={styles.statKey}>Mistake Limit</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.actionWrapper}>
          <GlowButton
            title="CONTINUE TO RULE PREVIEW"
            variant="gold"
            size="lg"
            onPress={() => onConfirm(selected)}
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
  cardsContainer: {
    gap: 14,
  },
  diffCard: {
    borderRadius: RMTheme.radii.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardGradient: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: RMTheme.radii.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  recommendedTag: {
    backgroundColor: RMTheme.colors.primaryGold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recommendedText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#07111F',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    color: RMTheme.colors.textSecondary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: RMTheme.radii.md,
    padding: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statKey: {
    fontSize: 9,
    color: RMTheme.colors.textMuted,
    marginTop: 2,
  },
  actionWrapper: {
    width: '100%',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
