import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useState } from "react";

const ControlPanel = () => {
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    // Simulate pipeline execution
    setTimeout(() => setRunning(false), 8000);
    try {
      await fetch("http://localhost:8000/run-demo", { method: "POST" });
    } catch {
      // Backend not available — dashboard runs in demo mode
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-panel p-6 flex flex-col items-center"
    >
      <h2 className="font-display text-lg font-semibold text-foreground mb-6 neon-text-cyan">
        Control Panel
      </h2>

      <motion.button
        onClick={handleRun}
        disabled={running}
        whileHover={!running ? { scale: 1.05 } : {}}
        whileTap={!running ? { scale: 0.95 } : {}}
        animate={running ? {
          boxShadow: [
            "0 0 20px hsl(220 90% 56% / 0.4), 0 0 60px hsl(270 70% 55% / 0.2)",
            "0 0 40px hsl(220 90% 56% / 0.7), 0 0 80px hsl(270 70% 55% / 0.4)",
            "0 0 20px hsl(220 90% 56% / 0.4), 0 0 60px hsl(270 70% 55% / 0.2)",
          ],
        } : {
          boxShadow: "0 0 20px hsl(220 90% 56% / 0.3), 0 0 40px hsl(270 70% 55% / 0.15)",
        }}
        transition={running ? { duration: 1.5, repeat: Infinity } : {}}
        className={`px-10 py-5 rounded-xl font-display text-base font-bold tracking-wider border transition-all ${
          running
            ? 'bg-primary/30 border-primary/50 text-primary cursor-wait'
            : 'bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/40 text-foreground hover:border-primary/60'
        }`}
      >
        <span className="flex items-center gap-3">
          <Zap className={`w-5 h-5 ${running ? 'animate-pulse-neon text-primary' : 'text-neon-cyan'}`} />
          {running ? "Executing Pipeline..." : "Run Secure IoT Transmission"}
        </span>
      </motion.button>

      {running && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-mono text-xs text-muted-foreground"
        >
          IoT → Clustering → Consensus → Encryption → Blockchain
        </motion.div>
      )}
    </motion.section>
  );
};

export default ControlPanel;
