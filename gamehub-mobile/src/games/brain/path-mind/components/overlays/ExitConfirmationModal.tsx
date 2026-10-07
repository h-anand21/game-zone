// ============================================================
// PATH MIND — Exit Confirmation Modal
// Ancient Stone Temple Doorway confirmation modal matching authentic reference
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, Image } from 'react-native';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';
import { pmAssets } from '../../design-system/uiAssets';
import { GameButton } from '../ui/GameButton';
import { usePathMindStore } from '../../store/pathMindStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ExitConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  level?: number;
  score?: number;
  coins?: number;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  level = 3,
  score = 3700,
  coins,
}) => {
  const storeCoins = usePathMindStore((s) => s.coins);
  const effectiveCoins = coins !== undefined ? coins : storeCoins ?? 850;

  // Sizing calculations matching authentic pixel reference
  const modalWidth = Math.min(SCREEN_WIDTH - 24, 345);
  const plaqueWidth = modalWidth;
  const plaqueHeight = Math.round(plaqueWidth * (710 / 1917)); // 2.70:1 aspect ratio
  const buttonWidth = Math.min(modalWidth - 40, 225);
  const buttonHeight = 62;
  const pedestalWidth = buttonWidth + 30;
  const pedestalHeight = Math.round(pedestalWidth * (55 / 590));

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.panelContainer, { width: modalWidth }]}>
          {/* 1. ANCIENT TEMPLE TITLE PLAQUE WITH TORCHES, COMPASS & VINES */}
          <View style={[styles.plaqueWrap, { width: plaqueWidth, height: plaqueHeight }]}>
            <Image
              source={pmAssets.plaques.leaveExpedition}
              style={{ width: plaqueWidth, height: plaqueHeight }}
              resizeMode="contain"
            />
          </View>

          {/* 2. SUBTITLE RIBBON BANNER */}
          <View style={styles.ribbonBanner}>
            <Text style={styles.ribbonText}>✦  PATH PROGRESS WILL BE RECORDED  ✦</Text>
          </View>

          {/* 3. PARCHMENT SCROLL CONTENT CARD */}
          <View style={styles.parchmentCard}>
            {/* Corner Decorative Stone Rivets */}
            <View style={[styles.rivet, styles.rivetTL]} />
            <View style={[styles.rivet, styles.rivetTR]} />
            <View style={[styles.rivet, styles.rivetBL]} />
            <View style={[styles.rivet, styles.rivetBR]} />

            {/* Explanatory Prompt */}
            <Text style={styles.bodyPrompt}>
              Are you sure you want to exit to the GameHub? Your current chamber milestone and artifacts are safe.
            </Text>

            {/* Inset Stone Stats Snapshot Panel */}
            <View style={styles.statsRecess}>
              {/* Column 1: Expedition Points */}
              <View style={styles.statColumn}>
                <Image
                  source={pmAssets.icons.exitScroll}
                  style={styles.statIcon}
                  resizeMode="contain"
                />
                <Text style={styles.statVal}>{score}</Text>
                <Text style={styles.statLabel}>EXPEDITION PTS</Text>
              </View>

              <View style={styles.statDivider} />

              {/* Column 2: Current Stage */}
              <View style={styles.statColumn}>
                <Image
                  source={pmAssets.icons.exitChamber}
                  style={styles.statIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.statVal, { color: '#00E5FF' }]}>CHAMBER {level}</Text>
                <Text style={styles.statLabel}>CURRENT STAGE</Text>
              </View>

              <View style={styles.statDivider} />

              {/* Column 3: Coins */}
              <View style={styles.statColumn}>
                <Image
                  source={pmAssets.icons.exitTrophy}
                  style={styles.statIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.statVal, { color: '#FFD700' }]}>{effectiveCoins}</Text>
                <Text style={styles.statLabel}>COINS</Text>
              </View>
            </View>
          </View>

          {/* 4. TEMPLE ACTION BUTTONS */}
          <View style={styles.buttonStack}>
            {/* RESUME EXPEDITION */}
            <GameButton
              imageSource={pmAssets.buttons.resume}
              label="RESUME"
              size="large"
              width={buttonWidth}
              height={buttonHeight}
              onPress={onCancel}
              accessibilityLabel="Resume Expedition"
            />

            {/* EXIT TO HUB */}
            <GameButton
              imageSource={pmAssets.buttons.exitHub}
              label="EXIT TO HUB"
              size="large"
              width={buttonWidth}
              height={buttonHeight}
              onPress={onConfirm}
              style={{ marginTop: 10 }}
              accessibilityLabel="Exit to Hub"
            />
          </View>

          {/* 5. STEPPED STONE PEDESTAL BASE */}
          <View style={[styles.pedestalWrap, { width: pedestalWidth, height: pedestalHeight }]}>
            <Image
              source={pmAssets.plaques.pedestalBase}
              style={{ width: pedestalWidth, height: pedestalHeight }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 8, 14, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  panelContainer: {
    alignItems: 'center',
  },
  plaqueWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonBanner: {
    backgroundColor: '#121D26',
    borderWidth: 1.5,
    borderColor: '#CCA048',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginTop: -8,
    marginBottom: 8,
    zIndex: 12,
    ...pmShadows.glowGold,
  },
  ribbonText: {
    color: '#FCD34D',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  parchmentCard: {
    width: '100%',
    backgroundColor: '#F3E4C8',
    borderRadius: pmRadii.lg,
    borderWidth: 3.5,
    borderColor: '#54361C',
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    position: 'relative',
    ...pmShadows.heavy,
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CCA048',
    borderWidth: 1,
    borderColor: '#4A2F17',
    opacity: 0.9,
  },
  rivetTL: { top: 6, left: 6 },
  rivetTR: { top: 6, right: 6 },
  rivetBL: { bottom: 6, left: 6 },
  rivetBR: { bottom: 6, right: 6 },

  bodyPrompt: {
    ...pmTypography.bodyMedium,
    color: '#3D2614',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 19,
    fontSize: 13.5,
    paddingHorizontal: 6,
  },
  statsRecess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#091118',
    borderWidth: 1.5,
    borderColor: '#243747',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '75%',
    backgroundColor: '#1E2F3E',
  },
  statIcon: {
    width: 32,
    height: 30,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 1,
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  buttonStack: {
    width: '100%',
    alignItems: 'center',
    marginTop: 14,
  },
  pedestalWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
});
