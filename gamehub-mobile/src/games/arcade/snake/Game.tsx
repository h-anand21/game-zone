// ============================================================
// GameHub — Snake Component (Modern Cyber Arcade Edition)
// Features: Full-Screen Hand Swipe Controls, Warp Portals,
// Self-Collision-Only Game Over, Eye-Tracking Snake Head, Sleek HUD
// ============================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialState, moveSnake, GRID_SIZE } from './logic';
import type { Direction, SnakeState } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface SnakeProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 28, 360);
const CELL_SIZE = (BOARD_SIZE - 4) / GRID_SIZE;

export const SnakeGame: React.FC<SnakeProps> = ({ onFinish, isPaused }) => {
  const [gameState, setGameState] = useState<SnakeState>(() => getInitialState());
  const pendingDirectionRef = useRef<Direction>('RIGHT');
  const currentDirectionRef = useRef<Direction>('RIGHT');
  const hasFinishedRef = useRef(false);

  // Pulse animation for the food
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Handle Game Finish safely outside setState reducer
  useEffect(() => {
    if (gameState.gameOver && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
      onFinish(gameState.score, gameState.score >= 50, { finalScore: gameState.score });
    }
  }, [gameState.gameOver, gameState.score, onFinish]);

  // Main game tick loop
  useEffect(() => {
    if (isPaused || gameState.gameOver) return;

    // Smooth speed scaling based on apples eaten
    const intervalTime = Math.max(75, 175 - Math.floor(gameState.score / 20) * 12);
    const timer = setInterval(() => {
      setGameState((prev) => {
        const next = moveSnake(prev, pendingDirectionRef.current);
        currentDirectionRef.current = next.direction;
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, gameState.gameOver, gameState.score]);

  // Change direction with reverse-prevention and haptics
  const changeDirection = (dir: Direction) => {
    const current = currentDirectionRef.current;
    if (
      (dir === 'UP' && current !== 'DOWN') ||
      (dir === 'DOWN' && current !== 'UP') ||
      (dir === 'LEFT' && current !== 'RIGHT') ||
      (dir === 'RIGHT' && current !== 'LEFT')
    ) {
      pendingDirectionRef.current = dir;
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
  };

  // Full-screen Hand Swipe Gesture handler
  const swipeHandledRef = useRef(false);
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) => {
          return Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10;
        },
        onPanResponderGrant: () => {
          swipeHandledRef.current = false;
        },
        onPanResponderMove: (_, gesture) => {
          if (swipeHandledRef.current) return;

          const SWIPE_THRESHOLD = 18;
          const { dx, dy } = gesture;

          if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > SWIPE_THRESHOLD) {
              changeDirection('RIGHT');
              swipeHandledRef.current = true;
            } else if (dx < -SWIPE_THRESHOLD) {
              changeDirection('LEFT');
              swipeHandledRef.current = true;
            }
          } else {
            // Vertical swipe
            if (dy > SWIPE_THRESHOLD) {
              changeDirection('DOWN');
              swipeHandledRef.current = true;
            } else if (dy < -SWIPE_THRESHOLD) {
              changeDirection('UP');
              swipeHandledRef.current = true;
            }
          }
        },
        onPanResponderRelease: () => {
          swipeHandledRef.current = false;
        },
      }),
    []
  );

  const head = gameState.snake[0];
  const body = gameState.snake.slice(1);
  const currentDir = pendingDirectionRef.current;

  // Eye placement on snake head based on direction
  const getEyeStyles = () => {
    switch (currentDir) {
      case 'UP':
        return { eye1: { top: 2, left: 3 }, eye2: { top: 2, right: 3 } };
      case 'DOWN':
        return { eye1: { bottom: 2, left: 3 }, eye2: { bottom: 2, right: 3 } };
      case 'LEFT':
        return { eye1: { top: 3, left: 2 }, eye2: { bottom: 3, left: 2 } };
      case 'RIGHT':
      default:
        return { eye1: { top: 3, right: 2 }, eye2: { bottom: 3, right: 2 } };
    }
  };
  const eyePos = getEyeStyles();

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Modern Cyber HUD Header */}
      <View style={styles.hudContainer}>
        <View style={styles.hudStat}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statValue}>🏆 {gameState.score}</Text>
        </View>

        <View style={styles.hudCenterBadge}>
          <Text style={styles.portalBadgeText}>🌀 WARP WALLS</Text>
          <Text style={styles.portalSubText}>Pass through borders!</Text>
        </View>

        <View style={[styles.hudStat, { alignItems: 'flex-end' }]}>
          <Text style={styles.statLabel}>APPLES</Text>
          <Text style={styles.statValue}>🍎 {Math.floor(gameState.score / 10)}</Text>
        </View>
      </View>

      {/* Main Game Arena */}
      <View style={styles.boardWrapper}>
        <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
          {/* Subtle Grid Background */}
          {Array.from({ length: GRID_SIZE }).map((_, r) => (
            <View key={`r-${r}`} style={styles.gridRow}>
              {Array.from({ length: GRID_SIZE }).map((_, c) => (
                <View
                  key={`c-${c}`}
                  style={[
                    styles.gridCell,
                    {
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor:
                        (r + c) % 2 === 0
                          ? 'rgba(15, 30, 48, 0.45)'
                          : 'rgba(10, 22, 36, 0.45)',
                    },
                  ]}
                />
              ))}
            </View>
          ))}

          {/* Snake Body Segments */}
          {body.map((segment, index) => {
            const opacity = Math.max(0.4, 1 - index * 0.02);
            return (
              <View
                key={`b-${index}`}
                style={[
                  styles.snakeSegment,
                  {
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2,
                    left: segment.x * CELL_SIZE + 1,
                    top: segment.y * CELL_SIZE + 1,
                    opacity,
                  },
                ]}
              />
            );
          })}

          {/* Snake Head with Cute Directional Eyes */}
          {head && (
            <View
              style={[
                styles.snakeHead,
                {
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  left: head.x * CELL_SIZE,
                  top: head.y * CELL_SIZE,
                },
              ]}
            >
              <View style={[styles.eye, eyePos.eye1]} />
              <View style={[styles.eye, eyePos.eye2]} />
            </View>
          )}

          {/* Glowing Animated Food Apple */}
          <Animated.View
            style={[
              styles.foodContainer,
              {
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: gameState.food.x * CELL_SIZE,
                top: gameState.food.y * CELL_SIZE,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={[styles.foodEmoji, { fontSize: CELL_SIZE * 0.85 }]}>🍎</Text>
          </Animated.View>
        </View>
      </View>

      {/* Swipe Hand Instruction & Touch Controller */}
      <View style={styles.bottomSection}>
        <View style={styles.gestureHintRow}>
          <Text style={styles.gestureHintText}>
            👆 Hand Swipe anywhere on screen or tap arrows
          </Text>
        </View>

        {/* Ergonomic Floating Thumb Pad */}
        <View style={styles.dpad}>
          {/* UP Button */}
          <View style={styles.dpadRow}>
            <Pressable
              style={({ pressed }) => [
                styles.dpadBtn,
                currentDir === 'UP' && styles.dpadBtnActive,
                pressed && styles.dpadBtnPressed,
              ]}
              onPress={() => changeDirection('UP')}
            >
              <Text style={styles.dpadArrow}>▲</Text>
            </Pressable>
          </View>

          {/* LEFT / CENTER / RIGHT */}
          <View style={styles.dpadRowMiddle}>
            <Pressable
              style={({ pressed }) => [
                styles.dpadBtn,
                currentDir === 'LEFT' && styles.dpadBtnActive,
                pressed && styles.dpadBtnPressed,
              ]}
              onPress={() => changeDirection('LEFT')}
            >
              <Text style={styles.dpadArrow}>◀</Text>
            </Pressable>

            <View style={styles.dpadCenterOrb}>
              <Text style={styles.centerOrbIcon}>⚡</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.dpadBtn,
                currentDir === 'RIGHT' && styles.dpadBtnActive,
                pressed && styles.dpadBtnPressed,
              ]}
              onPress={() => changeDirection('RIGHT')}
            >
              <Text style={styles.dpadArrow}>▶</Text>
            </Pressable>
          </View>

          {/* DOWN Button */}
          <View style={styles.dpadRow}>
            <Pressable
              style={({ pressed }) => [
                styles.dpadBtn,
                currentDir === 'DOWN' && styles.dpadBtnActive,
                pressed && styles.dpadBtnPressed,
              ]}
              onPress={() => changeDirection('DOWN')}
            >
              <Text style={styles.dpadArrow}>▼</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#070D18',
  },
  hudContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: BOARD_SIZE,
    backgroundColor: 'rgba(12, 26, 46, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#00E5FF33',
    ...Shadows.md,
  },
  hudStat: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00E5FF',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 229, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  hudCenterBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00E5FF55',
  },
  portalBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#00E5FF',
    letterSpacing: 1,
  },
  portalSubText: {
    fontSize: 9,
    color: '#A0D2EB',
    fontWeight: '600',
  },
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  board: {
    backgroundColor: '#0A1526',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#00E5FF',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    borderWidth: 0.5,
    borderColor: 'rgba(0, 229, 255, 0.05)',
  },
  snakeSegment: {
    position: 'absolute',
    backgroundColor: '#00E676',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B9F6CA',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  snakeHead: {
    position: 'absolute',
    backgroundColor: '#00FF88',
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  eye: {
    position: 'absolute',
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#070D18',
  },
  foodContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  foodEmoji: {
    textAlign: 'center',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  gestureHintRow: {
    backgroundColor: 'rgba(12, 26, 46, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  gestureHintText: {
    fontSize: 11,
    color: '#8BAAC8',
    fontWeight: '700',
  },
  dpad: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  dpadRow: {
    alignItems: 'center',
  },
  dpadRowMiddle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 4,
  },
  dpadCenterOrb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerOrbIcon: {
    fontSize: 18,
    color: '#00E5FF',
  },
  dpadBtn: {
    width: 54,
    height: 54,
    backgroundColor: 'rgba(14, 30, 52, 0.9)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00E5FF44',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  dpadBtnActive: {
    borderColor: '#00FF88',
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    shadowColor: '#00FF88',
    shadowOpacity: 0.7,
  },
  dpadBtnPressed: {
    transform: [{ scale: 0.92 }],
    backgroundColor: 'rgba(0, 229, 255, 0.35)',
  },
  dpadArrow: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
