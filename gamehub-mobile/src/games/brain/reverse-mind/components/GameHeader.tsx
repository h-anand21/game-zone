// ============================================================
// REVERSE MIND — In-Game HUD Header Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RMTheme } from '../theme';

interface GameHeaderProps {
  modeName: string;
  round: number;
  totalRounds: number;
  score: number;
  combo: number;
  onBack: () => void;
  onPause?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  modeName,
  round,
  totalRounds,
  score,
  combo,
  onBack,
  onPause,
}) => {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable onPress={onBack} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
        <Text style={styles.iconBtnText}>✕</Text>
      </Pressable>

      {/* Center Info: Mode Pill & Round Progression */}
      <View style={styles.centerGroup}>
        <View style={styles.modeBadge}>
          <Text style={styles.modeText}>{modeName.toUpperCase()}</Text>
        </View>
        <Text style={styles.roundText}>
          ROUND {round} <Text style={styles.roundTotal}>/ {totalRounds}</Text>
        </Text>
      </View>

      {/* Right Stats: Score & Combo */}
      <View style={styles.rightGroup}>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        {combo > 1 && (
          <View style={styles.comboPill}>
            <Text style={styles.comboText}>🔥 {combo}x</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    width: '100%',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconBtnText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  centerGroup: {
    alignItems: 'center',
  },
  modeBadge: {
    backgroundColor: 'rgba(77, 231, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: RMTheme.radii.full,
    borderWidth: 1,
    borderColor: 'rgba(77, 231, 255, 0.35)',
  },
  modeText: {
    fontSize: 10,
    fontWeight: '800',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 1.2,
  },
  roundText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  roundTotal: {
    color: RMTheme.colors.textSecondary,
    fontSize: 12,
  },
  rightGroup: {
    alignItems: 'flex-end',
  },
  scoreBadge: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: RMTheme.colors.textMuted,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '900',
    color: RMTheme.colors.primaryGold,
  },
  comboPill: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RMTheme.colors.orangeNeon,
    marginTop: 2,
  },
  comboText: {
    fontSize: 10,
    fontWeight: '900',
    color: RMTheme.colors.orangeNeon,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
