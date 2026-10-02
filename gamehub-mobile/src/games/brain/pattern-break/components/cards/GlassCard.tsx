// ============================================================
// PATTERN BREAKER — GlassCard Component
// Real Glassmorphism with multi-stop dark gradient & frosted cyan rim
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PBColors, PBRadius, PBShadows } from '../../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  variant?: 'cyan' | 'amber' | 'neutral';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  innerStyle,
  variant = 'cyan',
}) => {
  const borderColor =
    variant === 'amber'
      ? 'rgba(255, 213, 74, 0.35)'
      : variant === 'neutral'
      ? 'rgba(169, 187, 197, 0.18)'
      : 'rgba(25, 211, 255, 0.28)';

  return (
    <View style={[styles.container, PBShadows.cardElevation, style]}>
      <LinearGradient
        colors={['rgba(24, 47, 57, 0.88)', 'rgba(16, 35, 44, 0.94)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.cardSurface, { borderColor }, innerStyle]}
      >
        {/* Subtle Top Sunlit Rim */}
        <View style={styles.topBevel} />
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: PBRadius.lg,
    overflow: 'hidden',
  },
  cardSurface: {
    borderRadius: PBRadius.lg,
    padding: 16,
    borderWidth: 1.5,
    position: 'relative',
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
});
