// ============================================================
// GameHub — Tic Tac Toe Types
// ============================================================

export type PlayerSymbol = 'X' | 'O';
export type BoardCell = PlayerSymbol | null;
export type Board = BoardCell[];

export type GameMode = 'ai' | 'pvp';
export type AIDifficulty = 'easy' | 'hard';
