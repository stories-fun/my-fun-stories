import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useWallet } from "@jup-ag/wallet-adapter";
import { usePresale } from "~/context/PresaleContext";
import { useConnection } from "@solana/wallet-adapter-react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/button";
import { Transaction, PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";

interface BuyTokensDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ErrorResponse {
  error: string;
}

interface TransactionResponse {
  transaction: string;
}

export const BuyTokensDialog = ({ open, onClose }: BuyTokensDialogProps) => {
  const { publicKey, signTransaction } = useWallet();
  const { pricePerToken, tokenMint, loadPresaleData } = usePresale();
  const { connection } = useConnection();
  const [solAmount, setSolAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorState, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && !tokenMint) {
      void loadPresaleData();
    }
  }, [open, tokenMint, loadPresaleData]);

  const tokensToReceive = useMemo(() => {
    if (!solAmount || !pricePerToken) return 0;
    const lamports = Number(solAmount) * 1e9;
    return lamports / Number(pricePerToken);
  }, [solAmount, pricePerToken]);

  const handleBuy = async () => {
    const solValue = Number(solAmount);
    if (isNaN(solValue) || solValue <= 0 || (solValue * 1e9) % 1 !== 0) {
      alert("Invalid SOL amount. Minimum is 0.000000001 SOL.");
      return;
    }
    if (!publicKey) {
      alert("Please connect your wallet first");
      return;
    }
    if (!solAmount || Number(solAmount) <= 0) {
      alert("Please enter a valid SOL amount");
      return;
    }
    if (!signTransaction) {
      alert("Wallet does not support transaction signing");
      return;
    }
    if (!connection) {
      alert("No connection to Solana network");
      return;
    }
    if (!tokenMint) {
      alert("Token mint address not available. Please try again later.");
      return;
    }

    console.log("Using token mint:", tokenMint);

    setLoading(true);
    try {
      const balance = await connection.getBalance(publicKey);
      const requiredAmount = Number(solAmount) * 1e9;
      if (balance < requiredAmount) {
        throw new Error(
          `Insufficient SOL balance. You need at least ${solAmount} SOL`,
        );
      }

      const mintInfo = await getMint(connection, new PublicKey(tokenMint));
      console.log("Mint authority:", mintInfo.mintAuthority?.toString());

      const response = await fetch("http://localhost:3001/api/presale/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solAmount: Number(solAmount) * 1e9,
          buyer: publicKey.toString(),
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.error || "Failed to create transaction");
      }

      const { transaction } = (await response.json()) as TransactionResponse;
      const tx = Transaction.from(Buffer.from(transaction, "base64"));
      const signedTx = await signTransaction(tx);
      const rawTransaction = signedTx.serialize();

      const txid = await connection.sendRawTransaction(rawTransaction);
      await connection.confirmTransaction(txid);
      onClose();
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "getLogs" in err &&
        typeof err.getLogs === "function"
      ) {
        const logs = await (err as { getLogs(): Promise<string[]> }).getLogs();
        console.error("Transaction simulation error logs:", logs);
      }
      console.error("Buy error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process transaction";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Tokens</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {errorState ? (
            <div className="text-sm text-red-600">{errorState}</div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount in SOL
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={solAmount}
                  onChange={(e) => setSolAmount(e.target.value)}
                  placeholder="Enter SOL amount"
                  className="mt-1"
                />
              </div>
              {pricePerToken && solAmount && (
                <div className="text-sm text-gray-600">
                  You will receive: {tokensToReceive.toFixed(2)} tokens
                </div>
              )}
              <Button
                onClick={handleBuy}
                disabled={
                  !publicKey || !solAmount || Number(solAmount) <= 0 || loading
                }
                className="w-full"
              >
                {loading ? "Processing..." : "Buy Tokens"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
