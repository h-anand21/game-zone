// ============================================================
// MEMORY RUSH — Premium Charcoal Glass Surface Card
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowing?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  glowing = false,
}) => {
  return (
    <View style={[styles.outer, glowing && styles.glowingBorder, style]}>
      <LinearGradient
        colors={['rgba(23, 29, 36, 0.90)', 'rgba(17, 22, 28, 0.95)']}
        style={styles.inner}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: MRColors.borderSubtle,
    backgroundColor: MRColors.surface,
  },
  glowingBorder: {
    borderColor: MRColors.borderGlass,
    shadowColor: MRColors.primaryCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  inner: {
    padding: 16,
    borderRadius: 20,
  },
});
