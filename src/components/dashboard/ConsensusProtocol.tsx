import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const delegates = [
  { id: "D-1", vote: 0.92 },
  { id: "D-2", vote: 0.87 },
  { id: "D-3", vote: 0.95 },
  { id: "D-4", vote: 0.78 },
  { id: "D-5", vote: 0.91 },
];

const ConsensusProtocol = () => {
  const [progress, setProgress] = useState(0);
  const [achieved, setAchieved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setAchieved(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Consensus Protocol
      </h2>

      <div className="space-y-3 mb-4">
        {delegates.map((d, i) => (
          <div key={d.id} className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground w-8">{d.id}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, d.vote * 100)}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-secondary rounded-full"
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground w-10 text-right">
              {Math.min(progress, Math.round(d.vote * 100))}%
            </span>
          </div>
        ))}
      </div>

      {achieved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center"
        >
          <span className="text-sm font-medium text-green-400">
            ✓ Consensus Achieved
          </span>
        </motion.div>
      )}
    </motion.section>
  );
};

export default ConsensusProtocol;
