// ============================================================
// GameHub — Snake Component (Google Snake & Android Mobile Edition)
// Ultra-Smooth Fluid Controls: Direct Swipe Steering + Tap to Turn
// Warp Portals (Walls do not kill), Self-Bite Only Game Over
// 100% Mobile Touchscreen Architecture (Zero Lag, Fast Tick)
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 24, 380);
const CELL_SIZE = (BOARD_SIZE - 4) / GRID_SIZE;

export const SnakeGame: React.FC<SnakeProps> = ({ onFinish, isPaused }) => {
  const [gameState, setGameState] = useState<SnakeState>(() => getInitialState());
  const currentDirectionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const hasFinishedRef = useRef(false);

  // Pulse animation for the glowing food apple
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Border portal glow animation
  const portalGlowAnim = useRef(new Animated.Value(0.5)).current;

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

  // Speed Level calculation (Level 1 starts relaxed at 210ms, scales smoothly with score)
  const speedLevel = Math.min(10, Math.floor(gameState.score / 40) + 1);
  const intervalTime = Math.max(90, 210 - (speedLevel - 1) * 13);

  const [levelUpText, setLevelUpText] = useState<string | null>(null);
  const prevLevelRef = useRef(1);

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

  // Main game tick loop
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

  // Direction changer with strict 180° self-bite prevention
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

  // Google Snake Style Continuous PanResponder
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

          // Fast threshold (15px): As soon as finger moves, steer!
          if (distance >= 15) {
            let desiredDir: Direction;
            if (Math.abs(dx) > Math.abs(dy)) {
              desiredDir = dx > 0 ? 'RIGHT' : 'LEFT';
            } else {
              desiredDir = dy > 0 ? 'DOWN' : 'UP';
            }

            const changed = trySetDirection(desiredDir);
            // Reset anchor so continuous dragging continues steering smoothly without lifting finger
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
            const centerY = SCREEN_HEIGHT * 0.44;

            // Direct Tap Controls:
            if (current === 'UP' || current === 'DOWN') {
              // Moving vertically: tapping left goes LEFT, tapping right goes RIGHT
              if (pageX < centerX) {
                trySetDirection('LEFT');
              } else {
                trySetDirection('RIGHT');
              }
            } else {
              // Moving horizontally: tapping top goes UP, tapping bottom goes DOWN
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
      {/* Modern Android Arcade HUD */}
      <View style={styles.hudCard}>
        <View style={styles.hudLeft}>
          <Text style={styles.hudLabel}>SCORE</Text>
          <Text style={styles.hudValue}>{gameState.score}</Text>
        </View>

        <View style={styles.hudCenter}>
          <View style={styles.speedBadge}>
            <Text style={styles.speedBadgeText}>⚡ SPEED LVL {speedLevel}</Text>
          </View>
          <Animated.View style={[styles.portalBadge, { opacity: portalGlowAnim }]}>
            <Text style={styles.portalBadgeDot}>●</Text>
            <Text style={styles.portalBadgeText}>WARP WALLS</Text>
          </Animated.View>
        </View>

        <View style={styles.hudRight}>
          <Text style={styles.hudLabel}>APPLES</Text>
          <Text style={styles.hudValue}>🍎 {Math.floor(gameState.score / 10)}</Text>
        </View>
      </View>

      {/* Main Game Arena with Glowing Warp Portal Frame */}
      <View style={styles.boardWrapper}>
        <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
          {/* Subtle Grid Checkerboard */}
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
                          : 'rgba(255, 255, 255, 0.008)',
                    },
                  ]}
                />
              ))}
            </View>
          ))}

          {/* Snake Body Segments (Connected Smooth Pills) */}
          {body.map((segment, index) => {
            const opacity = Math.max(0.5, 1 - index * 0.018);
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

          {/* Level Up Flash Banner */}
          {levelUpText && (
            <View style={styles.levelUpOverlay} pointerEvents="none">
              <Text style={styles.levelUpText}>{levelUpText}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Pure Touchscreen Gesture Controls Zone */}
      <View style={styles.touchControlZone}>
        <View style={styles.touchHintCard}>
          <Text style={styles.touchHintTitle}>👆 Google Snake Touch Controls</Text>
          <Text style={styles.touchHintText}>
            Swipe in any direction to steer • Tap left/right/up/down to turn
          </Text>
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
    paddingVertical: 14,
    backgroundColor: '#090D16',
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
    borderColor: 'rgba(16, 185, 129, 0.25)',
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
    color: '#10B981',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  hudValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  speedBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    marginBottom: 3,
  },
  speedBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.8,
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
    backgroundColor: '#0F172A',
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: '#10B981',
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
    backgroundColor: '#10B981',
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
    backgroundColor: '#34D399',
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
    width: BOARD_SIZE,
    alignItems: 'center',
    paddingVertical: 12,
  },
  touchHintCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    gap: 3,
  },
  touchHintTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  touchHintText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
  levelUpOverlay: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(5, 12, 22, 0.92)',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 99,
  },
  levelUpText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
  },
});
