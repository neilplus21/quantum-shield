import { motion } from "framer-motion";
import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const IoTNode = ({ data }: { data: { label: string; isClusterHead: boolean; online: boolean } }) => (
  <motion.div
    animate={data.online ? { 
      boxShadow: [
        `0 0 8px ${data.isClusterHead ? 'hsl(270 70% 55% / 0.5)' : 'hsl(220 90% 56% / 0.3)'}`,
        `0 0 20px ${data.isClusterHead ? 'hsl(270 70% 55% / 0.8)' : 'hsl(220 90% 56% / 0.6)'}`,
        `0 0 8px ${data.isClusterHead ? 'hsl(270 70% 55% / 0.5)' : 'hsl(220 90% 56% / 0.3)'}`,
      ]
    } : {}}
    transition={{ duration: 2, repeat: Infinity }}
    className={`px-3 py-2 rounded-lg border text-xs font-mono ${
      data.isClusterHead
        ? 'bg-secondary/20 border-secondary/50 text-secondary'
        : data.online
        ? 'bg-primary/10 border-primary/30 text-primary'
        : 'bg-muted/30 border-muted text-muted-foreground'
    }`}
  >
    {data.label}
  </motion.div>
);

const nodeTypes: NodeTypes = { iot: IoTNode };

const generateNodes = (): Node[] => {
  const nodes: Node[] = [];
  const clusterHeads = [0, 5, 10, 15];
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const radius = clusterHeads.includes(i) ? 120 : 200 + Math.random() * 60;
    nodes.push({
      id: `node-${i}`,
      type: "iot",
      position: {
        x: 300 + Math.cos(angle) * radius,
        y: 220 + Math.sin(angle) * radius,
      },
      data: {
        label: clusterHeads.includes(i) ? `CH-${i}` : `IoT-${i}`,
        isClusterHead: clusterHeads.includes(i),
        online: Math.random() > 0.1,
      },
    });
  }
  return nodes;
};

const generateEdges = (nodes: Node[]): Edge[] => {
  const edges: Edge[] = [];
  const clusterHeads = [0, 5, 10, 15];
  nodes.forEach((node, i) => {
    if (!clusterHeads.includes(i)) {
      const nearest = clusterHeads.reduce((prev, curr) =>
        Math.abs(curr - i) < Math.abs(prev - i) ? curr : prev
      );
      edges.push({
        id: `e-${i}-${nearest}`,
        source: `node-${i}`,
        target: `node-${nearest}`,
        style: { stroke: "hsl(220 90% 56% / 0.3)", strokeWidth: 1 },
        animated: true,
      });
    }
  });
  // Connect cluster heads
  for (let i = 0; i < clusterHeads.length; i++) {
    const next = clusterHeads[(i + 1) % clusterHeads.length];
    edges.push({
      id: `e-ch-${clusterHeads[i]}-${next}`,
      source: `node-${clusterHeads[i]}`,
      target: `node-${next}`,
      style: { stroke: "hsl(270 70% 55% / 0.5)", strokeWidth: 2 },
      animated: true,
    });
  }
  return edges;
};

const IoTNetworkMap = () => {
  const nodes = useMemo(() => generateNodes(), []);
  const edges = useMemo(() => generateEdges(nodes), [nodes]);

  const onInit = useCallback(() => {}, []);

  const stats = useMemo(() => ({
    online: nodes.filter(n => n.data.online).length,
    clusterHeads: nodes.filter(n => n.data.isClusterHead).length,
    total: nodes.length,
  }), [nodes]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-panel neon-glow-blue p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground mb-4 neon-text-blue">
        IoT Network Map
      </h2>
      <div className="flex gap-6 mb-4">
        {[
          { label: "Devices Online", value: `${stats.online}/${stats.total}`, color: "text-neon-green" },
          { label: "Cluster Heads", value: stats.clusterHeads, color: "text-secondary" },
          { label: "Network Status", value: "ACTIVE", color: "text-neon-cyan" },
        ].map((stat) => (
          <div key={stat.label} className="font-mono text-xs">
            <span className="text-muted-foreground">{stat.label}: </span>
            <span className={stat.color}>{stat.value}</span>
          </div>
        ))}
      </div>
      <div className="h-[400px] rounded-lg border border-border overflow-hidden bg-background/50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={onInit}
          fitView
          proOptions={{ hideAttribution: true }}
          style={{ background: "transparent" }}
        >
          <Background color="hsl(220 30% 18%)" gap={30} size={1} />
        </ReactFlow>
      </div>
    </motion.section>
  );
};

export default IoTNetworkMap;
