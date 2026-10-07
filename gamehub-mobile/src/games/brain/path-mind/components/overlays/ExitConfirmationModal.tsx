// ============================================================
// PATH MIND — Exit Confirmation Modal
// Ancient Stone Temple Doorway confirmation modal
// Using authentic uncropped title plaque with original game assets
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
  level = 1,
  score = 0,
  coins,
}) => {
  const storeCoins = usePathMindStore((s) => s.coins);
  const effectiveCoins = coins !== undefined ? coins : storeCoins ?? 850;

  const modalWidth = Math.min(SCREEN_WIDTH - 32, 340);
  const plaqueWidth = modalWidth;
  const plaqueHeight = Math.round(plaqueWidth * (724 / 2172)); // 3:1 ratio from image copy.png

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
          {/* Authentic uncropped Title Plaque (image copy.png) */}
          <View style={[styles.plaqueWrap, { width: plaqueWidth, height: plaqueHeight }]}>
            <Image
              source={pmAssets.plaques.leaveExpedition}
              style={{ width: plaqueWidth, height: plaqueHeight }}
              resizeMode="contain"
            />
          </View>

          {/* Subtitle Ribbon */}
          <View style={styles.ribbonBanner}>
            <Text style={styles.ribbonText}>✦  PATH PROGRESS WILL BE RECORDED  ✦</Text>
          </View>

          {/* Temple Stone Card */}
          <View style={styles.card}>
            <Text style={styles.bodyText}>
              Are you sure you want to exit to the GameHub? Your current chamber milestone and artifacts are safe.
            </Text>

            {/* Quick Stats Snapshot using original game icons */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Image source={pmAssets.icons.star} style={styles.statIcon} resizeMode="contain" />
                <Text style={styles.statVal}>{score}</Text>
                <Text style={styles.statLabel}>EXPEDITION PTS</Text>
              </View>

              <View style={styles.statBox}>
                <Image source={pmAssets.icons.compass} style={styles.statIcon} resizeMode="contain" />
                <Text style={[styles.statVal, { color: pmColors.cyan }]}>CHAMBER {level}</Text>
                <Text style={styles.statLabel}>CURRENT STAGE</Text>
              </View>

              <View style={styles.statBox}>
                <Image source={pmAssets.icons.coin} style={styles.statIcon} resizeMode="contain" />
                <Text style={[styles.statVal, { color: pmColors.goldBright }]}>{effectiveCoins}</Text>
                <Text style={styles.statLabel}>COINS</Text>
              </View>
            </View>

            {/* Action Buttons using original button images */}
            <View style={styles.buttonCol}>
              {/* STAY & CONTINUE */}
              <GameButton
                imageSource={pmAssets.buttons.resume}
                label="RESUME"
                size="large"
                width={220}
                height={62}
                onPress={onCancel}
                accessibilityLabel="Resume Expedition"
              />

              {/* QUIT EXPEDITION */}
              <GameButton
                imageSource={pmAssets.buttons.exitHub}
                label="EXIT TO HUB"
                size="large"
                width={220}
                height={62}
                onPress={onConfirm}
                style={{ marginTop: 10 }}
                accessibilityLabel="Exit to Hub"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 10, 16, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  panelContainer: {
    alignItems: 'center',
  },
  plaqueWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -4,
  },
  ribbonBanner: {
    backgroundColor: '#121D26',
    borderWidth: 1.5,
    borderColor: '#CCA048',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 6,
    zIndex: 12,
    ...pmShadows.glowGold,
  },
  ribbonText: {
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(14, 24, 34, 0.98)',
    borderRadius: pmRadii.xl,
    borderWidth: 2.5,
    borderBottomWidth: 5,
    borderColor: pmColors.stoneBorder,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...pmShadows.heavy,
  },
  bodyText: {
    ...pmTypography.bodyMedium,
    color: pmColors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 19,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(7, 14, 20, 0.75)',
    borderWidth: 1.5,
    borderColor: '#263745',
    borderRadius: pmRadii.lg,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 26,
    height: 26,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: pmColors.textPrimary,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: pmColors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  buttonCol: {
    width: '100%',
    alignItems: 'center',
  },
});
