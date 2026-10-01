// ============================================================
// REVERSE MIND — Interactive Object Keypad Grid
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { GameObject } from '../types';
import { ObjectCard } from './ObjectCard';

interface ObjectTileGridProps {
  options: GameObject[];
  playerInput: GameObject[];
  onSelect: (object: GameObject) => void;
  disabled?: boolean;
}

export const ObjectTileGrid: React.FC<ObjectTileGridProps> = ({
  options,
  playerInput,
  onSelect,
  disabled = false,
}) => {
  const selectedIds = new Set(playerInput.map((item) => item.id));

  return (
    <View style={styles.gridContainer}>
      {options.map((object) => {
        const isSelected = selectedIds.has(object.id);

        return (
          <View key={object.id} style={styles.cellWrapper}>
            <ObjectCard
              object={object}
              size="md"
              isSelected={isSelected}
              disabled={disabled || isSelected}
              onPress={() => onSelect(object)}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: 380,
  },
  cellWrapper: {
    margin: 2,
  },
});
