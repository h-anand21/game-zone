// ============================================================
// Number Rush — 3x3 Native Number Box Puzzle Matrix
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NumberBoxCell } from '../types';
import { NRTheme } from '../theme';

interface NumberBoxMatrixProps {
  grid: NumberBoxCell[];
  ruleDescription?: string;
  hintActive?: boolean;
}

export const NumberBoxMatrix: React.FC<NumberBoxMatrixProps> = ({
  grid,
  ruleDescription,
  hintActive = false,
}) => {
  return (
    <View style={styles.container}>
      {ruleDescription ? (
        <View style={styles.ruleBanner}>
          <Text style={styles.ruleIcon}>💡</Text>
          <Text style={styles.ruleText}>{ruleDescription}</Text>
        </View>
      ) : null}

      <View style={styles.matrixBoard}>
        {grid.map((cell, idx) => {
          const isTarget = cell.val === null;

          return (
            <View
              key={idx}
              style={[
                styles.tile,
                isTarget ? styles.targetTile : styles.normalTile,
                isTarget && hintActive && styles.hintedTarget,
              ]}
            >
              {/* Bevel highlight */}
              <View style={styles.tileGloss} />

              <Text
                style={[
                  styles.tileText,
                  isTarget && styles.targetText,
                ]}
              >
                {cell.val !== null ? cell.val : '?'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: '#10223D',
    borderRadius: NRTheme.radius.xl,
    borderWidth: 2.5,
    borderColor: '#A55EEA',
    alignItems: 'center',
    ...NRTheme.shadows.card,
  },
  ruleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(165, 94, 234, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: NRTheme.radius.md,
    borderWidth: 1,
    borderColor: '#A55EEA',
    marginBottom: 14,
  },
  ruleIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  ruleText: {
    color: '#D2B4DE',
    fontSize: 12,
    fontWeight: '700',
  },
  matrixBoard: {
    width: 260,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  tile: {
    width: 76,
    height: 76,
    borderRadius: NRTheme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    ...NRTheme.shadows.card,
  },
  normalTile: {
    backgroundColor: '#1E3E6B',
    borderColor: '#2D5B99',
  },
  targetTile: {
    backgroundColor: '#FF9800',
    borderColor: '#FFD700',
    borderWidth: 3,
    ...NRTheme.shadows.glowGold,
  },
  hintedTarget: {
    backgroundColor: '#FF5722',
    borderColor: '#FFE082',
    transform: [{ scale: 1.05 }],
  },
  tileGloss: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  tileText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  targetText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
