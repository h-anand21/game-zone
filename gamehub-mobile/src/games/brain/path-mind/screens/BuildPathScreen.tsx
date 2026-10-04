// ============================================================
// PATH MIND — Screen 09: BuildPathScreen
// Interactive Custom Puzzle Builder & Chamber Workshop
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { TitlePlaque } from '../components/ui/TitlePlaque';
import { GameBoard } from '../components/game/GameBoard';
import { GameButton } from '../components/ui/GameButton';
import { usePathMindStore } from '../store/pathMindStore';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';
import type { GridPos } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const BuildPathScreen: React.FC = () => {
  const { setScreen, hearts, coins } = usePathMindStore();
  const [customPath, setCustomPath] = useState<GridPos[]>([
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
  ]);

  const handleTilePress = (row: number, col: number) => {
    // If empty, start path
    if (customPath.length === 0) {
      setCustomPath([{ row, col }]);
      return;
    }

    const last = customPath[customPath.length - 1];
    // Check if tapping existing last tile to undo
    if (last.row === row && last.col === col) {
      setCustomPath(customPath.slice(0, -1));
      return;
    }

    // Check if already in path (prevent self-intersect)
    if (customPath.some((p) => p.row === row && p.col === col)) {
      return;
    }

    // Must be adjacent (orthogonal)
    const isAdjacent = Math.abs(last.row - row) + Math.abs(last.col - col) === 1;
    if (isAdjacent) {
      setCustomPath([...customPath, { row, col }]);
    }
  };

  const handleUndo = () => {
    if (customPath.length > 0) {
      setCustomPath(customPath.slice(0, -1));
    }
  };

  const handleClear = () => {
    setCustomPath([]);
  };

  const handleTestAndPlay = () => {
    if (customPath.length < 3) return;
    usePathMindStore.setState({ selectedDifficulty: 'CUSTOM' });
    setScreen('gameplay');
  };

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('modes')}
        onSettings={() => setScreen('settings')}
        hearts={hearts}
        coins={coins}
      />

      <View style={styles.container}>
        <TitlePlaque
          title="BUILD YOUR PATH"
          subtitle="SACRED PUZZLE WORKSHOP"
          variant="gold"
          size="medium"
          style={styles.titlePlaque}
        />

        {/* Builder Status Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            RUNES: <Text style={{ color: pmColors.cyanGlow }}>{customPath.length}</Text> • TAP TILES TO WEAVE PATH
          </Text>
        </View>

        {/* Interactive Board */}
        <View style={styles.boardWrap}>
          <GameBoard
            gridSize={5}
            path={customPath}
            playerPath={customPath}
            phase="build"
            onTilePress={handleTilePress}
            maxWidth={Math.min(SCREEN_WIDTH - 36, 320)}
          />
        </View>

        {/* Builder Action Toolbar */}
        <View style={styles.toolRow}>
          <GameButton
            label="UNDO"
            variant="wood"
            size="small"
            width={90}
            height={44}
            disabled={customPath.length === 0}
            onPress={handleUndo}
            accessibilityLabel="Undo"
          />

          <GameButton
            label="CLEAR"
            variant="red"
            size="small"
            width={90}
            height={44}
            disabled={customPath.length === 0}
            onPress={handleClear}
            accessibilityLabel="Clear"
          />

          <GameButton
            label="MAP"
            iconName="map"
            variant="cyan"
            size="small"
            width={90}
            height={44}
            onPress={() => setScreen('world_map')}
            accessibilityLabel="Map"
          />
        </View>

        {/* Primary CTA Button */}
        <View style={styles.ctaWrap}>
          <GameButton
            label="TEST & PLAY"
            iconName="play"
            variant="gold"
            size="large"
            width={Math.min(SCREEN_WIDTH - 48, 280)}
            height={58}
            disabled={customPath.length < 3}
            onPress={handleTestAndPlay}
            accessibilityLabel="Test and Play"
          />
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  titlePlaque: {
    width: Math.min(SCREEN_WIDTH - 36, 320),
    marginTop: 4,
  },
  infoBanner: {
    backgroundColor: 'rgba(10, 18, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: pmColors.stoneBorder,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginVertical: 4,
    ...pmShadows.soft,
  },
  infoText: {
    fontSize: 10,
    fontWeight: '800',
    color: pmColors.textSecondary,
    letterSpacing: 0.5,
  },
  boardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  ctaWrap: {
    width: '100%',
    alignItems: 'center',
  },
});
