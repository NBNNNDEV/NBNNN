import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

const MANUAL_CONNECT_KEY = "wallet_manual_connect";

export const TopNav = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const short = publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : "";
  const [isConnecting, setIsConnecting] = useState(false);

  // Disconnect on mount if wallet auto-connected without user action
  useEffect(() => {
    if(!connected){
      setIsConnecting(false)
    }
  }, [connected, disconnect, isConnecting]);

  // Track when user manually connects
  const handleConnect = () => {
    setIsConnecting(true);
    sessionStorage.setItem(MANUAL_CONNECT_KEY, "true");
    // Reset isConnecting after a short delay
    setTimeout(() => setIsConnecting(false), 1000);
  };

  return (
    <header className="w-full sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-full px-4 h-14 grid grid-cols-3 items-center">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-border text-sm font-bold text-black"
          >
            <img
              src="NBNNN.gif"
              alt="NBNNN background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </a>
        </div>

        {/* Center navigation */}
        <nav className="flex items-center justify-center gap-1 sm:gap-2">
          {[
            { href: "#countdown", label: "Countdown" },
            { href: "#social", label: "Community" },
            { href: "#leaderboard", label: "Leaderboard" },
            { href: "#challenge", label: "Challenge" },
            { href: "#shame", label: "Shame" },
            { href: "#team", label: "Team" },
            { href: "#faq", label: "FAQ" },
          ].map((i) => (
            <a
              key={i.href}
              href={i.href}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              {i.label}
            </a>
          ))}
        </nav>

        {/* Right section (wallet controls) */}
        <div className="flex items-center justify-end gap-2">
          {connected ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">{short}</span>
              <button
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                onClick={() => {
                  sessionStorage.removeItem(MANUAL_CONNECT_KEY);
                  disconnect();
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div onClick={handleConnect}>
              <WalletMultiButton className={cn(buttonVariants({ variant: "outline", size: "sm" }))} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;