// ============================================================
// Number Rush — 3-2-1 RUSH! Countdown Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { MascotIllustration } from '../components';
import { MODE_CONFIGS } from '../data';

export const CountdownScreen: React.FC = () => {
  const { countdownValue, selectedMode, difficulty } = useNumberRushStore();
  const modeMeta = MODE_CONFIGS[selectedMode];

  return (
    <View style={styles.container}>
      {/* Top Mode Badge */}
      <View style={styles.topBadge}>
        <Text style={styles.modeIcon}>{modeMeta?.icon || '⚡'}</Text>
        <Text style={styles.modeTitle}>{modeMeta?.name || 'Number Rush'}</Text>
        <View style={styles.diffPill}>
          <Text style={styles.diffText}>{difficulty.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.getReady}>GET READY!</Text>

      {/* Mascot in celebration/ready pose */}
      <View style={styles.mascotBox}>
        <MascotIllustration size={160} mood="celebrate" />
      </View>

      {/* Giant Countdown Pulse */}
      <View style={styles.counterBox}>
        <Text
          style={[
            styles.counterText,
            countdownValue === 0 && styles.rushText,
          ]}
        >
          {countdownValue > 0 ? countdownValue : 'RUSH!'}
        </Text>
      </View>

      <Text style={styles.tipText}>
        {selectedMode === 'animal-count'
          ? 'Count the target animals as fast as you can!'
          : selectedMode === 'emoji-count'
          ? 'Spot the specific emojis in the grid!'
          : selectedMode === 'number-box'
          ? 'Find the pattern to solve the mystery tile!'
          : 'Solve the mental math sprint before time runs out!'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2643',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: NRTheme.radius.pill,
    borderWidth: 2,
    borderColor: '#FFC107',
    marginBottom: 20,
    ...NRTheme.shadows.card,
  },
  modeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  modeTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
    marginRight: 8,
  },
  diffPill: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  diffText: {
    color: '#04160D',
    fontWeight: '900',
    fontSize: 10,
  },
  getReady: {
    color: '#8CA0BA',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 10,
  },
  mascotBox: {
    marginVertical: 12,
  },
  counterBox: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 90,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: '#FF6D00',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 16,
  },
  rushText: {
    fontSize: 70,
    color: '#2ED573',
    textShadowColor: '#0E5C35',
    letterSpacing: 2,
  },
  tipText: {
    color: '#8CA0BA',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
    maxWidth: 280,
    lineHeight: 18,
  },
});
