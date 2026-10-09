// ============================================================
// REACTION FIRE — Full-Screen Interactive Gameplay Arena
// Direct touch target covering the entire combat field with dynamic state response
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable, useWindowDimensions, Animated } from 'react-native';
import { RadarRings } from './RadarRings';
import { RfColors } from '../theme';
import type { GameplayState, PerformanceClassification } from '../types';

interface ReactionArenaProps {
  state: GameplayState;
  onTouchArena: () => void;
  lastReactionTimeMs?: number | null;
  lastClassification?: PerformanceClassification;
  disabled?: boolean;
}

export const ReactionArena: React.FC<ReactionArenaProps> = ({
  state,
  onTouchArena,
  lastReactionTimeMs,
  lastClassification,
  disabled = false,
}) => {
  const { width, height } = useWindowDimensions();
  const arenaSize = Math.min(width - 32, height * 0.48, 380);

  const isWaiting = state === 'waiting';
  const isGo = state === 'go';
  const isTooEarly = state === 'tooEarly';
  const isDecoy = state === 'decoy';
  const isSuccess = state === 'success';

  return (
    <Pressable
      style={[
        styles.fullScreenTouchArea,
        isWaiting && styles.arenaWaiting,
        isGo && styles.arenaGo,
        isTooEarly && styles.arenaTooEarly,
        isDecoy && styles.arenaDecoy,
        isSuccess && styles.arenaSuccess,
      ]}
      onPress={onTouchArena}
      disabled={disabled}
    >
      {/* Central Radar Target Container */}
      <View style={[styles.centerRadarFrame, { width: arenaSize, height: arenaSize }]}>
        <RadarRings size={arenaSize} state={state} />

        {/* State Content Center Piece */}
        <View style={styles.stateCenterWrapper} pointerEvents="none">
          {/* 1. WAITING STATE */}
          {isWaiting && (
            <View style={styles.contentCol}>
              <View style={[styles.iconCircle, styles.iconCircleBlue]}>
                <Text style={styles.stateIcon}>⏳</Text>
              </View>
              <Text style={styles.mainDirective}>WAIT FOR GREEN...</Text>
              <Text style={styles.subDirective}>Do not tap yet.</Text>
            </View>
          )}

          {/* 2. GO STATE */}
          {isGo && (
            <View style={styles.contentCol}>
              <View style={[styles.iconCircle, styles.iconCircleLime]}>
                <Text style={styles.stateIconGo}>⚡</Text>
              </View>
              <Text style={styles.mainDirectiveGo}>TAP NOW!</Text>
              <Text style={styles.subDirectiveGo}>STRIKE FAST!</Text>
            </View>
          )}

          {/* 3. TOO EARLY STATE */}
          {isTooEarly && (
            <View style={styles.contentCol}>
              <View style={[styles.iconCircle, styles.iconCircleRed]}>
                <Text style={styles.stateIcon}>⚠️</Text>
              </View>
              <Text style={styles.mainDirectiveRed}>TOO EARLY!</Text>
              <Text style={styles.subDirective}>Wait for the green signal.</Text>
            </View>
          )}

          {/* 4. DECOY STATE */}
          {isDecoy && (
            <View style={styles.contentCol}>
              <View style={[styles.iconCircle, styles.iconCircleYellow]}>
                <Text style={styles.stateIcon}>👁️</Text>
              </View>
              <Text style={styles.mainDirectiveYellow}>DECOY!</Text>
              <Text style={styles.subDirectiveYellow}>DO NOT TAP YELLOW!</Text>
            </View>
          )}

          {/* 5. SUCCESS STATE */}
          {isSuccess && (
            <View style={styles.contentCol}>
              <Text style={styles.successTimeNumber}>{lastReactionTimeMs} ms</Text>
              <View style={styles.classificationPill}>
                <Text style={styles.classificationText}>{lastClassification || 'HIT!'}</Text>
              </View>
            </View>
          )}

          {/* 6. IDLE STATE */}
          {state === 'idle' && (
            <View style={styles.contentCol}>
              <Text style={styles.stateIcon}>⚡</Text>
              <Text style={styles.mainDirective}>STANDBY</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fullScreenTouchArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RfColors.bgMain,
  },

  // State Backgrounds
  arenaWaiting: {
    backgroundColor: '#07162C',
  },
  arenaGo: {
    backgroundColor: '#1E3E04',
  },
  arenaTooEarly: {
    backgroundColor: '#350C12',
  },
  arenaDecoy: {
    backgroundColor: '#382A02',
  },
  arenaSuccess: {
    backgroundColor: '#091A26',
  },

  centerRadarFrame: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stateCenterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 10,
  },
  contentCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Icons
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  iconCircleBlue: {
    backgroundColor: 'rgba(39, 183, 255, 0.15)',
    borderColor: RfColors.primaryBlue,
    shadowColor: RfColors.primaryBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  iconCircleLime: {
    backgroundColor: 'rgba(183, 255, 60, 0.25)',
    borderColor: RfColors.goLime,
    shadowColor: RfColors.goLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircleRed: {
    backgroundColor: 'rgba(255, 77, 99, 0.2)',
    borderColor: RfColors.signalRed,
    shadowColor: RfColors.signalRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  iconCircleYellow: {
    backgroundColor: 'rgba(255, 208, 67, 0.2)',
    borderColor: RfColors.decoyYellow,
    shadowColor: RfColors.decoyYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  stateIcon: {
    fontSize: 30,
  },
  stateIconGo: {
    fontSize: 34,
    fontWeight: '900',
    color: RfColors.goLime,
  },

  // Directives
  mainDirective: {
    fontSize: 22,
    fontWeight: '900',
    color: RfColors.primaryBlue,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subDirective: {
    fontSize: 12,
    fontWeight: '700',
    color: RfColors.textSecondary,
    letterSpacing: 1,
    marginTop: 6,
  },
  mainDirectiveGo: {
    fontSize: 34,
    fontWeight: '900',
    color: RfColors.goLime,
    letterSpacing: 3,
    textShadowColor: RfColors.goLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subDirectiveGo: {
    fontSize: 14,
    fontWeight: '900',
    color: RfColors.goLime,
    letterSpacing: 2,
    marginTop: 4,
  },
  mainDirectiveRed: {
    fontSize: 26,
    fontWeight: '900',
    color: RfColors.signalRed,
    letterSpacing: 2,
    textShadowColor: RfColors.signalRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  mainDirectiveYellow: {
    fontSize: 24,
    fontWeight: '900',
    color: RfColors.decoyYellow,
    letterSpacing: 2,
  },
  subDirectiveYellow: {
    fontSize: 12,
    fontWeight: '800',
    color: RfColors.decoyYellow,
    marginTop: 4,
  },

  // Success Telemetry
  successTimeNumber: {
    fontSize: 54,
    fontWeight: '900',
    color: RfColors.goLime,
    letterSpacing: 2,
    textShadowColor: RfColors.goLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  classificationPill: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(183, 255, 60, 0.15)',
    borderWidth: 1.5,
    borderColor: RfColors.goLime,
  },
  classificationText: {
    fontSize: 12,
    fontWeight: '900',
    color: RfColors.goLime,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export default ReactionArena;
