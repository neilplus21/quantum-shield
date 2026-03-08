import { motion } from "framer-motion";
import NavHeader from "@/components/dashboard/NavHeader";
import PipelineTracker from "@/components/dashboard/PipelineTracker";
import { Radio, GitBranch, Database, Vote, Lock, Blocks } from "lucide-react";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.5 } });

const stages = [
  {
    icon: Radio,
    title: "Stage 1 — IoT Device Initialization & Neighbor Discovery",
    description: "IoT nodes activate and broadcast beacon signals. Each node discovers nearby neighbors within communication range through signal exchange, forming an initial connectivity graph.",
  },
  {
    icon: GitBranch,
    title: "Stage 2 — Cluster Head Selection (MCDM/WSM)",
    description: "A multi-criteria decision-making approach using the Weighted Sum Method evaluates nodes based on residual energy, distance to base station, and neighbor count. The highest-scoring nodes are elected as cluster heads.",
  },
  {
    icon: Database,
    title: "Stage 3 — Cluster Data Aggregation",
    description: "Member nodes transmit sensor data to their assigned cluster heads. Cluster heads aggregate, compress, and prepare the data for secure transmission to the blockchain layer.",
  },
  {
    icon: Vote,
    title: "Stage 4 — Extended DPoL Consensus",
    description: "Cluster heads generate random luck values. The node closest to the median is selected as the block proposer. Top log(n) cluster heads serve as delegates and vote to validate the proposed block.",
  },
  {
    icon: Lock,
    title: "Stage 5 — Post-Quantum Encryption",
    description: "Aggregated IoT data is encrypted using Kyber-512 (ML-KEM) for key encapsulation and AES-256-GCM for symmetric encryption. This provides quantum-resistant confidentiality and integrity.",
  },
  {
    icon: Blocks,
    title: "Stage 6 — Blockchain Logging via Smart Contracts",
    description: "The encrypted payload is broadcast to the Ethereum Sepolia testnet via a smart contract. The transaction hash is recorded, providing an immutable and verifiable audit trail for IoT data.",
  },
];

const Architecture = () => (
  <div className="min-h-screen bg-background">
    <NavHeader />
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <motion.div {...fade(0)} className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">System Architecture</h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          End-to-end pipeline from IoT device activation to blockchain transaction confirmation.
        </p>
      </motion.div>

      <motion.div {...fade(0.1)}>
        <PipelineTracker activeStage={-1} />
      </motion.div>

      <div className="space-y-4">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <motion.div key={i} {...fade(0.15 + i * 0.06)} className="bg-card border border-border rounded-lg p-6 flex gap-5">
              <div className="shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{stage.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{stage.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

export default Architecture;
