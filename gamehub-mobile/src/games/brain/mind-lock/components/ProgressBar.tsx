// ============================================================
// Mind Lock — Animated Progress Bar Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLTypography } from '../theme';

interface ProgressBarProps {
  progress: number; // 0.0 to 1.0
  colorVariant?: 'gold' | 'green' | 'blue' | 'purple' | 'red';
  height?: number;
  label?: string;
  subLabel?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  colorVariant = 'gold',
  height = 10,
  label,
  subLabel,
  style,
}) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  const getGradient = (): readonly [string, string, ...string[]] => {
    switch (colorVariant) {
      case 'green':
        return MLColors.greenGradient as [string, string, ...string[]];
      case 'blue':
        return MLColors.blueGradient as [string, string, ...string[]];
      case 'purple':
        return MLColors.purpleGradient as [string, string, ...string[]];
      case 'red':
        return MLColors.redGradient as [string, string, ...string[]];
      case 'gold':
      default:
        return MLColors.goldGradient as [string, string, ...string[]];
    }
  };

  return (
    <View style={[styles.container, style]}>
      {(label || subLabel) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
        </View>
      )}

      {/* Bar Track */}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <View style={[styles.fillWrapper, { width: `${clampedProgress * 100}%` }]}>
          <LinearGradient
            colors={getGradient()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { height, borderRadius: height / 2 }]}
          >
            {/* Top glossy sheen */}
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.gloss}
            />
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.semibold,
  },
  subLabel: {
    color: MLColors.white,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
  track: {
    backgroundColor: '#0A1523',
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
  },
  fillWrapper: {
    height: '100%',
  },
  fill: {
    width: '100%',
    position: 'relative',
    ...MLShadows.sm,
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
});
