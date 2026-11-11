/**
 * Minimal HTTP client for the Spring Boot backend.
 *
 * Everything network related lives here so the rest of the app never calls
 * `fetch` directly. The auth service in `auth-service.ts` builds on top of it.
 *
 * Security note: this file never logs request bodies, headers or tokens.
 * Auth requests carry passwords, so only the method, path and status code are
 * ever written to the console.
 */

import { API_BASE_URL, API_TIMEOUT_MS, IS_API_CONFIGURED } from '@/config/env';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method: HttpMethod;
  /** Path beginning with `/`, for example `/api/auth/login`. */
  path: string;
  /** Sent as JSON. Contains a password for auth calls, so never log it. */
  body?: unknown;
  /** Aborts the request after this many milliseconds. */
  timeoutMs?: number;
  /** Optional bearer token, added when the backend needs authentication. */
  token?: string | null;
};

/**
 * An error we can show to the user. `fieldErrors` lets the backend report
 * problems per form field, which the screens map straight onto the inputs.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Response keys that describe the error itself, not a form field. */
const ENVELOPE_KEYS = new Set([
  'message',
  'error',
  'path',
  'status',
  'timestamp',
  'trace',
  'detail',
]);

/**
 * Pulls a readable message out of whatever the backend returned. Spring Boot
 * often answers with `{ "message": "..." }` or `{ "error": "..." }`, and
 * validation failures with `{ "field": "reason" }` pairs.
 */
function parseErrorBody(body: unknown): {
  message: string;
  fieldErrors: Record<string, string>;
} {
  if (typeof body !== 'object' || body === null) {
    return { message: '', fieldErrors: {} };
  }

  const record = body as Record<string, unknown>;
  const fieldErrors: Record<string, string> = {};

  for (const [key, value] of Object.entries(record)) {
    // Spring Boot's default error envelope uses these keys, so they are metadata
    // rather than a complaint about a specific form field.
    if (typeof value === 'string' && !ENVELOPE_KEYS.has(key)) {
      fieldErrors[key] = value;
    }
  }

  const firstFieldMessage = Object.values(fieldErrors)[0];
  const message =
    (typeof record.message === 'string' && record.message) ||
    (typeof record.error === 'string' && record.error) ||
    firstFieldMessage ||
    '';

  return { message, fieldErrors };
}

/** Reads the response as JSON, tolerating an empty or non-JSON body. */
async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Sends one request and returns the parsed body.
 *
 * Throws `ApiError` for any non-2xx response, and a plain `Error` for network
 * problems such as no connection or a timeout.
 */
export async function request<T>({
  method,
  path,
  body,
  timeoutMs = API_TIMEOUT_MS,
  token,
}: RequestOptions): Promise<T> {
  if (!IS_API_CONFIGURED) {
    throw new Error(
      'The backend URL is not set. Add EXPO_PUBLIC_API_URL to your .env file.'
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // Only the method and path are logged. The body holds credentials.
    console.log(`[api] ${method} ${path}`);

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const parsed = await readBody(response);

    if (!response.ok) {
      const { message, fieldErrors } = parseErrorBody(parsed);
      throw new ApiError(
        message || `Request failed with status ${response.status}.`,
        response.status,
        fieldErrors
      );
    }

    return parsed as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The request timed out. Please check your connection and try again.');
    }
    throw new Error('Could not reach the server. Please check your connection and try again.');
  } finally {
    clearTimeout(timeout);
  }
}
