import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const stages = [
  "Normalizing node metrics",
  "Calculating weighted scores",
  "Selecting cluster heads",
];

const clusterHeads = ["CH-0", "CH-5", "CH-10", "CH-15"];

const ClusterHeadSelection = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => {
        if (prev >= stages.length - 1) {
          setComplete(true);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Cluster Head Selection
      </h2>

      <div className="space-y-3 mb-5">
        {stages.map((stage, i) => (
          <motion.div
            key={stage}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= activeStage ? 1 : 0.3, x: 0 }}
            transition={{ delay: i * 0.2, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-500 ${
                i < activeStage
                  ? "bg-green-500"
                  : i === activeStage
                  ? "bg-primary animate-pulse"
                  : "bg-muted"
              }`}
            />
            <span className="text-sm text-foreground">{stage}</span>
          </motion.div>
        ))}
      </div>

      {complete && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-2"
        >
          {clusterHeads.map((ch, i) => (
            <motion.div
              key={ch}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-primary/10 border border-primary/30 rounded-lg p-2 text-center"
            >
              <div className="text-xs font-mono text-primary">{ch}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Active</div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
};

export default ClusterHeadSelection;
