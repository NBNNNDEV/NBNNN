const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
};

export type StreakResponse = { wallet: string; streak_count: number; total_count: number; last_nut_date: string | null };
export type LeaderboardEntry = { wallet: string; streak_count: number; total_count: number };
export type ShameEntry = { id: string; user_id: string; season_year: number; created_at: string };



