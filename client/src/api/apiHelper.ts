const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const getApiUrl = (path: string) => `${BACKEND_URL}${path}`;

export const apiRequest = async <T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<T | null> => {
  const res = await fetch(getApiUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API request failed: ${res.status} ${errorText}`);
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json() as Promise<T>;
};
