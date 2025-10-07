import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useWalletVerification } from "@/hooks/useWalletVerification";


export const TopNav = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const short = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey
        .toBase58()
        .slice(-4)}`
    : "";
  const [isConnecting, setIsConnecting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { verifyWallet } = useWalletVerification();
  const IS_VERIFIED = sessionStorage.getItem("IS_VERIFIED");

  useEffect(() => {
    if (!connected) {
      setIsConnecting(false);
    }
  }, [connected, disconnect, isConnecting]);

  useEffect(() => {
    if (connected && publicKey && IS_VERIFIED == "false") {
      // Immediately verify wallet
      verifyWallet();
    }
  }, [connected, publicKey, verifyWallet, IS_VERIFIED]);

  const handleConnect = () => {
    setIsConnecting(true);
    sessionStorage.setItem("IS_VERIFIED", "false")
    setTimeout(() => setIsConnecting(false), 1000);
  };

  const navItems = [
    { href: "#countdown", label: "Countdown" },
    { href: "#social", label: "Community" },
    { href: "#leaderboard", label: "Leaderboard" },
    { href: "#challenge", label: "Challenge" },
    { href: "#shame", label: "Shame" },
    { href: "#team", label: "Team" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="w-full sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-border text-sm font-bold text-black"
          >
            <img
              src="/NBNNN.gif"
              alt="NBNNN logo"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </a>
        </div>

        {/* Center navigation */}
        <nav className="hidden md:flex items-center justify-center gap-2">
          {navItems.map((i) => (
            <a
              key={i.href}
              href={i.href}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              {i.label}
            </a>
          ))}
        </nav>

        {/* Right section (wallet controls + mobile menu button) */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {connected ? (
              <>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {short}
                </span>
                <button
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                  onClick={() => {
                    sessionStorage.removeItem("IS_VERIFIED");
                    disconnect();
                  }}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <div onClick={handleConnect}>
                <WalletMultiButton
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                />
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded hover:bg-muted"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="flex flex-col items-start p-3 space-y-1">
            {navItems.map((i) => (
              <a
                key={i.href}
                href={i.href}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                onClick={() => setMenuOpen(false)}
              >
                {i.label}
              </a>
            ))}
            

            <div className="mt-2 border-t w-full pt-2">
              {connected ? (
                <button
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                  onClick={() => {
                    sessionStorage.removeItem("IS_VERIFIED");
                    disconnect();
                    setMenuOpen(false);
                  }}
                >
                  Disconnect ({short})
                </button>
              ) : (
                <div onClick={handleConnect}>
                  <WalletMultiButton
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" })
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;
