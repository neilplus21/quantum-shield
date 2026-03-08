import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavHeader from "@/components/dashboard/NavHeader";
import PipelineTracker from "@/components/dashboard/PipelineTracker";
import { Play, Radio, GitBranch, Vote, Lock, ArrowRight } from "lucide-react";

const actions = [
  { label: "Play Full Demo", description: "Run the entire pipeline automatically", path: "/demo", icon: Play },
  { label: "Explore IoT Network", description: "View scattered devices and neighbor discovery", path: "/iot-network", icon: Radio },
  { label: "Explore Clustering", description: "Cluster head selection and data aggregation", path: "/clustering", icon: GitBranch },
  { label: "Explore Consensus", description: "Extended DPoL consensus protocol", path: "/consensus", icon: Vote },
  { label: "Encryption & Blockchain", description: "Post-quantum encryption and blockchain logging", path: "/encryption", icon: Lock },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Quantum Secure IoT Blockchain System
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Distributed IoT security architecture using clustering, consensus, post-quantum encryption, and blockchain logging.
          </p>
        </motion.div>

        {/* Pipeline overview */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="text-xs text-muted-foreground mb-3 text-center">Architecture Pipeline</p>
          <PipelineTracker activeStage={-1} />
        </motion.div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.path}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                onClick={() => navigate(action.path)}
                className="group bg-card border border-border rounded-lg p-5 text-left hover:border-foreground/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className="w-5 h-5 text-foreground" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{action.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
