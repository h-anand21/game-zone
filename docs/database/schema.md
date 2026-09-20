# GameHub — Database Schema

## Cloud Database (Neon PostgreSQL)

### users
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default gen_random_uuid() |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |
| last_login_at | TIMESTAMPTZ | |

### profiles
| Column | Type | Constraints |
|---|---|---|
| user_id | UUID | PK, FK→users, UNIQUE |
| display_name | VARCHAR(50) | NOT NULL |
| avatar_url | TEXT | |
| bio | TEXT | |
| xp | INTEGER | DEFAULT 0 |
| level | INTEGER | DEFAULT 1 |
| coins | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

### games
| Column | Type | Constraints |
|---|---|---|
| id | TEXT | PK (slug) |
| name | VARCHAR(100) | NOT NULL |
| category | VARCHAR(20) | NOT NULL |
| is_offline | BOOLEAN | DEFAULT true |
| is_multiplayer | BOOLEAN | DEFAULT false |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

### game_scores
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| event_id | UUID | UNIQUE (idempotency) |
| user_id | UUID | FK→users, INDEX |
| game_id | TEXT | FK→games, INDEX |
| score | INTEGER | NOT NULL |
| duration | INTEGER | seconds |
| game_version | VARCHAR(20) | NOT NULL |
| score_version | VARCHAR(20) | NOT NULL |
| metadata | JSONB | |
| created_at | TIMESTAMPTZ | DEFAULT NOW(), INDEX |

### game_stats
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK→users |
| game_id | TEXT | FK→games |
| games_played | INTEGER | DEFAULT 0 |
| wins | INTEGER | DEFAULT 0 |
| losses | INTEGER | DEFAULT 0 |
| draws | INTEGER | DEFAULT 0 |
| best_score | INTEGER | DEFAULT 0 |
| total_score | BIGINT | DEFAULT 0 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |
| | | UNIQUE(user_id, game_id) |

### friend_requests
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| sender_id | UUID | FK→users |
| receiver_id | UUID | FK→users |
| status | VARCHAR(20) | pending/accepted/rejected |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

### friends
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK→users |
| friend_id | UUID | FK→users |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| | | UNIQUE(user_id, friend_id) |

### achievements
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| code | VARCHAR(50) | UNIQUE |
| name | VARCHAR(100) | NOT NULL |
| description | TEXT | |
| icon | TEXT | |
| xp_reward | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### user_achievements
| Column | Type | Constraints |
|---|---|---|
| user_id | UUID | FK→users |
| achievement_id | UUID | FK→achievements |
| unlocked_at | TIMESTAMPTZ | DEFAULT NOW() |
| | | PK(user_id, achievement_id) |

### matches
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| game_id | TEXT | FK→games |
| match_type | VARCHAR(30) | |
| status | VARCHAR(20) | pending/active/completed/cancelled |
| started_at | TIMESTAMPTZ | |
| ended_at | TIMESTAMPTZ | |
| winner_id | UUID | FK→users, NULLABLE |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### match_players
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| match_id | UUID | FK→matches |
| user_id | UUID | FK→users |
| team | VARCHAR(20) | |
| score | INTEGER | DEFAULT 0 |
| kills | INTEGER | DEFAULT 0 |
| deaths | INTEGER | DEFAULT 0 |
| position | INTEGER | |
| result | VARCHAR(10) | win/loss/draw |

### leaderboards
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| game_id | TEXT | FK→games |
| user_id | UUID | FK→users |
| score | INTEGER | NOT NULL |
| rank | INTEGER | |
| period | VARCHAR(20) | daily/weekly/monthly/all_time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |
| | | INDEX(game_id, period, rank) |

### sync_events
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| event_id | UUID | UNIQUE (idempotency) |
| user_id | UUID | FK→users |
| event_type | VARCHAR(30) | NOT NULL |
| payload | JSONB | NOT NULL |
| client_timestamp | TIMESTAMPTZ | NOT NULL |
| server_timestamp | TIMESTAMPTZ | DEFAULT NOW() |
| processed_at | TIMESTAMPTZ | |

## Mobile Database (SQLite)

See `gamehub-mobile/storage/sqlite/schema.ts` for local table definitions.

Key tables: users, game_progress, game_scores, game_stats, achievements, user_achievements, settings, daily_challenges, daily_streaks, favorite_games, sync_queue, remote_config_cache.
