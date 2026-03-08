import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const mockTxHash = "0x7f4e8d2c1a9b3f0e5c8d2a6f1b4e9c3d7a0f5b8e2c6a1d9f3b7e0c4a8d2f6";

const BlockchainLog = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel neon-glow-blue p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground mb-4 neon-text-blue">
        Blockchain Logging
      </h2>

      <div className="space-y-4 font-mono text-sm">
        {[
          { label: "Network", value: "Ethereum Sepolia", color: "text-neon-cyan" },
          { label: "Tx Hash", value: mockTxHash, color: "text-neon-green", truncate: true },
          { label: "Block Number", value: "18,432,671", color: "text-foreground" },
          { label: "Gas Used", value: "52,341 wei", color: "text-foreground" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className={`${item.color} ${item.truncate ? 'truncate' : ''} text-xs`}
            >
              {item.value}
            </motion.span>
          </div>
        ))}
      </div>

      <motion.a
        href={`https://sepolia.etherscan.io/tx/${mockTxHash}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-mono text-sm hover:bg-primary/20 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        View on Etherscan
      </motion.a>
    </motion.section>
  );
};

export default BlockchainLog;
