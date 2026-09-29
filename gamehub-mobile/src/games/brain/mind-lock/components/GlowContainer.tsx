// ============================================================
// Mind Lock — Glow Container Component
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface GlowContainerProps {
  children: React.ReactNode;
  glowColor?: string;
  glowRadius?: number;
  style?: ViewStyle;
}

export const GlowContainer: React.FC<GlowContainerProps> = ({
  children,
  glowColor = '#FFC928',
  glowRadius = 16,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          shadowColor: glowColor,
          shadowRadius: glowRadius,
          shadowOpacity: 0.8,
          elevation: 10,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowOffset: { width: 0, height: 0 },
  },
});
