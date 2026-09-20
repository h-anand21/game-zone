// ============================================================
// GameHub — Shared Contracts: Auth
// ============================================================

/** Register a new cloud account. */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  /** Optional guest_id to link existing offline progress. */
  guestId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface AuthUserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

/** Link a guest identity to a cloud account. */
export interface LinkGuestRequest {
  guestId: string;
  deviceId: string;
}
