// ============================================================
// GameHub — Stack Master Pure Logic
// ============================================================

const BLOCK_COLORS = ['#6C5CE7', '#FF6B6B', '#00D2A0', '#FDCB6E', '#A29BFE', '#FF8E8E'];

export function getBlockColor(index: number): string {
  return BLOCK_COLORS[index % BLOCK_COLORS.length];
}
