/**
 * Backend configuration.
 *
 * This is the only file that needs to change when the Spring Boot backend
 * becomes available. Set the URL in a `.env` file at the project root:
 *
 *   EXPO_PUBLIC_API_URL=http://192.168.1.20:8080
 *
 * The `EXPO_PUBLIC_` prefix is what makes Expo expose the variable to the app
 * at build time. Restart the dev server after editing `.env`.
 *
 * Tips for the URL:
 *   - Android emulator  -> http://10.0.2.2:8080
 *   - iOS simulator     -> http://localhost:8080
 *   - Physical device   -> http://<your-computer-LAN-IP>:8080
 *   - Web browser       -> http://localhost:8080
 *
 * A physical device cannot reach `localhost`, because on the device that
 * points at the phone itself. Use your computer's LAN IP instead.
 */

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL;

/**
 * Base URL of the Spring Boot backend, with any trailing slash removed so
 * paths can be joined safely. Empty string means "not configured yet".
 */
export const API_BASE_URL: string = (rawBaseUrl ?? '').trim().replace(/\/+$/, '');

/**
 * True once a backend URL has been provided.
 *
 * The auth screens use this to decide between calling the real endpoints and
 * running in demo mode, where only the on-device validation runs.
 */
export const IS_API_CONFIGURED: boolean = API_BASE_URL.length > 0;

/** How long a single request may take before it is aborted. */
export const API_TIMEOUT_MS = 15000;
