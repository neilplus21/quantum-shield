import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface BlockchainLogProps {
  txHash: string | null;
}

const BlockchainLog = ({ txHash }: BlockchainLogProps) => {
  const displayHash = txHash ?? "Awaiting transaction…";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel neon-glow-blue p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground mb-4 neon-text-blue">
        Blockchain Transaction
      </h2>

      <div className="space-y-4 font-mono text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Network</span>
          <span className="text-neon-cyan text-xs">Ethereum Sepolia</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Transaction Hash</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-neon-green truncate text-xs"
          >
            {displayHash}
          </motion.span>
        </div>
      </div>

      {txHash && (
        <motion.a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-mono text-sm hover:bg-primary/20 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View on Etherscan
        </motion.a>
      )}
    </motion.section>
  );
};

export default BlockchainLog;
