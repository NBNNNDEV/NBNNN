import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getStreak, postNut } from "@/integrations/api/nut";
import { useWallet } from "@solana/wallet-adapter-react";

const STORAGE_KEY = "nbnnn_nut_streak";
const DATE_KEY = "nbnnn_nut_streak_last_date";

function isSameLocalDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export const NutStreakChallenge = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  // Load streak from API when wallet connects
  useEffect(() => {
    const load = async () => {
      if (!publicKey) return;

      try {
        const data = await getStreak(publicKey.toBase58());
        setStreak(data.streak_count ?? 0);
        setLastDate(data.last_nut_date ? new Date(data.last_nut_date) : null);
      } catch (_) {
        setStreak(0);
        setLastDate(null);
      }
    };
    load();
  }, [publicKey]);

  const registerNut = async () => {
    if (!connected) return;
    if (!publicKey) return;
    const today = new Date();
    if (lastDate && isSameLocalDay(today, lastDate)) {
      // already registered today
      return;
    }

    setLoading(true);

    const updated = await postNut(publicKey.toBase58());
    setStreak(updated.streak_count ?? 0);
    setLastDate(updated.last_nut_date ? new Date(updated.last_nut_date) : today);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center space-y-4">
      <h2 className="text-3xl font-bold">Nut Streak Challenge</h2>
      <p className="text-muted-foreground">Log once per day to keep your streak alive.</p>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={registerNut} disabled={!connected || loading}>
          {loading ? "Saving..." : "I Nut Today"}
        </Button>
      </div>
      {!connected && (
        <div className="text-xs text-muted-foreground">Connect your wallet to log your nut streak.</div>
      )}
      <div className="text-5xl font-extrabold">{streak}</div>
      <div className="text-sm text-muted-foreground">Current streak (days)</div>
    </div>
  );
};

export default NutStreakChallenge;


