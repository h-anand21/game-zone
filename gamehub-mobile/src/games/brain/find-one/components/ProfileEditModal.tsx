// ============================================================
// Find One — Profile Edit Modal
// ============================================================

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FORadius, FOSpacing } from '../theme';
import { useFindOneStore } from '../store/findOneStore';
import { GameButton } from './GameButton';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
}

const AVAILABLE_AVATARS = ['🐼', '🦊', '🐻', '🐨', '🐸', '🐯', '🐰', '🦁', '👦', '👧', '🧙', '🥷'];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  onClose,
}) => {
  const { profile, stats, updateProfile } = useFindOneStore();
  const [nameInput, setNameInput] = useState(profile.name || 'Champion');
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || '🐼');

  const handleSave = () => {
    updateProfile(nameInput, selectedAvatar);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCardWrapper}>
          <LinearGradient
            colors={['#142E4C', '#0B1C30', '#061322']}
            style={styles.modalCard}
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.titleBadge}>
                <Text style={styles.titleIcon}>✏️</Text>
                <Text style={styles.modalTitle}>EDIT PROFILE</Text>
              </View>

              <Pressable
                style={styles.closeBtn}
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Current Preview */}
              <View style={styles.previewBox}>
                <View style={styles.previewAvatarHolder}>
                  <Text style={styles.previewAvatarText}>{selectedAvatar}</Text>
                </View>
                <View style={styles.previewDetails}>
                  <Text style={styles.previewName}>{nameInput || 'Champion'}</Text>
                  <Text style={styles.previewRank}>Rank #{profile.rank} • {stats.bestScore} Best Pts</Text>
                </View>
              </View>

              {/* Name Input */}
              <Text style={styles.inputLabel}>PLAYER NAME</Text>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter player name"
                placeholderTextColor="#5C7A99"
                style={styles.textInput}
                maxLength={18}
              />

              {/* Avatar Selector */}
              <Text style={styles.inputLabel}>CHOOSE MASCOT AVATAR</Text>
              <View style={styles.avatarGrid}>
                {AVAILABLE_AVATARS.map((av) => {
                  const isSelected = selectedAvatar === av;

                  return (
                    <Pressable
                      key={av}
                      onPress={() => setSelectedAvatar(av)}
                      style={[
                        styles.avatarOption,
                        isSelected && styles.avatarOptionSelected,
                      ]}
                    >
                      <Text style={styles.avatarEmoji}>{av}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Save Button */}
              <View style={styles.ctaHolder}>
                <GameButton
                  title="SAVE CHANGES"
                  variant="gold"
                  size="md"
                  onPress={handleSave}
                />
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 8, 14, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: FOSpacing.md,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCardWrapper: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
  },
  modalCard: {
    width: '100%',
    borderRadius: FORadius.xl,
    padding: FOSpacing.lg,
    borderWidth: 2,
    borderColor: '#FFC928',
    borderTopColor: '#FFE57F',
    borderBottomWidth: 5,
    borderBottomColor: '#05111E',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleIcon: {
    fontSize: 22,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0E243C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1D4973',
  },
  closeIcon: {
    fontSize: 16,
    color: '#A8C5DE',
    fontWeight: '900',
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1E33',
    borderRadius: FORadius.lg,
    padding: 12,
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#174066',
    marginBottom: 16,
  },
  previewAvatarHolder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0E2A47',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFC928',
  },
  previewAvatarText: {
    fontSize: 28,
  },
  previewDetails: {
    flex: 1,
  },
  previewName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  previewRank: {
    fontSize: 11,
    color: '#7AA0C2',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#89ADC9',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#091A2E',
    borderRadius: FORadius.md,
    borderWidth: 1.5,
    borderColor: '#18426B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  avatarOption: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#0A1C2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#163B61',
  },
  avatarOptionSelected: {
    borderColor: '#FFC928',
    backgroundColor: '#1E4870',
    borderWidth: 2.5,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  ctaHolder: {
    marginTop: 6,
    marginBottom: 4,
  },
});
