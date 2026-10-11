// ============================================================
// STACK MASTER — Screen 05: Interactive Tutorial
// Hands-on playable stacking guide with real engine physics
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { StackArena } from '../components/arena/StackArena';
import { COLORS } from '../theme/colors';

interface TutorialScreenProps {
  onBack: () => void;
  onStartPlaying: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({
  onBack,
  onStartPlaying,
}) => {
  const insets = useSafeAreaInsets();
  const [tutHeight, setTutHeight] = useState(0);

  const getTipText = () => {
    if (tutHeight === 0) return '👉 TAP ANYWHERE inside the sky arena to drop your first block!';
    if (tutHeight === 1) return '✨ Notice how the block settles! Land another drop now!';
    if (tutHeight === 2) return '✂️ If you miss alignment slightly, the overhang will be sliced off!';
    if (tutHeight >= 3) return '👑 Perfect drops keep your full width! Keep practicing or start a real run!';
    return 'Tap anywhere to drop!';
  };

  return (
    <ScreenBackground type="gameplay" dimAmount={0.35}>
      <View style={styles.container}>
        <GameHeader
          title="TUTORIAL ARENA"
          subtitle="PRACTICE YOUR TIMING"
          onBack={onBack}
          showCurrency={false}
        />

        {/* Top Tip Banner */}
        <View style={styles.tipWrapper}>
          <LinearGradient
            colors={['#102E56', '#091C38']}
            style={styles.tipCard}
          >
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>{getTipText()}</Text>
          </LinearGradient>
        </View>

        {/* Live Interactive Practice Arena */}
        <View style={styles.arenaWrapper}>
          <StackArena
            mode="zen"
            isPaused={false}
            assistMode={true}
            onScoreUpdate={(_s, h) => setTutHeight(h)}
            onGameOver={() => {
              // Reset automatically for tutorial practice
              setTutHeight(0);
            }}
          />
        </View>

        {/* Bottom Action */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
          <PrimaryButton
            title="START CLASSIC RUN ▶"
            variant="green"
            size="large"
            onPress={onStartPlaying}
          />
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tipWrapper: {
    paddingHorizontal: 16,
    marginVertical: 8,
    zIndex: 10,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    lineHeight: 18,
  },
  arenaWrapper: {
    flex: 1,
    position: 'relative',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
