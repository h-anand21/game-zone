// ============================================================
// Number Rush — Responsive Emoji Observation Grid
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { EmojiGridItem } from '../types';
import { NRTheme } from '../theme';

interface EmojiGridProps {
  items: EmojiGridItem[];
  gridCols?: number;
  hintActive?: boolean;
}

export const EmojiGrid: React.FC<EmojiGridProps> = ({
  items,
  gridCols = 4,
  hintActive = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {items.map((item) => {
          const isHinted = hintActive && item.isTarget;

          return (
            <View
              key={item.id}
              style={[
                styles.tile,
                { width: `${100 / gridCols - 3}%` },
                isHinted && styles.hintedTile,
              ]}
            >
              <Text style={styles.emojiText}>{item.char}</Text>
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
    padding: 12,
    backgroundColor: '#0E223D',
    borderRadius: NRTheme.radius.xl,
    borderWidth: 2.5,
    borderColor: '#FF793F',
    ...NRTheme.shadows.card,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tile: {
    aspectRatio: 1,
    backgroundColor: '#16365E',
    borderRadius: NRTheme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  hintedTile: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderWidth: 2.5,
    ...NRTheme.shadows.glowGold,
  },
  emojiText: {
    fontSize: 28,
  },
});
