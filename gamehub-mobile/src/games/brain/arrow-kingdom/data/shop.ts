// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Shop Catalog
// ============================================================

export interface ShopItem {
  id: string;
  category: 'hints' | 'coins' | 'gems' | 'themes';
  title: string;
  description: string;
  icon: string;
  priceAmount: number;
  priceCurrency: 'coins' | 'gems' | 'free';
  rewardType: 'hints' | 'coins' | 'gems';
  rewardAmount: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  // Hint Packs
  {
    id: 'hints_pack_3',
    category: 'hints',
    title: '3x Magic Hints',
    description: 'Instant escape hints when stuck',
    icon: '💡',
    priceAmount: 80,
    priceCurrency: 'coins',
    rewardType: 'hints',
    rewardAmount: 3,
  },
  {
    id: 'hints_pack_10',
    category: 'hints',
    title: '10x Royal Hints',
    description: 'Generous divination stockpile',
    icon: '🔮',
    priceAmount: 220,
    priceCurrency: 'coins',
    rewardType: 'hints',
    rewardAmount: 10,
  },

  // Coin Bags (using Gems)
  {
    id: 'coins_pouch',
    category: 'coins',
    title: 'Pouch of Gold',
    description: '+300 Sparkling Gold Coins',
    icon: '💰',
    priceAmount: 10,
    priceCurrency: 'gems',
    rewardType: 'coins',
    rewardAmount: 300,
  },
  {
    id: 'coins_chest',
    category: 'coins',
    title: 'Treasure Chest',
    description: '+1000 Heavy Gold Coins',
    icon: '🪙',
    priceAmount: 30,
    priceCurrency: 'gems',
    rewardType: 'coins',
    rewardAmount: 1000,
  },

  // Free Daily Gift
  {
    id: 'daily_free_coins',
    category: 'coins',
    title: 'Daily Tribute',
    description: 'Free kingdom subsidy every 24h',
    icon: '🎁',
    priceAmount: 0,
    priceCurrency: 'free',
    rewardType: 'coins',
    rewardAmount: 100,
  },
];
