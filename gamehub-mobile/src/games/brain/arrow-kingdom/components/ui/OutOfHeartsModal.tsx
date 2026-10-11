// ============================================================
// ARROW KINGDOM — Screen: Out of Hearts Modal
// Displays when 3 mistakes are made on blocked moves
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { GameButton } from './GameButton';
import { ArrowHaptics } from '../../utils/haptics';

interface OutOfHeartsModalProps {
  visible: boolean;
  onRestart: () => void;
  onExitHome: () => void;
  onRefillHeart?: () => void;
  canRefill?: boolean;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  visible,
  onRestart,
  onExitHome,
  onRefillHeart,
  canRefill = false,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.cardBezel}>
          <LinearGradient
            colors={[COLORS.surfaceLight, COLORS.surface, COLORS.background]}
            style={styles.cardInner}
          >
            {/* Dark broken hearts display */}
            <View style={styles.heartsRow}>
              <Text style={styles.brokenHeart}>🖤 🖤 🖤</Text>
            </View>

            <Text style={styles.title}>OUT OF HEARTS</Text>
            <Text style={styles.subtitle}>THE RUNIC MAZE COLLAPSED</Text>

            <Text style={styles.message}>
              Arrows can only slide when their entire exit path is clear! Take another look and trace your path before tapping.
            </Text>

            <View style={styles.actions}>
              {canRefill && onRefillHeart && (
                <GameButton
                  title="+1 ❤️ REFILL (50 🪙)"
                  variant="gold"
                  size="medium"
                  onPress={() => {
                    ArrowHaptics.buttonPress();
                    onRefillHeart();
                  }}
                  style={styles.btn}
                />
              )}

              <GameButton
                title="↻ TRY AGAIN"
                variant="green"
                size="large"
                onPress={() => {
                  ArrowHaptics.buttonPress();
                  onRestart();
                }}
                style={styles.btn}
              />

              <GameButton
                title="⌂ MAIN MENU"
                variant="blue"
                size="medium"
                onPress={() => {
                  ArrowHaptics.buttonPress();
                  onExitHome();
                }}
                style={styles.btn}
              />
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 10, 20, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  cardBezel: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#781B26',
    shadowColor: '#FF4655',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 12,
  },
  cardInner: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  heartsRow: {
    marginBottom: 8,
  },
  brokenHeart: {
    fontSize: 32,
    letterSpacing: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF6475',
    letterSpacing: 1.5,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 1,
    marginBottom: 14,
  },
  message: {
    fontSize: 13,
    color: '#D4E4F5',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 22,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  btn: {
    width: '100%',
  },
});
