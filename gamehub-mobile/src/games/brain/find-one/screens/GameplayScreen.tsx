// ============================================================
// Find One — Screen 3: Gameplay Screen
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FOColors, FORadius, FOSpacing } from '../theme';
import {
  GameGrid,
  GameGridRef,
  TimerRing,
  WoodenSign,
} from '../components';
import { useFindOneStore } from '../store/findOneStore';

export const GameplayScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const gridRef = useRef<GameGridRef>(null);
  const insets = useSafeAreaInsets();

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 20,
    16
  );
  const bottomInset = Math.max(insets.bottom, 16);

  const {
    score,
    timeLeft,
    maxTime,
    roundData,
    stats,
    isPaused,
    hintsLeft,
    hintHighlightIndex,
    tapTile,
    tickTimer,
    useHint,
    shuffleGrid,
    skipRound,
    pauseGame,
  } = useFindOneStore();

  // Active game countdown loop
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, tickTimer]);

  const handleTilePress = (index: number) => {
    const { isOdd } = tapTile(index);
    if (!isOdd) {
      gridRef.current?.triggerShake();
    }
  };

  const currentLevelNum = Math.floor(score / 5) + 1;
  const levelProgress = score % 5;

  return (
    <LinearGradient
      colors={['#081729', '#05101C', '#02070D']}
      style={[
        styles.container,
        {
          paddingTop: topInset + 6,
          paddingBottom: bottomInset + 12,
        },
      ]}
    >
      {/* ── Top HUD ── */}
      <View style={styles.topHud}>
        {/* Pause Button */}
        <Pressable onPress={pauseGame} style={styles.pauseBtn}>
          <Text style={styles.pauseIcon}>⏸</Text>
        </Pressable>

        {/* Score Badge */}
        <View style={styles.hudBadge}>
          <Text style={styles.badgeEmoji}>🏆</Text>
          <View>
            <Text style={styles.badgeLabel}>SCORE</Text>
            <Text style={styles.badgeValue}>
              {score < 10 ? `0${score}` : score}
            </Text>
          </View>
        </View>

        {/* Center Circular Countdown Timer */}
        <View style={styles.timerCenter}>
          <TimerRing seconds={timeLeft} maxSeconds={maxTime} size={88} />
        </View>

        {/* Best Score Badge */}
        <View style={styles.hudBadge}>
          <Text style={styles.badgeEmoji}>👑</Text>
          <View>
            <Text style={styles.badgeLabel}>BEST</Text>
            <Text style={styles.badgeValue}>{stats.bestScore}</Text>
          </View>
        </View>

        {/* Level Indicator Pill */}
        <View style={styles.levelContainer}>
          <Text style={styles.levelLabel}>Level {currentLevelNum}</Text>
          <View style={styles.levelPillsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.levelPill,
                  i < levelProgress && styles.levelPillActive,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* ── Wooden Sign: Find the odd one! ── */}
      <View style={styles.signWrap}>
        <WoodenSign
          text="Find the odd one!"
          size="md"
          variant="wood"
        />
      </View>

      {/* ── Main Dynamic Grid ── */}
      <View style={styles.gridWrap}>
        <GameGrid
          ref={gridRef}
          tiles={roundData.tiles}
          gridSize={roundData.gridSize}
          hintHighlightIndex={hintHighlightIndex}
          onTilePress={handleTilePress}
        />
      </View>

      {/* ── Bottom Power-Up / Assist Bar ── */}
      <View style={styles.bottomBar}>
        {/* Hint Button */}
        <Pressable
          onPress={useHint}
          style={[styles.powerBtn, styles.hintBtn]}
        >
          <View style={styles.hintBadge}>
            <Text style={styles.hintBadgeText}>{hintsLeft}</Text>
          </View>
          <Text style={styles.powerEmoji}>💡</Text>
          <Text style={styles.powerLabel}>HINT</Text>
        </Pressable>

        {/* Shuffle Button */}
        <Pressable
          onPress={shuffleGrid}
          style={[styles.powerBtn, styles.shuffleBtn]}
        >
          <Text style={styles.powerEmoji}>🔄</Text>
          <View style={styles.powerTextCol}>
            <Text style={styles.powerLabel}>SHUFFLE</Text>
            <Text style={styles.adTag}>▶ AD</Text>
          </View>
        </Pressable>

        {/* Skip Button */}
        <Pressable
          onPress={skipRound}
          style={[styles.powerBtn, styles.skipBtn]}
        >
          <Text style={styles.powerEmoji}>⏭</Text>
          <View style={styles.powerTextCol}>
            <Text style={styles.powerLabel}>SKIP</Text>
            <Text style={styles.adTag}>▶ AD</Text>
          </View>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: FOSpacing.md,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  pauseBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0F2844',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1D4E80',
    borderBottomWidth: 3,
    borderBottomColor: '#071526',
  },
  pauseIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  hudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E243D',
    borderRadius: FORadius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#1B426B',
    gap: 6,
  },
  badgeEmoji: {
    fontSize: 18,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: FOColors.textMuted,
    letterSpacing: 0.6,
  },
  badgeValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  timerCenter: {
    marginHorizontal: 2,
  },
  levelContainer: {
    alignItems: 'center',
    gap: 3,
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  levelPillsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  levelPill: {
    width: 8,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#132B45',
    borderWidth: 1,
    borderColor: '#20466E',
  },
  levelPillActive: {
    backgroundColor: FOColors.primary,
    borderColor: '#FFA500',
  },
  signWrap: {
    marginVertical: 4,
  },
  gridWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingHorizontal: 12,
  },
  powerBtn: {
    flex: 1,
    height: 52,
    borderRadius: FORadius.round,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderBottomWidth: 4,
    position: 'relative',
    paddingHorizontal: 8,
  },
  hintBtn: {
    backgroundColor: '#183654',
    borderBottomColor: '#0A1A2E',
    borderWidth: 1.5,
    borderColor: '#FFC928',
  },
  hintBadge: {
    position: 'absolute',
    top: -6,
    right: 4,
    backgroundColor: FOColors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0A1A2E',
  },
  hintBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#321D00',
  },
  shuffleBtn: {
    backgroundColor: '#14467A',
    borderBottomColor: '#0C2D52',
    borderWidth: 1.5,
    borderColor: '#29B6F6',
  },
  skipBtn: {
    backgroundColor: '#52208A',
    borderBottomColor: '#301254',
    borderWidth: 1.5,
    borderColor: '#9E5BFF',
  },
  powerEmoji: {
    fontSize: 20,
  },
  powerTextCol: {
    alignItems: 'flex-start',
  },
  powerLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  adTag: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFE57F',
  },
});
