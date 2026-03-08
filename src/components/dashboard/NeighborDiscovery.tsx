import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

const NeighborDiscovery = () => {
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const totalPairs = 24;

  const nodes = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 15 + (i % 4) * 25,
      y: 15 + Math.floor(i / 4) * 30,
    })), []);

  const connections = useMemo(() => {
    const conns: { from: number; to: number }[] = [];
    nodes.forEach((n, i) => {
      nodes.forEach((m, j) => {
        if (j > i) {
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < 35) conns.push({ from: i, to: j });
        }
      });
    });
    return conns.slice(0, totalPairs);
  }, [nodes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDiscoveredCount((p) => {
        if (p >= connections.length) { clearInterval(interval); return p; }
        return p + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [connections.length]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-1">Neighbor Discovery</h2>
      <div className="flex gap-4 text-xs text-muted-foreground mb-4">
        <span>Neighbors Detected: <span className="text-foreground">{discoveredCount}</span></span>
        <span>Connectivity: <span className="text-foreground">{connections.length > 0 ? Math.round((discoveredCount / connections.length) * 100) : 0}%</span></span>
      </div>

      <div className="relative h-[220px] bg-background rounded-lg border border-border overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {connections.slice(0, discoveredCount).map((c, i) => (
            <motion.line
              key={i}
              x1={`${nodes[c.from].x}%`} y1={`${nodes[c.from].y}%`}
              x2={`${nodes[c.to].x}%`} y2={`${nodes[c.to].y}%`}
              stroke="hsl(217 91% 60% / 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </svg>
        {nodes.map((n) => (
          <div
            key={n.id}
            className="absolute w-4 h-4 rounded-full bg-primary/30 border border-primary/50"
            style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)" }}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default NeighborDiscovery;
