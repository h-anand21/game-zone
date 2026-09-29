// ============================================================
// GameHub — Mind Lock Game Component
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MindLockApp } from './MindLockApp';
import type { GameEngine } from '../../engine/GameEngine';

interface MindLockProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const MindLockGame: React.FC<MindLockProps> = ({ onFinish }) => {
  return (
    <View style={styles.container}>
      <MindLockApp onFinishGame={onFinish} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111C',
  },
});
