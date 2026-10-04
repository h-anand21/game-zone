// ============================================================
// PATH MIND — Exit Confirmation Modal
// Ancient Stone Temple Doorway confirmation modal
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, Image } from 'react-native';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';
import { pmAssets } from '../../design-system/uiAssets';
import { TitlePlaque } from '../ui/TitlePlaque';
import { GameButton } from '../ui/GameButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ExitConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  level?: number;
  score?: number;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  level = 1,
  score = 0,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.panelContainer}>
          {/* Temple Stone Plaque */}
          <TitlePlaque
            title="LEAVE THE EXPEDITION?"
            subtitle="PATH PROGRESS WILL BE RECORDED"
            variant="gold"
            size="medium"
            style={styles.plaque}
          />

          <View style={styles.card}>
            <Text style={styles.bodyText}>
              Are you sure you want to exit to the GameHub? Your current chamber milestone and artifacts are safe.
            </Text>

            {/* Quick Stats Snapshot */}
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
                <Text style={[styles.statVal, { color: pmColors.goldBright }]}>850</Text>
                <Text style={styles.statLabel}>COINS</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonCol}>
              {/* STAY & CONTINUE */}
              <GameButton
                label="RESUME EXPEDITION"
                variant="green"
                size="large"
                width={240}
                height={56}
                onPress={onCancel}
              />

              {/* QUIT EXPEDITION */}
              <GameButton
                label="EXIT TO HUB"
                variant="red"
                size="medium"
                width={240}
                height={50}
                onPress={onConfirm}
                style={{ marginTop: 8 }}
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
    backgroundColor: 'rgba(4, 10, 16, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  panelContainer: {
    width: Math.min(SCREEN_WIDTH - 36, 360),
    alignItems: 'center',
  },
  plaque: {
    marginBottom: -16,
    zIndex: 10,
    width: '94%',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(14, 24, 34, 0.98)',
    borderRadius: pmRadii.xl,
    borderWidth: 2.5,
    borderBottomWidth: 5,
    borderColor: pmColors.stoneBorder,
    paddingTop: 28,
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
    width: 22,
    height: 22,
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
