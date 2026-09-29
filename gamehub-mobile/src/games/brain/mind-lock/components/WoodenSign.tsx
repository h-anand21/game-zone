// ============================================================
// Mind Lock — Wooden Signboard Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLTypography } from '../theme';

interface WoodenSignProps {
  subtitle: string;
  title: string;
}

export const WoodenSign: React.FC<WoodenSignProps> = ({ subtitle, title }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8D4619', '#5A2609', '#3B1703']}
        style={styles.board}
      >
        {/* Top wood grain highlight */}
        <View style={styles.grainHighlight} />

        {/* 4 Corner Bolts */}
        <View style={[styles.bolt, { top: 6, left: 8 }]} />
        <View style={[styles.bolt, { top: 6, right: 8 }]} />
        <View style={[styles.bolt, { bottom: 6, left: 8 }]} />
        <View style={[styles.bolt, { bottom: 6, right: 8 }]} />

        {/* Text */}
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  board: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: MLRadius.lg,
    borderWidth: 3,
    borderColor: '#381604',
    alignItems: 'center',
    ...MLShadows.md,
    position: 'relative',
    overflow: 'hidden',
  },
  grainHighlight: {
    position: 'absolute',
    top: 2,
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
  },
  bolt: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1A36A',
    borderWidth: 1,
    borderColor: '#2D1103',
  },
  subtitle: {
    color: '#FFD39B',
    fontSize: 10,
    fontWeight: MLTypography.bold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFF8EB',
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
});
