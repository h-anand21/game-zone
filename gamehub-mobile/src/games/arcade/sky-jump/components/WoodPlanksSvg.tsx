// ============================================================
// Wood Screw: Nuts & Bolts Puzzle — SVG Wooden Board & Planks
// Renders the vertical wood wall backdrop, beveled oak backing plate,
// recessed dark holes, textured wooden planks, and Phillips screws
// ============================================================

import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { PLANK_PALETTES, WOOD_UI_COLORS } from '../colors';
import {
  BOARD_H,
  BOARD_W,
  HOLE_RADIUS,
  SCREW_RADIUS,
  type BoardHole,
  type ScrewItem,
  type WoodPlank,
} from '../types';

/**
 * Full-screen vertical wooden wall plank background matching the warm orange-cedar backdrop
 */
export const WallWoodBackground: React.FC = () => (
  <Svg
    width="100%"
    height="100%"
    viewBox="0 0 360 760"
    preserveAspectRatio="none"
    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
  >
    <Rect x="0" y="0" width="360" height="760" fill={WOOD_UI_COLORS.wallBg} />
    {[0, 60, 120, 180, 240, 300].map((x, idx) => (
      <G key={`plank-bg-${x}`}>
        <Rect
          x={x}
          y="0"
          width="60"
          height="760"
          fill={idx % 2 === 0 ? WOOD_UI_COLORS.wallPlankEven : WOOD_UI_COLORS.wallPlankOdd}
        />
        {/* Plank seam */}
        <Line x1={x} y1="0" x2={x} y2="760" stroke={WOOD_UI_COLORS.wallSeam} strokeWidth={2.2} />
        {/* Subtle vertical grain streaks */}
        <Path
          d={`M${x + 16} 0 Q${x + 21} 190 ${x + 15} 380 T${x + 18} 760`}
          stroke={WOOD_UI_COLORS.wallGrain}
          strokeWidth={1.6}
          fill="none"
        />
        <Path
          d={`M${x + 42} 0 Q${x + 37} 240 ${x + 44} 500 T${x + 40} 760`}
          stroke={WOOD_UI_COLORS.wallGrain}
          strokeWidth={1.2}
          fill="none"
        />
      </G>
    ))}
  </Svg>
);

interface WoodBoardSvgProps {
  width: number;
  height: number;
  holes: BoardHole[];
  planks: WoodPlank[];
  screws: ScrewItem[];
  selectedScrewHoleId: string | null;
  openValidHoleIds: Set<string>;
  screwdriverMode: boolean;
}

/**
 * Interactive SVG canvas containing the oak board, recessed holes, layered planks, and screws.
 */
export const WoodBoardSvg: React.FC<WoodBoardSvgProps> = ({
  width,
  height,
  holes,
  planks,
  screws,
  selectedScrewHoleId,
  openValidHoleIds,
  screwdriverMode,
}) => {
  // Sort planks back-to-front by layer (and render falling planks cleanly)
  const visiblePlanks = [...planks]
    .filter((p) => p.status !== 'cleared')
    .sort((a, b) => a.layer - b.layer);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}>
      <Defs>
        <SvgLinearGradient id="oakBoardGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={WOOD_UI_COLORS.boardTop} />
          <Stop offset="100%" stopColor={WOOD_UI_COLORS.boardBottom} />
        </SvgLinearGradient>
        <SvgLinearGradient id="screwGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={WOOD_UI_COLORS.screwTop} />
          <Stop offset="100%" stopColor={WOOD_UI_COLORS.screwBottom} />
        </SvgLinearGradient>
      </Defs>

      {/* Outer Drop Shadow under Oak Board */}
      <Rect
        x="8"
        y="14"
        width={BOARD_W - 16}
        height={BOARD_H - 18}
        rx="22"
        fill={WOOD_UI_COLORS.boardShadow}
        opacity={0.45}
      />

      {/* Light-Oak Wooden Backing Board */}
      <Rect
        x="6"
        y="6"
        width={BOARD_W - 12}
        height={BOARD_H - 16}
        rx="20"
        fill="url(#oakBoardGrad)"
        stroke={WOOD_UI_COLORS.boardBorder}
        strokeWidth={2.5}
      />

      {/* Top inner bevel rim */}
      <Path
        d={`M26 8.5 H${BOARD_W - 26}`}
        stroke={WOOD_UI_COLORS.boardBevelTop}
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.85}
      />

      {/* Fine vertical oak grain lines */}
      {[34, 68, 108, 146, 184, 224, 262, 290].map((gx) => (
        <Path
          key={`oak-grain-${gx}`}
          d={`M${gx} 14 Q${gx + 4} ${BOARD_H / 2} ${gx - 2} ${BOARD_H - 22}`}
          stroke={WOOD_UI_COLORS.boardGrain}
          strokeWidth={1.3}
          fill="none"
        />
      ))}

      {/* Dark Recessed Board Holes */}
      {holes.map((hole) => {
        const isTargetCandidate =
          selectedScrewHoleId !== null && openValidHoleIds.has(hole.id);

        return (
          <G key={`board-hole-${hole.id}`}>
            {/* Subtle glowing placement ring when a screw is selected and this hole is open */}
            {isTargetCandidate && (
              <Circle
                cx={hole.x}
                cy={hole.y}
                r={HOLE_RADIUS + 4.5}
                fill="rgba(118, 232, 30, 0.22)"
                stroke="#76E81E"
                strokeWidth={2}
              />
            )}
            {/* Light bottom rim highlight */}
            <Circle
              cx={hole.x}
              cy={hole.y + 1.4}
              r={HOLE_RADIUS}
              fill={WOOD_UI_COLORS.holeRimBottom}
              opacity={0.85}
            />
            {/* Deep recessed dark brown circle */}
            <Circle
              cx={hole.x}
              cy={hole.y}
              r={HOLE_RADIUS}
              fill={WOOD_UI_COLORS.holeFill}
              stroke={WOOD_UI_COLORS.holeOutline}
              strokeWidth={1.2}
            />
            {/* Inner upper-edge recessed shadow */}
            <Path
              d={`M${hole.x - HOLE_RADIUS * 0.72} ${hole.y - HOLE_RADIUS * 0.2} A${HOLE_RADIUS} ${HOLE_RADIUS} 0 0 1 ${hole.x + HOLE_RADIUS * 0.72} ${hole.y - HOLE_RADIUS * 0.2}`}
              stroke={WOOD_UI_COLORS.holeInnerShadow}
              strokeWidth={2.5}
              fill="none"
            />
          </G>
        );
      })}

      {/* Layered Colored Wood Planks */}
      {visiblePlanks.map((plank) => {
        const pal = PLANK_PALETTES[plank.color] || PLANK_PALETTES.green;
        const halfL = plank.length / 2;
        const halfT = plank.thickness / 2;
        const rx = halfT;

        return (
          <G
            key={plank.id}
            transform={`translate(${plank.x}, ${plank.y}) rotate(${plank.angle})`}
          >
            {/* Soft Drop Shadow underneath plank */}
            <Rect
              x={-halfL + 1}
              y={-halfT + 4.5}
              width={plank.length}
              height={plank.thickness}
              rx={rx}
              fill={pal.shadow}
            />

            {/* Main Plank Wood Base */}
            <Rect
              x={-halfL}
              y={-halfT}
              width={plank.length}
              height={plank.thickness}
              rx={rx}
              fill={pal.bottom}
              stroke={pal.outline}
              strokeWidth={2}
            />

            {/* Upper Lighter Wood Gradient Face */}
            <Rect
              x={-halfL + 1.5}
              y={-halfT + 1.5}
              width={plank.length - 3}
              height={plank.thickness - 5}
              rx={Math.max(4, rx - 2)}
              fill={pal.top}
            />

            {/* Crisp Top Bevel Highlight */}
            <Line
              x1={-halfL + rx}
              y1={-halfT + 3}
              x2={halfL - rx}
              y2={-halfT + 3}
              stroke={pal.bevel}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.75}
            />

            {/* Wood Grain Streaks along plank spine */}
            <Path
              d={`M${-halfL + rx * 0.8} -3 Q0 -6 ${halfL - rx * 0.8} -2`}
              stroke={pal.grain}
              strokeWidth={1.3}
              fill="none"
            />
            <Path
              d={`M${-halfL + rx * 0.9} 4 Q0 7 ${halfL - rx * 0.9} 3`}
              stroke={pal.grain}
              strokeWidth={1.2}
              fill="none"
            />

            {/* Drilled Holes along the plank (rotates/falls with the plank!) */}
            {plank.holes.map((ph) => (
              <G key={ph.id}>
                <Circle
                  cx={ph.localX}
                  cy={0}
                  r={HOLE_RADIUS - 0.5}
                  fill={WOOD_UI_COLORS.holeFill}
                  stroke={pal.outline}
                  strokeWidth={1.4}
                />
                <Circle
                  cx={ph.localX}
                  cy={-1.2}
                  r={HOLE_RADIUS - 2.6}
                  fill={WOOD_UI_COLORS.holeInnerShadow}
                  opacity={0.7}
                />
              </G>
            ))}
          </G>
        );
      })}

      {/* Phillips-Head Cream-Gold Wood Screws */}
      {screws.map((screw) => {
        const hole = holes.find((h) => h.id === screw.holeId);
        if (!hole) return null;

        const isSelected = selectedScrewHoleId === screw.holeId;
        const liftY = isSelected ? -5.5 : 0;
        const scale = isSelected ? 1.15 : 1;
        const spinDeg = isSelected ? 32 : 0;

        return (
          <G
            key={screw.id}
            transform={`translate(${hole.x}, ${hole.y + liftY}) scale(${scale})`}
          >
            {/* Selection / Screwdriver Target Halo */}
            {(isSelected || screwdriverMode) && (
              <Circle
                cx={0}
                cy={0}
                r={SCREW_RADIUS + 4.5}
                fill={
                  screwdriverMode
                    ? 'rgba(239, 68, 68, 0.25)'
                    : 'rgba(0, 212, 255, 0.28)'
                }
                stroke={screwdriverMode ? '#EF4444' : WOOD_UI_COLORS.screwSelectedGlow}
                strokeWidth={2}
              />
            )}

            {/* Screw drop shadow */}
            <Circle
              cx={0}
              cy={isSelected ? 6.5 : 2.5}
              r={SCREW_RADIUS}
              fill="rgba(36, 14, 4, 0.42)"
            />

            <G transform={`rotate(${spinDeg})`}>
              {/* Gold-Cream Metallic Head */}
              <Circle
                cx={0}
                cy={0}
                r={SCREW_RADIUS}
                fill="url(#screwGrad)"
                stroke={WOOD_UI_COLORS.screwRim}
                strokeWidth={1.8}
              />
              {/* Inner recessed ring */}
              <Circle
                cx={0}
                cy={0}
                r={SCREW_RADIUS - 2.3}
                fill="none"
                stroke={WOOD_UI_COLORS.screwInnerRing}
                strokeWidth={1}
                opacity={0.7}
              />
              {/* Phillips 'X' cross slot */}
              <Line
                x1={-4.4}
                y1={-4.4}
                x2={4.4}
                y2={4.4}
                stroke={WOOD_UI_COLORS.screwCross}
                strokeWidth={2.7}
                strokeLinecap="round"
              />
              <Line
                x1={4.4}
                y1={-4.4}
                x2={-4.4}
                y2={4.4}
                stroke={WOOD_UI_COLORS.screwCross}
                strokeWidth={2.7}
                strokeLinecap="round"
              />
              {/* Top-left specular dot */}
              <Circle cx={-4.2} cy={-5.2} r={1.6} fill="#FFFFFF" opacity={0.75} />
            </G>
          </G>
        );
      })}
    </Svg>
  );
};
