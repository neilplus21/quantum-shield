import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const DashboardHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel neon-glow-blue p-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 20px hsl(220 90% 56% / 0.4)",
              "0 0 40px hsl(220 90% 56% / 0.7)",
              "0 0 20px hsl(220 90% 56% / 0.4)",
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-3 rounded-xl bg-primary/20 border border-primary/30"
        >
          <Shield className="w-8 h-8 text-primary" />
        </motion.div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-wider text-foreground neon-text-blue">
            QuantumSecure IoT Blockchain
          </h1>
          <p className="text-muted-foreground text-sm font-mono tracking-wide mt-1">
            Post-Quantum Secure IoT Infrastructure
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-neon-green"
          />
          <span className="text-xs font-mono text-neon-green">SYSTEM ONLINE</span>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
