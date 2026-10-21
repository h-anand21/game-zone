// ============================================================
// GameHub — Snake Component (Big Screen Full-Immersion Edition)
// ZERO BUTTONS — 100% Full-Screen Big Arena
// Fluid Touchscreen Gestures: Direct Hand Swipe & Tap-To-Turn
// Warp Portals (Walls do not kill), Self-Bite Only Game Over
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
import { getInitialState, moveSnake } from './logic';
import type { Direction, SnakeState } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface SnakeProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Dynamic Full-Screen Big Arena Sizing
const GRID_COLS = 15;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 16) / GRID_COLS);
const BOARD_WIDTH = GRID_COLS * CELL_SIZE;

// Fill the entire available height on the phone screen
const AVAILABLE_HEIGHT = SCREEN_HEIGHT - 150;
const GRID_ROWS = Math.max(18, Math.floor(AVAILABLE_HEIGHT / CELL_SIZE));
const BOARD_HEIGHT = GRID_ROWS * CELL_SIZE;

export const SnakeGame: React.FC<SnakeProps> = ({ onFinish, isPaused }) => {
  const [gameState, setGameState] = useState<SnakeState>(() =>
    getInitialState(GRID_COLS, GRID_ROWS)
  );
  const currentDirectionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const hasFinishedRef = useRef(false);

  // Pulse animation for the glowing food apple
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Border portal glow animation
  const portalGlowAnim = useRef(new Animated.Value(0.5)).current;

  // Level Up announcement
  const [levelUpText, setLevelUpText] = useState<string | null>(null);
  const prevLevelRef = useRef(1);

  // Speed level: Level 1 starts relaxed at 210ms, scales with level
  const speedLevel = Math.min(10, Math.floor(gameState.score / 40) + 1);
  const intervalTime = Math.max(90, 210 - (speedLevel - 1) * 13);

  useEffect(() => {
    const foodPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ])
    );
    foodPulse.start();

    const portalGlow = Animated.loop(
      Animated.sequence([
        Animated.timing(portalGlowAnim, {
          toValue: 0.95,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(portalGlowAnim, {
          toValue: 0.45,
          duration: 1100,
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

  // Level Up announcement
  useEffect(() => {
    if (speedLevel > prevLevelRef.current) {
      prevLevelRef.current = speedLevel;
      setLevelUpText(`⚡ LEVEL ${speedLevel}! SPEED UP`);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      const timer = setTimeout(() => {
        setLevelUpText(null);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [speedLevel]);

  // Game over finish handler
  useEffect(() => {
    if (gameState.gameOver && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
      onFinish(gameState.score, gameState.score >= 50, { finalScore: gameState.score });
    }
  }, [gameState.gameOver, gameState.score, onFinish]);

  // Game tick loop
  useEffect(() => {
    if (isPaused || gameState.gameOver) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        const next = moveSnake(prev, nextDirectionRef.current);
        currentDirectionRef.current = next.direction;
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, gameState.gameOver, intervalTime]);

  // Direction changer with 180° self-bite prevention
  const trySetDirection = (newDir: Direction) => {
    const current = currentDirectionRef.current;

    // Prevent direct 180-degree suicide
    if (
      (newDir === 'UP' && current === 'DOWN') ||
      (newDir === 'DOWN' && current === 'UP') ||
      (newDir === 'LEFT' && current === 'RIGHT') ||
      (newDir === 'RIGHT' && current === 'LEFT')
    ) {
      return false;
    }

    if (newDir !== current) {
      nextDirectionRef.current = newDir;
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      return true;
    }
    return false;
  };

  // Google Snake style full-screen touch gesture handler
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          touchStartRef.current = {
            x: evt.nativeEvent.pageX,
            y: evt.nativeEvent.pageY,
            time: Date.now(),
          };
        },
        onPanResponderMove: (evt) => {
          const currentX = evt.nativeEvent.pageX;
          const currentY = evt.nativeEvent.pageY;
          const dx = currentX - touchStartRef.current.x;
          const dy = currentY - touchStartRef.current.y;
          const distance = Math.hypot(dx, dy);

          if (distance >= 15) {
            let desiredDir: Direction;
            if (Math.abs(dx) > Math.abs(dy)) {
              desiredDir = dx > 0 ? 'RIGHT' : 'LEFT';
            } else {
              desiredDir = dy > 0 ? 'DOWN' : 'UP';
            }

            const changed = trySetDirection(desiredDir);
            if (changed || distance >= 30) {
              touchStartRef.current = {
                x: currentX,
                y: currentY,
                time: Date.now(),
              };
            }
          }
        },
        onPanResponderRelease: (evt, gesture) => {
          const duration = Date.now() - touchStartRef.current.time;
          const isTap = Math.abs(gesture.dx) < 14 && Math.abs(gesture.dy) < 14 && duration < 300;

          if (isTap) {
            const { pageX, pageY } = evt.nativeEvent;
            const current = currentDirectionRef.current;
            const centerX = SCREEN_WIDTH / 2;
            const centerY = SCREEN_HEIGHT * 0.45;

            if (current === 'UP' || current === 'DOWN') {
              if (pageX < centerX) {
                trySetDirection('LEFT');
              } else {
                trySetDirection('RIGHT');
              }
            } else {
              if (pageY < centerY) {
                trySetDirection('UP');
              } else {
                trySetDirection('DOWN');
              }
            }
          }
        },
      }),
    []
  );

  const head = gameState.snake[0];
  const body = gameState.snake.slice(1);
  const currentDir = currentDirectionRef.current;

  // Eye placement on snake head
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
      {/* 1. TOP FLOATING CYBER HUD */}
      <View style={styles.hudCard}>
        <View style={styles.hudStatBox}>
          <Text style={styles.hudLabel}>SCORE</Text>
          <Text style={styles.hudValue}>{gameState.score}</Text>
        </View>

        <View style={styles.hudCenterBox}>
          <View style={styles.speedBadge}>
            <Text style={styles.speedBadgeText}>⚡ SPEED LVL {speedLevel}</Text>
          </View>
          <Animated.View style={[styles.portalBadge, { opacity: portalGlowAnim }]}>
            <Text style={styles.portalDot}>●</Text>
            <Text style={styles.portalText}>WARP WALLS ACTIVE</Text>
          </Animated.View>
        </View>

        <View style={[styles.hudStatBox, { alignItems: 'flex-end' }]}>
          <Text style={styles.hudLabel}>APPLES</Text>
          <Text style={styles.hudValue}>🍎 {Math.floor(gameState.score / 10)}</Text>
        </View>
      </View>

      {/* 2. BIG IMMERSIVE FULL-SCREEN ARENA (ZERO BUTTONS) */}
      <View style={styles.bigArenaWrapper}>
        <View style={[styles.board, { width: BOARD_WIDTH, height: BOARD_HEIGHT }]}>
          {/* Subtle Grid Checkerboard */}
          {Array.from({ length: GRID_ROWS }).map((_, r) => (
            <View key={`r-${r}`} style={styles.gridRow}>
              {Array.from({ length: GRID_COLS }).map((_, c) => (
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
                          : 'rgba(255, 255, 255, 0.008)',
                    },
                  ]}
                />
              ))}
            </View>
          ))}

          {/* Snake Body Segments */}
          {body.map((segment, index) => {
            const opacity = Math.max(0.5, 1 - index * 0.015);
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

          {/* Snake Head with Cute Eyes */}
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

          {/* Pulsing Glowing Apple */}
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

          {/* Level Up Flash Banner */}
          {levelUpText && (
            <View style={styles.levelUpOverlay} pointerEvents="none">
              <Text style={styles.levelUpText}>{levelUpText}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#070C16',
  },
  // HUD
  hudCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: BOARD_WIDTH,
    backgroundColor: 'rgba(12, 22, 38, 0.92)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    marginBottom: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  hudStatBox: {
    alignItems: 'flex-start',
    minWidth: 60,
  },
  hudCenterBox: {
    alignItems: 'center',
  },
  hudLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 1.5,
    marginBottom: 1,
  },
  hudValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  speedBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.45)',
    marginBottom: 3,
  },
  speedBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.8,
  },
  portalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    gap: 4,
  },
  portalDot: {
    color: '#10B981',
    fontSize: 7,
  },
  portalText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.8,
  },
  // BIG ARENA
  bigArenaWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    backgroundColor: '#0C1729',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#10B981',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
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
    backgroundColor: '#10B981',
    borderRadius: 5,
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
    backgroundColor: '#34D399',
    borderRadius: 7,
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
    backgroundColor: '#070C16',
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
  levelUpOverlay: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(5, 12, 22, 0.92)',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 99,
  },
  levelUpText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.2,
  },
});
