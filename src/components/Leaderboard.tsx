import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { getTop } from "@/integrations/api/nut";
import { useSolanaWallet } from "@/hooks/use-solana-wallet";

type Entry = {
  wallet: string;
  streak_count: number;
  total_count: number;
};

export const Leaderboard = () => {
  const [top, setTop] = useState<Entry[]>([]);
  const { isConnected, connect, publicKey } = useSolanaWallet();

  useEffect(() => {
    const load = async () => {
      if (!publicKey) return;
      try {
        const data = await getTop();
        setTop(data)
        } catch (_) {

      }
    };
    load();
  }, [publicKey]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Top Nutters</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {top.map((e, idx) => (
              <li key={e.wallet} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-right font-semibold">{idx + 1}</span>
                  <span className="font-mono">{e.wallet.slice(0, 4)}...{e.wallet.slice(-4)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">streak</span>
                  <span className="font-semibold">{e.streak_count}</span>
                  <span className="text-sm text-muted-foreground">total</span>
                  <span className="font-semibold">{e.total_count}</span>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;


