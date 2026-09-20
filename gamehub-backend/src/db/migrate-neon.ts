// ============================================================
// GameHub Backend — Programmatic Neon DB Setup & Migration
// ============================================================

import { pool } from '../config/database.js';

async function initNeonTables() {
  console.log('⚡ Initializing Neon PostgreSQL Database Tables...');

  const sqlStatements = [
    // 1. Users Table
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      guest_id VARCHAR(255) NOT NULL UNIQUE,
      device_id VARCHAR(255) NOT NULL,
      cloud_user_id UUID,
      email VARCHAR(255) UNIQUE,
      password_hash VARCHAR(255),
      username VARCHAR(100) NOT NULL UNIQUE,
      display_name VARCHAR(100) NOT NULL,
      avatar_url TEXT,
      xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      coins INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      linked_at TIMESTAMP
    );`,

    // 2. Profiles Table
    `CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      bio TEXT,
      country VARCHAR(50),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    // 3. Games Table
    `CREATE TABLE IF NOT EXISTS games (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'available',
      game_version VARCHAR(20) NOT NULL,
      score_version VARCHAR(20) NOT NULL,
      max_score INTEGER NOT NULL,
      min_duration INTEGER NOT NULL,
      max_duration INTEGER NOT NULL
    );`,

    // 4. Game Stats Table
    `CREATE TABLE IF NOT EXISTS game_stats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game_id VARCHAR(100) NOT NULL,
      games_played INTEGER NOT NULL DEFAULT 0,
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0,
      draws INTEGER NOT NULL DEFAULT 0,
      best_score INTEGER NOT NULL DEFAULT 0,
      total_score INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT idx_user_game_stats UNIQUE (user_id, game_id)
    );`,

    // 5. Game Scores Table
    `CREATE TABLE IF NOT EXISTS game_scores (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID NOT NULL UNIQUE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game_id VARCHAR(100) NOT NULL,
      game_version VARCHAR(20) NOT NULL,
      score_version VARCHAR(20) NOT NULL,
      score INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    // 6. Friend Requests Table
    `CREATE TABLE IF NOT EXISTS friend_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    // 7. Friends Table
    `CREATE TABLE IF NOT EXISTS friends (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT idx_friends_pair UNIQUE (user_id, friend_id)
    );`,

    // 8. Achievements Table
    `CREATE TABLE IF NOT EXISTS achievements (
      id VARCHAR(100) PRIMARY KEY,
      code VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      icon VARCHAR(50) NOT NULL,
      xp_reward INTEGER NOT NULL DEFAULT 50
    );`,

    // 9. User Achievements Table
    `CREATE TABLE IF NOT EXISTS user_achievements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      achievement_id VARCHAR(100) NOT NULL REFERENCES achievements(id),
      unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT idx_user_achievements UNIQUE (user_id, achievement_id)
    );`,

    // 10. Matches Table
    `CREATE TABLE IF NOT EXISTS matches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      game_id VARCHAR(100) NOT NULL,
      mode VARCHAR(50) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'completed',
      started_at TIMESTAMP NOT NULL DEFAULT NOW(),
      ended_at TIMESTAMP
    );`,

    // 11. Match Players Table
    `CREATE TABLE IF NOT EXISTS match_players (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      score INTEGER NOT NULL DEFAULT 0,
      kills INTEGER NOT NULL DEFAULT 0,
      deaths INTEGER NOT NULL DEFAULT 0,
      won BOOLEAN NOT NULL DEFAULT FALSE
    );`,

    // 12. Leaderboards Table
    `CREATE TABLE IF NOT EXISTS leaderboards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      game_id VARCHAR(100) NOT NULL,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rank INTEGER NOT NULL,
      score INTEGER NOT NULL,
      period VARCHAR(20) NOT NULL DEFAULT 'all_time',
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    // 13. Sync Events Table (Idempotency Engine)
    `CREATE TABLE IF NOT EXISTS sync_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID NOT NULL UNIQUE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(100) NOT NULL,
      payload JSONB NOT NULL,
      processed_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,
  ];

  try {
    for (const sql of sqlStatements) {
      await pool.query(sql);
    }
    console.log('✅ Successfully created all 13 Neon PostgreSQL tables!');
  } catch (err) {
    console.error('❌ Table initialization error:', err);
  } finally {
    await pool.end();
  }
}

initNeonTables();
