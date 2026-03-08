import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

const NeighborDiscovery = () => {
  const [discoveredCount, setDiscoveredCount] = useState(0);

  // Scatter nodes in a natural layout
  const nodes = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2 + i * 0.5;
      const radius = 18 + ((i * 13) % 22);
      return {
        id: i,
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
      };
    });
  }, []);

  // Only connect nearby nodes (within radius threshold)
  const connections = useMemo(() => {
    const conns: { from: number; to: number }[] = [];
    const threshold = 28;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (dist < threshold) conns.push({ from: i, to: j });
      }
    }
    return conns;
  }, [nodes]);

  // Gradually discover connections
  useEffect(() => {
    if (connections.length === 0) return;
    const interval = setInterval(() => {
      setDiscoveredCount((p) => {
        if (p >= connections.length) {
          clearInterval(interval);
          return p;
        }
        return p + 1;
      });
    }, 150);
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
        <span>
          Neighbors Detected:{" "}
          <span className="text-foreground">{discoveredCount}</span>
        </span>
        <span>
          Connectivity:{" "}
          <span className="text-foreground">
            {connections.length > 0 ? Math.round((discoveredCount / connections.length) * 100) : 0}%
          </span>
        </span>
      </div>

      <div className="relative h-[220px] bg-background rounded-lg border border-border overflow-hidden">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          {connections.slice(0, discoveredCount).map((c, i) => (
            <motion.line
              key={i}
              x1={`${nodes[c.from].x}%`}
              y1={`${nodes[c.from].y}%`}
              x2={`${nodes[c.to].x}%`}
              y2={`${nodes[c.to].y}%`}
              stroke="hsl(0 0% 35%)"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.4 }}
            />
          ))}

          {/* Data packets moving along discovered connections */}
          {connections.slice(0, discoveredCount).map((c, i) => (
            <motion.circle
              key={`pkt-${i}`}
              r="2"
              fill="hsl(0 0% 100%)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                cx: [`${nodes[c.from].x}%`, `${nodes[c.to].x}%`],
                cy: [`${nodes[c.from].y}%`, `${nodes[c.to].y}%`],
              }}
              transition={{
                duration: 3,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
            />
          ))}
        </svg>

        {/* Nodes */}
        {nodes.map((n) => (
          <motion.div
            key={n.id}
            className="absolute w-3 h-3 rounded-full border border-muted-foreground bg-muted-foreground/20"
            style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: n.id * 0.05 }}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default NeighborDiscovery;
