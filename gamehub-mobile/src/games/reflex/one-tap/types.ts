// ============================================================
// GameHub — One Tap Types
// ============================================================

export interface OneTapState {
  indicatorPos: number; // 0 to 100%
  targetZoneStart: number;
  targetZoneEnd: number;
  score: number;
  attempts: number;
}
