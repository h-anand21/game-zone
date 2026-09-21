// ============================================================
// GameHub — Game Engine Barrel Export
// ============================================================

export { GameEngine } from './GameEngine';
export type { IGame } from './GameEngine';
export { validateScore, generateEventId, createScoreRecord } from './ScoreManager';
export { DifficultyManager } from './DifficultyManager';
export type { DifficultyLevel, DifficultyParams } from './DifficultyManager';
export { GameSession } from './GameSession';
export { GameState, GameStateMachine } from './GameState';
export type { StateChangeListener } from './GameState';
export type { IGameLifecycle, GameResult, GameConfig } from './GameLifecycle';
export { ResultManager } from './ResultManager';
export type { ResultScreenData } from './ResultManager';
export { GameStorage } from './GameStorage';
