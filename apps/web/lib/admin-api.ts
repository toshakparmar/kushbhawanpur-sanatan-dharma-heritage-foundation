export async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      // If unauthorized, redirect to login
      if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    const message = json.error?.message || json.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return json.data !== undefined ? json.data : json;
}
