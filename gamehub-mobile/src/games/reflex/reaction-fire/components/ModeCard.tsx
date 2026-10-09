// ============================================================
// REACTION FIRE — Mode Selection Card
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { NeonBadge } from './NeonBadge';
import { RfColors } from '../theme';
import type { GameModeConfig } from '../types';

interface ModeCardProps {
  mode: GameModeConfig;
  onSelect: () => void;
  isPopular?: boolean;
}

export const ModeCard: React.FC<ModeCardProps> = ({ mode, onSelect, isPopular }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { borderColor: mode.badgeColor },
        isPopular && styles.popularCard,
        pressed && styles.pressed,
      ]}
      onPress={onSelect}
    >
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.icon}>{mode.icon}</Text>
          <View>
            <Text style={[styles.title, { color: mode.badgeColor }]}>{mode.name}</Text>
            <Text style={styles.tagline}>{mode.tagline}</Text>
          </View>
        </View>

        <NeonBadge
          label={mode.durationSeconds > 0 ? `${mode.durationSeconds}s` : `${mode.totalRounds} RND`}
          color={mode.badgeColor}
          size="compact"
        />
      </View>

      <Text style={styles.description}>{mode.description}</Text>

      <View style={styles.footerRow}>
        <View style={styles.targetCol}>
          <Text style={styles.targetLabel}>TARGET</Text>
          <Text style={[styles.targetValue, { color: mode.badgeColor }]}>
            &lt;{mode.targetMs} ms
          </Text>
        </View>

        <View style={styles.enterButton}>
          <Text style={[styles.enterText, { color: mode.badgeColor }]}>ENTER ARENA →</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(10, 23, 41, 0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    marginVertical: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  popularCard: {
    backgroundColor: 'rgba(30, 62, 5, 0.35)',
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 26,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 10,
    color: RfColors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: RfColors.textSecondary,
    lineHeight: 18,
    marginVertical: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  targetCol: {
    alignItems: 'flex-start',
  },
  targetLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1,
  },
  targetValue: {
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },
  enterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  enterText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default ModeCard;
