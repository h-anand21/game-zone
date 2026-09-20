// ============================================================
// GameHub — Guess the Drawing Component
// ============================================================

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, PanResponder } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getRandomPromptWord } from './logic';
import type { DrawLine, DrawPoint } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface GuessTheDrawingProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const GuessTheDrawingGame: React.FC<GuessTheDrawingProps> = ({ onFinish, isPaused }) => {
  const [word] = useState(() => getRandomPromptWord());
  const [lines, setLines] = useState<DrawLine[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(Colors.primary);
  const currentLineRef = useRef<DrawPoint[]>([]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentLineRef.current = [{ x: locationX, y: locationY }];
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentLineRef.current.push({ x: locationX, y: locationY });
        // Force render stroke
        setLines((prev) => [
          ...prev.filter((l) => l.points !== currentLineRef.current),
          { points: [...currentLineRef.current], color: selectedColor },
        ]);
      },
      onPanResponderRelease: () => {
        currentLineRef.current = [];
      },
    })
  ).current;

  const handleClear = () => {
    setLines([]);
  };

  const handleDone = () => {
    onFinish(100, true, { word, lineCount: lines.length });
  };

  return (
    <View style={styles.container}>
      {/* Prompt Bar */}
      <View style={styles.promptCard}>
        <Text style={styles.promptLabel}>DRAW THIS WORD:</Text>
        <Text style={styles.promptWord}>{word}</Text>
      </View>

      {/* Canvas View */}
      <View style={styles.canvas} {...panResponder.panHandlers}>
        {lines.map((line, idx) =>
          line.points.map((pt, pIdx) => (
            <View
              key={`${idx}-${pIdx}`}
              style={[
                styles.dot,
                {
                  left: pt.x,
                  top: pt.y,
                  backgroundColor: line.color,
                },
              ]}
            />
          ))
        )}
      </View>

      {/* Color Palette & Actions */}
      <View style={styles.toolbar}>
        {['#6C5CE7', '#FF6B6B', '#00D2A0', '#FDCB6E', '#FFFFFF'].map((color) => (
          <Pressable
            key={color}
            style={[
              styles.colorPill,
              { backgroundColor: color },
              selectedColor === color && styles.colorPillSelected,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}

        <Pressable style={styles.actionBtn} onPress={handleClear}>
          <Text style={styles.actionBtnText}>🗑️ Clear</Text>
        </Pressable>

        <Pressable style={[styles.actionBtn, styles.doneBtn]} onPress={handleDone}>
          <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>✓ Done</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    justifyContent: 'space-around',
  },
  promptCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promptLabel: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontWeight: Typography.semibold,
  },
  promptWord: {
    fontSize: Typography.h2,
    color: Colors.primary,
    fontWeight: Typography.bold,
    marginTop: 2,
  },
  canvas: {
    width: '100%',
    height: 350,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.md,
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    width: '100%',
  },
  colorPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  colorPillSelected: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
    transform: [{ scale: 1.1 }],
  },
  actionBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  doneBtn: {
    backgroundColor: Colors.success,
  },
  actionBtnText: {
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
});
