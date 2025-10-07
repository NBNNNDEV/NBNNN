// src/hooks/useWalletVerification.ts
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useState } from "react";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const useWalletVerification = () => {
    const { publicKey, signMessage } = useWallet();
    const [verified, setVerified] = useState(false)


    const verifyWallet = async () => {
        if (!publicKey) {
            toast.error("Connect your wallet first");
            return;
        }

        if (!signMessage) {
            toast.error("Your wallet does not support message signing");
            return;
        }

        const message = `Welcome to NutBeforeNNN!
By signing this message, you verify ownership of wallet:
${publicKey.toBase58()}
Timestamp: ${new Date().toISOString()}`;

        try {
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);
            const signatureBase58 = bs58.encode(signature);

            const response = await fetch(`${BASE_URL}/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet: publicKey.toBase58(),
                    message,
                    signature: signatureBase58,
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Wallet verified successfully!");
                sessionStorage.setItem("IS_VERIFIED", "true")
                return true;
            } else {
                toast.error("Wallet verification failed");
                return false;
            }
        } catch (err) {
            console.error(err);
            toast.error("Error verifying wallet");
            return false;
        }
    };

    return { verifyWallet, verified };
};
