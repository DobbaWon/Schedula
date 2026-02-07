const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/**
 * Build the full backend URL
 */
export const getApiUrl = (path: string) => `${BACKEND_URL}${path}`;

/**
 * Generic API request helper
 * Handles GET, POST, PUT, DELETE with JSON payloads and credentials
 */
export const apiRequest = async <T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<T> => {
  const res = await fetch(getApiUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // send cookies for session-based auth
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API request failed: ${res.status} ${errorText}`);
  }

  return res.json() as Promise<T>;
};
