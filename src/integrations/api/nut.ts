import { api, StreakResponse, LeaderboardEntry } from "./client";

export async function getStreak(wallet: string): Promise<StreakResponse> {
  return api.get<StreakResponse>(`/streaks/${wallet}`);
}

export async function postNut(wallet: string): Promise<StreakResponse> {
  return api.post<StreakResponse>(`/streaks/${wallet}/nut`);
}

export async function getTotal(): Promise<{ total: number }> {
  return api.get<{ total: number }>(`/streaks/total/all`);
}

export async function getTop(): Promise<LeaderboardEntry[]> {
  return api.get<LeaderboardEntry[]>(`/streaks/total/top?limit=5`);
}

export function subscribeTotal(onTotal: (n: number) => void): () => void {
  const url = `${import.meta.env.VITE_API_BASE_URL || ""}/events`;
  const ev = new EventSource(url);
  const handler = (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data || '{}');
      if (typeof data.total === 'number') onTotal(data.total);
    } catch {}
  };
  ev.addEventListener('total', handler as any);
  ev.onerror = () => {
    ev.close();
  };
  return () => ev.close();
}



