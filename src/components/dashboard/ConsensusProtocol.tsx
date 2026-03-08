import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const clusterHeads = [
  { id: "CH-1", value: 0 },
  { id: "CH-2", value: 0 },
  { id: "CH-3", value: 0 },
  { id: "CH-4", value: 0 },
];

const ConsensusProtocol = () => {
  const [phase, setPhase] = useState(0); // 0=init, 1=random, 2=median, 3=delegates, 4=voting, 5=achieved
  const [nodes, setNodes] = useState(clusterHeads);
  const [median, setMedian] = useState(0);
  const [proposer, setProposer] = useState("");
  const [delegates, setDelegates] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Generate random numbers
    timers.push(setTimeout(() => {
      const updated = clusterHeads.map((ch) => ({ ...ch, value: Math.random() }));
      setNodes(updated);
      setPhase(1);

      // Phase 2: Calculate median
      timers.push(setTimeout(() => {
        const sorted = [...updated].sort((a, b) => a.value - b.value);
        const mid = Math.floor(sorted.length / 2);
        const med = sorted.length % 2 === 0
          ? (sorted[mid - 1].value + sorted[mid].value) / 2
          : sorted[mid].value;
        setMedian(med);

        // Find proposer (closest to median)
        let closest = sorted[0];
        sorted.forEach((n) => {
          if (Math.abs(n.value - med) < Math.abs(closest.value - med)) closest = n;
        });
        setProposer(closest.id);

        // Delegates = top log(n) nodes
        const logN = Math.max(2, Math.round(Math.log2(updated.length)));
        const dels = sorted.slice(0, logN).map((n) => n.id);
        setDelegates(dels);
        setPhase(2);

        // Phase 3: Show delegates
        timers.push(setTimeout(() => {
          setPhase(3);

          // Phase 4: Voting animation
          timers.push(setTimeout(() => {
            setPhase(4);
            const voteObj: Record<string, number> = {};
            dels.forEach((d) => { voteObj[d] = 0; });

            let tick = 0;
            const voteInterval = setInterval(() => {
              tick++;
              const newVotes: Record<string, number> = {};
              dels.forEach((d) => {
                newVotes[d] = Math.min(100, (tick / 8) * 100 * (0.7 + Math.random() * 0.3));
              });
              setVotes(newVotes);
              if (tick >= 8) {
                clearInterval(voteInterval);
                dels.forEach((d) => { newVotes[d] = 100; });
                setVotes({ ...newVotes });
                setTimeout(() => setPhase(5), 500);
              }
            }, 300);
          }, 800));
        }, 800));
      }, 1000));
    }, 600));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Extended DPoL Consensus Protocol
      </h2>

      {/* Random numbers */}
      {phase >= 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Generated Random Values</p>
          <div className="grid grid-cols-4 gap-2">
            {nodes.map((n) => (
              <div key={n.id} className={`text-center p-2 rounded border text-xs font-mono ${
                n.id === proposer && phase >= 2
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "bg-muted/50 border-border text-foreground"
              }`}>
                <div className="text-muted-foreground text-[10px]">{n.id}</div>
                <div>{n.value.toFixed(4)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Median & Proposer */}
      {phase >= 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex gap-4 text-xs">
          <div className="bg-muted/50 border border-border rounded p-2 flex-1 text-center">
            <div className="text-muted-foreground text-[10px]">Median Value</div>
            <div className="font-mono text-foreground">{median.toFixed(4)}</div>
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded p-2 flex-1 text-center">
            <div className="text-muted-foreground text-[10px]">Proposer</div>
            <div className="font-mono text-primary">{proposer}</div>
          </div>
        </motion.div>
      )}

      {/* Delegates */}
      {phase >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">
            Delegates (top {delegates.length})
          </p>
          <div className="flex gap-2">
            {delegates.map((d) => (
              <span key={d} className="text-xs font-mono px-2 py-1 rounded bg-secondary/15 border border-secondary/30 text-secondary">
                {d}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Voting */}
      {phase >= 4 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 space-y-2">
          <p className="text-xs text-muted-foreground mb-1">Delegate Voting</p>
          {delegates.map((d) => (
            <div key={d} className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground w-8">{d}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-secondary rounded-full"
                  animate={{ width: `${votes[d] || 0}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
                {Math.round(votes[d] || 0)}%
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {phase >= 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center"
        >
          <span className="text-sm font-medium text-green-400">✓ Consensus Achieved</span>
        </motion.div>
      )}
    </motion.section>
  );
};

export default ConsensusProtocol;
