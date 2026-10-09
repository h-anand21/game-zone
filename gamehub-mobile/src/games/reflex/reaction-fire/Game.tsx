// ============================================================
// GameHub — Reaction Fire Component Adapter
// Integrates the 12-screen Reaction Fire master arcade game into
// the GameHub ecosystem & native registry.
// ============================================================

import React from 'react';
import type { GameEngine } from '../../engine/GameEngine';
import { ReactionFireMasterGame } from './ReactionFireMasterGame';

interface ReactionFireProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const ReactionFireGame: React.FC<ReactionFireProps> = ({ onFinish }) => {
  return (
    <ReactionFireMasterGame
      onExit={() => {
        onFinish?.(0, false);
      }}
    />
  );
};

export default ReactionFireGame;
