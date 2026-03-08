import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const delegates = [
  { id: "D-1", vote: "approve", weight: 24 },
  { id: "D-2", vote: "approve", weight: 31 },
  { id: "D-3", vote: "approve", weight: 18 },
  { id: "D-4", vote: "reject", weight: 12 },
  { id: "D-5", vote: "approve", weight: 15 },
];

const ConsensusProtocol = () => {
  const [votesRevealed, setVotesRevealed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVotesRevealed((prev) => {
        if (prev >= delegates.length) {
          setTimeout(() => setVotesRevealed(0), 3000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const totalWeight = delegates.reduce((s, d) => s + d.weight, 0);
  const approveWeight = delegates
    .filter((d, i) => i < votesRevealed && d.vote === "approve")
    .reduce((s, d) => s + d.weight, 0);
  const rejectWeight = delegates
    .filter((d, i) => i < votesRevealed && d.vote === "reject")
    .reduce((s, d) => s + d.weight, 0);

  const consensusReached = votesRevealed >= delegates.length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel neon-glow-blue p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground mb-4 neon-text-blue">
        Consensus Protocol
      </h2>

      <div className="space-y-3 mb-5">
        {delegates.map((d, i) => (
          <div key={d.id} className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground w-10">{d.id}</span>
            <div className="flex-1 h-6 bg-muted/30 rounded-md overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i < votesRevealed ? `${(d.weight / totalWeight) * 100}%` : 0 }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-md ${
                  d.vote === "approve" ? 'bg-neon-green/40' : 'bg-neon-red/40'
                }`}
              />
              {i < votesRevealed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center px-2 text-xs font-mono"
                >
                  <span className={d.vote === "approve" ? "text-neon-green" : "text-neon-red"}>
                    {d.vote.toUpperCase()} ({d.weight}%)
                  </span>
                </motion.span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-muted/20 border border-border text-center">
          <div className="text-muted-foreground mb-1">Approve</div>
          <div className="text-neon-green font-bold text-lg">{approveWeight}%</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/20 border border-border text-center">
          <div className="text-muted-foreground mb-1">Reject</div>
          <div className="text-neon-red font-bold text-lg">{rejectWeight}%</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/20 border border-border text-center">
          <div className="text-muted-foreground mb-1">Block Proposal</div>
          <div className={`font-bold text-lg ${consensusReached ? 'text-neon-green' : 'text-muted-foreground'}`}>
            {consensusReached ? "APPROVED" : "PENDING"}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ConsensusProtocol;
