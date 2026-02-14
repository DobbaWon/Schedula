// frontend/src/api/auth/auth.ts
import { getApiUrl } from "../apiHelper";

/**
 * Redirects the user to the backend Google OAuth endpoint
 */
export const handleGoogleLogin = () => {
  window.location.href = getApiUrl("/auth/google");
};

/**
 * Redirects the user to the backend Microsoft OAuth endpoint
 */
export const handleMicrosoftLogin = () => {
  window.location.href = getApiUrl("/auth/microsoft");
};
