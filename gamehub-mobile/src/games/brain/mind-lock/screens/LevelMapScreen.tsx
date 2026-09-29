// ============================================================
// Mind Lock — Screen 9: Level Map Screen
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MLColors } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { LevelMap } from '../components/LevelMap';
import { BottomNavigation } from '../components/BottomNavigation';

export const LevelMapScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScreenHeader title="World Progression" />
      <LevelMap />
      <BottomNavigation currentTab="levels" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MLColors.background,
  },
});
