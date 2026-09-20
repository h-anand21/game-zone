// ============================================================
// GameHub — Path Mind Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { generatePath } from './logic';
import type { GridPos } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface PathMindProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const PathMindGame: React.FC<PathMindProps> = ({ onFinish, isPaused }) => {
  const [level, setLevel] = useState(1);
  const [gridSize] = useState(4);
  const [path, setPath] = useState<GridPos[]>([]);
  const [playerPath, setPlayerPath] = useState<GridPos[]>([]);
  const [isShowing, setIsShowing] = useState(true);
  const [statusMsg, setStatusMsg] = useState('Watch the path!');

  useEffect(() => {
    startLevel(1);
  }, []);

  const startLevel = (lvl: number) => {
    const pathLen = lvl + 2;
    const newPath = generatePath(gridSize, pathLen);
    setPath(newPath);
    setPlayerPath([]);
    setIsShowing(true);
    setStatusMsg(`Level ${lvl}: Memorize the path!`);

    setTimeout(() => {
      setIsShowing(false);
      setStatusMsg(`Level ${lvl}: Trace the path from start to end!`);
    }, 1500 + pathLen * 400);
  };

  const handleCellPress = (row: number, col: number) => {
    if (isShowing || isPaused) return;

    const target = path[playerPath.length];
    if (target.row === row && target.col === col) {
      // Correct step!
      const newPlayerPath = [...playerPath, { row, col }];
      setPlayerPath(newPlayerPath);

      if (newPlayerPath.length === path.length) {
        // Level complete!
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setStatusMsg('Path Completed! Next Level...');
        setTimeout(() => startLevel(nextLevel), 800);
      }
    } else {
      // Wrong step! Game Over
      const finalScore = (level - 1) * 10;
      setStatusMsg('Wrong tile! Path broken.');
      onFinish(finalScore, finalScore >= 20, { maxLevel: level });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.infoCard}>
        <Text style={styles.levelText}>Level {level}</Text>
        <Text style={styles.statusText}>{statusMsg}</Text>
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        {Array.from({ length: gridSize }).map((_, r) => (
          <View key={r} style={styles.row}>
            {Array.from({ length: gridSize }).map((_, c) => {
              const isInPath = path.some((p) => p.row === r && p.col === c);
              const isStart = path.length > 0 && path[0].row === r && path[0].col === c;
              const isPlayerStep = playerPath.some((p) => p.row === r && p.col === c);

              const isHighlighted = (isShowing && isInPath) || isPlayerStep;

              return (
                <Pressable
                  key={c}
                  disabled={isShowing}
                  style={({ pressed }) => [
                    styles.cell,
                    isHighlighted && styles.cellHighlighted,
                    isStart && isShowing && styles.cellStart,
                    pressed && !isShowing && styles.pressed,
                  ]}
                  onPress={() => handleCellPress(r, c)}
                >
                  {isStart && isShowing && <Text style={styles.cellEmoji}>🚩</Text>}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    justifyContent: 'space-around',
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
  levelText: {
    fontSize: Typography.h3,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  statusText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  gridContainer: {
    width: 290,
    height: 290,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 4,
  },
  cell: {
    width: 58,
    height: 58,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellHighlighted: {
    backgroundColor: Colors.primary,
  },
  cellStart: {
    backgroundColor: Colors.accent,
  },
  cellEmoji: {
    fontSize: 24,
  },
  pressed: {
    opacity: 0.8,
  },
});
