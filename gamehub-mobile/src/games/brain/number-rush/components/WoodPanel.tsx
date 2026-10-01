// ============================================================
// Number Rush — Jungle Wood & Glossy Arcade Panel
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { NRTheme } from '../theme';

interface WoodPanelProps {
  children: React.ReactNode;
  variant?: 'wood' | 'glass' | 'card' | 'gold';
  style?: ViewStyle;
  hasRivets?: boolean;
}

export const WoodPanel: React.FC<WoodPanelProps> = ({
  children,
  variant = 'card',
  style,
  hasRivets = true,
}) => {
  const getPanelStyles = () => {
    switch (variant) {
      case 'wood':
        return {
          backgroundColor: '#4A2511',
          borderColor: '#8B4513',
          borderWidth: 4,
        };
      case 'gold':
        return {
          backgroundColor: '#1E1A0C',
          borderColor: '#FFC107',
          borderWidth: 3,
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(16, 39, 68, 0.75)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1.5,
        };
      case 'card':
      default:
        return {
          backgroundColor: '#102744',
          borderColor: '#1D4575',
          borderWidth: 2,
        };
    }
  };

  const panelConfig = getPanelStyles();

  return (
    <View style={[styles.outer, panelConfig, style]}>
      {/* Corner Rivets */}
      {hasRivets && (
        <>
          <View style={[styles.rivet, styles.rivetTL]} />
          <View style={[styles.rivet, styles.rivetTR]} />
          <View style={[styles.rivet, styles.rivetBL]} />
          <View style={[styles.rivet, styles.rivetBR]} />
        </>
      )}

      {/* Top Gloss Line */}
      <View style={styles.topGloss} />

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: NRTheme.radius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...NRTheme.shadows.card,
  },
  topGloss: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
  },
  content: {
    padding: 16,
  },
  rivet: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFE082',
    borderWidth: 1.5,
    borderColor: '#C67C00',
    zIndex: 5,
  },
  rivetTL: { top: 8, left: 8 },
  rivetTR: { top: 8, right: 8 },
  rivetBL: { bottom: 8, left: 8 },
  rivetBR: { bottom: 8, right: 8 },
});
