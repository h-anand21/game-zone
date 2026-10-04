// ============================================================
// PATH MIND — Component 04: GamePanel
// Reusable fantasy panel (Wood, Stone, Metal, Crystal)
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { pmColors } from '../../design-system/colors';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';

interface GamePanelProps {
  variant?: 'stone' | 'wood' | 'metal' | 'crystal';
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GamePanel: React.FC<GamePanelProps> = ({
  variant = 'stone',
  children,
  style,
}) => {
  const getPanelStyles = () => {
    switch (variant) {
      case 'wood':
        return {
          backgroundColor: pmColors.woodPanelBg,
          borderColor: pmColors.woodHighlight,
          borderBottomColor: pmColors.woodBorder,
        };
      case 'metal':
        return {
          backgroundColor: 'rgba(20, 26, 32, 0.95)',
          borderColor: '#4A5D6E',
          borderBottomColor: '#28333D',
        };
      case 'crystal':
        return {
          backgroundColor: pmColors.crystalPanelBg,
          borderColor: pmColors.cyan,
          borderBottomColor: pmColors.tealDark,
        };
      case 'stone':
      default:
        return {
          backgroundColor: pmColors.stonePanelBg,
          borderColor: pmColors.stoneBorder,
          borderBottomColor: '#1A252E',
        };
    }
  };

  const panelTheme = getPanelStyles();

  return (
    <View style={[styles.outerFrame, panelTheme, style]}>
      {/* Corner Metal Rivets */}
      <View style={[styles.rivet, styles.topLeft, { borderColor: panelTheme.borderColor }]} />
      <View style={[styles.rivet, styles.topRight, { borderColor: panelTheme.borderColor }]} />
      <View style={[styles.rivet, styles.bottomLeft, { borderColor: panelTheme.borderColor }]} />
      <View style={[styles.rivet, styles.bottomRight, { borderColor: panelTheme.borderColor }]} />

      {/* Inner Inset Content */}
      <View style={styles.innerContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerFrame: {
    borderRadius: pmRadii.xl,
    borderWidth: 2,
    borderBottomWidth: 4.5,
    padding: 16,
    position: 'relative',
    ...pmShadows.heavy,
  },
  innerContent: {
    width: '100%',
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0F1A22',
    borderWidth: 1,
    opacity: 0.8,
  },
  topLeft: { top: 6, left: 6 },
  topRight: { top: 6, right: 6 },
  bottomLeft: { bottom: 6, left: 6 },
  bottomRight: { bottom: 6, right: 6 },
});
