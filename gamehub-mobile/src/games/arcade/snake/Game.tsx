// ============================================================
// GameHub — Snake Component (ChatGPT Easter Egg Inspired Edition)
// 100% Pure Touchscreen Controls (Zero Buttons)
// Features: Full-Screen Hand Swipe + Tap Steering ("Haath Se Kaatna")
// Border Warp Portals, Self-Collision-Only Game Over, Minimalist Cyber UI
// ============================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Shadows } from '@/constants/theme';
import { getInitialState, moveSnake, GRID_SIZE } from './logic';
import type { Direction, SnakeState } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface SnakeProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Maximize board size for modern phone screens so it feels expansive & immersive
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 24, 380);
const CELL_SIZE = (BOARD_SIZE - 4) / GRID_SIZE;

export const SnakeGame: React.FC<SnakeProps> = ({ onFinish, isPaused }) => {
  const [gameState, setGameState] = useState<SnakeState>(() => getInitialState());
  const currentDirectionRef = useRef<Direction>('RIGHT');
  const directionQueueRef = useRef<Direction[]>([]);
  const hasFinishedRef = useRef(false);

  // Pulse animation for the glowing food apple
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Border portal glow animation
  const portalGlowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Pulse animation for the food
    const foodPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    foodPulse.start();

    // Subtle breathing glow for the warp borders
    const portalGlow = Animated.loop(
      Animated.sequence([
        Animated.timing(portalGlowAnim, {
          toValue: 0.9,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(portalGlowAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    portalGlow.start();

    return () => {
      foodPulse.stop();
      portalGlow.stop();
    };
  }, [pulseAnim, portalGlowAnim]);

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

  // Main game tick loop with direction queue
  useEffect(() => {
    if (isPaused || gameState.gameOver) return;

    // Smooth speed scaling based on score
    const intervalTime = Math.max(75, 175 - Math.floor(gameState.score / 20) * 10);
    const timer = setInterval(() => {
      setGameState((prev) => {
        // Dequeue next queued turn or keep going straight
        const nextDir = directionQueueRef.current.shift() || currentDirectionRef.current;
        const next = moveSnake(prev, nextDir);
        currentDirectionRef.current = next.direction;
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, gameState.gameOver, gameState.score]);

  // Change direction with queue and 180° reverse-lock prevention
  const queueDirection = (dir: Direction) => {
    // Determine the last intended direction (from queue or currently moving)
    const lastDir =
      directionQueueRef.current.length > 0
        ? directionQueueRef.current[directionQueueRef.current.length - 1]
        : currentDirectionRef.current;

    const isOpposite =
      (dir === 'UP' && lastDir === 'DOWN') ||
      (dir === 'DOWN' && lastDir === 'UP') ||
      (dir === 'LEFT' && lastDir === 'RIGHT') ||
      (dir === 'RIGHT' && lastDir === 'LEFT');

    // Prevent 180-degree self-bite suicide and queue max 2 turns
    if (!isOpposite && dir !== lastDir && directionQueueRef.current.length < 2) {
      directionQueueRef.current.push(dir);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
  };

  // Pure Touchscreen Controller: Hand Swipe + Tap to Cut/Turn
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const swipeTriggeredRef = useRef(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          swipeTriggeredRef.current = false;
          touchStartRef.current = {
            x: evt.nativeEvent.pageX,
            y: evt.nativeEvent.pageY,
            time: Date.now(),
          };
        },
        onPanResponderMove: (_, gesture) => {
          if (swipeTriggeredRef.current) return;

          const SWIPE_THRESHOLD = 14; // Ultra-responsive hand swipe
          const { dx, dy } = gesture;

          if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal hand swipe
            if (dx > SWIPE_THRESHOLD) {
              queueDirection('RIGHT');
              swipeTriggeredRef.current = true;
            } else if (dx < -SWIPE_THRESHOLD) {
              queueDirection('LEFT');
              swipeTriggeredRef.current = true;
            }
          } else {
            // Vertical hand swipe
            if (dy > SWIPE_THRESHOLD) {
              queueDirection('DOWN');
              swipeTriggeredRef.current = true;
            } else if (dy < -SWIPE_THRESHOLD) {
              queueDirection('UP');
              swipeTriggeredRef.current = true;
            }
          }
        },
        onPanResponderRelease: (evt, gesture) => {
          // If user didn't swipe (was a quick tap / "haath se kaatna"),
          // turn relative to current snake heading!
          const duration = Date.now() - touchStartRef.current.time;
          const isTap = Math.abs(gesture.dx) < 12 && Math.abs(gesture.dy) < 12 && duration < 350;

          if (isTap && !swipeTriggeredRef.current) {
            const touchY = evt.nativeEvent.locationY;
            const touchX = evt.nativeEvent.locationX;
            const currentDir = currentDirectionRef.current;

            if (currentDir === 'LEFT' || currentDir === 'RIGHT') {
              // Moving horizontally: tap top half cuts UP, tap bottom half cuts DOWN
              if (touchY < BOARD_SIZE / 2) {
                queueDirection('UP');
              } else {
                queueDirection('DOWN');
              }
            } else {
              // Moving vertically: tap left half cuts LEFT, tap right half cuts RIGHT
              if (touchX < BOARD_SIZE / 2) {
                queueDirection('LEFT');
              } else {
                queueDirection('RIGHT');
              }
            }
          }
          swipeTriggeredRef.current = false;
        },
      }),
    []
  );

  const head = gameState.snake[0];
  const body = gameState.snake.slice(1);
  const currentDir = currentDirectionRef.current;

  // Eye placement on head matching movement direction
  const getEyeStyles = () => {
    switch (currentDir) {
      case 'UP':
        return { eye1: { top: 2, left: 4 }, eye2: { top: 2, right: 4 } };
      case 'DOWN':
        return { eye1: { bottom: 2, left: 4 }, eye2: { bottom: 2, right: 4 } };
      case 'LEFT':
        return { eye1: { top: 4, left: 2 }, eye2: { bottom: 4, left: 2 } };
      case 'RIGHT':
      default:
        return { eye1: { top: 4, right: 2 }, eye2: { bottom: 4, right: 2 } };
    }
  };
  const eyePos = getEyeStyles();

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* ChatGPT Minimalist HUD Header */}
      <View style={styles.hudCard}>
        <View style={styles.hudLeft}>
          <Text style={styles.hudLabel}>SCORE</Text>
          <Text style={styles.hudValue}>{gameState.score}</Text>
        </View>

        <View style={styles.hudCenter}>
          <Animated.View style={[styles.portalBadge, { opacity: portalGlowAnim }]}>
            <Text style={styles.portalBadgeDot}>●</Text>
            <Text style={styles.portalBadgeText}>WARP WALLS ACTIVE</Text>
          </Animated.View>
          <Text style={styles.subHint}>Pass borders • Only self-bite ends game</Text>
        </View>

        <View style={styles.hudRight}>
          <Text style={styles.hudLabel}>APPLES</Text>
          <Text style={styles.hudValue}>🍎 {Math.floor(gameState.score / 10)}</Text>
        </View>
      </View>

      {/* Main Game Arena with Glowing Warp Portal Frame */}
      <View style={styles.boardWrapper}>
        <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
          {/* ChatGPT Style Clean Slate Grid */}
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
                          ? 'rgba(255, 255, 255, 0.025)'
                          : 'rgba(255, 255, 255, 0.01)',
                    },
                  ]}
                />
              ))}
            </View>
          ))}

          {/* Snake Body Segments (Connected Smooth Pills) */}
          {body.map((segment, index) => {
            const opacity = Math.max(0.45, 1 - index * 0.018);
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
            <Text style={[styles.foodEmoji, { fontSize: CELL_SIZE * 0.88 }]}>🍎</Text>
          </Animated.View>
        </View>
      </View>

      {/* Pure Touchscreen Bottom Zone (Zero Buttons — Hand Controls Guide) */}
      <View style={styles.touchControlZone}>
        <View style={styles.touchHintPill}>
          <Text style={styles.touchHintIcon}>👆</Text>
          <Text style={styles.touchHintText}>
            Swipe or Tap screen to cut / steer snake
          </Text>
        </View>
        <Text style={styles.touchSubHint}>
          No buttons needed • 100% gesture touchscreen controls
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    backgroundColor: '#090D16', // ChatGPT Dark Mode Palette
  },
  hudCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: BOARD_SIZE,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)', // Subtle Emerald Accent
    ...Shadows.md,
  },
  hudLeft: {
    alignItems: 'flex-start',
  },
  hudRight: {
    alignItems: 'flex-end',
  },
  hudCenter: {
    alignItems: 'center',
  },
  hudLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981', // ChatGPT Emerald
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  hudValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  portalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    gap: 5,
  },
  portalBadgeDot: {
    color: '#10B981',
    fontSize: 8,
  },
  portalBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 1,
  },
  subHint: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  board: {
    backgroundColor: '#0F172A', // Deep Sleek Slate
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#10B981', // Emerald Border
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.015)',
  },
  snakeSegment: {
    position: 'absolute',
    backgroundColor: '#10B981', // Emerald Pill
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#34D399',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  snakeHead: {
    position: 'absolute',
    backgroundColor: '#34D399', // Bright Head Pill
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#34D399',
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
    backgroundColor: '#090D16',
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
  touchControlZone: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 6,
  },
  touchHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    gap: 8,
  },
  touchHintIcon: {
    fontSize: 16,
  },
  touchHintText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 0.5,
  },
  touchSubHint: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
});
