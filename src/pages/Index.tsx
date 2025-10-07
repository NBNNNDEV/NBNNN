import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClickButton } from "@/components/ClickButton";
import { ClickCounter } from "@/components/ClickCounter";
import { useSolanaWallet } from "@/hooks/use-solana-wallet";
import { getTotal, subscribeTotal } from "@/integrations/api/nut";
import { Countdown } from "@/components/Countdown";
import { SocialLinks } from "@/components/SocialLinks";
import { Leaderboard } from "@/components/Leaderboard";
import { NutStreakChallenge } from "@/components/NutStreakChallenge";
import { Team } from "@/components/Team";
import { FAQ } from "@/components/FAQ";
import { WallOfShame } from "@/components/WallOfShame";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/TopNav";
import { toast } from "sonner";

const Index = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [clickId, setClickId] = useState<string | null>(null);
  const { publicKey } = useSolanaWallet();
  const getOrCreateUserId = () => {
    const KEY = "nbnnn_user_id";
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  };

  // Fetch initial total nuts (sum of user totals) via API
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { total } = await getTotal();
        setClickCount(total ?? 0);
      } catch (e) {
        console.error("Error fetching total:", e);
        toast.error("Failed to load click count");
      }
    };

    fetchCount();
  }, []);

  // Poll totals periodically (Render REST)
  useEffect(() => {
    // SSE subscription
    const unsub = subscribeTotal((n) => setClickCount(n));
    // Fallback initial fetch
    (async () => {
      try {
        const { total } = await getTotal();

        setClickCount(total ?? 0);
      } catch {}
    })();
    return () => {
      unsub();
    };
  }, []);

  const handleClick = async () => {
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 400);

    // Optimistically update UI (sum will sync via realtime anyway)
    setClickCount((prev) => prev + 1);

    // If it's November, log to wall_of_shame once per season using anonymous local id
    const now = new Date();
    const isNovember = now.getMonth() === 10; // 0-based: 10 => November
    if (isNovember) {
      const userId = getOrCreateUserId();
      const seasonYear = now.getFullYear();
      // POST to Render API
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/shame`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, season_year: seasonYear }),
        });
        if (!res.ok) throw new Error("shame failed");
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-16 p-8 ">
      <TopNav />
      <div className="text-center space-y-4">
        
        <h1 className="text-5xl font-bold">
          NutBeforeNNN $NBNNN
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl">
          Click Every time you Nut Before No Nut November
        </p>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Nut with your friends too (We don't judge you but we'll shame you if you fail NNN)
        </p>

      </div>
      <div>
        <button
          onClick={() => {
            navigator.clipboard.writeText("EGh2tNSjZD2CugKKXhQDVvouNE6DTAJaMWkykReRZyPA");
            toast.success("Copied to clipboard!");
          }}
          className="text-center text-2xl font-bold"
        >
          CA: <br />
          EGh2tNSjZD2CugKKXhQDVvouNE6DTAJaMWkykReRZyPA
        </button>
      </div>

      <section id="countdown" className="w-full">
        <Countdown />
      </section>

      <ClickCounter count={clickCount} />

      <ClickButton onClick={handleClick} isClicking={isClicking} />


      {/* New Sections */}


      <section id="social" className="w-full">
        <SocialLinks />
      </section>

      <section id="leaderboard" className="w-full">
        <Leaderboard />
      </section>

      <section id="challenge" className="w-full">
        <NutStreakChallenge />
      </section>

      <section id="shame" className="w-full">
        <WallOfShame />
      </section>

      <section id="team" className="w-full">
        <Team />
      </section>

      <section id="faq" className="w-full">
        <FAQ />
      </section>
    </div>
  );
};

export default Index;
