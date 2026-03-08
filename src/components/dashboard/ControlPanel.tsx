import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface ControlPanelProps {
  onRun: () => void;
  loading: boolean;
}

const ControlPanel = ({ onRun, loading }: ControlPanelProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card border border-border rounded-lg p-6 flex flex-col items-center shadow-sm"
    >
      <button
        onClick={onRun}
        disabled={loading}
        className={`px-8 py-4 rounded-lg font-medium text-sm flex items-center gap-3 transition-colors ${
          loading
            ? 'bg-primary/20 text-primary cursor-wait'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        <Zap className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
        {loading ? "Encrypting IoT Data and Broadcasting Transaction..." : "Run Secure IoT Transmission"}
      </button>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 font-mono text-xs text-muted-foreground"
        >
          IoT → Clustering → Consensus → Encryption → Blockchain
        </motion.div>
      )}
    </motion.section>
  );
};

export default ControlPanel;
