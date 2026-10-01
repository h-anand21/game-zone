// ============================================================
// Number Rush — Language Selection Bottom Sheet / Modal
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { NRTheme } from '../theme';
import { NRHaptics } from '../services/haptics';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

interface LanguageModalProps {
  visible: boolean;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  visible,
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Top handle bar */}
          <View style={styles.handleBar} />

          <Text style={styles.sheetTitle}>SELECT LANGUAGE</Text>
          <Text style={styles.sheetSubtitle}>Choose your preferred game language</Text>

          <View style={styles.list}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;

              return (
                <Pressable
                  key={lang.code}
                  onPress={() => {
                    NRHaptics.buttonTap();
                    onSelectLanguage(lang.code);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.langRow,
                    isSelected && styles.langRowSelected,
                    pressed && styles.langRowPressed,
                  ]}
                >
                  <Text style={styles.flagIcon}>{lang.flag}</Text>
                  <View style={styles.textCol}>
                    <Text style={[styles.langName, isSelected && styles.activeText]}>
                      {lang.nativeName}
                    </Text>
                    <Text style={styles.langSub}>{lang.name}</Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <Pressable onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>CLOSE</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: '#1E120A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 2,
    borderColor: '#7A3F1D',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 16,
  },
  sheetTitle: {
    color: '#FFD42A',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  sheetSubtitle: {
    color: '#D8E2DD',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 16,
  },
  list: {
    width: '100%',
    gap: 8,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D1B11',
    borderRadius: NRTheme.radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  langRowSelected: {
    borderColor: '#FFD42A',
    backgroundColor: 'rgba(255, 212, 42, 0.15)',
  },
  langRowPressed: {
    transform: [{ scale: 0.98 }],
  },
  flagIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  textCol: {
    flex: 1,
  },
  langName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  activeText: {
    color: '#FFD42A',
  },
  langSub: {
    color: '#8CA0BA',
    fontSize: 11,
    marginTop: 2,
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#20C83A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  cancelBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: NRTheme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cancelText: {
    color: '#D8E2DD',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
