// ============================================================
// GameHub — Onboarding: Username Screen
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useProfileStore } from '@/store/profile-store';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

const SUGGESTIONS = [
  'GameMaster', 'ProPlayer', 'AceGamer', 'StormRider',
  'PhantomX', 'NightHawk', 'BlazeFire', 'IronWolf',
];

export default function UsernameScreen() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { setDisplayName } = useProfileStore();

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const validateUsername = (text: string) => {
    setUsername(text);
    if (text.length === 0) {
      setError('');
    } else if (text.length < 3) {
      setError('Minimum 3 characters chahiye');
    } else if (text.length > 20) {
      setError('Maximum 20 characters allowed');
    } else if (!USERNAME_REGEX.test(text)) {
      setError('Sirf letters, numbers, aur underscore use karo');
    } else {
      setError('');
    }
  };

  const handleContinue = () => {
    if (!username.trim() || error) return;
    setDisplayName(username.trim());
    router.push('/onboarding/avatar' as any);
  };

  const handleSuggestion = (name: string) => {
    const suffix = Math.floor(Math.random() * 999);
    validateUsername(`${name}_${suffix}`);
  };

  const isValid = username.length >= 3 && !error;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Progress indicator */}
        <View style={styles.progress}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>

        <Text style={styles.emoji}>👤</Text>
        <Text style={styles.title}>Choose Your Username</Text>
        <Text style={styles.subtitle}>Ye tere friends ko dikhega. Baad mein change bhi kar sakte ho.</Text>

        {/* Input */}
        <View style={[styles.inputBox, error ? styles.inputError : isValid ? styles.inputValid : null]}>
          <Text style={styles.inputPrefix}>@</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username..."
            placeholderTextColor={Colors.textMuted}
            value={username}
            onChangeText={validateUsername}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
          />
          {isValid && <Text style={styles.checkMark}>✅</Text>}
        </View>

        {error ? (
          <Text style={styles.errorText}>⚠️ {error}</Text>
        ) : username.length > 0 ? (
          <Text style={styles.validText}>✨ Username available!</Text>
        ) : null}

        {/* Character count */}
        <Text style={styles.charCount}>{username.length}/20</Text>

        {/* Suggestions */}
        <Text style={styles.suggestLabel}>Ya ek try karo:</Text>
        <View style={styles.suggestions}>
          {SUGGESTIONS.map((name) => (
            <TouchableOpacity key={name} style={styles.suggestionChip} onPress={() => handleSuggestion(name)}>
              <Text style={styles.suggestionText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <TouchableOpacity
          style={[styles.continueBtn, !isValid && styles.disabledBtn]}
          onPress={handleContinue}
          disabled={!isValid}
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingTop: 80, paddingHorizontal: Spacing.xl },
  progress: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: Spacing.xl },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.surfaceLight },
  progressDotActive: { backgroundColor: Colors.primary, width: 24 },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: Spacing.md },
  title: {
    fontSize: Typography.h2, color: Colors.textPrimary,
    fontWeight: Typography.extrabold, textAlign: 'center', marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.bodySmall, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 20, marginBottom: Spacing.xl,
  },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, borderWidth: 2, borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.error },
  inputValid: { borderColor: Colors.success },
  inputPrefix: { color: Colors.primary, fontSize: Typography.h3, fontWeight: Typography.bold, marginRight: 4 },
  input: { flex: 1, height: 52, color: Colors.textPrimary, fontSize: Typography.body },
  checkMark: { fontSize: 18 },
  errorText: { color: Colors.error, fontSize: Typography.caption, marginTop: Spacing.xs },
  validText: { color: Colors.success, fontSize: Typography.caption, marginTop: Spacing.xs },
  charCount: { color: Colors.textMuted, fontSize: Typography.tiny, textAlign: 'right', marginTop: 4 },
  suggestLabel: { color: Colors.textMuted, fontSize: Typography.caption, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  suggestionChip: {
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
  },
  suggestionText: { color: Colors.primaryLight, fontSize: Typography.caption, fontWeight: Typography.semibold },
  bottomCta: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  continueBtn: {
    backgroundColor: Colors.primary, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, alignItems: 'center',
  },
  disabledBtn: { opacity: 0.4 },
  continueBtnText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: Typography.bold },
});
