// ============================================================
// GameHub Backend — Auth & API Validation Tests
// ============================================================

import { describe, it, expect } from 'vitest';

// ── Auth Validation Logic (inline for testing) ──────────────

function validateGuestRegistration(body: any): { valid: boolean; error?: string } {
  if (!body.deviceId || typeof body.deviceId !== 'string') {
    return { valid: false, error: 'deviceId is required' };
  }
  if (body.deviceId.length < 4) {
    return { valid: false, error: 'deviceId too short' };
  }
  if (body.deviceId.length > 256) {
    return { valid: false, error: 'deviceId too long' };
  }
  return { valid: true };
}

function validateLinkAccount(body: any): { valid: boolean; error?: string } {
  if (!body.email || typeof body.email !== 'string') {
    return { valid: false, error: 'email is required' };
  }
  if (!body.password || typeof body.password !== 'string') {
    return { valid: false, error: 'password is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  if (body.password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  return { valid: true };
}

function validatePagination(query: any): { page: number; limit: number } {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  return { page, limit };
}

// ── Tests ────────────────────────────────────────────────────

describe('Guest Registration Validation', () => {
  it('should accept valid deviceId', () => {
    expect(validateGuestRegistration({ deviceId: 'abc123' }).valid).toBe(true);
  });

  it('should reject missing deviceId', () => {
    const result = validateGuestRegistration({});
    expect(result.valid).toBe(false);
    expect(result.error).toContain('deviceId');
  });

  it('should reject short deviceId', () => {
    const result = validateGuestRegistration({ deviceId: 'ab' });
    expect(result.valid).toBe(false);
  });

  it('should reject too long deviceId', () => {
    const result = validateGuestRegistration({ deviceId: 'x'.repeat(300) });
    expect(result.valid).toBe(false);
  });
});

describe('Link Account Validation', () => {
  it('should accept valid email and password', () => {
    expect(validateLinkAccount({ email: 'test@example.com', password: 'secure123' }).valid).toBe(true);
  });

  it('should reject missing email', () => {
    expect(validateLinkAccount({ password: '123456' }).valid).toBe(false);
  });

  it('should reject missing password', () => {
    expect(validateLinkAccount({ email: 'test@test.com' }).valid).toBe(false);
  });

  it('should reject invalid email format', () => {
    expect(validateLinkAccount({ email: 'notanemail', password: '123456' }).valid).toBe(false);
  });

  it('should reject short password', () => {
    const result = validateLinkAccount({ email: 'test@test.com', password: '12' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('6 characters');
  });
});

describe('Pagination Validation', () => {
  it('should use defaults for empty query', () => {
    const result = validatePagination({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('should clamp page to minimum 1', () => {
    expect(validatePagination({ page: -5 }).page).toBe(1);
    expect(validatePagination({ page: 0 }).page).toBe(1);
  });

  it('should clamp limit to max 100', () => {
    expect(validatePagination({ limit: 500 }).limit).toBe(100);
  });

  it('should default limit for zero or negative', () => {
    expect(validatePagination({ limit: 0 }).limit).toBe(20); // 0 is falsy, defaults to 20
    expect(validatePagination({ limit: -5 }).limit).toBe(1);
  });

  it('should parse valid numbers', () => {
    const result = validatePagination({ page: '3', limit: '50' });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(50);
  });
});
