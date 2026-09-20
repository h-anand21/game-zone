// ============================================================
// GameHub — Games Screen (Game Discovery)
// ============================================================

import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography, Shadows, CATEGORY_COLORS } from '@/constants/theme';
import { GAME_REGISTRY, GAME_CATEGORIES } from '@/constants/games';
import type { GameCategory } from '@/constants/types';

export default function GamesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');


  const filteredGames = useMemo(() => {
    let games = GAME_REGISTRY;
    if (selectedCategory !== 'all') {
      games = games.filter((g) => g.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      games = games.filter(
        (g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
      );
    }
    return games;
  }, [selectedCategory, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Games</Text>
        <Text style={styles.subtitle}>{GAME_REGISTRY.length} games available</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search games..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <Pressable
          style={[
            styles.categoryPill,
            selectedCategory === 'all' && styles.categoryPillActive,
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[
            styles.categoryPillText,
            selectedCategory === 'all' && styles.categoryPillTextActive,
          ]}>
            All ({GAME_REGISTRY.length})
          </Text>
        </Pressable>
        {GAME_CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={[
              styles.categoryPill,
              selectedCategory === cat.id && [
                styles.categoryPillActive,
                { backgroundColor: CATEGORY_COLORS[cat.id] },
              ],
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={[
              styles.categoryPillText,
              selectedCategory === cat.id && styles.categoryPillTextActive,
            ]}>
              {cat.icon} {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Games Grid */}
      <ScrollView style={styles.gamesList} contentContainerStyle={styles.gamesContent}>
        {filteredGames.map((game) => (
          <Pressable
            key={game.id}
            style={({ pressed }) => [styles.gameCard, pressed && styles.pressed]}
            onPress={() => router.push(`/games/${game.id}`)}
          >

            <View style={[styles.gameIconWrapper, { backgroundColor: CATEGORY_COLORS[game.category] + '20' }]}>
              <Text style={styles.gameIcon}>{game.icon}</Text>
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameName}>{game.name}</Text>
              <Text style={styles.gameDescription} numberOfLines={1}>
                {game.description}
              </Text>
              <View style={styles.gameTags}>
                <View style={[styles.tag, { backgroundColor: CATEGORY_COLORS[game.category] + '30' }]}>
                  <Text style={[styles.tagText, { color: CATEGORY_COLORS[game.category] }]}>
                    {game.category}
                  </Text>
                </View>
                {game.offline && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>offline</Text>
                  </View>
                )}
                {game.multiplayer && (
                  <View style={[styles.tag, { backgroundColor: Colors.accent + '20' }]}>
                    <Text style={[styles.tagText, { color: Colors.accent }]}>multiplayer</Text>
                  </View>
                )}
              </View>
            </View>
            {game.status === 'coming-soon' ? (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Soon</Text>
              </View>
            ) : (
              <Text style={styles.playArrow}>▶</Text>
            )}
          </Pressable>
        ))}

        {filteredGames.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No games found</Text>
            <Text style={styles.emptySubtext}>Try a different search or category</Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.h1,
    color: Colors.textPrimary,
    fontWeight: Typography.extrabold,
  },
  subtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: Colors.textPrimary,
    fontSize: Typography.body,
  },
  clearButton: {
    fontSize: 16,
    color: Colors.textMuted,
    padding: Spacing.xs,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    maxHeight: 44,
  },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryPillText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.semibold,
  },
  gamesList: {
    flex: 1,
  },
  gamesContent: {
    paddingHorizontal: Spacing.md,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  gameIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  gameIcon: {
    fontSize: 24,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: Typography.body,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
  gameDescription: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  gameTags: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
  },
  tagText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: Typography.medium,
    textTransform: 'capitalize',
  },
  statusBadge: {
    backgroundColor: Colors.warning,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: Typography.tiny,
    color: Colors.textInverse,
    fontWeight: Typography.bold,
  },
  playArrow: {
    fontSize: 18,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
  emptySubtext: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 100,
  },
});
