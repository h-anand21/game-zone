// ============================================================
// Number Rush — Difficulty Select Modal
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { WoodPanel, GameButton } from '../components';
import type { Difficulty } from '../types';

interface DifficultyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DifficultyModal: React.FC<DifficultyModalProps> = ({
  visible,
  onClose,
}) => {
  const { difficulty, setDifficulty, startCountdown, selectedMode } =
    useNumberRushStore();

  if (!visible) return null;

  const diffs: {
    id: Difficulty;
    name: string;
    sub: string;
    badge: string;
    color: string;
  }[] = [
    {
      id: 'easy',
      name: 'EASY',
      sub: 'Generous time limit, fewer distractors (1.0x Points)',
      badge: '🟢 CASUAL',
      color: '#2ED573',
    },
    {
      id: 'medium',
      name: 'MEDIUM',
      sub: 'Faster timer, moderate challenge (1.5x Points)',
      badge: '🟡 BALANCED',
      color: '#FF9F1A',
    },
    {
      id: 'hard',
      name: 'HARD',
      sub: 'Extreme speed, maximum distractors (2.0x Points)',
      badge: '🔴 INSANE',
      color: '#FF4757',
    },
  ];

  return (
    <View style={styles.overlay}>
      <WoodPanel style={styles.panel} variant="wood">
        <Text style={styles.title}>SELECT DIFFICULTY</Text>

        <View style={styles.optionsList}>
          {diffs.map((d) => {
            const isSelected = difficulty === d.id;

            return (
              <Pressable
                key={d.id}
                onPress={() => setDifficulty(d.id)}
                style={[
                  styles.diffCard,
                  { borderColor: d.color },
                  isSelected && {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 3,
                  },
                ]}
              >
                <View style={styles.topRow}>
                  <Text style={[styles.diffName, { color: d.color }]}>
                    {d.name}
                  </Text>
                  <View
                    style={[styles.badgePill, { backgroundColor: d.color }]}
                  >
                    <Text style={styles.badgeText}>{d.badge}</Text>
                  </View>
                </View>
                <Text style={styles.diffSub}>{d.sub}</Text>
              </Pressable>
            );
          })}
        </View>

        <GameButton
          title="START RUSH"
          icon="▶"
          variant="green"
          size="lg"
          fullWidth
          onPress={() => {
            onClose();
            startCountdown(selectedMode, difficulty);
          }}
          style={{ marginTop: 16 }}
        />
      </WoodPanel>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4, 11, 22, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 999,
  },
  panel: {
    width: '100%',
    maxWidth: 360,
    padding: 20,
  },
  title: {
    color: '#FFE082',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 16,
  },
  optionsList: {
    gap: 12,
  },
  diffCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: NRTheme.radius.lg,
    padding: 14,
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  diffName: {
    fontSize: 18,
    fontWeight: '900',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#071324',
    fontSize: 10,
    fontWeight: '900',
  },
  diffSub: {
    color: '#8CA0BA',
    fontSize: 12,
    lineHeight: 16,
  },
});
