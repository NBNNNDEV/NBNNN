import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const queryClient = new QueryClient();

const App = () => {
  // IMPORTANT: Clear wallet name on every render to prevent auto-connect

  const wallets = useMemo(
    () => [],
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ConnectionProvider endpoint={(import.meta as any).env?.VITE_SOLANA_RPC_URL || "https://api.devnet.solana.com"}>
          <WalletProvider 
            wallets={wallets} 
            autoConnect={true}
            localStorageKey="walletName"
          >
            <WalletModalProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;