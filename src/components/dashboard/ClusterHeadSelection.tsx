import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stages = [
  { label: "Normalizing node metrics", icon: "📊" },
  { label: "Weighted score calculation", icon: "⚖️" },
  { label: "Selecting cluster heads", icon: "🎯" },
];

const clusterHeads = [
  { id: "CH-0", score: 0.94, energy: "87%", proximity: "12m" },
  { id: "CH-5", score: 0.91, energy: "92%", proximity: "8m" },
  { id: "CH-10", score: 0.88, energy: "79%", proximity: "15m" },
  { id: "CH-15", score: 0.85, energy: "84%", proximity: "11m" },
];

const ClusterHeadSelection = () => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % (stages.length + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel neon-glow-purple p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground mb-4 neon-text-purple">
        Cluster Head Selection
      </h2>

      <div className="space-y-3 mb-6">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.label}
            animate={{ opacity: i <= activeStage ? 1 : 0.3 }}
            className="flex items-center gap-3 font-mono text-sm"
          >
            <motion.div
              animate={i === activeStage ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
                i < activeStage ? 'bg-neon-green/20 border border-neon-green/30' :
                i === activeStage ? 'bg-primary/20 border border-primary/30' :
                'bg-muted/30 border border-border'
              }`}
            >
              {i < activeStage ? '✓' : stage.icon}
            </motion.div>
            <span className={i <= activeStage ? 'text-foreground' : 'text-muted-foreground'}>
              {stage.label}
            </span>
            {i === activeStage && (
              <motion.span
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="text-primary text-xs"
              >
                Processing...
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {clusterHeads.map((ch, i) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: activeStage >= stages.length ? 1 : 0.3, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 font-mono text-xs"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-secondary font-semibold">{ch.id}</span>
              <span className="text-neon-green">Score: {ch.score}</span>
            </div>
            <div className="text-muted-foreground space-y-1">
              <div>Energy: {ch.energy}</div>
              <div>Proximity: {ch.proximity}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ClusterHeadSelection;
