import { api, ShameEntry } from "./client";

export async function getShame(year: number): Promise<ShameEntry[]> {
  return api.get<ShameEntry[]>(`/shame?season_year=${year}`);
}

export async function postShame(userId: string, seasonYear: number): Promise<ShameEntry> {
  return api.post<ShameEntry>(`/shame`, { user_id: userId, season_year: seasonYear });
}



