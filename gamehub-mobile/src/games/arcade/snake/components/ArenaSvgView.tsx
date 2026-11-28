// ============================================================
// Worms Zone 3D Arena — 60fps Viewport-Culled 3D SVG Renderer
// Draws arena floor grid, hazard wall, gourmet 3D food sprites,
// luminous slain-worm loot auras, overlapping spherical worm skins,
// tracking cartoon eyes, heading chevron & floating gain callouts.
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
  Rect,
  G,
  Ellipse,
  Polygon,
  Line,
  Text as SvgText,
} from 'react-native-svg';
import { WORM_SKINS } from '../skins';
import { FoodGlyphNode, SharedFoodDefs } from './FoodSprites';
import type { ArenaState, WormEntity } from '../types';

interface ArenaSvgViewProps {
  state: ArenaState;
  width: number;
  height: number;
  cameraZoom: number;
}

const FLOOR_GRID_STEP = 140;

export const ArenaSvgView: React.FC<ArenaSvgViewProps> = ({
  state,
  width,
  height,
  cameraZoom,
}) => {
  const playerHead = state.player.segments[0] || { x: 0, y: 0 };
  const camX = playerHead.x;
  const camY = playerHead.y;

  const worldLeft = camX - width / (2 * cameraZoom) - 65;
  const worldRight = camX + width / (2 * cameraZoom) + 65;
  const worldTop = camY - height / (2 * cameraZoom) + 65;
  const worldBottom = camY + height / (2 * cameraZoom) + 65;
  const viewTopBound = camY - height / (2 * cameraZoom) - 65;

  const isVisible = (x: number, y: number, margin = 0) =>
    x >= worldLeft - margin &&
    x <= worldRight + margin &&
    y >= viewTopBound - margin &&
    y <= worldBottom + margin;

  // Floor subtle coordinate dots & faint arena lines anchored to world coordinates
  const firstGridX = Math.floor(worldLeft / FLOOR_GRID_STEP) * FLOOR_GRID_STEP;
  const firstGridY = Math.floor(viewTopBound / FLOOR_GRID_STEP) * FLOOR_GRID_STEP;
  const gridLinesX: number[] = [];
  const gridLinesY: number[] = [];
  for (let gx = firstGridX; gx <= worldRight; gx += FLOOR_GRID_STEP) gridLinesX.push(gx);
  for (let gy = firstGridY; gy <= worldBottom; gy += FLOOR_GRID_STEP) gridLinesY.push(gy);

  // Visible foods (strict frustum culled)
  const visibleFoods = state.foods.filter((f) => isVisible(f.x, f.y, 30));

  // Order living worms so player renders crisp above/overlapping bots properly
  const wormsToRender: WormEntity[] = [
    ...state.bots.filter(
      (b) => b.alive && b.segments.some((s) => isVisible(s.x, s.y, b.radius + 20))
    ),
    ...(state.player.alive ? [state.player] : []),
  ];

  // Suppress unused local variable warning cleanly
  void worldTop;

  const translateWorldToScreen = `translate(${(width / 2).toFixed(1)}, ${(height / 2).toFixed(
    1
  )}) scale(${cameraZoom.toFixed(3)}) translate(${(-camX).toFixed(1)}, ${(-camY).toFixed(1)})`;

  return (
    <View style={[styles.wrap, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height}>
        <SharedFoodDefs />
        <Defs>
          <SvgLinearGradient id="wz-arena-floor" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#1D5EA8" />
            <Stop offset="55%" stopColor="#164B8B" />
            <Stop offset="100%" stopColor="#0E3668" />
          </SvgLinearGradient>

          {Object.values(WORM_SKINS).map((skin) => (
            <RadialGradient key={skin.id} id={`wz-skin-${skin.id}`} cx="35%" cy="28%" r="72%">
              <Stop offset="0%" stopColor={skin.highlight} />
              <Stop offset="48%" stopColor={skin.primary} />
              <Stop offset="100%" stopColor={skin.shadow} />
            </RadialGradient>
          ))}
        </Defs>

        {/* Deep Blue Arena Floor Backdrop */}
        <Rect x={0} y={0} width={width} height={height} fill="url(#wz-arena-floor)" />

        <G transform={translateWorldToScreen}>
          {/* Subtle Geometric Arena Grid Lines & Floor Speckles */}
          {gridLinesX.map((gx) => (
            <Line
              key={`gx-${gx}`}
              x1={gx}
              y1={viewTopBound}
              x2={gx}
              y2={worldBottom}
              stroke="rgba(255, 255, 255, 0.045)"
              strokeWidth={1.5}
            />
          ))}
          {gridLinesY.map((gy) => (
            <Line
              key={`gy-${gy}`}
              x1={worldLeft}
              y1={gy}
              x2={worldRight}
              y2={gy}
              stroke="rgba(255, 255, 255, 0.045)"
              strokeWidth={1.5}
            />
          ))}
          {gridLinesX.map((gx) =>
            gridLinesY.map((gy) => (
              <Circle
                key={`sp-${gx}-${gy}`}
                cx={gx + FLOOR_GRID_STEP * 0.5}
                cy={gy + FLOOR_GRID_STEP * 0.5}
                r={3}
                fill="rgba(255, 255, 255, 0.06)"
              />
            ))
          )}

          {/* Outer Arena Danger Boundary Ring */}
          <Circle
            cx={0}
            cy={0}
            r={state.arenaRadius}
            fill="none"
            stroke="#EF4444"
            strokeWidth={18}
            opacity={0.75}
          />
          <Circle
            cx={0}
            cy={0}
            r={state.arenaRadius + 14}
            fill="none"
            stroke="#7F1D1D"
            strokeWidth={14}
            opacity={0.85}
          />

          {/* Magnet Field Ring Indicator */}
          {state.boosters.magnetMs > 0 && state.player.alive && (
            <Circle
              cx={playerHead.x}
              cy={playerHead.y}
              r={260}
              fill="rgba(56, 189, 248, 0.07)"
              stroke="#7DD3FC"
              strokeWidth={2.5}
              strokeDasharray="10,10"
              opacity={0.65}
            />
          )}

          {/* 3D Food & Luminous Fallen Worm Loot Items */}
          {visibleFoods.map((food) => (
            <FoodGlyphNode
              key={food.id}
              kind={food.kind}
              x={food.x}
              y={food.y}
              scale={food.scale}
              isLootDrop={food.isLootDrop}
            />
          ))}

          {/* 3D Volumetric Segmented Worms */}
          {wormsToRender.map((worm) => {
            const skin = WORM_SKINS[worm.skinId] || WORM_SKINS.violet;
            const head = worm.segments[0];
            if (!head) return null;

            const isPlayerBoosting =
              worm.isPlayer && (worm.isBoosting || state.boosters.turboMs > 0);
            const cosA = Math.cos(worm.angle);
            const sinA = Math.sin(worm.angle);
            const perpX = -sinA;
            const perpY = cosA;

            const eyeForward = worm.radius * 0.38;
            const eyeSpread = worm.radius * 0.36;
            const eyeRadius = Math.max(4, worm.radius * 0.28);
            const pupilRadius = eyeRadius * 0.54;
            const pupilShift = eyeRadius * 0.28;

            const leftEyeX = head.x + cosA * eyeForward + perpX * eyeSpread;
            const leftEyeY = head.y + sinA * eyeForward + perpY * eyeSpread;
            const rightEyeX = head.x + cosA * eyeForward - perpX * eyeSpread;
            const rightEyeY = head.y + sinA * eyeForward - perpY * eyeSpread;

            const mouthOpen =
              state.elapsedMs < worm.isEatingUntil || worm.isBoosting || isPlayerBoosting;
            const mouthX = head.x + cosA * worm.radius * 0.68;
            const mouthY = head.y + sinA * worm.radius * 0.68;

            // Draw segments tail-to-head so front spheres overlap smoothly in 3D
            const visibleSegIndices: number[] = [];
            for (let i = worm.segments.length - 1; i >= 0; i--) {
              const seg = worm.segments[i];
              if (isVisible(seg.x, seg.y, worm.radius + 16)) {
                visibleSegIndices.push(i);
              }
            }

            return (
              <G key={worm.id}>
                {/* Soft 3D Ground Drop Shadow Layer */}
                {visibleSegIndices.map((idx) => {
                  const seg = worm.segments[idx];
                  const taper =
                    idx > worm.segments.length - 6
                      ? 0.55 + ((worm.segments.length - idx) / 6) * 0.45
                      : 1;
                  return (
                    <Circle
                      key={`sh-${idx}`}
                      cx={seg.x + 3}
                      cy={seg.y + 6}
                      r={worm.radius * taper}
                      fill="rgba(5, 16, 36, 0.34)"
                    />
                  );
                })}

                {/* Glowing Turbo / Sprint Boost Aura */}
                {(worm.isBoosting || isPlayerBoosting) &&
                  visibleSegIndices
                    .filter((idx) => idx % 2 === 0)
                    .map((idx) => {
                      const seg = worm.segments[idx];
                      return (
                        <Circle
                          key={`aura-${idx}`}
                          cx={seg.x}
                          cy={seg.y}
                          r={worm.radius * 1.28}
                          fill={isPlayerBoosting ? 'rgba(250, 204, 21, 0.25)' : 'rgba(147, 197, 253, 0.22)'}
                        />
                      );
                    })}

                {/* Overlapping 3D Spherical Body Segments */}
                {visibleSegIndices.map((idx) => {
                  const seg = worm.segments[idx];
                  const taper =
                    idx > worm.segments.length - 6
                      ? 0.55 + ((worm.segments.length - idx) / 6) * 0.45
                      : 1;
                  const segR = worm.radius * taper;
                  const isStripe = idx > 0 && idx % skin.stripeEvery === 0;

                  return (
                    <G key={`seg-${idx}`}>
                      <Circle
                        cx={seg.x}
                        cy={seg.y}
                        r={segR}
                        fill={isStripe ? skin.stripeColor : `url(#wz-skin-${skin.id})`}
                        stroke={skin.shadow}
                        strokeWidth={0.8}
                      />
                      {/* Specular crescent highlight on ribbed/striped segments */}
                      <Ellipse
                        cx={seg.x - segR * 0.28}
                        cy={seg.y - segR * 0.32}
                        rx={segR * 0.38}
                        ry={segR * 0.18}
                        fill="rgba(255, 255, 255, 0.28)"
                      />
                    </G>
                  );
                })}

                {/* Expressive 3D Cartoon Head (Mouth + Tracking Dual Eyes) */}
                <Ellipse
                  cx={mouthX}
                  cy={mouthY}
                  rx={worm.radius * (mouthOpen ? 0.32 : 0.22)}
                  ry={worm.radius * (mouthOpen ? 0.24 : 0.12)}
                  transform={`rotate(${((worm.angle * 180) / Math.PI).toFixed(1)} ${mouthX.toFixed(
                    1
                  )} ${mouthY.toFixed(1)})`}
                  fill={skin.mouthColor}
                  stroke="#450A0A"
                  strokeWidth={1}
                />

                {/* Dual Cartoon Sclera + Directional Pupils */}
                <Circle
                  cx={leftEyeX}
                  cy={leftEyeY}
                  r={eyeRadius}
                  fill="#FFFFFF"
                  stroke="#0F172A"
                  strokeWidth={1}
                />
                <Circle
                  cx={rightEyeX}
                  cy={rightEyeY}
                  r={eyeRadius}
                  fill="#FFFFFF"
                  stroke="#0F172A"
                  strokeWidth={1}
                />
                <Circle
                  cx={leftEyeX + cosA * pupilShift}
                  cy={leftEyeY + sinA * pupilShift}
                  r={pupilRadius}
                  fill="#0F172A"
                />
                <Circle
                  cx={rightEyeX + cosA * pupilShift}
                  cy={rightEyeY + sinA * pupilShift}
                  r={pupilRadius}
                  fill="#0F172A"
                />
                <Circle
                  cx={leftEyeX + cosA * pupilShift - pupilRadius * 0.3}
                  cy={leftEyeY + sinA * pupilShift - pupilRadius * 0.35}
                  r={pupilRadius * 0.32}
                  fill="#FFFFFF"
                />
                <Circle
                  cx={rightEyeX + cosA * pupilShift - pupilRadius * 0.3}
                  cy={rightEyeY + sinA * pupilShift - pupilRadius * 0.35}
                  r={pupilRadius * 0.32}
                  fill="#FFFFFF"
                />

                {/* Player Heading Orange Chevron Indicator (like Screenshots 1, 3, 5) */}
                {worm.isPlayer && (
                  <Polygon
                    points={`${(head.x + cosA * (worm.radius + 26)).toFixed(1)},${(
                      head.y +
                      sinA * (worm.radius + 26)
                    ).toFixed(1)} ${(head.x + cosA * (worm.radius + 14) + perpX * 8).toFixed(1)},${(
                      head.y +
                      sinA * (worm.radius + 14) +
                      perpY * 8
                    ).toFixed(1)} ${(head.x + cosA * (worm.radius + 14) - perpX * 8).toFixed(1)},${(
                      head.y +
                      sinA * (worm.radius + 14) -
                      perpY * 8
                    ).toFixed(1)}`}
                    fill="#F59E0B"
                    stroke="#78350F"
                    strokeWidth={1.2}
                    opacity={0.9}
                  />
                )}

                {/* Rival Bot Name Tag */}
                {!worm.isPlayer && (
                  <SvgText
                    x={head.x}
                    y={head.y - worm.radius - 8}
                    fill="#E2E8F0"
                    stroke="#0F172A"
                    strokeWidth={2}
                    fontSize={11}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {worm.name}
                  </SvgText>
                )}
              </G>
            );
          })}

          {/* Floating "+12 / +120 / +1000 KO!" Popups */}
          {state.popups.map((p) => {
            const t = p.ageMs / 750;
            const yOffset = -t * 36;
            const alpha = Math.max(0, 1 - t);
            return (
              <SvgText
                key={p.id}
                x={p.x}
                y={p.y + yOffset}
                fill={p.color}
                stroke="#0B192C"
                strokeWidth={3}
                fontSize={16}
                fontWeight="900"
                textAnchor="middle"
                opacity={alpha}
              >
                {p.text}
              </SvgText>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#123C73',
  },
});
