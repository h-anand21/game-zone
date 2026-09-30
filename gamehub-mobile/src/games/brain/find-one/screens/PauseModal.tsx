// ============================================================
// Find One — Screen 4: Pause Modal Overlay Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { FOColors, FORadius, FOSpacing, FOShadows } from '../theme';
import {
  GameButton,
  WoodenSign,
  PandaIllustration,
} from '../components';
import { useFindOneStore } from '../store/findOneStore';

export const PauseModal: React.FC = () => {
  const { isPaused, resumeGame, restartGame, exitHome } = useFindOneStore();

  if (!isPaused) return null;

  return (
    <Modal
      transparent
      visible={isPaused}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Dimmed Background */}
        <Pressable style={styles.backdrop} onPress={resumeGame} />

        {/* Modal Card */}
        <View style={styles.cardContainer}>
          {/* Peeking Happy Panda on Top */}
          <View style={styles.mascotHolder}>
            <PandaIllustration mood="home" size={130} />
          </View>

          {/* Wooden Frame Card */}
          <LinearGradient
            colors={['#0F253E', '#0A1C30', '#061220']}
            style={[styles.modalCard, FOShadows.modalShadow]}
          >
            {/* Hanging Lantern on Corner */}
            <View style={styles.lanternWrap}>
              <Svg width={36} height={46} viewBox="0 0 36 46">
                {/* Chain */}
                <Path d="M18,0 L18,8" stroke="#8A562B" strokeWidth="2" />
                {/* Cap */}
                <Path d="M8,8 L28,8 L24,14 L12,14 Z" fill="#4A260F" />
                {/* Glowing Glass */}
                <Rect x="10" y="14" width="16" height="20" rx="3" fill="#FFE885" stroke="#4A260F" strokeWidth="2" />
                {/* Inner Glow Bulb */}
                <Circle cx="18" cy="24" r="5" fill="#FFA500" />
                {/* Base */}
                <Path d="M10,34 L26,34 L22,38 L14,38 Z" fill="#4A260F" />
              </Svg>
            </View>

            {/* 3D PAUSED Title */}
            <View style={styles.titleWrap}>
              <WoodenSign text="PAUSED" size="lg" variant="wood" />
              <Text style={styles.subtitle}>Take a break!</Text>
            </View>

            {/* 3 Action Buttons */}
            <View style={styles.buttonsColumn}>
              {/* Resume */}
              <GameButton
                title="RESUME"
                variant="green"
                size="md"
                icon={<Text style={{ fontSize: 20 }}>▶</Text>}
                onPress={resumeGame}
              />

              {/* Restart */}
              <GameButton
                title="RESTART"
                variant="gold"
                size="md"
                icon={<Text style={{ fontSize: 20 }}>🔄</Text>}
                onPress={restartGame}
              />

              {/* Exit to Home */}
              <GameButton
                title="EXIT TO HOME"
                variant="red"
                size="md"
                icon={<Text style={{ fontSize: 20 }}>🏠</Text>}
                onPress={exitHome}
              />
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 8, 14, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: FOSpacing.lg,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    position: 'relative',
    paddingTop: 45,
  },
  mascotHolder: {
    position: 'absolute',
    top: -20,
    zIndex: 2,
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    borderRadius: FORadius.xl,
    paddingHorizontal: FOSpacing.lg,
    paddingTop: 36,
    paddingBottom: FOSpacing.xl,
    borderWidth: 3,
    borderColor: '#1C426B',
    borderTopColor: '#2C629E',
    borderBottomWidth: 6,
    borderBottomColor: '#05111E',
    alignItems: 'center',
    position: 'relative',
  },
  lanternWrap: {
    position: 'absolute',
    top: 40,
    right: 8,
    zIndex: 3,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: FOSpacing.lg,
    gap: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8EDBFF',
    marginTop: 2,
  },
  buttonsColumn: {
    width: '100%',
    gap: 12,
  },
});
