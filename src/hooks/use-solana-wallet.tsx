import { useCallback, useEffect, useState } from "react";

type WalletInfo = {
  name: string;
  provider: any;
};

type WalletState = {
  isConnected: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  hasProvider: boolean;
  providers: WalletInfo[];
  selected: string | null;
  select: (name: string) => void;
};

export function useSolanaWallet(): WalletState {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [hasProvider, setHasProvider] = useState(false);
  const [providers, setProviders] = useState<WalletInfo[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [userInitiated, setUserInitiated] = useState(false);

  const discoverProviders = () => {
    if (typeof window === "undefined") return { list: [], any: false };
    const sol = (window as any).solana;
    if (!sol) return { list: [], any: false };
    const list: WalletInfo[] = [];
    if (Array.isArray(sol.providers) && sol.providers.length) {
      for (const p of sol.providers) {
        const name = p?.wallet?.name || p?.name || (p?.isPhantom ? "Phantom" : "Wallet");
        list.push({ name, provider: p });
      }
    } else {
      const candidates = [sol, (window as any).phantom?.solana, (window as any).backpack?.solana, (window as any).solflare];
      for (const p of candidates) {
        if (!p) continue;
        const name = p?.wallet?.name || (p?.isPhantom && "Phantom") || (p?.isBackpack && "Backpack") || (p?.isSolflare && "Solflare") || p?.name || "Wallet";
        if (name && !list.find((i) => i.provider === p)) list.push({ name, provider: p });
      }
    }
    return { list, any: list.length > 0 };
  };

  const getSelectedProvider = () => {
    const found = providers.find((p) => p.name === selected);
    return found?.provider || providers[0]?.provider;
  };

  const connect = useCallback(async () => {
    setUserInitiated(true);
    const provider = getSelectedProvider();
    if (!provider) return;
    try {
      // only connect when user explicitly calls connect()
      const res = await provider.connect({ onlyIfTrusted: false });
      const key = res?.publicKey?.toString?.() ?? provider.publicKey?.toString?.() ?? null;
      setIsConnected(Boolean(key));
      setPublicKey(key);
    } catch (err) {
      console.warn("Wallet connection failed:", err);
    }
  }, [providers, selected]);

  const disconnect = useCallback(async () => {
    const provider = getSelectedProvider();
    if (!provider) return;
    try {
      await provider.disconnect?.();
    } catch (err) {
      console.warn("Wallet disconnect failed:", err);
    } finally {
      setIsConnected(false);
      setPublicKey(null);
    }
  }, [providers, selected]);

  useEffect(() => {
    const { list, any } = discoverProviders();
    setProviders(list);
    setHasProvider(any);
    if (!any) return;

    setSelected(list[0]?.name ?? null);

    const onConnect = (prov: any) => (pubKey: any) => {
      const key = pubKey?.toString?.() ?? prov.publicKey?.toString?.() ?? null;
      setIsConnected(Boolean(key));
      setPublicKey(key);
    };
    const onDisconnect = () => {
      setIsConnected(false);
      setPublicKey(null);
    };
    const onAccountChanged = (prov: any) => (newPubKey: any) => {
      const key = newPubKey?.toString?.() ?? prov.publicKey?.toString?.() ?? null;
      setIsConnected(Boolean(key));
      setPublicKey(key);
    };

    const cleanups: Array<() => void> = [];
    for (const { provider } of list) {
      provider.on?.("connect", onConnect(provider));
      provider.on?.("disconnect", onDisconnect);
      provider.on?.("accountChanged", onAccountChanged(provider));

      // ⚠️ REMOVE this auto-connect behavior
      // Don't check publicKey on load anymore
      // (we'll only connect when user clicks "Connect")

      cleanups.push(() => {
        provider.removeListener?.("connect", onConnect);
        provider.removeListener?.("disconnect", onDisconnect);
        provider.removeListener?.("accountChanged", onAccountChanged);
      });
    }

    return () => { cleanups.forEach((fn) => fn()); };
  }, [userInitiated]);

  const select = (name: string) => setSelected(name);

  return { isConnected, publicKey, connect, disconnect, hasProvider, providers, selected, select };
}
