// ============================================================
// Mind Lock — Screen 5: Main Interactive Gameplay Screen
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { SequenceIndicator } from '../components/SequenceIndicator';
import { MemoryPadGrid } from '../components/MemoryPadGrid';
import { ProgressBar } from '../components/ProgressBar';
import { Mascot } from '../components/Mascot';
import { useMindLockStore } from '../store/mindLockStore';
import { MindLockAudio } from '../services/audio';
import { MindLockHaptics } from '../services/haptics';
import type { PadColor } from '../types';

export const GameplayScreen: React.FC = () => {
  const {
    round,
    score,
    sequence,
    playerInput,
    activePad,
    gameStatus,
    selectedMode,
    settings,
    setGameStatus,
    setActivePad,
    recordPlayerTap,
    pauseGame,
    goBack,
    updateSettings,
  } = useMindLockStore();

  const [playbackProgress, setPlaybackProgress] = useState(0);
  const isPlayingSequence = gameStatus === 'PLAYING_SEQUENCE';
  const isPlayerTurn = gameStatus === 'PLAYER_TURN';

  // Run sequence playback whenever sequence updates or on mount
  useEffect(() => {
    let isCancelled = false;

    const playSequence = async () => {
      setGameStatus('PLAYING_SEQUENCE');
      setPlaybackProgress(0);

      // Brief preparation pause
      await new Promise((r) => setTimeout(r, 600));
      if (isCancelled) return;

      const flashDuration = selectedMode === 'speed' ? 320 : 500;
      const pauseDuration = selectedMode === 'speed' ? 180 : 280;

      for (let i = 0; i < sequence.length; i++) {
        if (isCancelled) return;

        const color = sequence[i];
        setActivePad(color);
        MindLockAudio.playPad(color);
        MindLockHaptics.padTap();

        setPlaybackProgress((i + 1) / sequence.length);

        await new Promise((r) => setTimeout(r, flashDuration));
        if (isCancelled) return;

        setActivePad(null);
        await new Promise((r) => setTimeout(r, pauseDuration));
      }

      if (!isCancelled) {
        setGameStatus('PLAYER_TURN');
      }
    };

    playSequence();

    return () => {
      isCancelled = true;
    };
  }, [sequence.length]);

  const handlePadPress = (color: PadColor) => {
    if (!isPlayerTurn) return;
    recordPlayerTap(color);
  };

  const getStatusTitle = () => {
    if (isPlayingSequence) return 'WATCH THE PATTERN';
    if (isPlayerTurn) return 'YOUR TURN';
    if (gameStatus === 'CORRECT') return 'CORRECT!';
    if (gameStatus === 'WRONG') return 'LOCK BROKEN';
    return 'GET READY';
  };

  const getStatusSubtitle = () => {
    if (isPlayingSequence) return 'Memorize the sequence...';
    if (isPlayerTurn) {
      if (selectedMode === 'reverse') {
        return 'Repeat the pattern in REVERSE order!';
      }
      return `Tap pad ${playerInput.length + 1} of ${sequence.length}`;
    }
    return 'Prepare your mind...';
  };

  return (
    <View style={styles.container}>
      {/* Gameplay Header */}
      <ScreenHeader
        variant="gameplay"
        round={round}
        score={score}
        onPause={pauseGame}
        onBack={goBack}
      />

      {/* Sequence Progress Indicator Dots */}
      <View style={styles.indicatorSection}>
        <SequenceIndicator
          total={Math.max(sequence.length, 6)}
          current={isPlayingSequence ? Math.floor(playbackProgress * sequence.length) : playerInput.length}
        />
      </View>

      {/* Dynamic Status Banner with Mascot on corner */}
      <View style={styles.bannerContainer}>
        <LinearGradient
          colors={
            isPlayerTurn
              ? ['#FFFBEA', '#FFF3D0']
              : ['#FFF8EB', '#FFF0D4']
          }
          style={styles.bannerBubble}
        >
          <Text style={styles.bannerTitle}>
            {getStatusTitle().split(' ')[0]}{' '}
            <Text style={{ color: isPlayerTurn ? MLColors.padGreenDark : MLColors.padBlueDark }}>
              {getStatusTitle().split(' ').slice(1).join(' ')}
            </Text>
          </Text>
          <Text style={styles.bannerSubtitle}>{getStatusSubtitle()}</Text>
        </LinearGradient>

        {/* Mascot Peeking on Corner */}
        <View style={styles.bannerMascot}>
          <Mascot mood="gameplay" size={80} />
        </View>
      </View>

      {/* Main 2x2 Memory Pad Grid */}
      <View style={styles.gridSection}>
        <MemoryPadGrid
          activePad={activePad}
          disabled={!isPlayerTurn}
          onPadPress={handlePadPress}
        />
      </View>

      {/* Bottom Progress & Sound / Vibration Toggles */}
      <View style={styles.bottomSection}>
        <View style={styles.progressBarWrapper}>
          <ProgressBar
            progress={
              isPlayingSequence
                ? playbackProgress
                : playerInput.length / Math.max(1, sequence.length)
            }
            colorVariant={isPlayerTurn ? 'green' : 'gold'}
            height={8}
            label={isPlayingSequence ? 'Sequence Playing...' : 'Your Turn'}
          />
        </View>

        <View style={styles.controlsRow}>
          {/* Sound Toggle Button */}
          <Pressable
            onPress={() => updateSettings({ soundEffects: !settings.soundEffects })}
            style={[styles.toggleBtn, settings.soundEffects && styles.toggleBtnActive]}
          >
            <Svg width="18" height="18" viewBox="0 0 24 24" fill={settings.soundEffects ? MLColors.primary : MLColors.textDim}>
              <Path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </Svg>
            <Text style={[styles.toggleText, settings.soundEffects && styles.toggleTextActive]}>
              Sound {settings.soundEffects ? 'ON' : 'OFF'}
            </Text>
          </Pressable>

          {/* Vibration Toggle Button */}
          <Pressable
            onPress={() => updateSettings({ hapticFeedback: !settings.hapticFeedback })}
            style={[styles.toggleBtn, settings.hapticFeedback && styles.toggleBtnActive]}
          >
            <Svg width="18" height="18" viewBox="0 0 24 24" fill={settings.hapticFeedback ? MLColors.primary : MLColors.textDim}>
              <Path d="M0 15h2V9H0v6zm3 2h2V7H3v10zm19-8v6h2V9h-2zm-3 8h2V7h-2v10zM16.5 3h-9C6.67 3 6 3.67 6 4.5v15c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5zM16 19H8V5h8v14z" />
            </Svg>
            <Text style={[styles.toggleText, settings.hapticFeedback && styles.toggleTextActive]}>
              Vibration {settings.hapticFeedback ? 'ON' : 'OFF'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MLColors.background,
    justifyContent: 'space-between',
    paddingBottom: MLSpacing.lg,
  },
  indicatorSection: {
    width: '100%',
  },
  bannerContainer: {
    width: '88%',
    alignSelf: 'center',
    position: 'relative',
    marginVertical: MLSpacing.xs,
  },
  bannerBubble: {
    paddingVertical: 10,
    paddingHorizontal: MLSpacing.base,
    borderRadius: MLRadius.xl,
    alignItems: 'center',
    ...MLShadows.md,
  },
  bannerTitle: {
    color: '#0A121D',
    fontSize: MLTypography.h4,
    fontWeight: MLTypography.black,
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    color: '#556677',
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.semibold,
    marginTop: 2,
  },
  bannerMascot: {
    position: 'absolute',
    right: -10,
    top: -24,
  },
  gridSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: MLSpacing.sm,
  },
  bottomSection: {
    width: '88%',
    alignSelf: 'center',
    gap: MLSpacing.md,
  },
  progressBarWrapper: {
    width: '100%',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: MLSpacing.md,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F1E31',
    paddingVertical: 10,
    borderRadius: MLRadius.pill,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
  },
  toggleBtnActive: {
    borderColor: 'rgba(255, 201, 40, 0.3)',
    backgroundColor: '#132840',
  },
  toggleText: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
  toggleTextActive: {
    color: MLColors.white,
  },
});
