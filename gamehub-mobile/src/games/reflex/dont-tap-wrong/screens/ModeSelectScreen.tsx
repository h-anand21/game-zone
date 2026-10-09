// ============================================================
// DON'T TAP WRONG — Screen 03: Mode Select
// Distinct game modes with transparent rules, targets & indicators
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { HeaderBar } from '../components/common/HeaderBar';
import { NeonBadge } from '../components/common/NeonBadge';
import { DtwColors } from '../theme/colors';
import { DTW_MODES } from '../config';
import type { GameModeId } from '../types';

interface ModeSelectScreenProps {
  onBack: () => void;
  onSelectMode: (mode: GameModeId) => void;
}

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  onBack,
  onSelectMode,
}) => {
  const modes = Object.values(DTW_MODES);

  return (
    <BackgroundLayer variant="lobby">
      <View style={styles.container}>
        <HeaderBar
          title="SELECT ARENA"
          subtitle="CHOOSE YOUR CHALLENGE"
          onBack={onBack}
        />

        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {modes.map((mode) => {
            const isClassic = mode.id === 'classic';

            return (
              <Pressable
                key={mode.id}
                style={({ pressed }) => [
                  styles.modeCard,
                  { borderColor: mode.badgeColor },
                  isClassic && styles.classicCard,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => onSelectMode(mode.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <Text style={styles.modeIcon}>{mode.icon}</Text>
                    <View>
                      <Text style={[styles.modeTitle, { color: mode.badgeColor }]}>
                        {mode.name}
                      </Text>
                      <Text style={styles.modeTagline}>{mode.tagline}</Text>
                    </View>
                  </View>

                  <NeonBadge
                    label={mode.durationSeconds > 0 ? `${mode.durationSeconds}s` : 'SURVIVAL'}
                    color={mode.badgeColor}
                    size="compact"
                  />
                </View>

                <Text style={styles.modeDescription}>{mode.description}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>TARGET</Text>
                    <Text style={[styles.metricValue, { color: mode.badgeColor }]}>
                      {mode.targetScore} TAPS
                    </Text>
                  </View>

                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>DANGER TILES</Text>
                    <Text style={styles.metricValue}>
                      {mode.dangerTileRange[0]}-{mode.dangerTileRange[1]} TILES
                    </Text>
                  </View>

                  <View style={styles.playTag}>
                    <Text style={[styles.playTagText, { color: mode.badgeColor }]}>
                      PLAY ARENA →
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
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
    gap: 14,
  },
  modeCard: {
    backgroundColor: 'rgba(21, 28, 37, 0.88)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  classicCard: {
    backgroundColor: 'rgba(22, 45, 11, 0.35)',
    borderWidth: 2,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeIcon: {
    fontSize: 26,
  },
  modeTitle: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  modeTagline: {
    fontSize: 10,
    color: DtwColors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 1,
  },
  modeDescription: {
    fontSize: 12,
    color: DtwColors.textSecondary,
    lineHeight: 18,
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricItem: {
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '900',
    color: DtwColors.textPrimary,
  },
  playTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  playTagText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default ModeSelectScreen;
