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
  <div
    className={`px-3 py-2 rounded-lg border text-xs font-mono ${
      data.isClusterHead
        ? 'bg-primary/20 border-primary/40 text-primary'
        : data.online
        ? 'bg-card border-border text-foreground'
        : 'bg-muted/30 border-border text-muted-foreground'
    }`}
  >
    {data.label}
  </div>
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
        style: { stroke: "hsl(220 70% 55% / 0.2)", strokeWidth: 1 },
        animated: true,
      });
    }
  });
  for (let i = 0; i < clusterHeads.length; i++) {
    const next = clusterHeads[(i + 1) % clusterHeads.length];
    edges.push({
      id: `e-ch-${clusterHeads[i]}-${next}`,
      source: `node-${clusterHeads[i]}`,
      target: `node-${next}`,
      style: { stroke: "hsl(220 70% 55% / 0.4)", strokeWidth: 2 },
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
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">
        IoT Network Map
      </h2>
      <div className="flex gap-6 mb-4">
        {[
          { label: "Devices Online", value: `${stats.online}/${stats.total}` },
          { label: "Cluster Heads", value: stats.clusterHeads },
          { label: "Status", value: "ACTIVE" },
        ].map((stat) => (
          <div key={stat.label} className="font-mono text-xs">
            <span className="text-muted-foreground">{stat.label}: </span>
            <span className="text-foreground">{String(stat.value)}</span>
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
          <Background color="hsl(220 15% 20%)" gap={30} size={1} />
        </ReactFlow>
      </div>
    </motion.section>
  );
};

export default IoTNetworkMap;
