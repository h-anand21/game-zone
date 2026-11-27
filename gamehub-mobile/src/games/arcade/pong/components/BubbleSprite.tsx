// ============================================================
// Woodland Bubble Shooter — Glossy Crystal & Wood-Themed Orbs
// Renders nature-emblem color bubbles, trapped fireflies, spiked
// iron stones, and Fireball / Lightning / Rainbow power orbs.
// ============================================================

import React, { useId } from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Circle,
  Path,
  Polygon,
  G,
  Ellipse,
} from 'react-native-svg';
import { BUBBLE_COLOR_THEMES } from './woodTheme';
import type { BubbleColor, BubbleKind } from '../types';

interface BubbleSpriteProps {
  size: number;
  color: BubbleColor;
  kind?: BubbleKind;
  hasFirefly?: boolean;
  isHighlighted?: boolean;
}

/**
 * Renders color-specific botanical/nature inner crystal emblem for crisp clarity
 */
const InnerNatureEmblem: React.FC<{ color: BubbleColor }> = ({ color }) => {
  switch (color) {
    case 'red':
      // Twin Cherry emblem
      return (
        <G opacity={0.42}>
          <Circle cx="11.2" cy="16.4" r="3" fill="#7F1D1D" />
          <Circle cx="16.8" cy="17.2" r="3" fill="#7F1D1D" />
          <Path d="M11.6 13.6Q14.5 9.2 17.5 11M16.5 14.3Q15.4 10.6 14.5 9.6" stroke="#7F1D1D" strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </G>
      );
    case 'green':
      // Forest Leaf emblem
      return (
        <G opacity={0.40}>
          <Path
            d="M8.5 17.5C8.5 11.8 13.5 9.2 19 9.2C19 14.5 15.8 19.2 9.8 19.2Z"
            fill="#14532D"
          />
          <Path d="M9.5 18.2L16.5 11.4" stroke="#DCFCE7" strokeWidth={1.1} strokeLinecap="round" />
        </G>
      );
    case 'blue':
      // Sky Butterfly emblem
      return (
        <G opacity={0.40}>
          <Path
            d="M13.6 14C10.5 9.8 7 10.5 7.4 13.6C7.7 15.8 10.8 16.5 13.6 14.6C16.4 16.5 19.5 15.8 19.8 13.6C20.2 10.5 16.7 9.8 13.6 14Z"
            fill="#1E3A8A"
          />
          <Path d="M13.6 11.4V18.2" stroke="#1E3A8A" strokeWidth={1.6} strokeLinecap="round" />
        </G>
      );
    case 'gold':
      // Honey Sunburst emblem
      return (
        <G opacity={0.40}>
          <Polygon
            points="14,7.5 15.7,11.6 20,12 16.8,14.8 17.8,19 14,16.7 10.2,19 11.2,14.8 8,12 12.3,11.6"
            fill="#78350F"
          />
        </G>
      );
    case 'teal':
      // Woodland Clover emblem
      return (
        <G opacity={0.40}>
          <Circle cx="14" cy="10.4" r="2.6" fill="#134E4A" />
          <Circle cx="10.8" cy="14.2" r="2.6" fill="#134E4A" />
          <Circle cx="17.2" cy="14.2" r="2.6" fill="#134E4A" />
          <Path d="M14 14.8V19.6" stroke="#134E4A" strokeWidth={1.6} strokeLinecap="round" />
        </G>
      );
    case 'orange':
    default:
      // Citrus Ring emblem
      return (
        <G opacity={0.40}>
          <Circle cx="14" cy="14" r="4.6" stroke="#7C2D12" strokeWidth={1.7} fill="none" />
          <Circle cx="14" cy="14" r="1.5" fill="#7C2D12" />
        </G>
      );
  }
};

export const BubbleSprite: React.FC<BubbleSpriteProps> = ({
  size,
  color,
  kind = 'normal',
  hasFirefly = false,
  isHighlighted = false,
}) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `orb-${uid}`;
  const theme = BUBBLE_COLOR_THEMES[color] || BUBBLE_COLOR_THEMES.red;

  if (size <= 0) return null;

  // 1. Iron Spiked Stone Blocker (Screenshot 5)
  if (kind === 'stone') {
    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 28 28">
          <Defs>
            <RadialGradient id={gradId} cx="35%" cy="30%" r="70%">
              <Stop offset="0%" stopColor="#E2E8F0" />
              <Stop offset="48%" stopColor="#64748B" />
              <Stop offset="100%" stopColor="#1E293B" />
            </RadialGradient>
          </Defs>
          {/* 8 Outer Iron Spikes */}
          <Polygon points="14,0.4 16,5 12,5" fill="#475569" stroke="#0F172A" strokeWidth={0.8} />
          <Polygon points="14,27.6 16,23 12,23" fill="#334155" stroke="#0F172A" strokeWidth={0.8} />
          <Polygon points="0.4,14 5,12 5,16" fill="#475569" stroke="#0F172A" strokeWidth={0.8} />
          <Polygon points="27.6,14 23,12 23,16" fill="#334155" stroke="#0F172A" strokeWidth={0.8} />
          <Polygon points="4.3,4.3 8.4,6.4 6.4,8.4" fill="#64748B" stroke="#0F172A" strokeWidth={0.8} />
          <Polygon points="23.7,4.3 19.6,6.4 21.6,8.4" fill="#475569" stroke="#0F172A" strokeWidth={0.8} />
          <Polygon points="4.3,23.7 8.4,21.6 6.4,19.6" fill="#475569" stroke="#0F172A" strokeWidth={0.8} />
          <Polygon points="23.7,23.7 19.6,21.6 21.6,19.6" fill="#1E293B" stroke="#0F172A" strokeWidth={0.8} />
          {/* Iron Sphere Core */}
          <Circle cx="14" cy="14" r="10" fill={`url(#${gradId})`} stroke="#0F172A" strokeWidth={1.4} />
          <Ellipse cx="11" cy="10.2" rx="3.2" ry="1.8" transform="rotate(-25 11 10.2)" fill="rgba(255,255,255,0.45)" />
        </Svg>
      </View>
    );
  }

  // 2. Fireball Bomb Orb (Screenshot 3)
  if (kind === 'fireball') {
    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 28 28">
          <Defs>
            <RadialGradient id={gradId} cx="42%" cy="38%" r="65%">
              <Stop offset="0%" stopColor="#FEF9C3" />
              <Stop offset="40%" stopColor="#FACC15" />
              <Stop offset="78%" stopColor="#EA580C" />
              <Stop offset="100%" stopColor="#9A3412" />
            </RadialGradient>
          </Defs>
          <Circle cx="14" cy="14" r="13" fill="rgba(249, 115, 22, 0.35)" />
          <Circle cx="14" cy="14" r="11.6" fill={`url(#${gradId})`} stroke="#7C2D12" strokeWidth={1.3} />
          {/* Molten Cracks */}
          <Path
            d="M8 10L13 13L11 19M19 8L14 14L20 17"
            stroke="#FFFBEB"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Ellipse cx="10.2" cy="8.6" rx="3.4" ry="1.8" transform="rotate(-28 10.2 8.6)" fill="rgba(255,255,255,0.65)" />
        </Svg>
      </View>
    );
  }

  // 3. Lightning Horizontal Blast Orb (Screenshot 5)
  if (kind === 'lightning') {
    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 28 28">
          <Defs>
            <RadialGradient id={gradId} cx="45%" cy="40%" r="68%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="45%" stopColor="#38BDF8" />
              <Stop offset="100%" stopColor="#075985" />
            </RadialGradient>
          </Defs>
          <Circle cx="14" cy="14" r="13" fill="rgba(56, 189, 248, 0.35)" />
          <Circle cx="14" cy="14" r="11.6" fill={`url(#${gradId})`} stroke="#0C4A6E" strokeWidth={1.3} />
          <Polygon
            points="15.2,6.2 9.4,14.6 13.8,14.6 12.6,21.8 18.6,13.2 14.2,13.2"
            fill="#FEF08A"
            stroke="#0C4A6E"
            strokeWidth={1}
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  }

  // 4. Rainbow Prism Wildcard Orb (No purple — warm Ruby/Gold/Emerald/Sky facets)
  if (kind === 'rainbow') {
    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 28 28">
          <Circle cx="14" cy="14" r="12.5" fill="#FFFBEB" stroke="#421F07" strokeWidth={1.4} />
          <Path d="M14 2.4A11.6 11.6 0 0 1 25.6 14H14V2.4Z" fill="#EF4444" />
          <Path d="M25.6 14A11.6 11.6 0 0 1 14 25.6V14H25.6Z" fill="#F59E0B" />
          <Path d="M14 25.6A11.6 11.6 0 0 1 2.4 14H14V25.6Z" fill="#22C55E" />
          <Path d="M2.4 14A11.6 11.6 0 0 1 14 2.4V14H2.4Z" fill="#2563EB" />
          <Circle cx="14" cy="14" r="5" fill="#FFFDF5" stroke="#421F07" strokeWidth={1.2} />
          <Polygon points="14,10.2 15.1,12.8 17.8,14 15.1,15.2 14,17.8 12.9,15.2 10.2,14 12.9,12.8" fill="#FACC15" />
          <Ellipse cx="9.8" cy="8" rx="3.4" ry="1.8" transform="rotate(-30 9.8 8)" fill="rgba(255,255,255,0.65)" />
        </Svg>
      </View>
    );
  }

  // 5. Standard Glossy Crystal Bubble (with optional Trapped Golden Firefly!)
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 28 28">
        <Defs>
          <RadialGradient id={gradId} cx="35%" cy="30%" r="72%">
            <Stop offset="0%" stopColor={theme.light} />
            <Stop offset="52%" stopColor={theme.primary} />
            <Stop offset="100%" stopColor={theme.dark} />
          </RadialGradient>
        </Defs>

        {isHighlighted && (
          <Circle
            cx="14"
            cy="14"
            r="13.4"
            fill="none"
            stroke="#FEF08A"
            strokeWidth={1.6}
          />
        )}

        {/* Base Crystal Sphere */}
        <Circle
          cx="14"
          cy="14"
          r="12.2"
          fill={`url(#${gradId})`}
          stroke={theme.dark}
          strokeWidth={1.1}
        />

        {/* Subtle Inner Translucent Emblem */}
        {!hasFirefly && <InnerNatureEmblem color={color} />}

        {/* Trapped Glowing Golden Forest Firefly inside Bubble */}
        {hasFirefly && (
          <G>
            <Circle cx="14" cy="14.5" r="7.4" fill="rgba(254, 249, 195, 0.25)" />
            <Path
              d="M13 13C9.6 9.5 6.8 10.8 7.2 13.6C7.5 15.5 10.6 15.2 13 14Z"
              fill="#FFFFFF"
              opacity={0.92}
              stroke="#421F07"
              strokeWidth={0.9}
            />
            <Path
              d="M15 13C18.4 9.5 21.2 10.8 20.8 13.6C20.5 15.5 17.4 15.2 15 14Z"
              fill="#FFFFFF"
              opacity={0.92}
              stroke="#421F07"
              strokeWidth={0.9}
            />
            <Circle cx="14" cy="16.2" r="3.4" fill="#FACC15" stroke="#421F07" strokeWidth={1.1} />
            <Circle cx="14" cy="11.8" r="2.2" fill="#78350F" stroke="#421F07" strokeWidth={1} />
            <Circle cx="13.3" cy="16.4" r="1.1" fill="#FEF9C3" />
          </G>
        )}

        {/* Crisp Specular Gloss Highlight (Top-Left) */}
        <Ellipse
          cx="9.8"
          cy="8.2"
          rx="3.9"
          ry="2"
          transform="rotate(-32 9.8 8.2)"
          fill="rgba(255, 255, 255, 0.72)"
        />
        <Circle cx="7.4" cy="11.2" r="1.1" fill="rgba(255, 255, 255, 0.52)" />
        {/* Bottom Subtle Rim Light */}
        <Path
          d="M8.5 22.4A9.2 9.2 0 0 0 19.5 22.4"
          stroke={theme.rim}
          strokeWidth={1.1}
          strokeLinecap="round"
          opacity={0.55}
          fill="none"
        />
      </Svg>
    </View>
  );
};
