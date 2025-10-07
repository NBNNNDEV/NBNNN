import { Button } from "@/components/ui/button";
import { Twitter, Send, MessageSquare, Pill } from "lucide-react";

type Link = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const SocialLinks = () => {
  const links: Link[] = [
    { label: "Twitter", href: "https://x.com/NutBeforeNNN", icon: <Twitter /> },
    { label: "Telegram", href: "https://t.me/+kdIkgp3ITx05YTZk", icon: <Send /> },
    { label: "PumpFun", href: "https://pump.fun/coin/EGh2tNSjZD2CugKKXhQDVvouNE6DTAJaMWkykReRZyPA", icon: <Pill /> },

  ];

  return (
    <div className="w-full max-w-3xl mx-auto text-center space-y-4">
      <h2 className="text-3xl font-bold">Join the Community</h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="min-w-40">
              {l.icon}
              <span>{l.label}</span>
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;


