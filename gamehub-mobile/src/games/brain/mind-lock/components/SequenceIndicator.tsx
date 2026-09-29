// ============================================================
// Mind Lock — Sequence Progress Indicator (Top Connected Dots)
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MLColors, MLShadows } from '../theme';

interface SequenceIndicatorProps {
  total: number;
  current: number;
  maxDisplay?: number;
}

export const SequenceIndicator: React.FC<SequenceIndicatorProps> = ({
  total,
  current,
  maxDisplay = 8,
}) => {
  const displayTotal = Math.min(total, maxDisplay);
  const dots = Array.from({ length: displayTotal }, (_, i) => i);

  return (
    <View style={styles.container}>
      {/* Background connecting track */}
      <View style={styles.track} />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {dots.map((index) => {
          const isFilled = index < current;
          const isCurrent = index === current;

          return (
            <View
              key={index}
              style={[
                styles.dot,
                isFilled && styles.dotFilled,
                isCurrent && styles.dotActive,
              ]}
            >
              {isFilled && <View style={styles.dotInner} />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    position: 'relative',
    width: '80%',
    alignSelf: 'center',
  },
  track: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: 'rgba(255, 244, 222, 0.1)',
    borderRadius: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0F2236',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFilled: {
    backgroundColor: MLColors.primary,
    borderColor: '#FFF4DE',
    ...MLShadows.glowGold,
  },
  dotActive: {
    borderColor: MLColors.primary,
    transform: [{ scale: 1.25 }],
    backgroundColor: '#1E3654',
  },
  dotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});
