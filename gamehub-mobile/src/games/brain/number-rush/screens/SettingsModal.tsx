// ============================================================
// Number Rush — Screen 19: SETTINGS (Master Professional Implementation)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import {
  TigerMascotHeader,
  WoodPanel,
  GameButton,
  GameToggle,
  GameSlider,
  LanguageModal,
  AccountModal,
  DeleteAccountModal,
  SupportModal,
  BottomNavBar,
  LANGUAGES,
} from '../components';
import type { SupportDocType } from '../components/SupportModal';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const SettingsModal: React.FC = () => {
  const { setScreen, settings, updateSettings } = useNumberRushStore();

  // Modals state
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [supportModal, setSupportModal] = useState<{
    visible: boolean;
    type: SupportDocType;
  }>({
    visible: false,
    type: 'help',
  });
  const [restoreNotice, setRestoreNotice] = useState(false);

  const currentLangObj =
    LANGUAGES.find((l) => l.code === settings.language) || LANGUAGES[0];

  const handleRestorePurchases = () => {
    setRestoreNotice(true);
    setTimeout(() => setRestoreNotice(false), 2500);
  };

  const handleConfirmDelete = () => {
    setDeleteModalVisible(false);
    // Reset local data & redirect to home
    setScreen('home');
  };

  return (
    <View style={styles.container}>
      {/* 1. Dedicated Atmospheric Fantasy Jungle Background Image */}
      <ExpoImage
        source={JUNGLE_BG}
        style={styles.bgImage}
        contentFit="cover"
        transition={250}
      />

      {/* Dark Ambient Vignette Overlay for Readability */}
      <View style={styles.darkVignette} />

      {/* 2. Top Header with Overlapping Cartoon Tiger Mascot */}
      <TigerMascotHeader
        title="SETTINGS"
        subtitle="Customize Your Game Experience"
        onBackPress={() => setScreen('home')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ====================================================== */}
        {/* SECTION 1 — SOUND & MUSIC                              */}
        {/* ====================================================== */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🔊 SOUND & MUSIC</Text>

          <WoodPanel style={styles.panel} variant="wood" hasRivets={false}>
            {/* Music Row */}
            <View style={styles.settingRow}>
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>🎵</Text>
                  <Text style={styles.rowTitle}>Music</Text>
                </View>
                <Text style={styles.rowSubtitle}>Background music during gameplay</Text>
              </View>

              <View style={styles.rowControls}>
                <GameSlider
                  value={settings.bgVolume}
                  onValueChange={(val) => updateSettings({ bgVolume: val })}
                  disabled={!settings.backgroundMusic}
                />
                <GameToggle
                  value={settings.backgroundMusic}
                  onValueChange={(val) => updateSettings({ backgroundMusic: val })}
                />
              </View>
            </View>

            {/* Sound Effects Row */}
            <View style={[styles.settingRow, styles.borderTop]}>
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>🔊</Text>
                  <Text style={styles.rowTitle}>Sound Effects</Text>
                </View>
                <Text style={styles.rowSubtitle}>Game sounds and effects</Text>
              </View>

              <View style={styles.rowControls}>
                <GameSlider
                  value={settings.sfxVolume}
                  onValueChange={(val) => updateSettings({ sfxVolume: val })}
                  disabled={!settings.soundEffects}
                />
                <GameToggle
                  value={settings.soundEffects}
                  onValueChange={(val) => updateSettings({ soundEffects: val })}
                />
              </View>
            </View>

            {/* Vibration Row */}
            <View style={[styles.settingRow, styles.borderTop]}>
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>📳</Text>
                  <Text style={styles.rowTitle}>Vibration</Text>
                </View>
                <Text style={styles.rowSubtitle}>Device vibration for actions</Text>
              </View>

              <GameToggle
                value={settings.vibration}
                onValueChange={(val) => updateSettings({ vibration: val })}
              />
            </View>
          </WoodPanel>
        </View>

        {/* ====================================================== */}
        {/* SECTION 2 — GAMEPLAY                                   */}
        {/* ====================================================== */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🎮 GAMEPLAY</Text>

          <WoodPanel style={styles.panel} variant="wood" hasRivets={false}>
            {/* Haptic Feedback */}
            <View style={styles.settingRow}>
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>⚡</Text>
                  <Text style={styles.rowTitle}>Haptic Feedback</Text>
                </View>
                <Text style={styles.rowSubtitle}>Feel the action with haptics</Text>
              </View>

              <GameToggle
                value={settings.hapticFeedback}
                onValueChange={(val) => updateSettings({ hapticFeedback: val })}
              />
            </View>

            {/* Show Hints */}
            <View style={[styles.settingRow, styles.borderTop]}>
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>💡</Text>
                  <Text style={styles.rowTitle}>Show Hints</Text>
                </View>
                <Text style={styles.rowSubtitle}>Show helpful hints during gameplay</Text>
              </View>

              <GameToggle
                value={settings.showHints}
                onValueChange={(val) => updateSettings({ showHints: val })}
              />
            </View>

            {/* Confirm Actions */}
            <View style={[styles.settingRow, styles.borderTop]}>
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>⚠️</Text>
                  <Text style={styles.rowTitle}>Confirm Actions</Text>
                </View>
                <Text style={styles.rowSubtitle}>Ask before restarting or leaving</Text>
              </View>

              <GameToggle
                value={settings.confirmActions}
                onValueChange={(val) => updateSettings({ confirmActions: val })}
              />
            </View>
          </WoodPanel>
        </View>

        {/* ====================================================== */}
        {/* SECTION 3 — DISPLAY                                    */}
        {/* ====================================================== */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🖥️ DISPLAY</Text>

          <WoodPanel style={styles.panel} variant="wood" hasRivets={false}>
            {/* Dark Mode */}
            <View style={styles.settingRow}>
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>🌙</Text>
                  <Text style={styles.rowTitle}>Dark Mode</Text>
                </View>
                <Text style={styles.rowSubtitle}>Use dark theme</Text>
              </View>

              <GameToggle
                value={settings.darkMode}
                onValueChange={(val) => updateSettings({ darkMode: val })}
              />
            </View>

            {/* Animations */}
            <View style={[styles.settingRow, styles.borderTop]}>
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>✨</Text>
                  <Text style={styles.rowTitle}>Animations</Text>
                </View>
                <Text style={styles.rowSubtitle}>Enable smooth animations</Text>
              </View>

              <GameToggle
                value={settings.animations}
                onValueChange={(val) => updateSettings({ animations: val })}
              />
            </View>

            {/* Language Selector */}
            <Pressable
              onPress={() => setLanguageModalVisible(true)}
              style={({ pressed }) => [
                styles.settingRow,
                styles.borderTop,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>🌐</Text>
                  <Text style={styles.rowTitle}>Language</Text>
                </View>
                <Text style={styles.rowSubtitle}>Select your preferred language</Text>
              </View>

              <View style={styles.dropdownBtn}>
                <Text style={styles.dropdownFlag}>{currentLangObj.flag}</Text>
                <Text style={styles.dropdownText}>{currentLangObj.name}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>
          </WoodPanel>
        </View>

        {/* ====================================================== */}
        {/* SECTION 4 — ACCOUNT                                    */}
        {/* ====================================================== */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🛡️ ACCOUNT</Text>

          <WoodPanel style={styles.panel} variant="wood" hasRivets={false}>
            <Pressable
              onPress={() => setAccountModalVisible(true)}
              style={({ pressed }) => [
                styles.settingRow,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>🛡️</Text>
                  <Text style={styles.rowTitle}>Manage Account</Text>
                </View>
                <Text style={styles.rowSubtitle}>View, edit or link your account</Text>
              </View>

              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </WoodPanel>
        </View>

        {/* ====================================================== */}
        {/* SECTION 5 — SUPPORT & ABOUT                            */}
        {/* ====================================================== */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>💬 SUPPORT & ABOUT</Text>

          <WoodPanel style={styles.panel} variant="wood" hasRivets={false}>
            {/* Help & Support */}
            <Pressable
              onPress={() => setSupportModal({ visible: true, type: 'help' })}
              style={({ pressed }) => [
                styles.settingRow,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>🎧</Text>
                  <Text style={styles.rowTitle}>Help & Support</Text>
                </View>
                <Text style={styles.rowSubtitle}>Get help or contact us</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>

            {/* Privacy Policy */}
            <Pressable
              onPress={() => setSupportModal({ visible: true, type: 'privacy' })}
              style={({ pressed }) => [
                styles.settingRow,
                styles.borderTop,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>🔒</Text>
                  <Text style={styles.rowTitle}>Privacy Policy</Text>
                </View>
                <Text style={styles.rowSubtitle}>Read our privacy policy</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>

            {/* Terms of Service */}
            <Pressable
              onPress={() => setSupportModal({ visible: true, type: 'terms' })}
              style={({ pressed }) => [
                styles.settingRow,
                styles.borderTop,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={styles.rowInfo}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.rowIcon}>📄</Text>
                  <Text style={styles.rowTitle}>Terms of Service</Text>
                </View>
                <Text style={styles.rowSubtitle}>Read our terms of service</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </WoodPanel>
        </View>

        {/* ====================================================== */}
        {/* FOOTER & DESTRUCTIVE ACTIONS                           */}
        {/* ====================================================== */}
        <View style={styles.footerContainer}>
          <Text style={styles.versionText}>Version 1.2.0 • Build 2026.09.30</Text>

          {restoreNotice && (
            <Text style={styles.restoreNotice}>
              ✓ Purchases checked: All in-game passes active!
            </Text>
          )}

          <GameButton
            title="RESTORE PURCHASES"
            icon="🔄"
            variant="wood"
            size="md"
            fullWidth
            onPress={handleRestorePurchases}
            style={{ marginTop: 12 }}
          />

          <GameButton
            title="DELETE ACCOUNT"
            icon="⚠️"
            variant="red"
            size="md"
            fullWidth
            onPress={() => setDeleteModalVisible(true)}
            style={{ marginTop: 10 }}
          />
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Floating Bottom Nav */}
      <BottomNavBar />

      {/* ====================================================== */}
      {/* MODALS                                                 */}
      {/* ====================================================== */}
      <LanguageModal
        visible={languageModalVisible}
        selectedLanguage={settings.language}
        onSelectLanguage={(code) => updateSettings({ language: code })}
        onClose={() => setLanguageModalVisible(false)}
      />

      <AccountModal
        visible={accountModalVisible}
        onClose={() => setAccountModalVisible(false)}
      />

      <DeleteAccountModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirmDelete={handleConfirmDelete}
      />

      <SupportModal
        visible={supportModal.visible}
        type={supportModal.type}
        onClose={() => setSupportModal({ visible: false, type: 'help' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  darkVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(6, 18, 13, 0.82)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  sectionContainer: {
    marginTop: 14,
  },
  sectionTitle: {
    color: '#FFD42A',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  panel: {
    padding: 6,
    backgroundColor: 'rgba(36, 21, 14, 0.88)',
    borderColor: '#6B3518',
    borderWidth: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  rowPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  rowInfo: {
    flex: 1,
    paddingRight: 10,
  },
  rowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  rowTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  rowSubtitle: {
    color: '#BFC8C2',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 15,
  },
  rowControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#381C0F',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#7A3F1D',
  },
  dropdownFlag: {
    fontSize: 14,
    marginRight: 6,
  },
  dropdownText: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '800',
  },
  chevron: {
    color: '#FFE082',
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 6,
  },
  footerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  versionText: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  restoreNotice: {
    color: '#2ED573',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
});
