import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface BlockchainLogProps {
  txHash: string | null;
}

const BlockchainLog = ({ txHash }: BlockchainLogProps) => {
  const etherscanUrl = txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Blockchain Transaction Details
      </h2>

      {txHash ? (
        <>
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-1">Transaction Hash</div>
            <div className="font-mono text-xs text-foreground bg-background rounded p-2 border border-border truncate">
              {txHash}
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden mb-4">
            <iframe
              src={etherscanUrl!}
              title="Etherscan Transaction"
              className="w-full bg-background"
              style={{ height: "500px" }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>

          <a
            href={etherscanUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Etherscan
          </a>
        </>
      ) : (
        <div className="text-sm text-muted-foreground py-8 text-center">
          Awaiting transaction…
        </div>
      )}
    </motion.section>
  );
};

export default BlockchainLog;
