// ============================================================
// STACK MASTER — Screen 04: Mode Select
// 5 distinct game modes with lock progression and records
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { COLORS } from '../theme/colors';
import { GAME_MODES } from '../engine/gameModes';
import { useStackStore } from '../store/stackStore';
import { StackHaptics } from '../utils/haptics';
import type { GameMode } from '../types';

interface ModeSelectScreenProps {
  onBack: () => void;
  onSelectMode: (mode: GameMode) => void;
}

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  onBack,
  onSelectMode,
}) => {
  const insets = useSafeAreaInsets();
  const modeBest = useStackStore((state) => state.modeBest);
  const bestHeight = useStackStore((state) => state.bestHeight);
  const totalPerfects = useStackStore((state) => state.totalPerfects);

  // Dynamic lock check
  const isModeUnlocked = (modeId: GameMode): boolean => {
    if (modeId === 'classic') return true;
    if (modeId === 'zen') return bestHeight >= 5;
    if (modeId === 'rush') return bestHeight >= 15;
    if (modeId === 'precision') return totalPerfects >= 5;
    if (modeId === 'daily') return true;
    return true;
  };

  return (
    <ScreenBackground type="home" dimAmount={0.5}>
      <View style={styles.container}>
        <GameHeader
          title="SELECT ARENA"
          subtitle="CHOOSE YOUR MODE"
          onBack={onBack}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 40) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {GAME_MODES.map((mode) => {
            const unlocked = isModeUnlocked(mode.id);
            const best = modeBest[mode.id] || { score: 0, height: 0 };

            return (
              <Pressable
                key={mode.id}
                onPress={() => {
                  if (!unlocked) return;
                  StackHaptics.buttonPress();
                  onSelectMode(mode.id);
                }}
                disabled={!unlocked}
                style={({ pressed }) => [
                  styles.cardWrapper,
                  !unlocked && styles.lockedCardWrapper,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
              >
                <LinearGradient
                  colors={
                    unlocked
                      ? ['#102E56', '#091C38']
                      : ['#1C2636', '#0E1624']
                  }
                  style={[
                    styles.card,
                    { borderColor: unlocked ? mode.accentColor : '#2A3A52' },
                  ]}
                >
                  {/* Top Mode Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.iconBox}>
                      <Text style={styles.modeIcon}>{mode.icon}</Text>
                    </View>
                    <View style={styles.titleBox}>
                      <Text style={styles.modeTitle}>{mode.title}</Text>
                      <Text style={[styles.modeSubtitle, { color: mode.accentColor }]}>
                        {mode.subtitle}
                      </Text>
                    </View>
                    {!unlocked && (
                      <View style={styles.lockBadge}>
                        <Text style={styles.lockText}>🔒 LOCKED</Text>
                      </View>
                    )}
                  </View>

                  {/* Mode Description */}
                  <Text style={styles.modeDesc}>{mode.description}</Text>

                  {/* Bottom Stats or Unlock Requirement */}
                  <View style={styles.cardFooter}>
                    {unlocked ? (
                      <View style={styles.statsRow}>
                        <Text style={styles.statTag}>
                          BEST HEIGHT: <Text style={styles.statTagVal}>{best.height}</Text>
                        </Text>
                        <Text style={styles.statTag}>
                          SCORE: <Text style={styles.statTagVal}>{best.score}</Text>
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.reqText}>
                        REQUIRES: {mode.unlockRequirement}
                      </Text>
                    )}

                    {unlocked && (
                      <View style={[styles.playPill, { backgroundColor: mode.accentColor }]}>
                        <Text style={styles.playPillText}>PLAY ▶</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 14,
  },
  cardWrapper: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  lockedCardWrapper: {
    opacity: 0.7,
  },
  card: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#07162C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modeIcon: {
    fontSize: 24,
  },
  titleBox: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  modeSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  lockBadge: {
    backgroundColor: '#351B20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  lockText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.error,
  },
  modeDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statTag: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
  },
  statTagVal: {
    color: '#FFF',
    fontWeight: '900',
  },
  reqText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.error,
  },
  playPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  playPillText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#071329',
    letterSpacing: 0.8,
  },
});
