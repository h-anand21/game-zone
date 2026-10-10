// ============================================================
// REACTION FIRE — Screen 04: Mode Selection
// Four distinct arena modes with transparent rules, targets & practice
// ============================================================

import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBar } from '../components/HeaderBar';
import { ModeCard } from '../components/ModeCard';
import { ArcadeButton } from '../components/ArcadeButton';
import { RfColors } from '../theme';
import { RF_MODES } from '../config';
import type { GameModeId } from '../types';

interface ModeSelectScreenProps {
  onBack: () => void;
  onSelectMode: (mode: GameModeId) => void;
  onOpenPractice: () => void;
}

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  onBack,
  onSelectMode,
  onOpenPractice,
}) => {
  const insets = useSafeAreaInsets();
  const modes: GameModeId[] = ['classic', 'five-round', 'endurance', 'fakeout'];

  return (
    <View style={styles.container}>
      <HeaderBar
        title="ARENA MODES"
        subtitle="SELECT REFLEX CHALLENGE"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollList,
          { paddingBottom: Math.max(insets.bottom + 20, 32) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {modes.map((modeId) => (
          <ModeCard
            key={modeId}
            mode={RF_MODES[modeId]}
            onSelect={() => onSelectMode(modeId)}
            isPopular={modeId === 'classic'}
          />
        ))}

        {/* Practice Mode Special Action */}
        <View style={styles.practiceSection}>
          <ArcadeButton
            title="TRY PRACTICE ARENA (3 RUNS)"
            variant="glass"
            icon="🛡️"
            onPress={onOpenPractice}
            style={styles.practiceBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollList: {
    padding: 16,
    paddingBottom: 32,
    gap: 8,
  },
  practiceSection: {
    marginTop: 12,
  },
  practiceBtn: {
    width: '100%',
  },
});

export default ModeSelectScreen;
