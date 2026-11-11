/**
 * Auth endpoints of the AgriConnect backend.
 *
 * These are the functions the Register and Login screens call. The paths live
 * in one place, so if the Spring Boot controllers use different URLs, only
 * `REGISTER_PATH` and `LOGIN_PATH` need to change.
 *
 * Expected backend contract (to be implemented in Spring Boot later):
 *   POST /api/auth/register
 *   POST /api/auth/login
 *
 * Expected success body from both:
 *   {
 *     "token": "<JWT>",
 *     "user": { "id": 1, "fullName": "...", "email": "...", "phone": "..." }
 *   }
 */

import { request } from '@/services/api-client';

export const REGISTER_PATH = '/api/auth/register';
export const LOGIN_PATH = '/api/auth/login';

/** What the Register screen sends. */
export type RegisterRequest = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

/** What the Login screen sends. */
export type LoginRequest = {
  email: string;
  password: string;
};

/** The signed-in user, as returned by the backend. */
export type AuthUser = {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
};

/** Token plus user, returned by both endpoints. */
export type AuthResponse = {
  token: string;
  user?: AuthUser;
};

/**
 * Creates a new farmer account.
 *
 * `confirmPassword` is intentionally not sent: it only exists so the user can
 * catch a typo, and the backend only needs to store the real password.
 */
export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  return request<AuthResponse>({
    method: 'POST',
    path: REGISTER_PATH,
    body: {
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      password: payload.password,
    },
  });
}

/** Signs an existing farmer in. */
export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>({
    method: 'POST',
    path: LOGIN_PATH,
    body: {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    },
  });
}
