// ============================================================
// GameHub — Find One Master Game Adapter
// ============================================================

import React from 'react';
import type { GameEngine } from '../../engine/GameEngine';
import { FindOneApp } from './FindOneApp';

interface FindOneProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const FindOneGame: React.FC<FindOneProps> = ({ onFinish }) => {
  return <FindOneApp onFinishGame={onFinish} />;
};

export default FindOneGame;
