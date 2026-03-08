import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const clusterHeads = [
  { id: "CH-1", members: 4 },
  { id: "CH-2", members: 5 },
  { id: "CH-3", members: 3 },
  { id: "CH-4", members: 4 },
];

const DataAggregation = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 3;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-1">Cluster Data Aggregation</h2>
      <p className="text-xs text-muted-foreground mb-4">Aggregating Sensor Data</p>

      <div className="space-y-3">
        {clusterHeads.map((ch, i) => {
          const chProgress = Math.min(100, Math.max(0, progress - i * 10));
          return (
            <div key={ch.id} className="flex items-center gap-3">
              <div className="w-10 text-xs font-mono text-primary">{ch.id}</div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary/60 rounded-full"
                  animate={{ width: `${chProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: ch.members }, (_, j) => (
                  <motion.div
                    key={j}
                    className="w-2 h-2 rounded-full"
                    animate={{
                      backgroundColor: chProgress > (j + 1) * (100 / ch.members)
                        ? "hsl(217 91% 60%)"
                        : "hsl(0 0% 20%)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {progress >= 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-xs font-medium text-green-400"
        >
          ✓ Aggregation Complete
        </motion.div>
      )}
    </motion.section>
  );
};

export default DataAggregation;
