// ============================================================
// Block Blast — Piece Shelf / Tray Component
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DraggablePiece } from './DraggablePiece';
import type { ShapePiece } from '../types';

interface PieceTrayProps {
  pieces: (ShapePiece | null)[];
  selectedPieceId?: string | null;
  boardCellSize: number;
  disabled?: boolean;
  onSelectPiece?: (piece: ShapePiece) => void;
  onDragStart?: (piece: ShapePiece) => void;
  onDragMove?: (piece: ShapePiece, pageX: number, pageY: number) => void;
  onDragEnd?: (piece: ShapePiece, pageX: number, pageY: number) => void;
}

export const PieceTray: React.FC<PieceTrayProps> = ({
  pieces,
  selectedPieceId,
  boardCellSize,
  disabled = false,
  onSelectPiece,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  return (
    <View style={styles.trayContainer}>
      <LinearGradient
        colors={['rgba(16, 27, 44, 0.92)', 'rgba(8, 15, 26, 0.95)']}
        style={styles.trayShelf}
      >
        {pieces.map((piece, index) => {
          if (!piece) {
            return (
              <View key={`empty-slot-${index}`} style={styles.emptySlotPlaceholder}>
                <View style={styles.emptySlotCircle} />
              </View>
            );
          }

          const isSelected = selectedPieceId === piece.id;

          return (
            <DraggablePiece
              key={piece.id}
              piece={piece}
              boardCellSize={boardCellSize}
              trayCellSize={20}
              isSelected={isSelected}
              disabled={disabled}
              onSelect={onSelectPiece}
              onDragStart={onDragStart}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
            />
          );
        })}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  trayContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  trayShelf: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 116,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1A2B44',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptySlotPlaceholder: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderStyle: 'dashed',
  },
});
