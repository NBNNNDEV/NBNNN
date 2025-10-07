import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getShame } from "@/integrations/api/shame";

type Shame = {
  wallet: string;
  season_year: number;
  date: string;
};

function getCurrentSeason(): number {
  // November belongs to its calendar year; e.g., Nov 2025 => 2025
  const now = new Date();
  return now.getFullYear();
}

export const WallOfShame = () => {
  const [entries, setEntries] = useState<Shame[]>([]);
  const [loading, setLoading] = useState(true);
  const season = useMemo(() => getCurrentSeason(), []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getShame(season);
      setEntries(data ?? []);
      setLoading(false);
    })();
  }, [season]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Wall of Shame</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : entries.length === 0 ? (
            <div className="text-muted-foreground">Clean slate. Don\'t be the first.</div>
          ) : (
            <ul className="space-y-2">
              {entries.map((e) => (
                <li key={e.wallet} className="flex items-center justify-between rounded-md border p-3">
                  <span className="font-mono">{e.wallet.slice(0, 4)}...{e.wallet.slice(-4)}</span>
                  <span className="text-xs text-muted-foreground">{new Date(e.date).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WallOfShame;


