import { motion } from "framer-motion";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface BlockchainLogProps {
  txHash: string | null;
}

const BlockchainLog = ({ txHash }: BlockchainLogProps) => {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"broadcasting" | "waiting" | "confirmed">("broadcasting");

  useState(() => {
    if (txHash) {
      setStatus("confirmed");
    }
  });

  const copyHash = async () => {
    if (!txHash) return;
    await navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">Blockchain Logging</h2>

      {txHash ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-sm text-green-400">Transaction Confirmed</span>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Network</div>
            <div className="text-sm text-foreground">Ethereum Sepolia</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Transaction Hash</div>
            <div className="font-mono text-xs text-primary bg-background rounded p-3 border border-border break-all">
              {txHash}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyHash}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Hash"}
            </button>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View on Etherscan
            </a>
          </div>
        </motion.div>
      ) : (
        <div className="text-sm text-muted-foreground py-8 text-center">
          Awaiting transaction…
        </div>
      )}
    </motion.section>
  );
};

export default BlockchainLog;
