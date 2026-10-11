// ============================================================
// STACK MASTER — Block Cosmetics Data
// Purely aesthetic collectible materials
// ============================================================

import type { BlockCosmetic } from '../types';

export const BLOCK_COSMETICS: BlockCosmetic[] = [
  {
    id: 'cyber-prism',
    name: 'Cyber Prism',
    rarity: 'Common',
    description: 'Crisp neon cyan with glowing sapphire side facets.',
    colors: ['#20D9FF', '#3289FF'],
    unlocked: true,
    unlockRequirement: 'Starter cosmetic',
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    rarity: 'Common',
    description: 'Molten sunbeam gradient with warm citrus sheen.',
    colors: ['#FFD34E', '#FF932F'],
    unlocked: true,
    unlockRequirement: 'Starter cosmetic',
  },
  {
    id: 'astral-violet',
    name: 'Astral Violet',
    rarity: 'Rare',
    description: 'Deep cosmic purple infused with stardust particles.',
    colors: ['#C084FC', '#9165FF'],
    unlocked: false,
    unlockRequirement: 'Reach Height 15',
  },
  {
    id: 'glacial-mint',
    name: 'Glacial Mint',
    rarity: 'Rare',
    description: 'Crystalline turquoise reminiscent of arctic sea ice.',
    colors: ['#54E6AB', '#20D9FF'],
    unlocked: false,
    unlockRequirement: 'Reach Height 25',
  },
  {
    id: 'crimson-ruby',
    name: 'Crimson Ruby',
    rarity: 'Epic',
    description: 'Polished gemstone block with fiery internal facets.',
    colors: ['#FF48C8', '#F43F5E'],
    unlocked: false,
    unlockRequirement: 'Achieve 7 Perfect Combo',
  },
  {
    id: 'sovereign-gold',
    name: 'Sovereign Gold',
    rarity: 'Legendary',
    description: 'Heavy imperial bullion stamped with royal crests.',
    colors: ['#FFF0A6', '#FFD34E'],
    unlocked: false,
    unlockRequirement: 'Reach Height 50',
  },
];
