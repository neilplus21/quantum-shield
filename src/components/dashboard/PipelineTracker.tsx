import { motion } from "framer-motion";

const stages = [
  "IoT Devices",
  "Neighbor Discovery",
  "Cluster Head Selection",
  "Aggregation",
  "Consensus",
  "Encryption",
  "Blockchain",
];

interface PipelineTrackerProps {
  activeStage: number; // -1 = none active
}

const PipelineTracker = ({ activeStage }: PipelineTrackerProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between min-w-[700px]">
        {stages.map((stage, i) => {
          const completed = i < activeStage;
          const active = i === activeStage;
          return (
            <div key={stage} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{
                    scale: active ? [1, 1.15, 1] : 1,
                    boxShadow: active
                      ? "0 0 12px hsl(217 91% 60% / 0.4)"
                      : completed
                      ? "0 0 8px hsl(142 71% 45% / 0.3)"
                      : "none",
                  }}
                  transition={active ? { repeat: Infinity, duration: 2 } : {}}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-500 ${
                    completed
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : active
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-muted border-border text-muted-foreground"
                  }`}
                >
                  {completed ? "✓" : i + 1}
                </motion.div>
                <span
                  className={`text-[10px] font-medium text-center leading-tight w-16 ${
                    completed
                      ? "text-green-400"
                      : active
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {stage}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div className="flex-1 mx-1">
                  <div
                    className={`h-0.5 transition-colors duration-500 ${
                      i < activeStage ? "bg-green-500/50" : "bg-border"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineTracker;
