// ============================================================
// GameHub — Snake Component (ChatGPT Easter Egg Inspired Edition)
// 100% Pure Touchscreen Controls (Zero Buttons)
// Instant Tap-To-Steer: Tap Left -> Snake goes Left, Tap Right -> Snake goes Right
// Tap Top -> Up, Tap Bottom -> Down + Full-Screen Hand Swipe
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 24, 380);
const CELL_SIZE = (BOARD_SIZE - 4) / GRID_SIZE;

interface TouchIndicator {
  id: number;
  x: number;
  y: number;
  arrow: string;
}

export const SnakeGame: React.FC<SnakeProps> = ({ onFinish, isPaused }) => {
  const [gameState, setGameState] = useState<SnakeState>(() => getInitialState());
  const currentDirectionRef = useRef<Direction>('RIGHT');
  const directionQueueRef = useRef<Direction[]>([]);
  const hasFinishedRef = useRef(false);

  // Visual tap feedback ripples
  const [touchFeedback, setTouchFeedback] = useState<TouchIndicator | null>(null);

  // Pulse animation for the glowing food apple
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Border portal glow animation
  const portalGlowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
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

  // Main game tick loop
  useEffect(() => {
    if (isPaused || gameState.gameOver) return;

    const intervalTime = Math.max(75, 175 - Math.floor(gameState.score / 20) * 10);
    const timer = setInterval(() => {
      setGameState((prev) => {
        const nextDir = directionQueueRef.current.shift() || currentDirectionRef.current;
        const next = moveSnake(prev, nextDir);
        currentDirectionRef.current = next.direction;
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, gameState.gameOver, gameState.score]);

  // Steer towards target direction (Direct turn or safe double-turn if 180°)
  const steerTowards = (targetDir: Direction, tapY: number, tapX: number) => {
    const current =
      directionQueueRef.current.length > 0
        ? directionQueueRef.current[directionQueueRef.current.length - 1]
        : currentDirectionRef.current;

    if (targetDir === current) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const isOpposite =
      (targetDir === 'UP' && current === 'DOWN') ||
      (targetDir === 'DOWN' && current === 'UP') ||
      (targetDir === 'LEFT' && current === 'RIGHT') ||
      (targetDir === 'RIGHT' && current === 'LEFT');

    if (!isOpposite) {
      // Direct 90-degree turn
      directionQueueRef.current = [targetDir];
    } else {
      // User tapped exact opposite side (180° turn):
      // Safely execute 2-step U-turn so snake turns towards the tapped side without self-bite suicide
      const centerY = SCREEN_HEIGHT * 0.45;
      const centerX = SCREEN_WIDTH * 0.5;

      if (targetDir === 'LEFT' || targetDir === 'RIGHT') {
        const intermediate: Direction = tapY < centerY ? 'UP' : 'DOWN';
        directionQueueRef.current = [intermediate, targetDir];
      } else {
        const intermediate: Direction = tapX < centerX ? 'LEFT' : 'RIGHT';
        directionQueueRef.current = [intermediate, targetDir];
      }
    }
  };

  // Process directional tap from screen coordinates
  const handleTap = (pageX: number, pageY: number) => {
    const centerX = SCREEN_WIDTH / 2;
    // Board center roughly at 45% of screen height
    const centerY = SCREEN_HEIGHT * 0.45;

    const dx = pageX - centerX;
    const dy = pageY - centerY;

    let targetDir: Direction;
    let arrowChar: string;

    // Check whether tap is more horizontal or vertical
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        targetDir = 'LEFT';
        arrowChar = '◀';
      } else {
        targetDir = 'RIGHT';
        arrowChar = '▶';
      }
    } else {
      if (dy < 0) {
        targetDir = 'UP';
        arrowChar = '▲';
      } else {
        targetDir = 'DOWN';
        arrowChar = '▼';
      }
    }

    // Show instant visual touch indicator
    setTouchFeedback({
      id: Date.now(),
      x: pageX - 25,
      y: pageY - 25,
      arrow: arrowChar,
    });
    setTimeout(() => {
      setTouchFeedback(null);
    }, 280);

    steerTowards(targetDir, pageY, pageX);
  };

  // Full-screen PanResponder: Instant Tap on touch-down + fluid drag
  const swipeHandledRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          swipeHandledRef.current = false;
          const { pageX, pageY } = evt.nativeEvent;
          startPosRef.current = { x: pageX, y: pageY };
          // INSTANT RESPONSE ON TOUCH-DOWN: Tap Left -> Goes Left, Tap Right -> Goes Right!
          handleTap(pageX, pageY);
        },
        onPanResponderMove: (_, gesture) => {
          if (swipeHandledRef.current) return;

          const SWIPE_THRESHOLD = 16;
          const { dx, dy } = gesture;

          if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_THRESHOLD) {
            let swipeDir: Direction;
            if (Math.abs(dx) > Math.abs(dy)) {
              swipeDir = dx > 0 ? 'RIGHT' : 'LEFT';
            } else {
              swipeDir = dy > 0 ? 'DOWN' : 'UP';
            }

            swipeHandledRef.current = true;
            steerTowards(
              swipeDir,
              startPosRef.current.y + dy,
              startPosRef.current.x + dx
            );
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
        <View style={styles.tapGuidanceContainer}>
          <View style={styles.tapZoneGuideLeft}>
            <Text style={styles.tapZoneArrow}>◀</Text>
            <Text style={styles.tapZoneText}>Tap Left side</Text>
          </View>
          <View style={styles.tapZoneDivider} />
          <View style={styles.tapZoneGuideRight}>
            <Text style={styles.tapZoneText}>Tap Right side</Text>
            <Text style={styles.tapZoneArrow}>▶</Text>
          </View>
        </View>
        <Text style={styles.touchSubHint}>
          Tap anywhere on screen to turn • Swipe to steer
        </Text>
      </View>

      {/* Instant Visual Touch Feedback Indicator */}
      {touchFeedback && (
        <View
          pointerEvents="none"
          style={[
            styles.touchIndicator,
            { left: touchFeedback.x, top: touchFeedback.y },
          ]}
        >
          <Text style={styles.touchIndicatorText}>{touchFeedback.arrow}</Text>
        </View>
      )}
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
    borderWidth: 2,
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
    paddingVertical: 14,
    gap: 8,
  },
  tapGuidanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  tapZoneGuideLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tapZoneGuideRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tapZoneArrow: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '900',
  },
  tapZoneText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tapZoneDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  touchSubHint: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  touchIndicator: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 2,
    borderColor: '#34D399',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  touchIndicatorText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
