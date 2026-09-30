// ============================================================
// Find One — Pure Game Logic & Content Database
// ============================================================

import type {
  CategoryType,
  CategoryInfo,
  CharacterPair,
  GridSize,
  RoundData,
  TileItem,
} from './types';

export const CATEGORIES_DATA: CategoryInfo[] = [
  { id: 'animals', name: 'Animals', icon: '🐼', color: '#3BE35A', unlocked: true, description: 'Pandas, Foxes, Bears, Koalas, Ducks & more', pairsCount: 5 },
  { id: 'clothes', name: 'Clothes', icon: '👕', color: '#2488FF', unlocked: true, description: 'Hoodies, Coats, Sneakers, Caps & more', pairsCount: 4 },
  { id: 'food', name: 'Food', icon: '🍔', color: '#FF9F1A', unlocked: true, description: 'Donuts, Burgers, Pizzas, Tacos & more', pairsCount: 4 },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗', color: '#FF4B4B', unlocked: true, description: 'Cars, Trucks, Planes, Rockets & more', pairsCount: 4 },
  { id: 'characters', name: 'Characters', icon: '🧢', color: '#8A4BFF', unlocked: true, description: 'Ninjas, Wizards, Pirates, Heroes & more', pairsCount: 4 },
];

export const ALL_CATEGORIES_DATA: CategoryInfo[] = [
  { id: 'all', name: 'All / Random', icon: '🎲', color: '#FFD700', unlocked: true, description: 'Mix of all 5 categories for ultimate visual perception challenge', pairsCount: 21 },
  ...CATEGORIES_DATA,
];

export const CHARACTER_PAIRS: CharacterPair[] = [
  // ── Animals ────────────────────────────────────────────────
  {
    id: 'anim-1',
    category: 'animals',
    base: { id: 'panda', name: 'Panda', category: 'animals', emoji: '🐼' },
    odd: { id: 'fox', name: 'Fox', category: 'animals', emoji: '🦊' },
    description: 'Find the cute Fox among the Pandas!',
    difficulty: 'easy',
  },
  {
    id: 'anim-2',
    category: 'animals',
    base: { id: 'bear', name: 'Bear', category: 'animals', emoji: '🐻' },
    odd: { id: 'koala', name: 'Koala', category: 'animals', emoji: '🐨' },
    description: 'All are bears but this one is a Koala!',
    difficulty: 'easy',
  },
  {
    id: 'anim-3',
    category: 'animals',
    base: { id: 'duck', name: 'Duck', category: 'animals', emoji: '🦆' },
    odd: { id: 'chick', name: 'Baby Chick', category: 'animals', emoji: '🐥' },
    description: 'Spot the baby chick among the ducks!',
    difficulty: 'medium',
  },
  {
    id: 'anim-4',
    category: 'animals',
    base: { id: 'frog', name: 'Frog', category: 'animals', emoji: '🐸' },
    odd: { id: 'turtle', name: 'Turtle', category: 'animals', emoji: '🐢' },
    description: 'Spot the cute Turtle hiding among the Frogs!',
    difficulty: 'medium',
  },
  {
    id: 'anim-5',
    category: 'animals',
    base: { id: 'cat', name: 'Cat', category: 'animals', emoji: '🐱' },
    odd: { id: 'tiger', name: 'Tiger Cub', category: 'animals', emoji: '🐯' },
    description: 'Find the little tiger hiding with the cats!',
    difficulty: 'medium',
  },
  {
    id: 'anim-6',
    category: 'animals',
    base: { id: 'rabbit', name: 'Rabbit', category: 'animals', emoji: '🐰' },
    odd: { id: 'hamster', name: 'Hamster', category: 'animals', emoji: '🐹' },
    description: 'Find the cute hamster among the rabbits!',
    difficulty: 'easy',
  },

  // ── Clothes ────────────────────────────────────────────────
  {
    id: 'cloth-1',
    category: 'clothes',
    base: { id: 'shirt', name: 'Polo Shirt', category: 'clothes', emoji: '👕' },
    odd: { id: 'jacket', name: 'Warm Jacket', category: 'clothes', emoji: '🧥' },
    description: 'Find the jacket among the shirts!',
    difficulty: 'easy',
  },
  {
    id: 'cloth-2',
    category: 'clothes',
    base: { id: 'sneaker-red', name: 'Red Shoe', category: 'clothes', emoji: '👟', color: '#FF4B4B' },
    odd: { id: 'boot-yellow', name: 'Hiking Boot', category: 'clothes', emoji: '🥾', color: '#FFC928' },
    description: 'Spot the boot among running sneakers!',
    difficulty: 'medium',
  },
  {
    id: 'cloth-3',
    category: 'clothes',
    base: { id: 'cap', name: 'Baseball Cap', category: 'clothes', emoji: '🧢' },
    odd: { id: 'hat-straw', name: 'Sun Hat', category: 'clothes', emoji: '👒' },
    description: 'Spot the sun hat among the caps!',
    difficulty: 'medium',
  },
  {
    id: 'cloth-4',
    category: 'clothes',
    base: { id: 'glasses', name: 'Sunglasses', category: 'clothes', emoji: '🕶️' },
    odd: { id: 'goggles', name: 'Goggles', category: 'clothes', emoji: '🥽' },
    description: 'Find the goggles among sunglasses!',
    difficulty: 'hard',
  },
  {
    id: 'cloth-5',
    category: 'clothes',
    base: { id: 'socks', name: 'Socks', category: 'clothes', emoji: '🧦' },
    odd: { id: 'gloves', name: 'Gloves', category: 'clothes', emoji: '🧤' },
    description: 'Find the gloves among socks!',
    difficulty: 'easy',
  },

  // ── Food ───────────────────────────────────────────────────
  {
    id: 'food-1',
    category: 'food',
    base: { id: 'burger', name: 'Burger', category: 'food', emoji: '🍔' },
    odd: { id: 'donut', name: 'Pink Donut', category: 'food', emoji: '🍩' },
    description: 'Find the sweet donut among burgers!',
    difficulty: 'easy',
  },
  {
    id: 'food-2',
    category: 'food',
    base: { id: 'pizza', name: 'Pizza', category: 'food', emoji: '🍕' },
    odd: { id: 'taco', name: 'Taco', category: 'food', emoji: '🌮' },
    description: 'Find the taco in the pizza party!',
    difficulty: 'medium',
  },
  {
    id: 'food-3',
    category: 'food',
    base: { id: 'icecream', name: 'Ice Cream', category: 'food', emoji: '🍦' },
    odd: { id: 'cupcake', name: 'Cupcake', category: 'food', emoji: '🧁' },
    description: 'Spot the cupcake among ice creams!',
    difficulty: 'easy',
  },
  {
    id: 'food-4',
    category: 'food',
    base: { id: 'apple', name: 'Red Apple', category: 'food', emoji: '🍎' },
    odd: { id: 'orange', name: 'Orange', category: 'food', emoji: '🍊' },
    description: 'Find the orange among red apples!',
    difficulty: 'easy',
  },
  {
    id: 'food-5',
    category: 'food',
    base: { id: 'fries', name: 'French Fries', category: 'food', emoji: '🍟' },
    odd: { id: 'popcorn', name: 'Popcorn', category: 'food', emoji: '🍿' },
    description: 'Spot the popcorn box among fries!',
    difficulty: 'medium',
  },

  // ── Vehicles ───────────────────────────────────────────────
  {
    id: 'veh-1',
    category: 'vehicles',
    base: { id: 'car', name: 'Red Car', category: 'vehicles', emoji: '🚗' },
    odd: { id: 'bus', name: 'Yellow Bus', category: 'vehicles', emoji: '🚌' },
    description: 'Find the yellow bus among cars!',
    difficulty: 'easy',
  },
  {
    id: 'veh-2',
    category: 'vehicles',
    base: { id: 'plane', name: 'Airplane', category: 'vehicles', emoji: '✈️' },
    odd: { id: 'rocket', name: 'Rocket Ship', category: 'vehicles', emoji: '🚀' },
    description: 'Spot the rocket among planes!',
    difficulty: 'medium',
  },
  {
    id: 'veh-3',
    category: 'vehicles',
    base: { id: 'taxi', name: 'Taxi', category: 'vehicles', emoji: '🚕' },
    odd: { id: 'police', name: 'Police Car', category: 'vehicles', emoji: '🚓' },
    description: 'Find the police car among taxis!',
    difficulty: 'hard',
  },
  {
    id: 'veh-4',
    category: 'vehicles',
    base: { id: 'train', name: 'Bullet Train', category: 'vehicles', emoji: '🚆' },
    odd: { id: 'helicopter', name: 'Helicopter', category: 'vehicles', emoji: '🚁' },
    description: 'Spot the helicopter among trains!',
    difficulty: 'easy',
  },
  {
    id: 'veh-5',
    category: 'vehicles',
    base: { id: 'bicycle', name: 'Bicycle', category: 'vehicles', emoji: '🚲' },
    odd: { id: 'motorcycle', name: 'Motorcycle', category: 'vehicles', emoji: '🏍️' },
    description: 'Find the motorcycle among bicycles!',
    difficulty: 'medium',
  },

  // ── Characters ─────────────────────────────────────────────
  {
    id: 'char-1',
    category: 'characters',
    base: { id: 'boy', name: 'Happy Boy', category: 'characters', emoji: '👦' },
    odd: { id: 'girl', name: 'Happy Girl', category: 'characters', emoji: '👧' },
    description: 'Find the girl among the boys!',
    difficulty: 'easy',
  },
  {
    id: 'char-2',
    category: 'characters',
    base: { id: 'ninja', name: 'Ninja', category: 'characters', emoji: '🥷' },
    odd: { id: 'wizard', name: 'Wizard', category: 'characters', emoji: '🧙' },
    description: 'Find the magic wizard hiding with ninjas!',
    difficulty: 'easy',
  },
  {
    id: 'char-3',
    category: 'characters',
    base: { id: 'princess', name: 'Princess', category: 'characters', emoji: '👸' },
    odd: { id: 'witch', name: 'Witch', category: 'characters', emoji: '🧙‍♀️' },
    description: 'Find the witch among the princesses!',
    difficulty: 'medium',
  },
  {
    id: 'char-4',
    category: 'characters',
    base: { id: 'cowboy', name: 'Cowboy', category: 'characters', emoji: '🤠' },
    odd: { id: 'police-officer', name: 'Police Officer', category: 'characters', emoji: '👮' },
    description: 'Spot the police officer among cowboys!',
    difficulty: 'medium',
  },
  {
    id: 'char-5',
    category: 'characters',
    base: { id: 'superhero', name: 'Superhero', category: 'characters', emoji: '🦸' },
    odd: { id: 'alien', name: 'Alien', category: 'characters', emoji: '👽' },
    description: 'Spot the alien hiding among superheroes!',
    difficulty: 'easy',
  },
];

export function getGridSize(score: number): GridSize {
  if (score >= 25) return 6; // Hard / Extreme (6x6 = 36 tiles)
  if (score >= 10) return 5; // Medium (5x5 = 25 tiles)
  return 4;                  // Easy (4x4 = 16 tiles)
}

export function generateRound(score: number, category: CategoryType = 'animals'): RoundData {
  const gridSize = getGridSize(score);
  const totalTiles = gridSize * gridSize;

  // Filter pairs by requested category (or fallback to any)
  let pool = CHARACTER_PAIRS.filter((p) => p.category === category);
  if (pool.length === 0) pool = CHARACTER_PAIRS;

  // Select pair based on score difficulty
  let selectedPair: CharacterPair;
  if (score >= 25) {
    const hardPool = pool.filter((p) => p.difficulty === 'hard' || p.difficulty === 'medium');
    selectedPair = hardPool.length > 0
      ? hardPool[Math.floor(Math.random() * hardPool.length)]
      : pool[Math.floor(Math.random() * pool.length)];
  } else {
    selectedPair = pool[Math.floor(Math.random() * pool.length)];
  }

  // Randomize the odd tile position
  const oddIndex = Math.floor(Math.random() * totalTiles);

  const tiles: TileItem[] = Array.from({ length: totalTiles }).map((_, idx) => {
    const isOdd = idx === oddIndex;
    const char = isOdd ? selectedPair.odd : selectedPair.base;
    return {
      id: idx,
      characterId: char.id,
      name: char.name,
      emoji: char.emoji,
      color: char.color,
      isOdd,
    };
  });

  return {
    gridSize,
    tiles,
    oddIndex,
    baseName: selectedPair.base.name,
    oddName: selectedPair.odd.name,
    category: selectedPair.category,
    targetDescription: selectedPair.description,
  };
}

export function calculateAccuracy(correct: number, wrong: number): number {
  const total = correct + wrong;
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}
