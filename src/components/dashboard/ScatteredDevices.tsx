import { motion } from "framer-motion";
import { useMemo } from "react";
import { Wifi } from "lucide-react";

const ScatteredDevices = () => {
  const devices = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    }));
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-1">Scattered IoT Devices</h2>
      <p className="text-xs text-muted-foreground mb-4">Devices Online: {devices.length}</p>

      <div className="relative h-[220px] bg-background rounded-lg border border-border overflow-hidden">
        {devices.map((d) => (
          <motion.div
            key={d.id}
            className="absolute flex flex-col items-center"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: d.id * 0.05 }}
          >
            <motion.div
              animate={{ boxShadow: ["0 0 0px hsl(217 91% 60% / 0)", "0 0 10px hsl(217 91% 60% / 0.4)", "0 0 0px hsl(217 91% 60% / 0)"] }}
              transition={{ repeat: Infinity, duration: 2, delay: d.id * 0.2 }}
              className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center"
            >
              <Wifi className="w-2.5 h-2.5 text-primary" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ScatteredDevices;
