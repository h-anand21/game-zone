// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 08: Gameplay Screen
// Master puzzle runtime: HUD, GameBoard, BottomControls & Modals
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ArrowPieceData, GameLevel } from '../game/types';
import { LEVELS } from '../data/levels';
import { THEMES } from '../data/themes';
import { attemptMove, isLevelComplete, calculateStars, getHint, getRemainingCount } from '../game/engine';
import { FantasyBackground } from '../components/ui/FantasyBackground';
import { GameHUD } from '../components/game/GameHUD';
import { GameBoard } from '../components/game/GameBoard';
import { BottomControls } from '../components/game/BottomControls';
import { PauseModal } from '../components/ui/PauseModal';
import { LevelCompleteModal } from '../components/ui/LevelCompleteModal';
import { RewardChestModal } from '../components/ui/RewardChestModal';
import { useGameStore } from '../store/gameStore';
import { ArrowHaptics } from '../utils/haptics';
import { ArrowAudio } from '../utils/sound';

interface GameplayScreenProps {
  levelId: number;
  onExitHome: () => void;
  onOpenWorldMap: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  levelId,
  onExitHome,
  onOpenWorldMap,
}) => {
  const insets = useSafeAreaInsets();

  // Store state
  const selectedThemeId = useGameStore((state) => state.selectedTheme);
  const hearts = useGameStore((state) => state.hearts);
  const hintsRemaining = useGameStore((state) => state.hintsRemaining);
  const useHintFromStore = useGameStore((state) => state.useHint);
  const completeLevelInStore = useGameStore((state) => state.completeLevel);
  const setCurrentLevelInStore = useGameStore((state) => state.setCurrentLevel);

  const activeTheme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];

  // Active level state
  const [currentLevelId, setCurrentLevelId] = useState(levelId);
  const levelData = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];

  const [pieces, setPieces] = useState<ArrowPieceData[]>(() =>
    JSON.parse(JSON.stringify(levelData.pieces))
  );
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState<ArrowPieceData[][]>([]);

  // Animation & Interaction states
  const [blockedPieceId, setBlockedPieceId] = useState<string | null>(null);
  const [escapingPieceId, setEscapingPieceId] = useState<string | null>(null);
  const [hintedPieceId, setHintedPieceId] = useState<string | null>(null);

  // Modals
  const [showPause, setShowPause] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showChest, setShowChest] = useState(false);
  const [finalStars, setFinalStars] = useState(3);

  // Re-initialize when level changes
  useEffect(() => {
    setCurrentLevelId(levelId);
    const target = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    setPieces(JSON.parse(JSON.stringify(target.pieces)));
    setMoves(0);
    setHistory([]);
    setShowPause(false);
    setShowComplete(false);
    setShowChest(false);
    setBlockedPieceId(null);
    setEscapingPieceId(null);
    setHintedPieceId(null);
  }, [levelId]);

  // Restart current level
  const handleRestart = useCallback(() => {
    setPieces(JSON.parse(JSON.stringify(levelData.pieces)));
    setMoves(0);
    setHistory([]);
    setShowPause(false);
    setShowComplete(false);
    setShowChest(false);
    setBlockedPieceId(null);
    setEscapingPieceId(null);
    setHintedPieceId(null);
  }, [levelData]);

  // Arrow Tap / Drag Handler
  const handlePiecePress = useCallback(
    (pressedPiece: ArrowPieceData) => {
      if (escapingPieceId || showComplete || showPause) return;

      const result = attemptMove(pressedPiece, pieces, levelData.rows, levelData.cols);

      if (result.type === 'blocked') {
        // Trigger blocked shake & error flash
        setBlockedPieceId(pressedPiece.id);
        ArrowAudio.playBlocked();
        setTimeout(() => {
          setBlockedPieceId(null);
        }, 320);
        return;
      }

      // Valid escape move!
      ArrowAudio.playWhoosh();
      setEscapingPieceId(pressedPiece.id);

      // Save undo snapshot
      setHistory((prev) => [...prev, JSON.parse(JSON.stringify(pieces))]);
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      // Animate off-screen then remove piece from state
      setTimeout(() => {
        const nextPieces = pieces.map((p) =>
          p.id === pressedPiece.id ? { ...p, removed: true } : p
        );
        setPieces(nextPieces);
        setEscapingPieceId(null);

        // Check if level solved!
        if (isLevelComplete(nextPieces)) {
          const starsEarned = calculateStars(nextMoves, levelData);
          setFinalStars(starsEarned);
          completeLevelInStore(
            levelData.id,
            starsEarned,
            nextMoves,
            levelData.reward.coins,
            levelData.reward.gems || 0
          );
          ArrowAudio.playWin();

          // Milestone bonus chest on levels 3, 5, 8, 12, 15
          if ([3, 5, 8, 12, 15].includes(levelData.id)) {
            setShowChest(true);
          } else {
            setShowComplete(true);
          }
        }
      }, 300);
    },
    [escapingPieceId, showComplete, showPause, pieces, levelData, moves, completeLevelInStore]
  );

  // Undo last escape
  const handleUndo = useCallback(() => {
    if (history.length === 0 || escapingPieceId) return;
    const last = history[history.length - 1];
    setPieces(last);
    setHistory((prev) => prev.slice(0, -1));
    setMoves((prev) => Math.max(0, prev - 1));
  }, [history, escapingPieceId]);

  // Hint magic
  const handleHint = useCallback(() => {
    if (hintsRemaining <= 0) return;
    const hintPiece = getHint(pieces, levelData.rows, levelData.cols);
    if (hintPiece) {
      useHintFromStore();
      setHintedPieceId(hintPiece.id);
      setTimeout(() => {
        setHintedPieceId(null);
      }, 2500);
    }
  }, [hintsRemaining, pieces, levelData, useHintFromStore]);

  // Next level navigation
  const handleNextLevel = useCallback(() => {
    setShowComplete(false);
    setShowChest(false);
    const nextId = currentLevelId + 1;
    if (nextId <= LEVELS.length) {
      setCurrentLevelId(nextId);
      setCurrentLevelInStore(nextId);
      const nextLevel = LEVELS.find((l) => l.id === nextId) || LEVELS[0];
      setPieces(JSON.parse(JSON.stringify(nextLevel.pieces)));
      setMoves(0);
      setHistory([]);
    } else {
      onOpenWorldMap();
    }
  }, [currentLevelId, setCurrentLevelInStore, onOpenWorldMap]);

  return (
    <FantasyBackground>
      <View style={styles.container}>
        {/* Top Wood Heads-Up Display */}
        <GameHUD
          levelNumber={levelData.id}
          levelName={levelData.name}
          moves={moves}
          targetMoves={levelData.threeStarMoves}
          hearts={hearts}
          remainingPieces={getRemainingCount(pieces)}
          onPause={() => setShowPause(true)}
          onRestart={handleRestart}
        />

        {/* Tutorial Hint Banner (for Level 1 & 3) */}
        {levelData.tutorialText && moves === 0 && (
          <View style={styles.tutorialBanner}>
            <Text style={styles.tutorialText}>{levelData.tutorialText}</Text>
          </View>
        )}

        {/* Interactive Puzzle Board */}
        <View style={styles.boardContainer}>
          <GameBoard
            rows={levelData.rows}
            cols={levelData.cols}
            pieces={pieces}
            onPiecePress={handlePiecePress}
            blockedPieceId={blockedPieceId}
            escapingPieceId={escapingPieceId}
            hintedPieceId={hintedPieceId}
            theme={activeTheme}
            showTutorialHand={levelData.id === 1 && moves === 0}
            disabled={showPause || showComplete || showChest}
          />
        </View>

        {/* Bottom Dimensional Controls (Undo, Hint, Reset) */}
        <BottomControls
          onUndo={handleUndo}
          onHint={handleHint}
          onReset={handleRestart}
          canUndo={history.length > 0}
          hintsRemaining={hintsRemaining}
        />

        {/* Pause Modal Overlay */}
        <PauseModal
          visible={showPause}
          levelNumber={levelData.id}
          onResume={() => setShowPause(false)}
          onRestart={handleRestart}
          onLevelsMap={() => {
            setShowPause(false);
            onOpenWorldMap();
          }}
          onHome={() => {
            setShowPause(false);
            onExitHome();
          }}
        />

        {/* Level Complete Victory Celebration */}
        <LevelCompleteModal
          visible={showComplete}
          levelNumber={levelData.id}
          moves={moves}
          bestMoves={levelData.threeStarMoves}
          stars={finalStars}
          rewardCoins={levelData.reward.coins}
          rewardGems={levelData.reward.gems || 0}
          onNextLevel={handleNextLevel}
          onReplay={handleRestart}
          onHome={onExitHome}
        />

        {/* Milestone Treasure Chest Modal */}
        <RewardChestModal
          visible={showChest}
          rewardCoins={levelData.reward.coins + 100}
          rewardGems={(levelData.reward.gems || 0) + 15}
          onClaim={() => {
            setShowChest(false);
            setShowComplete(true);
          }}
        />
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tutorialBanner: {
    backgroundColor: 'rgba(8, 27, 47, 0.92)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#78F329',
    alignSelf: 'center',
    marginTop: 6,
    maxWidth: '90%',
  },
  tutorialText: {
    color: '#78F329',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameplayScreen;
