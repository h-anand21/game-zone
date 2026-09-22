// ============================================================
// GameHub — Shared Package Index
// ============================================================

// Enums
export { GameState } from './enums/game-state';
export { GameMode } from './enums/game-mode';
export { MatchStatus } from './enums/match-status';
export { PlayerStatus } from './enums/player-status';
export { NetworkState } from './enums/network-state';
export { Difficulty } from './enums/difficulty';

// Game IDs & Types
export type {
  GameCategory, SaveSupport, GameStatus, ScoreValidationRules, GameConfig, GameId,
} from './game-ids/games';
export {
  ALL_GAME_IDS,
  GAME_MIND_LOCK, GAME_FIND_ONE, GAME_REVERSE_MIND, GAME_MEMORY_RUSH,
  GAME_NUMBER_RUSH, GAME_PATTERN_BREAK, GAME_CODE_BREAKER, GAME_PATH_MIND,
  GAME_AIM_RUSH, GAME_ONE_TAP, GAME_DONT_TAP_WRONG, GAME_REACTION_FIRE,
  GAME_STACK_MASTER, GAME_PERFECT_HIT,
  GAME_SNAKE, GAME_PONG, GAME_SKY_JUMP, GAME_ENDLESS_RUNNER, GAME_BLOCK_PUZZLE,
  GAME_LUDO, GAME_BAGH_BAKRI, GAME_CARROM, GAME_MINI_CHESS, GAME_CONNECT_4, GAME_MEMORY_CARDS,
  GAME_FPS_FFA, GAME_FPS_TDM, GAME_FPS_GUN_GAME, GAME_FPS_CAPTURE_POINT, GAME_FPS_DUEL,
  GAME_TIC_TAC_TOE, GAME_ROCK_PAPER_SCISSORS, GAME_AIR_HOCKEY, GAME_QUIZ_BATTLE, GAME_GUESS_THE_DRAWING,
} from './game-ids/games';

// Contracts
export type {
  RegisterRequest, LoginRequest, RefreshTokenRequest,
  AuthTokenResponse, AuthUserResponse, LinkGuestRequest,
} from './contracts/auth';
export type {
  GameResponse, ScoreSubmitRequest, ScoreResponse, GameStatsResponse,
} from './contracts/games';
export type {
  ProfileResponse, UpdateProfileRequest, FriendResponse,
  FriendRequestResponse, AchievementResponse, UserAchievementResponse,
  LeaderboardEntryResponse,
} from './contracts/players';
export type {
  MatchResponse, MatchPlayerResponse, FpsMatchResultRequest, FpsPlayerResult,
} from './contracts/matches';
export type {
  SyncEventType, SyncEvent, SyncRequest, SyncEventResult, SyncResponse,
} from './contracts/sync';
export type {
  GameRemoteConfig, FeatureFlags, RemoteConfigResponse,
} from './contracts/config';

// Protocol
export type {
  ClientAuthEvent, ClientJoinRoomEvent, ClientInputEvent, ClientLeaveEvent, ClientEvent,
  ServerAuthResultEvent, ServerStateSnapshotEvent, PlayerSnapshot,
  ServerHitConfirmEvent, ServerPlayerKilledEvent, ServerPlayerRespawnEvent,
  ServerMatchStartEvent, ServerMatchEndEvent, ServerPlayerDisconnectedEvent,
  ServerPlayerReconnectedEvent, ServerErrorEvent, ServerEvent,
} from './protocol/fps-events';
export type {
  CasualCreateRoomEvent, CasualJoinRoomEvent, CasualLeaveRoomEvent,
  CasualMakeMoveEvent, CasualGameOverEvent, CasualChatEvent, CasualClientEvent,
  CasualRoomCreatedEvent, CasualRoomJoinedEvent, CasualPlayerJoinedEvent,
  CasualPlayerLeftEvent, CasualMoveMadeEvent, CasualGameResultEvent,
  CasualRoomClosedEvent, CasualChatMessageEvent, CasualErrorEvent, CasualServerEvent,
  CasualPlayer, CasualRoomState,
} from './protocol/casual-events';

// Validation
export { SCORE_VALIDATION_RULES } from './validation/score-rules';

// Common API types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}
