import { motion } from "framer-motion";
import { useMemo } from "react";

const ScatteredDevices = () => {
  const devices = useMemo(() => {
    const clusterHeads = [0, 6, 12];
    return Array.from({ length: 18 }, (_, i) => {
      const isCH = clusterHeads.includes(i);
      // Use seeded-style positions for natural scatter
      const angle = (i / 18) * Math.PI * 2 + (i * 0.3);
      const radius = isCH ? 25 : 15 + ((i * 17) % 30);
      return {
        id: i,
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        isCH,
        label: isCH ? `CH-${clusterHeads.indexOf(i) + 1}` : null,
      };
    });
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-1">Scattered IoT Devices</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Devices Online: <span className="text-foreground">{devices.length}</span>
      </p>

      <div className="relative h-[220px] bg-background rounded-lg border border-border overflow-hidden">
        {devices.map((d) => (
          <motion.div
            key={d.id}
            className="absolute flex flex-col items-center"
            style={{ left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: d.id * 0.04, duration: 0.3 }}
          >
            {/* Node circle */}
            <motion.div
              animate={d.isCH ? { scale: [1, 1.1, 1] } : {}}
              transition={d.isCH ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" } : {}}
              className={`rounded-full border flex items-center justify-center ${
                d.isCH
                  ? "w-5 h-5 border-2 border-foreground bg-foreground/10"
                  : "w-3 h-3 border border-muted-foreground bg-muted-foreground/20"
              }`}
            />
            {/* Label for cluster heads */}
            {d.label && (
              <span className="text-[9px] text-muted-foreground mt-1 font-mono">{d.label}</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ScatteredDevices;
