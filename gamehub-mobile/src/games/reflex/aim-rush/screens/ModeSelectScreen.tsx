// ============================================================
// AIM RUSH — Screen 04: ModeSelectScreen
// Futuristic carousel for selecting Classic, Rush, Precision, or Daily
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { GAME_MODES } from '../config';
import { GameModeConfig, GameModeId } from '../types';

interface ModeSelectScreenProps {
  currentMode: GameModeConfig;
  onSelectMode: (mode: GameModeConfig) => void;
  onBack: () => void;
}

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  currentMode,
  onSelectMode,
  onBack,
}) => {
  const modesList = Object.values(GAME_MODES);

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.4}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <Pressable style={styles.iconCircle} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={ARColors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>ARENA MODES</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Scrollable Mode Cards */}
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {modesList.map((m) => {
            const isSelected = m.id === currentMode.id;

            return (
              <Pressable
                key={m.id}
                style={[
                  styles.card,
                  isSelected && { borderColor: m.color, borderWidth: 2 },
                ]}
                onPress={() => onSelectMode(m)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: `${m.color}25`, borderColor: m.color }]}>
                    <Text style={[styles.badgeText, { color: m.color }]}>{m.badge}</Text>
                  </View>
                  <Text style={[styles.durationTag, { color: m.color }]}>{m.durationSeconds}s</Text>
                </View>

                <Text style={styles.cardTitle}>{m.title}</Text>
                <Text style={styles.cardSubtitle}>{m.subtitle}</Text>
                <Text style={styles.cardDesc}>{m.description}</Text>

                {/* Telemetry specs row */}
                <View style={styles.specRow}>
                  <Text style={styles.specItem}>BASE RADIUS: {m.baseRadius}px</Text>
                  <Text style={styles.specItem}>VELOCITY: ×{m.speedMultiplier}</Text>
                  <Text style={styles.specItem}>LIVES: {m.initialLives}</Text>
                </View>

                <View style={[styles.selectAction, isSelected && { backgroundColor: m.color }]}>
                  <Text
                    style={[
                      styles.selectActionText,
                      isSelected && { color: '#07090C' },
                    ]}
                  >
                    {isSelected ? 'ACTIVE ARENA ✓' : 'EQUIP MODE'}
                  </Text>
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
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
  },
  scrollList: {
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.border,
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  durationTag: {
    fontSize: 12,
    fontWeight: '900',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1,
  },
  cardDesc: {
    fontSize: 12,
    color: ARColors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6,
  },
  specItem: {
    fontSize: 9,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  selectAction: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  selectActionText: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.2,
  },
});
