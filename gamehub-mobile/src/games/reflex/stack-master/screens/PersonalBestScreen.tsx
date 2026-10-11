// ============================================================
// STACK MASTER — Screen 10: New Personal Best Celebration
// Golden Crown triumph with record delta & fireworks
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { COLORS } from '../theme/colors';
import { StackHaptics } from '../utils/haptics';
import type { RunRecord } from '../types';

interface PersonalBestScreenProps {
  run: RunRecord;
  onPlayAgain: () => void;
  onViewBreakdown: () => void;
  onHome: () => void;
}

export const PersonalBestScreen: React.FC<PersonalBestScreenProps> = ({
  run,
  onPlayAgain,
  onViewBreakdown,
  onHome,
}) => {
  const insets = useSafeAreaInsets();
  const crownScale = useSharedValue(0.4);

  useEffect(() => {
    StackHaptics.milestone();
    crownScale.value = withSequence(
      withSpring(1.3, { damping: 6, stiffness: 140 }),
      withTiming(1, { duration: 200 })
    );
  }, [crownScale]);

  const crownStyle = useAnimatedStyle(() => ({
    transform: [{ scale: crownScale.value }],
  }));

  return (
    <ScreenBackground type="home" dimAmount={0.45}>
      <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20 }]}>
        {/* Crown Icon */}
        <Animated.View style={[styles.crownBox, crownStyle]}>
          <Text style={styles.crownEmoji}>👑</Text>
        </Animated.View>

        <Text style={styles.title}>NEW PERSONAL RECORD!</Text>
        <Text style={styles.subtitle}>SKYLANDS ASCENT TRIUMPH</Text>

        {/* Record Card */}
        <LinearGradient
          colors={['#102E56', '#091C38']}
          style={styles.card}
        >
          <View style={styles.badgeRow}>
            <Text style={styles.starText}>⭐ ⭐ ⭐</Text>
          </View>

          <Text style={styles.metricLabel}>NEW BEST HEIGHT</Text>
          <Text style={styles.metricVal}>{run.height}</Text>

          <View style={styles.divider} />

          <View style={styles.statLine}>
            <Text style={styles.statLineLabel}>FINAL SCORE</Text>
            <Text style={styles.statLineVal}>{run.score}</Text>
          </View>

          <View style={styles.statLine}>
            <Text style={styles.statLineLabel}>PERFECT PLACEMENTS</Text>
            <Text style={styles.statLineVal}>{run.perfectPlacements}</Text>
          </View>

          <View style={styles.statLine}>
            <Text style={styles.statLineLabel}>MAX COMBO</Text>
            <Text style={styles.statLineVal}>x{run.maxCombo}</Text>
          </View>
        </LinearGradient>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            title="PLAY AGAIN ▶"
            variant="gold"
            size="large"
            onPress={onPlayAgain}
          />

          <SecondaryButton
            title="RUN BREAKDOWN 📊"
            onPress={onViewBreakdown}
          />

          <SecondaryButton
            title="MAIN MENU 🏠"
            variant="panel"
            onPress={onHome}
          />
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crownBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 211, 78, 0.2)',
    borderWidth: 3,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  crownEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 1,
    marginBottom: 8,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  badgeRow: {
    marginBottom: 10,
  },
  starText: {
    fontSize: 20,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  metricVal: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFF',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#1E3B68',
    marginVertical: 14,
  },
  statLine: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  statLineLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
  },
  statLineVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
});
