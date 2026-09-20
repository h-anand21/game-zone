// ============================================================
// GameHub — Root Layout
// ============================================================

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuthStore, useProfileStore, useNetworkStore, useFeatureFlagStore } from '@/store';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const initializeAuth = useAuthStore((s) => s.initialize);
  const loadProfile = useProfileStore((s) => s.loadProfile);
  const initializeNetwork = useNetworkStore((s) => s.initialize);
  const loadFlags = useFeatureFlagStore((s) => s.loadFlags);

  useEffect(() => {
    async function bootstrap() {
      try {
        // 1. Initialize auth (creates guest on first launch)
        await initializeAuth();

        // 2. Load profile from SQLite
        await loadProfile();

        // 3. Load feature flags
        await loadFlags();

        // 4. Start network monitoring & sync
        initializeNetwork();

        setIsReady(true);
        console.log('[App] Bootstrap complete');
      } catch (error) {
        console.error('[App] Bootstrap failed:', error);
        setIsReady(true); // Still show app to avoid permanent loading
      }
    }

    bootstrap();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashTitle}>GameHub</Text>
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        <Text style={styles.splashSubtitle}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="games/[gameId]"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="settings/index"
          options={{
            headerShown: true,
            title: 'Settings',
            headerStyle: { backgroundColor: Colors.surface },
            headerTintColor: Colors.textPrimary,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    fontSize: 40,
    color: Colors.textPrimary,
    fontWeight: '800',
    letterSpacing: -1,
  },
  loader: {
    marginTop: 24,
  },
  splashSubtitle: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textMuted,
  },
});
