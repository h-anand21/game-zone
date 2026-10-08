// ============================================================
// AIM RUSH — Screen 04: ModeSelectScreen
// Recreated from "Neon Aim Rush Mode Selection.png" reference
// Sci-Fi mode carousel, parameter specs, and safe area insets
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { GAME_MODES } from '../config';
import { GameModeConfig } from '../types';
import { SvgBackArrow } from '../components/icons/AimRushIcons';

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
  const insets = useSafeAreaInsets();
  const modesList = Object.values(GAME_MODES);

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.35}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(12, insets.top + 6),
            paddingBottom: Math.max(16, insets.bottom + 8),
          },
        ]}
      >
        {/* Top Header */}
        <View style={styles.topBar}>
          <Pressable style={styles.iconCircle} onPress={onBack}>
            <SvgBackArrow size={18} color={ARColors.white} />
          </Pressable>
          <View style={styles.titleGroup}>
            <Text style={styles.headerTitle}>SELECT MODE</Text>
            <Text style={styles.headerSub}>CHOOSE YOUR CHALLENGE</Text>
          </View>
          <View style={{ width: 40 }} />
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
                  <Text style={[styles.durationTag, { color: m.color }]}>{m.durationSeconds}s DURATION</Text>
                </View>

                <Text style={styles.cardTitle}>{m.title}</Text>
                <Text style={styles.cardSubtitle}>{m.subtitle}</Text>
                <Text style={styles.cardDesc}>{m.description}</Text>

                {/* Telemetry specs row */}
                <View style={styles.specRow}>
                  <Text style={styles.specItem}>RADIUS: {m.baseRadius}px</Text>
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
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGroup: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  headerSub: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  scrollList: {
    gap: 14,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(10, 16, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: ARColors.border,
    borderRadius: 18,
    padding: 16,
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
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1,
  },
  durationTag: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.5,
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardSubtitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1,
  },
  cardDesc: {
    fontSize: 11.5,
    color: ARColors.textSecondary,
    lineHeight: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  specItem: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  selectAction: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  selectActionText: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.2,
  },
});
