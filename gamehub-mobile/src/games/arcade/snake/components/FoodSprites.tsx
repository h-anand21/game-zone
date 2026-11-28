// ============================================================
// Worms Zone 3D Arena — 3D Gourmet Food & Loot SVG Sprites
// Shared <Defs> radial/linear lighting + crisp food shapes matching
// Apple, Cherry, Cheese, Pumpkin, Sandwich, Cake, Corn, Kiwi & Coins.
// ============================================================

import React from 'react';
import {
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
  Circle,
  Ellipse,
  Path,
  Polygon,
  Rect,
} from 'react-native-svg';
import type { FoodKind } from '../types';

/**
 * Shared 3D spherical lighting & food gradients declared ONCE per arena SVG frame
 */
export const SharedFoodDefs: React.FC = () => (
  <Defs>
    {/* Icy blue-white electric energy aura beneath fallen worm loot */}
    <RadialGradient id="wz-loot-aura" cx="50%" cy="50%" r="50%">
      <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
      <Stop offset="45%" stopColor="#7DD3FC" stopOpacity="0.65" />
      <Stop offset="80%" stopColor="#3B82F6" stopOpacity="0.30" />
      <Stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
    </RadialGradient>

    {/* Green-Gold Apple 3D */}
    <RadialGradient id="wz-apple" cx="34%" cy="28%" r="72%">
      <Stop offset="0%" stopColor="#FEF9C3" />
      <Stop offset="45%" stopColor="#D9F99D" />
      <Stop offset="85%" stopColor="#84CC16" />
      <Stop offset="100%" stopColor="#4D7C0F" />
    </RadialGradient>

    {/* Ruby Cherry / Tomato 3D */}
    <RadialGradient id="wz-ruby" cx="35%" cy="28%" r="72%">
      <Stop offset="0%" stopColor="#FECACA" />
      <Stop offset="42%" stopColor="#EF4444" />
      <Stop offset="100%" stopColor="#7F1D1D" />
    </RadialGradient>

    {/* Swiss Cheese Golden 3D */}
    <SvgLinearGradient id="wz-cheese" x1="0" y1="0" x2="1" y2="1">
      <Stop offset="0%" stopColor="#FEF08A" />
      <Stop offset="55%" stopColor="#FACC15" />
      <Stop offset="100%" stopColor="#CA8A04" />
    </SvgLinearGradient>

    {/* Pumpkin 3D */}
    <RadialGradient id="wz-pumpkin" cx="38%" cy="32%" r="70%">
      <Stop offset="0%" stopColor="#FDBA74" />
      <Stop offset="52%" stopColor="#F97316" />
      <Stop offset="100%" stopColor="#9A3412" />
    </RadialGradient>

    {/* Corn Golden 3D */}
    <SvgLinearGradient id="wz-corn" x1="0" y1="0" x2="1" y2="1">
      <Stop offset="0%" stopColor="#FEF9C3" />
      <Stop offset="55%" stopColor="#FACC15" />
      <Stop offset="100%" stopColor="#B45309" />
    </SvgLinearGradient>

    {/* Gold Smiley Coin 3D */}
    <RadialGradient id="wz-coin" cx="35%" cy="30%" r="70%">
      <Stop offset="0%" stopColor="#FEF9C3" />
      <Stop offset="50%" stopColor="#FACC15" />
      <Stop offset="100%" stopColor="#B45309" />
    </RadialGradient>

    {/* Mushroom Cap 3D */}
    <RadialGradient id="wz-mushroom" cx="35%" cy="30%" r="70%">
      <Stop offset="0%" stopColor="#FDBA74" />
      <Stop offset="50%" stopColor="#B45309" />
      <Stop offset="100%" stopColor="#451A03" />
    </RadialGradient>
  </Defs>
);

interface FoodGlyphProps {
  kind: FoodKind;
  x: number;
  y: number;
  scale: number;
  isLootDrop?: boolean;
}

/**
 * Lightweight viewport-ready SVG <G> node rendering 3D gourmet food at world/screen coordinates
 */
export const FoodGlyphNode: React.FC<FoodGlyphProps> = ({
  kind,
  x,
  y,
  scale,
  isLootDrop = false,
}) => {
  const s = scale * 1.15;

  return (
    <G transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)}) scale(${s.toFixed(2)})`}>
      {/* Glowing blue-white energy field under slain worm food */}
      {isLootDrop && <Circle cx={0} cy={0} r={24} fill="url(#wz-loot-aura)" />}

      {/* Soft 3D ground drop shadow */}
      <Ellipse cx={1.5} cy={7.5} rx={10} ry={5.5} fill="rgba(7, 19, 38, 0.38)" />

      {kind === 'coin' && (
        <G>
          <Circle cx={0} cy={1.5} r={12} fill="#92400E" />
          <Circle cx={0} cy={0} r={11.5} fill="url(#wz-coin)" stroke="#78350F" strokeWidth={1.2} />
          <Circle cx={0} cy={0} r={8.4} fill="none" stroke="#B45309" strokeWidth={1} />
          <Circle cx={-3} cy={-2} r={1.6} fill="#FEF9C3" stroke="#78350F" strokeWidth={0.8} />
          <Circle cx={3} cy={-2} r={1.6} fill="#FEF9C3" stroke="#78350F" strokeWidth={0.8} />
          <Path d="M-3.5 3.2Q0 6.2 3.5 3.2" stroke="#78350F" strokeWidth={1.4} strokeLinecap="round" fill="none" />
        </G>
      )}

      {kind === 'apple' && (
        <G>
          <Circle cx={0} cy={0.5} r={11} fill="url(#wz-apple)" stroke="#3F6212" strokeWidth={0.9} />
          <Ellipse cx={-3.5} cy={-4} rx={3.5} ry={1.8} transform="rotate(-30 -3.5 -4)" fill="rgba(255,255,255,0.65)" />
          <Path d="M0 -8.5Q1.5 -14 4 -13.5" stroke="#78350F" strokeWidth={2} strokeLinecap="round" fill="none" />
          <Path d="M1 -11C4.5 -13.5 7.5 -11.5 6.5 -9.2C4.5 -8.2 2 -9.5 1 -11Z" fill="#22C55E" />
        </G>
      )}

      {kind === 'cherry' && (
        <G>
          <Path d="M-4 -2Q1 -11 2.5 -13M5 0Q3 -10 2.5 -13" stroke="#65A30D" strokeWidth={1.6} strokeLinecap="round" fill="none" />
          <Circle cx={-4.8} cy={2.5} r={6.2} fill="url(#wz-ruby)" stroke="#7F1D1D" strokeWidth={0.7} />
          <Circle cx={5.2} cy={4} r={6.2} fill="url(#wz-ruby)" stroke="#7F1D1D" strokeWidth={0.7} />
          <Circle cx={-6.4} cy={0.4} r={1.6} fill="rgba(255,255,255,0.65)" />
          <Circle cx={3.5} cy={1.8} r={1.6} fill="rgba(255,255,255,0.65)" />
        </G>
      )}

      {kind === 'tomato' && (
        <G>
          <Circle cx={0} cy={1} r={11.2} fill="url(#wz-ruby)" stroke="#7F1D1D" strokeWidth={0.9} />
          <Ellipse cx={-3.8} cy={-3.4} rx={3.6} ry={1.8} transform="rotate(-25 -3.8 -3.4)" fill="rgba(255,255,255,0.62)" />
          <Polygon points="0,-12 2.5,-7 7,-8.5 2,-5 3,-1 0,-4 -3,-1 -2,-5 -7,-8.5 -2.5,-7" fill="#16A34A" />
        </G>
      )}

      {kind === 'cheese' && (
        <G>
          <Polygon points="-11,6 10,8 12,-2 -2,-10" fill="url(#wz-cheese)" stroke="#A16207" strokeWidth={0.9} />
          <Polygon points="-11,6 10,8 10,12 -11,10" fill="#CA8A04" stroke="#854D0E" strokeWidth={0.8} />
          <Circle cx={-2} cy={0.5} r={2.2} fill="#B45309" opacity={0.75} />
          <Circle cx={4.5} cy={3} r={1.7} fill="#B45309" opacity={0.75} />
          <Circle cx={2} cy={-4} r={1.4} fill="#B45309" opacity={0.75} />
        </G>
      )}

      {kind === 'pumpkin' && (
        <G>
          <Ellipse cx={-4.5} cy={1} rx={6} ry={9.5} fill="#EA580C" stroke="#7C2D12" strokeWidth={0.7} />
          <Ellipse cx={4.5} cy={1} rx={6} ry={9.5} fill="#EA580C" stroke="#7C2D12" strokeWidth={0.7} />
          <Ellipse cx={0} cy={1} rx={6.2} ry={10.2} fill="url(#wz-pumpkin)" stroke="#9A3412" strokeWidth={0.8} />
          <Path d="M-1 -8.5Q0 -13 3 -12" stroke="#15803D" strokeWidth={2.4} strokeLinecap="round" fill="none" />
        </G>
      )}

      {kind === 'corn' && (
        <G transform="rotate(-28)">
          <Ellipse cx={0} cy={0} rx={5.6} ry={10.8} fill="url(#wz-corn)" stroke="#A16207" strokeWidth={0.8} />
          <Path d="M-5.5 2Q-7 10 0 11.5Q7 10 5.5 2Q1 7 -5.5 2Z" fill="#22C55E" stroke="#14532D" strokeWidth={0.8} />
          <Circle cx={-1.5} cy={-4} r={1.1} fill="#FEF9C3" />
          <Circle cx={1.8} cy={-2} r={1.1} fill="#FEF9C3" />
          <Circle cx={-1.2} cy={1} r={1.1} fill="#FEF9C3" />
        </G>
      )}

      {kind === 'broccoli' && (
        <G>
          <Rect x={-2.5} y={2} width={5} height={8} rx={1.5} fill="#4D7C0F" />
          <Circle cx={-4.8} cy={-1.5} r={5.4} fill="#16A34A" />
          <Circle cx={4.8} cy={-1.5} r={5.4} fill="#15803D" />
          <Circle cx={0} cy={-5.2} r={6} fill="#22C55E" />
          <Circle cx={-1.5} cy={-6.5} r={2} fill="#86EFAC" opacity={0.55} />
        </G>
      )}

      {kind === 'mushroom' && (
        <G>
          <Rect x={-3.6} y={0} width={7.2} height={9.5} rx={3} fill="#FEF3C7" stroke="#78350F" strokeWidth={0.8} />
          <Path d="M-10.5 2C-10.5 -6 -5.5 -10 0 -10C5.5 -10 10.5 -6 10.5 2Z" fill="url(#wz-mushroom)" stroke="#451A03" strokeWidth={0.9} />
          <Circle cx={-3.5} cy={-4.5} r={1.6} fill="#FEF3C7" opacity={0.75} />
          <Circle cx={4} cy={-3} r={1.2} fill="#FEF3C7" opacity={0.75} />
        </G>
      )}

      {kind === 'kiwi' && (
        <G>
          <Circle cx={0} cy={0} r={10.2} fill="#84CC16" stroke="#713F12" strokeWidth={2.2} />
          <Circle cx={0} cy={0} r={4.2} fill="#ECFCCB" />
          <Circle cx={-4.8} cy={-2} r={0.9} fill="#1E293B" />
          <Circle cx={4.8} cy={2} r={0.9} fill="#1E293B" />
          <Circle cx={-2} cy={4.8} r={0.9} fill="#1E293B" />
          <Circle cx={2} cy={-4.8} r={0.9} fill="#1E293B" />
        </G>
      )}

      {kind === 'cake' && (
        <G>
          <Polygon points="-11,7 11,7 11,-1 -11,-1" fill="#FDE68A" stroke="#9A3412" strokeWidth={0.9} />
          <Rect x={-11} y={1.5} width={22} height={2.5} fill="#EF4444" />
          <Polygon points="-11,-1 11,-1 0,-10" fill="#FFFDF7" stroke="#CBD5E1" strokeWidth={0.8} />
          <Circle cx={0} cy={-7.5} r={3.6} fill="url(#wz-ruby)" />
        </G>
      )}

      {kind === 'sandwich' && (
        <G>
          <Polygon points="-11,5 0,10 11,5 0,-3" fill="#D97706" stroke="#78350F" strokeWidth={0.9} />
          <Polygon points="-10,2 0,7 10,2 0,-5" fill="#22C55E" />
          <Polygon points="-10,0 0,5 10,0 0,-7" fill="#FACC15" />
          <Polygon points="-11,-2 0,3 11,-2 0,-10" fill="#FDBA74" stroke="#9A3412" strokeWidth={0.9} />
          <Circle cx={0} cy={-3.5} r={2.2} fill="#65A30D" />
        </G>
      )}
    </G>
  );
};
