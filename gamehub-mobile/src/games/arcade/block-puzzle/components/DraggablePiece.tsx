// ============================================================
// Block Blast — Draggable Piece Component with Finger Offset
// ============================================================

import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Pressable,
} from 'react-native';
import { BlockCell } from './BlockCell';
import type { ShapePiece } from '../types';
import { BlockHaptics } from '../haptics';

export const FINGER_VERTICAL_OFFSET = 75; // Pixels floating above finger tip

interface DraggablePieceProps {
  piece: ShapePiece;
  trayCellSize?: number;
  boardCellSize: number;
  isSelected?: boolean;
  disabled?: boolean;
  onSelect?: (piece: ShapePiece) => void;
  onDragStart?: (piece: ShapePiece) => void;
  onDragMove?: (piece: ShapePiece, pageX: number, pageY: number) => void;
  onDragEnd?: (piece: ShapePiece, pageX: number, pageY: number) => void;
}

export const DraggablePiece: React.FC<DraggablePieceProps> = ({
  piece,
  trayCellSize = 22,
  boardCellSize,
  isSelected = false,
  disabled = false,
  onSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return !disabled && (Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4);
      },
      onPanResponderGrant: (_, gestureState) => {
        setIsDragging(true);
        BlockHaptics.piecePickup();
        onDragStart?.(piece);

        // Instantly elevate with finger offset and scale up to full board size
        pan.setValue({
          x: gestureState.dx,
          y: gestureState.dy - FINGER_VERTICAL_OFFSET,
        });

        Animated.spring(scale, {
          toValue: boardCellSize / trayCellSize,
          useNativeDriver: false,
          friction: 6,
        }).start();
      },
      onPanResponderMove: (e, gestureState) => {
        pan.setValue({
          x: gestureState.dx,
          y: gestureState.dy - FINGER_VERTICAL_OFFSET,
        });

        // Pass global coordinates with finger offset
        const touchPageX = e.nativeEvent.pageX;
        const touchPageY = e.nativeEvent.pageY - FINGER_VERTICAL_OFFSET;
        onDragMove?.(piece, touchPageX, touchPageY);
      },
      onPanResponderRelease: (e, gestureState) => {
        const touchPageX = e.nativeEvent.pageX;
        const touchPageY = e.nativeEvent.pageY - FINGER_VERTICAL_OFFSET;

        // Reset scale and animate pan back to 0 if not placed
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 40,
            useNativeDriver: false,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 7,
            useNativeDriver: false,
          }),
        ]).start(() => {
          setIsDragging(false);
        });

        onDragEnd?.(piece, touchPageX, touchPageY);
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: false,
          }),
        ]).start(() => {
          setIsDragging(false);
        });
      },
    })
  ).current;

  const currentCellSize = isDragging ? boardCellSize : trayCellSize;
  const GAP = 2;

  return (
    <View style={styles.pieceSlot}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.animatedPieceContainer,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: scale },
            ],
            zIndex: isDragging ? 9999 : 1,
          },
          isSelected && styles.selectedPieceBox,
        ]}
      >
        <Pressable
          onPress={() => onSelect?.(piece)}
          style={styles.pieceGrid}
          disabled={disabled || isDragging}
        >
          {piece.matrix.map((row, r) => (
            <View key={`r-${r}`} style={[styles.matrixRow, { gap: GAP }]}>
              {row.map((active, c) => (
                <View
                  key={`c-${c}`}
                  style={{
                    width: currentCellSize,
                    height: currentCellSize,
                  }}
                >
                  {active ? (
                    <BlockCell
                      size={currentCellSize}
                      filled={true}
                      colorKey={piece.colorKey}
                    />
                  ) : (
                    <View style={{ width: currentCellSize, height: currentCellSize }} />
                  )}
                </View>
              ))}
            </View>
          ))}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  pieceSlot: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedPieceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieceGrid: {
    padding: 4,
    borderRadius: 8,
  },
  matrixRow: {
    flexDirection: 'row',
    marginVertical: 1,
  },
  selectedPieceBox: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE082',
    backgroundColor: 'rgba(255, 214, 0, 0.12)',
  },
});
