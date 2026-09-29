// ============================================================
// Mind Lock — 2x2 Memory Pad Console Grid Component
// ============================================================

import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MemoryPad } from './MemoryPad';
import { MLRadius, MLShadows, MLSpacing } from '../theme';
import type { PadColor } from '../types';

interface MemoryPadGridProps {
  activePad: PadColor | null;
  disabled: boolean;
  onPadPress: (color: PadColor) => void;
}

export const MemoryPadGrid: React.FC<MemoryPadGridProps> = ({
  activePad,
  disabled,
  onPadPress,
}) => {
  const { width } = useWindowDimensions();
  // Responsive pad size calculation
  const consoleWidth = Math.min(width - 40, 360);
  const padSize = (consoleWidth - 56) / 2;

  const renderRivet = () => (
    <LinearGradient
      colors={['#4A5A72', '#1B2637', '#0A121D']}
      style={styles.rivet}
    >
      <View style={styles.rivetInner} />
    </LinearGradient>
  );

  return (
    <View style={[styles.consoleOuter, { width: consoleWidth }]}>
      <LinearGradient
        colors={['#24374E', '#132030', '#0A131F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.consoleFrame}
      >
        {/* 4 Corner Rivets */}
        <View style={[styles.rivetPos, { top: 8, left: 8 }]}>{renderRivet()}</View>
        <View style={[styles.rivetPos, { top: 8, right: 8 }]}>{renderRivet()}</View>
        <View style={[styles.rivetPos, { bottom: 8, left: 8 }]}>{renderRivet()}</View>
        <View style={[styles.rivetPos, { bottom: 8, right: 8 }]}>{renderRivet()}</View>

        {/* Console Surface Grid */}
        <View style={styles.grid}>
          {/* Top Row: Red & Blue */}
          <View style={styles.row}>
            <MemoryPad
              color="red"
              size={padSize}
              isActive={activePad === 'red'}
              disabled={disabled}
              onPress={() => onPadPress('red')}
            />
            <MemoryPad
              color="blue"
              size={padSize}
              isActive={activePad === 'blue'}
              disabled={disabled}
              onPress={() => onPadPress('blue')}
            />
          </View>

          {/* Bottom Row: Green & Yellow */}
          <View style={styles.row}>
            <MemoryPad
              color="green"
              size={padSize}
              isActive={activePad === 'green'}
              disabled={disabled}
              onPress={() => onPadPress('green')}
            />
            <MemoryPad
              color="yellow"
              size={padSize}
              isActive={activePad === 'yellow'}
              disabled={disabled}
              onPress={() => onPadPress('yellow')}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  consoleOuter: {
    borderRadius: MLRadius.xxl,
    ...MLShadows.lg,
    padding: 3,
    backgroundColor: '#2E4461',
  },
  consoleFrame: {
    padding: MLSpacing.base,
    borderRadius: MLRadius.xxl - 2,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rivetPos: {
    position: 'absolute',
    zIndex: 10,
  },
  rivet: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rivetInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#07101B',
  },
  grid: {
    gap: MLSpacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: MLSpacing.md,
    justifyContent: 'center',
  },
});
