// ============================================================
// GameHub Backend — Database Schema (Drizzle ORM + Neon PostgreSQL)
// ============================================================

import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

// 1. Users Table
export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    guestId: varchar('guest_id', { length: 255 }).notNull().unique(),
    deviceId: varchar('device_id', { length: 255 }).notNull(),
    cloudUserId: uuid('cloud_user_id'),
    email: varchar('email', { length: 255 }).unique(),
    passwordHash: varchar('password_hash', { length: 255 }),
    username: varchar('username', { length: 100 }).notNull().unique(),
    displayName: varchar('display_name', { length: 100 }).notNull(),
    avatarUrl: text('avatar_url'),
    xp: integer('xp').default(0).notNull(),
    level: integer('level').default(1).notNull(),
    coins: integer('coins').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    linkedAt: timestamp('linked_at'),
  },
  (table) => ({
    guestIdx: uniqueIndex('idx_users_guest').on(table.guestId),
    emailIdx: uniqueIndex('idx_users_email').on(table.email),
  })
);

// 2. Profiles Table
export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  bio: text('bio'),
  country: varchar('country', { length: 50 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Games Registry Table
export const games = pgTable('games', {
  id: varchar('id', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).default('available').notNull(),
  gameVersion: varchar('game_version', { length: 20 }).notNull(),
  scoreVersion: varchar('score_version', { length: 20 }).notNull(),
  maxScore: integer('max_score').notNull(),
  minDuration: integer('min_duration').notNull(),
  maxDuration: integer('max_duration').notNull(),
});

// 4. Game Stats Table
export const gameStats = pgTable(
  'game_stats',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    gameId: varchar('game_id', { length: 100 }).notNull(),
    gamesPlayed: integer('games_played').default(0).notNull(),
    wins: integer('wins').default(0).notNull(),
    losses: integer('losses').default(0).notNull(),
    draws: integer('draws').default(0).notNull(),
    bestScore: integer('best_score').default(0).notNull(),
    totalScore: integer('total_score').default(0).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userGameIdx: uniqueIndex('idx_user_game_stats').on(table.userId, table.gameId),
  })
);

// 5. Game Scores Table
export const gameScores = pgTable(
  'game_scores',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id').notNull().unique(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    gameId: varchar('game_id', { length: 100 }).notNull(),
    gameVersion: varchar('game_version', { length: 20 }).notNull(),
    scoreVersion: varchar('score_version', { length: 20 }).notNull(),
    score: integer('score').notNull(),
    duration: integer('duration').notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    eventIdx: uniqueIndex('idx_scores_event').on(table.eventId),
    userGameScoreIdx: index('idx_scores_user_game').on(table.userId, table.gameId),
  })
);

// 6. Friend Requests Table
export const friendRequests = pgTable('friend_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  receiverId: uuid('receiver_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending/accepted/rejected
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Friends Table
export const friends = pgTable(
  'friends',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    friendId: uuid('friend_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    pairIdx: uniqueIndex('idx_friends_pair').on(table.userId, table.friendId),
  })
);

// 8. Achievements Definitions Table
export const achievements = pgTable('achievements', {
  id: varchar('id', { length: 100 }).primaryKey(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  xpReward: integer('xp_reward').default(50).notNull(),
});

// 9. User Achievements Table
export const userAchievements = pgTable(
  'user_achievements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    achievementId: varchar('achievement_id', { length: 100 }).references(() => achievements.id).notNull(),
    unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
  },
  (table) => ({
    userAchieveIdx: uniqueIndex('idx_user_achievements').on(table.userId, table.achievementId),
  })
);

// 10. Matches Table
export const matches = pgTable('matches', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: varchar('game_id', { length: 100 }).notNull(),
  mode: varchar('mode', { length: 50 }).notNull(), // ffa, tdm, etc.
  status: varchar('status', { length: 20 }).default('completed').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
});

// 11. Match Players Table
export const matchPlayers = pgTable('match_players', {
  id: uuid('id').defaultRandom().primaryKey(),
  matchId: uuid('match_id').references(() => matches.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  score: integer('score').default(0).notNull(),
  kills: integer('kills').default(0).notNull(),
  deaths: integer('deaths').default(0).notNull(),
  won: boolean('won').default(false).notNull(),
});

// 12. Leaderboards Cache Table
export const leaderboards = pgTable(
  'leaderboards',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    gameId: varchar('game_id', { length: 100 }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    rank: integer('rank').notNull(),
    score: integer('score').notNull(),
    period: varchar('period', { length: 20 }).default('all_time').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    rankIdx: index('idx_leaderboard_lookup').on(table.gameId, table.period, table.rank),
  })
);

// 13. Sync Events Table (Idempotency Engine)
export const syncEvents = pgTable('sync_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  payload: jsonb('payload').notNull(),
  processedAt: timestamp('processed_at').defaultNow().notNull(),
});
