import { Button } from "@/components/ui/button";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

const ConnectWalletButton = () => {
  const { setVisible } = useWalletModal();
  const { connected, publicKey } = useWallet();
  const short = publicKey ? `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}` : "";

  if (connected) {
    return (
      <Button variant="outline" className="gap-2 border-primary/50 hover:border-primary glow-cyan">
        {short}
      </Button>
    );
  }

  return (
    <Button variant="outline" className="gap-2 border-primary/50 hover:border-primary glow-cyan" onClick={() => setVisible(true)}>
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;

