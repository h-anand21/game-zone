// ============================================================
// STACK MASTER — Interactive Gameplay Arena
// Responsive touch-anywhere drop, camera tracking, and slice animation
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BlockView, BLOCK_HEIGHT } from './BlockView';
import { FallingFragment } from './FallingFragment';
import { ComboFeedback } from './ComboFeedback';
import { calculatePlacement, getBlockSpeed, createBaseBlock } from '../../engine/stackPhysics';
import { computeScore } from '../../engine/scoring';
import { BLOCK_PALETTE } from '../../theme/colors';
import { StackHaptics } from '../../utils/haptics';
import type { TowerBlock, FallingPiece, GameMode } from '../../types';

interface StackArenaProps {
  mode: GameMode;
  isPaused: boolean;
  assistMode?: boolean;
  hapticsEnabled?: boolean;
  onScoreUpdate: (score: number, height: number, combo: number) => void;
  onGameOver: (finalScore: number, finalHeight: number, perfects: number, partials: number, maxCombo: number) => void;
}

export const StackArena: React.FC<StackArenaProps> = ({
  mode,
  isPaused,
  assistMode = false,
  hapticsEnabled = true,
  onScoreUpdate,
  onGameOver,
}) => {
  // Tower blocks array (starts with centered base block)
  const [blocks, setBlocks] = useState<TowerBlock[]>([createBaseBlock()]);
  const [fallingPieces, setFallingPieces] = useState<FallingPiece[]>([]);

  // Moving block properties
  const [currX, setCurrX] = useState<number>(0);
  const [currWidth, setCurrWidth] = useState<number>(createBaseBlock().width);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Score & stats
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [perfectCount, setPerfectCount] = useState<number>(0);
  const [partialCount, setPartialCount] = useState<number>(0);

  // Feedback states
  const [feedback, setFeedback] = useState<{
    type: 'perfect' | 'combo' | 'milestone';
    value: number;
    key: number;
  }>({ type: 'perfect', value: 0, key: 0 });

  // Guard flags
  const isDroppingRef = useRef<boolean>(false);
  const isGameOverRef = useRef<boolean>(false);

  // Camera smooth vertical translation
  const cameraTranslateY = useSharedValue<number>(0);

  // Color generator based on height
  const getBlockColor = useCallback((index: number) => {
    return BLOCK_PALETTE[index % BLOCK_PALETTE.length];
  }, []);

  // Moving block game loop
  useEffect(() => {
    if (isPaused || isGameOverRef.current) return;

    const speed = getBlockSpeed(blocks.length - 1, mode);
    const interval = setInterval(() => {
      setCurrX((prev) => {
        let next = prev + direction * speed;
        const maxLeft = 100 - currWidth;

        if (next >= maxLeft) {
          next = maxLeft;
          setDirection(-1);
        } else if (next <= 0) {
          next = 0;
          setDirection(1);
        }
        return next;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPaused, direction, currWidth, blocks.length, mode]);

  // Handle tap anywhere inside the arena to place block
  const handleArenaTap = () => {
    if (isPaused || isDroppingRef.current || isGameOverRef.current) return;
    isDroppingRef.current = true;

    const currentHeight = blocks.length - 1;
    const topBlock = blocks[blocks.length - 1];

    // Compute placement physics
    const result = calculatePlacement(currX, currWidth, topBlock, assistMode);

    if (result.type === 'miss') {
      // Game Over
      isGameOverRef.current = true;
      StackHaptics.gameOver(hapticsEnabled);

      // Create falling miss block
      const missPiece: FallingPiece = {
        id: `miss_${Date.now()}`,
        x: currX,
        width: currWidth,
        y: blocks.length,
        color: getBlockColor(blocks.length),
        direction: currX < topBlock.x ? 'left' : 'right',
      };
      setFallingPieces((prev) => [...prev, missPiece]);

      // Delay to let player see the miss
      setTimeout(() => {
        onGameOver(score, currentHeight, perfectCount, partialCount, maxCombo);
      }, 700);
      return;
    }

    const isPerfect = result.type === 'perfect';

    // Compute score & combo
    const scoreUpdate = computeScore(score, combo, isPerfect, currentHeight, mode);
    const nextScore = scoreUpdate.newScore;
    const nextCombo = scoreUpdate.newCombo;
    const newMaxCombo = Math.max(maxCombo, nextCombo);

    setScore(nextScore);
    setCombo(nextCombo);
    setMaxCombo(newMaxCombo);

    if (isPerfect) {
      setPerfectCount((prev) => prev + 1);
      StackHaptics.placePerfect(hapticsEnabled);

      if (scoreUpdate.milestoneReached) {
        StackHaptics.milestone(hapticsEnabled);
        setFeedback({
          type: 'milestone',
          value: scoreUpdate.milestoneReached,
          key: Date.now(),
        });
      } else if (nextCombo > 1) {
        setFeedback({
          type: 'combo',
          value: nextCombo,
          key: Date.now(),
        });
      } else {
        setFeedback({
          type: 'perfect',
          value: 0,
          key: Date.now(),
        });
      }
    } else {
      setPartialCount((prev) => prev + 1);
      StackHaptics.placeGood(hapticsEnabled);

      // Spawn falling cut overhang
      if (result.cutWidth && result.cutWidth > 0) {
        const piece: FallingPiece = {
          id: `cut_${Date.now()}`,
          x: result.cutX ?? 0,
          width: result.cutWidth,
          y: blocks.length,
          color: getBlockColor(blocks.length),
          direction: result.cutDirection ?? 'right',
        };
        setFallingPieces((prev) => [...prev, piece]);
      }
    }

    // Add new solid block to tower
    const newBlock: TowerBlock = {
      id: blocks.length + 1,
      x: result.survivingX,
      width: result.survivingWidth,
      y: blocks.length,
      color: getBlockColor(blocks.length),
      isPerfect,
    };

    const nextBlocks = [...blocks, newBlock];
    setBlocks(nextBlocks);
    setCurrWidth(result.survivingWidth);

    // Camera following: if tower exceeds 6 blocks, shift downwards smoothly
    if (nextBlocks.length > 6) {
      const targetOffset = (nextBlocks.length - 6) * BLOCK_HEIGHT;
      cameraTranslateY.value = withTiming(targetOffset, {
        duration: 250,
        easing: Easing.out(Easing.quad),
      });
    }

    // Notify parent HUD
    onScoreUpdate(nextScore, nextBlocks.length - 1, nextCombo);

    // Reset moving block start position based on direction
    setCurrX(direction === 1 ? 0 : 100 - result.survivingWidth);
    isDroppingRef.current = false;
  };

  const cameraAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cameraTranslateY.value }],
  }));

  return (
    <Pressable style={styles.arenaContainer} onPress={handleArenaTap}>
      <Animated.View style={[styles.towerTrack, cameraAnimatedStyle]}>
        {/* Placed Tower Blocks */}
        {blocks.map((blk, idx) => (
          <BlockView
            key={blk.id}
            x={blk.x}
            width={blk.width}
            bottom={idx * BLOCK_HEIGHT + 40}
            color={blk.color}
            isPerfect={blk.isPerfect}
          />
        ))}

        {/* Active Moving Block */}
        {!isGameOverRef.current && (
          <BlockView
            x={currX}
            width={currWidth}
            bottom={blocks.length * BLOCK_HEIGHT + 40}
            color={getBlockColor(blocks.length)}
          />
        )}

        {/* Falling Sliced Overhang Pieces */}
        {fallingPieces.map((piece) => (
          <FallingFragment
            key={piece.id}
            x={piece.x}
            width={piece.width}
            bottom={piece.y * BLOCK_HEIGHT + 40}
            color={piece.color}
            direction={piece.direction}
            onComplete={() => {
              setFallingPieces((prev) => prev.filter((p) => p.id !== piece.id));
            }}
          />
        ))}
      </Animated.View>

      {/* Floating combo / perfect feedback */}
      <ComboFeedback
        type={feedback.type}
        value={feedback.value}
        triggerKey={feedback.key}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  arenaContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  towerTrack: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
  },
});
