// ============================================================
// GameHub — Snake Component
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialState, moveSnake, GRID_SIZE } from './logic';
import type { Direction, SnakeState } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface SnakeProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const SnakeGame: React.FC<SnakeProps> = ({ onFinish, isPaused }) => {
  const [gameState, setGameState] = useState<SnakeState>(() => getInitialState());
  const pendingDirectionRef = useRef<Direction>('RIGHT');

  useEffect(() => {
    if (isPaused || gameState.gameOver) return;

    const intervalTime = Math.max(80, 200 - Math.floor(gameState.score / 30) * 15);
    const timer = setInterval(() => {
      setGameState((prev) => {
        const next = moveSnake(prev, pendingDirectionRef.current);
        if (next.gameOver && !prev.gameOver) {
          onFinish(next.score, next.score >= 50, { finalScore: next.score });
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, gameState.gameOver, gameState.score, onFinish]);

  const changeDirection = (dir: Direction) => {
    const current = gameState.direction;
    if (
      (dir === 'UP' && current !== 'DOWN') ||
      (dir === 'DOWN' && current !== 'UP') ||
      (dir === 'LEFT' && current !== 'RIGHT') ||
      (dir === 'RIGHT' && current !== 'LEFT')
    ) {
      pendingDirectionRef.current = dir;
    }
  };

  const cellSize = 300 / GRID_SIZE;

  return (
    <View style={styles.container}>
      {/* Score Header */}
      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>Score: {gameState.score}</Text>
        <Text style={styles.speedText}>Speed: Level {Math.floor(gameState.score / 30) + 1}</Text>
      </View>

      {/* Grid Canvas */}
      <View style={styles.board}>
        {Array.from({ length: GRID_SIZE }).map((_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: GRID_SIZE }).map((_, col) => {
              const isHead = gameState.snake[0].x === col && gameState.snake[0].y === row;
              const isBody = gameState.snake.slice(1).some((s) => s.x === col && s.y === row);
              const isFood = gameState.food.x === col && gameState.food.y === row;

              return (
                <View
                  key={col}
                  style={[
                    styles.cell,
                    { width: cellSize, height: cellSize },
                    isHead && styles.snakeHead,
                    isBody && styles.snakeBody,
                    isFood && styles.foodCell,
                  ]}
                >
                  {isFood && <Text style={styles.foodEmoji}>🍎</Text>}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* D-Pad Controls */}
      <View style={styles.dpad}>
        <View style={styles.dpadRow}>
          <Pressable style={styles.dpadBtn} onPress={() => changeDirection('UP')}>
            <Text style={styles.dpadArrow}>▲</Text>
          </Pressable>
        </View>

        <View style={styles.dpadRowMiddle}>
          <Pressable style={styles.dpadBtn} onPress={() => changeDirection('LEFT')}>
            <Text style={styles.dpadArrow}>◀</Text>
          </Pressable>
          <View style={styles.dpadCenter} />
          <Pressable style={styles.dpadBtn} onPress={() => changeDirection('RIGHT')}>
            <Text style={styles.dpadArrow}>▶</Text>
          </Pressable>
        </View>

        <View style={styles.dpadRow}>
          <Pressable style={styles.dpadBtn} onPress={() => changeDirection('DOWN')}>
            <Text style={styles.dpadArrow}>▼</Text>
          </Pressable>
        </View>
      </View>
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
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreText: {
    fontSize: Typography.body,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  speedText: {
    fontSize: Typography.bodySmall,
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
  board: {
    width: 304,
    height: 304,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 2,
    ...Shadows.md,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    backgroundColor: Colors.surfaceLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0.5,
    borderRadius: 2,
  },
  snakeHead: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  snakeBody: {
    backgroundColor: Colors.primary + 'B0',
    borderRadius: 3,
  },
  foodCell: {
    backgroundColor: 'transparent',
  },
  foodEmoji: {
    fontSize: 14,
  },
  dpad: {
    width: 200,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadRow: {
    alignItems: 'center',
  },
  dpadRowMiddle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginVertical: 4,
  },
  dpadCenter: {
    width: 48,
    height: 48,
  },
  dpadBtn: {
    width: 52,
    height: 52,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  dpadArrow: {
    fontSize: 22,
    color: Colors.textPrimary,
  },
});
