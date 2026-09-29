// ============================================================
// GameHub — Dedicated Mind Lock Route
// ============================================================

import React from 'react';
import { useRouter } from 'expo-router';
import { MindLockApp } from '@/games/brain/mind-lock/MindLockApp';

export default function MindLockScreenRoute() {
  const router = useRouter();

  return (
    <MindLockApp
      onExit={() => router.back()}
    />
  );
}
