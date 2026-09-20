// ============================================================
// GameHub — Stack Master Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getBlockColor } from './logic';
import type { StackBlock } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface StackMasterProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const StackMasterGame: React.FC<StackMasterProps> = ({ onFinish, isPaused }) => {
  const [blocks, setBlocks] = useState<StackBlock[]>([
    { id: 1, x: 25, width: 50, color: getBlockColor(0) },
  ]);
  const [currX, setCurrX] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [currWidth, setCurrWidth] = useState(50);

  useEffect(() => {
    if (isPaused) return;

    const speed = 1.5 + Math.min(4, blocks.length * 0.2);
    const timer = setInterval(() => {
      setCurrX((prev) => {
        let next = prev + direction * speed;
        if (next + currWidth >= 100) {
          next = 100 - currWidth;
          setDirection(-1);
        } else if (next <= 0) {
          next = 0;
          setDirection(1);
        }
        return next;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [isPaused, direction, currWidth, blocks.length]);

  const handlePlaceBlock = () => {
    if (isPaused) return;

    const topBlock = blocks[blocks.length - 1];
    const leftOverlap = Math.max(currX, topBlock.x);
    const rightOverlap = Math.min(currX + currWidth, topBlock.x + topBlock.width);
    const newWidth = rightOverlap - leftOverlap;

    if (newWidth <= 0) {
      // Complete miss! Game Over
      const finalScore = blocks.length - 1;
      onFinish(finalScore, finalScore >= 10, { towerHeight: finalScore });
      return;
    }

    const newBlock: StackBlock = {
      id: blocks.length + 1,
      x: leftOverlap,
      width: newWidth,
      color: getBlockColor(blocks.length),
    };

    setBlocks([...blocks, newBlock]);
    setCurrWidth(newWidth);
    setCurrX(0);
    setDirection(1);
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.infoCard}>
        <Text style={styles.scoreText}>Blocks Stacked: {blocks.length - 1}</Text>
      </View>

      {/* Tower Viewport */}
      <Pressable style={styles.viewport} onPress={handlePlaceBlock}>
        {/* Moving active block on top */}
        <View
          style={[
            styles.block,
            {
              bottom: blocks.length * 28 + 10,
              left: `${currX}%`,
              width: `${currWidth}%`,
              backgroundColor: getBlockColor(blocks.length),
            },
          ]}
        />

        {/* Placed blocks in tower */}
        {blocks.map((blk, idx) => (
          <View
            key={blk.id}
            style={[
              styles.block,
              {
                bottom: idx * 28 + 10,
                left: `${blk.x}%`,
                width: `${blk.width}%`,
                backgroundColor: blk.color,
              },
            ]}
          />
        ))}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreText: {
    fontSize: Typography.h3,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  viewport: {
    width: '100%',
    flex: 1,
    maxHeight: 450,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.md,
  },
  block: {
    position: 'absolute',
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});
