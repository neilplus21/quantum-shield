import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import NavHeader from "@/components/dashboard/NavHeader";
import PipelineTracker from "@/components/dashboard/PipelineTracker";
import { CheckCircle, Loader2, ExternalLink, Copy, Check } from "lucide-react";

interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
  kem_ciphertext: string;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Scattered IoT Devices Panel ──
const ScatteredDevicesPanel = ({ active }: { active: boolean }) => {
  const devices = useMemo(() => {
    const chs = [0, 6, 12];
    return Array.from({ length: 18 }, (_, i) => {
      const isCH = chs.includes(i);
      const angle = (i / 18) * Math.PI * 2 + i * 0.3;
      const radius = isCH ? 25 : 15 + ((i * 17) % 30);
      return { id: i, x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius, isCH, label: isCH ? `CH-${chs.indexOf(i) + 1}` : null };
    });
  }, []);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-1">Scattered IoT Devices</h2>
      <p className="text-xs text-muted-foreground mb-4">Devices Online: <span className="text-foreground">18</span></p>
      <div className="relative h-[220px] bg-background rounded-lg border border-border overflow-hidden">
        {devices.map((d) => (
          <motion.div key={d.id} className="absolute flex flex-col items-center" style={{ left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: d.id * 0.04, duration: 0.3 }}>
            <motion.div
              animate={d.isCH ? { scale: [1, 1.1, 1] } : active ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={d.isCH ? { repeat: Infinity, duration: 2.5 } : active ? { repeat: Infinity, duration: 1.5 } : {}}
              className={`rounded-full border ${d.isCH ? "w-5 h-5 border-2 border-foreground bg-foreground/10" : "w-3 h-3 border-muted-foreground bg-muted-foreground/20"}`}
            />
            {d.label && <span className="text-[9px] text-muted-foreground mt-1 font-mono">{d.label}</span>}
          </motion.div>
        ))}
        {/* Broadcast rings when active */}
        {active && devices.filter(d => d.isCH).map(d => (
          <motion.div key={`ring-${d.id}`} className="absolute rounded-full border border-foreground/20"
            style={{ left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%, -50%)" }}
            animate={{ width: [8, 40], height: [8, 40], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: d.id * 0.2 }}
          />
        ))}
      </div>
    </motion.section>
  );
};

// ── Neighbor Discovery Panel ──
const NeighborDiscoveryPanel = ({ active }: { active: boolean }) => {
  const [discoveredCount, setDiscoveredCount] = useState(0);

  const nodes = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 + i * 0.5;
    const radius = 18 + ((i * 13) % 22);
    return { id: i, x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
  }), []);

  const connections = useMemo(() => {
    const conns: { from: number; to: number }[] = [];
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++)
        if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < 28)
          conns.push({ from: i, to: j });
    return conns;
  }, [nodes]);

  useEffect(() => {
    if (!active) return;
    setDiscoveredCount(0);
    const interval = setInterval(() => {
      setDiscoveredCount(p => {
        if (p >= connections.length) { clearInterval(interval); return p; }
        return p + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [active, connections.length]);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-1">Neighbor Discovery</h2>
      <div className="flex gap-4 text-xs text-muted-foreground mb-4">
        <span>Neighbors Detected: <span className="text-foreground">{discoveredCount}</span></span>
        <span>Connectivity: <span className="text-foreground">{connections.length > 0 ? Math.round((discoveredCount / connections.length) * 100) : 0}%</span></span>
      </div>
      <div className="relative h-[220px] bg-background rounded-lg border border-border overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {connections.slice(0, discoveredCount).map((c, i) => (
            <motion.line key={i} x1={`${nodes[c.from].x}%`} y1={`${nodes[c.from].y}%`} x2={`${nodes[c.to].x}%`} y2={`${nodes[c.to].y}%`}
              stroke="hsl(0 0% 35%)" strokeWidth="1" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 0.4 }} />
          ))}
          {connections.slice(0, discoveredCount).map((c, i) => (
            <motion.circle key={`pkt-${i}`} r="2" fill="hsl(0 0% 100%)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0], cx: [`${nodes[c.from].x}%`, `${nodes[c.to].x}%`], cy: [`${nodes[c.from].y}%`, `${nodes[c.to].y}%`] }}
              transition={{ duration: 3, delay: i * 0.3, repeat: Infinity, repeatDelay: 2, ease: "linear" }} />
          ))}
        </svg>
        {nodes.map(n => (
          <motion.div key={n.id} className="absolute w-3 h-3 rounded-full border border-muted-foreground bg-muted-foreground/20"
            style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: n.id * 0.05 }} />
        ))}
      </div>
    </motion.section>
  );
};

// ── Cluster Head Selection Panel ──
const ClusterHeadPanel = ({ active }: { active: boolean }) => {
  const stages = ["Normalizing node metrics", "Calculating weighted scores (WSM)", "Selecting cluster heads"];
  const chs = [{ id: "CH-1", score: 0.94 }, { id: "CH-2", score: 0.89 }, { id: "CH-3", score: 0.91 }];
  const [activeStage, setActiveStage] = useState(-1);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!active) return;
    setActiveStage(0); setComplete(false);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= stages.length) { setComplete(true); clearInterval(interval); }
      else setActiveStage(step);
    }, 800);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">Cluster Head Selection</h2>
      <div className="space-y-3 mb-5">
        {stages.map((s, i) => (
          <motion.div key={s} initial={{ opacity: 0.3 }} animate={{ opacity: i <= activeStage ? 1 : 0.3 }} className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-500 ${i < activeStage ? "bg-green-500" : i === activeStage ? "bg-foreground animate-pulse" : "bg-muted"}`} />
            <span className="text-sm text-foreground">{s}</span>
          </motion.div>
        ))}
      </div>
      {complete && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">Selected Cluster Heads</p>
          <div className="grid grid-cols-3 gap-2">
            {chs.map((ch, i) => (
              <motion.div key={ch.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="bg-foreground/10 border border-foreground/30 rounded-lg p-3 text-center">
                <div className="text-sm font-mono text-foreground font-semibold">{ch.id}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Score: {ch.score}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

// ── Data Aggregation Panel ──
const DataAggregationPanel = ({ active }: { active: boolean }) => {
  const clusterHeads = [{ id: "CH-1", members: 4 }, { id: "CH-2", members: 5 }, { id: "CH-3", members: 3 }, { id: "CH-4", members: 4 }];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); return 100; } return p + 4; });
    }, 60);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-1">Cluster Data Aggregation</h2>
      <p className="text-xs text-muted-foreground mb-4">Aggregating Sensor Data</p>
      <div className="space-y-3">
        {clusterHeads.map((ch, i) => {
          const chP = Math.min(100, Math.max(0, progress - i * 10));
          return (
            <div key={ch.id} className="flex items-center gap-3">
              <div className="w-10 text-xs font-mono text-foreground">{ch.id}</div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full bg-foreground/60 rounded-full" animate={{ width: `${chP}%` }} transition={{ duration: 0.2 }} />
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: ch.members }, (_, j) => (
                  <motion.div key={j} className="w-2 h-2 rounded-full"
                    animate={{ backgroundColor: chP > (j + 1) * (100 / ch.members) ? "hsl(0 0% 100%)" : "hsl(0 0% 20%)" }}
                    transition={{ duration: 0.3 }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {progress >= 100 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-xs font-medium text-green-400">✓ Aggregation Complete</motion.div>
      )}
    </motion.section>
  );
};

// ── Consensus Protocol Panel ──
const ConsensusPanel = ({ active }: { active: boolean }) => {
  const chData = [{ id: "CH-1" }, { id: "CH-2" }, { id: "CH-3" }, { id: "CH-4" }];
  const [phase, setPhase] = useState(0);
  const [nodes, setNodes] = useState(chData.map(c => ({ ...c, value: 0 })));
  const [median, setMedian] = useState(0);
  const [proposer, setProposer] = useState("");
  const [delegates, setDelegates] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!active) return;
    setPhase(0); setNodes(chData.map(c => ({ ...c, value: 0 }))); setMedian(0); setProposer(""); setDelegates([]); setVotes({});
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => {
      const updated = chData.map(ch => ({ ...ch, value: Math.random() }));
      setNodes(updated);
      setPhase(1);

      timers.push(setTimeout(() => {
        const sorted = [...updated].sort((a, b) => a.value - b.value);
        const mid = Math.floor(sorted.length / 2);
        const med = sorted.length % 2 === 0 ? (sorted[mid - 1].value + sorted[mid].value) / 2 : sorted[mid].value;
        setMedian(med);
        let closest = sorted[0];
        sorted.forEach(n => { if (Math.abs(n.value - med) < Math.abs(closest.value - med)) closest = n; });
        setProposer(closest.id);
        const logN = Math.max(2, Math.round(Math.log2(updated.length)));
        const dels = sorted.slice(0, logN).map(n => n.id);
        setDelegates(dels);
        setPhase(2);

        timers.push(setTimeout(() => {
          setPhase(3);
          timers.push(setTimeout(() => {
            setPhase(4);
            let tick = 0;
            const voteInterval = setInterval(() => {
              tick++;
              const nv: Record<string, number> = {};
              dels.forEach(d => { nv[d] = Math.min(100, (tick / 8) * 100 * (0.7 + Math.random() * 0.3)); });
              setVotes(nv);
              if (tick >= 8) {
                clearInterval(voteInterval);
                dels.forEach(d => { nv[d] = 100; });
                setVotes({ ...nv });
                setTimeout(() => setPhase(5), 500);
              }
            }, 300);
          }, 800));
        }, 800));
      }, 1000));
    }, 600));

    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">Extended DPoL Consensus Protocol</h2>
      {phase >= 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Generated Random Values</p>
          <div className="grid grid-cols-4 gap-2">
            {nodes.map(n => (
              <div key={n.id} className={`text-center p-2 rounded border text-xs font-mono ${n.id === proposer && phase >= 2 ? "bg-foreground/15 border-foreground/40 text-foreground" : "bg-muted/50 border-border text-foreground"}`}>
                <div className="text-muted-foreground text-[10px]">{n.id}</div>
                <div>{n.value.toFixed(4)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      {phase >= 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex gap-4 text-xs">
          <div className="bg-muted/50 border border-border rounded p-2 flex-1 text-center">
            <div className="text-muted-foreground text-[10px]">Median Value</div>
            <div className="font-mono text-foreground">{median.toFixed(4)}</div>
          </div>
          <div className="bg-foreground/10 border border-foreground/30 rounded p-2 flex-1 text-center">
            <div className="text-muted-foreground text-[10px]">Proposer</div>
            <div className="font-mono text-foreground">{proposer}</div>
          </div>
        </motion.div>
      )}
      {phase >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Delegates (top {delegates.length})</p>
          <div className="flex gap-2">
            {delegates.map(d => (
              <span key={d} className="text-xs font-mono px-2 py-1 rounded bg-muted/50 border border-border text-foreground">{d}</span>
            ))}
          </div>
        </motion.div>
      )}
      {phase >= 4 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 space-y-2">
          <p className="text-xs text-muted-foreground mb-1">Delegate Voting</p>
          {delegates.map(d => (
            <div key={d} className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground w-8">{d}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full bg-foreground/70 rounded-full" animate={{ width: `${votes[d] || 0}%` }} transition={{ duration: 0.2 }} />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{Math.round(votes[d] || 0)}%</span>
            </div>
          ))}
        </motion.div>
      )}
      {phase >= 5 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
          <span className="text-sm font-medium text-green-400">✓ Consensus Achieved</span>
        </motion.div>
      )}
    </motion.section>
  );
};

// ── Encryption Panel ──
const EncryptionPanel = ({ active, encryptedData }: { active: boolean; encryptedData: EncryptedData | null }) => {
  const stages = ["Generating Kyber ML-KEM Keypair", "Deriving AES-256 Key", "Encrypting IoT Data"];
  const fields = encryptedData
    ? [{ label: "Ciphertext", value: encryptedData.ciphertext }, { label: "IV", value: encryptedData.iv }, { label: "Authentication Tag", value: encryptedData.tag }, { label: "KEM Ciphertext", value: encryptedData.kem_ciphertext }]
    : [{ label: "Ciphertext", value: "Awaiting…" }, { label: "IV", value: "—" }, { label: "Authentication Tag", value: "—" }, { label: "KEM Ciphertext", value: "—" }];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">Post-Quantum Encryption Output</h2>
      {active && !encryptedData && (
        <div className="mb-4 space-y-2">
          {stages.map((s, i) => (
            <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              <span className="text-muted-foreground">{s}</span>
            </motion.div>
          ))}
        </div>
      )}
      <div className="bg-background rounded-lg border border-border p-4 max-h-[250px] overflow-auto">
        {fields.map(f => (
          <div key={f.label} className="mb-3 last:mb-0">
            <div className="text-xs text-muted-foreground mb-1">{f.label}</div>
            <div className="font-mono text-xs text-green-400 bg-background rounded p-2 overflow-x-auto whitespace-nowrap border border-border">{f.value}</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

// ── Blockchain Panel ──
const BlockchainPanel = ({ txHash, status }: { txHash: string | null; status: string }) => {
  const [copied, setCopied] = useState(false);
  const copyHash = async () => { if (!txHash) return; await navigator.clipboard.writeText(txHash); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">Blockchain Logging</h2>
      {status && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${txHash ? "bg-green-500" : "bg-foreground animate-pulse"}`} />
          <span className={`text-sm ${txHash ? "text-green-400" : "text-muted-foreground"}`}>{status}</span>
        </motion.div>
      )}
      {txHash && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Network</div>
            <div className="text-sm text-foreground">Ethereum Sepolia</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Transaction Hash</div>
            <div className="font-mono text-xs text-foreground bg-background rounded p-3 border border-border break-all">{txHash}</div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyHash} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Hash"}
            </button>
            <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors">
              <ExternalLink className="w-4 h-4" />View on Etherscan
            </a>
          </div>
        </motion.div>
      )}
      {!status && !txHash && <div className="text-sm text-muted-foreground py-8 text-center">Awaiting transaction…</div>}
    </motion.section>
  );
};

// ══════════════════════════════════
// ── Main Demo Page ──
// ══════════════════════════════════

const Demo = () => {
  const [stage, setStage] = useState(-1); // -1=idle, 0-6=pipeline stages
  const [pipelineStage, setPipelineStage] = useState(-1);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [encryptedData, setEncryptedData] = useState<EncryptedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [bcStatus, setBcStatus] = useState("");
  const [finished, setFinished] = useState(false);

  const runPipeline = useCallback(async () => {
    setRunning(true); setError(null); setStage(-1); setPipelineStage(-1);
    setTxHash(null); setEncryptedData(null); setBcStatus(""); setFinished(false);

    // Stage 0: IoT Devices (1.5s)
    setStage(0); setPipelineStage(0);
    await wait(1500);

    // Stage 1: Neighbor Discovery (2s)
    setStage(1); setPipelineStage(1);
    await wait(2000);

    // Stage 2: Cluster Head Selection (2.5s)
    setStage(2); setPipelineStage(2);
    await wait(2500);

    // Stage 3: Data Aggregation (2s)
    setStage(3); setPipelineStage(3);
    await wait(2000);

    // Stage 4: Consensus (4s)
    setStage(4); setPipelineStage(4);
    await wait(4000);

    // Stage 5: Encryption (API call)
    setStage(5); setPipelineStage(5);
    try {
      const res = await axios.post("http://127.0.0.1:8000/run-demo");
      const { encrypted_payload, tx_hash } = res.data;
      setEncryptedData(JSON.parse(encrypted_payload));

      // Stage 6: Blockchain
      setStage(6); setPipelineStage(6);
      setBcStatus("Broadcasting Transaction");
      await wait(1500);
      setBcStatus("Waiting for Network Confirmation");
      await wait(3000);
      setBcStatus("Transaction Confirmed");
      setTxHash(tx_hash);
    } catch {
      setError("Failed to execute secure IoT transmission.");
    } finally {
      setRunning(false);
      setFinished(true);
    }
  }, []);

  useEffect(() => { runPipeline(); }, [runPipeline]);

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Secure IoT Pipeline Simulation</h1>
          <p className="text-sm text-muted-foreground">Automated post-quantum secure transmission pipeline</p>
        </div>

        <PipelineTracker activeStage={pipelineStage} />

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">{error}</div>
        )}

        {/* Row 1: IoT Devices | Neighbor Discovery */}
        <AnimatePresence>
          {stage >= 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScatteredDevicesPanel active={stage === 0} />
              {stage >= 1 && <NeighborDiscoveryPanel active={stage === 1} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 2: Cluster Head Selection | Data Aggregation */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClusterHeadPanel active={stage >= 2} />
              {stage >= 3 && <DataAggregationPanel active={stage >= 3} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 3: Consensus */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ConsensusPanel active={stage >= 4} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 4: Encryption | Blockchain */}
        <AnimatePresence>
          {stage >= 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EncryptionPanel active={stage >= 5} encryptedData={encryptedData} />
              {stage >= 6 && <BlockchainPanel txHash={txHash} status={bcStatus} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Replay */}
        {finished && !running && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-4">
            <button onClick={runPipeline} className="px-6 py-3 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors">
              Replay Demo
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Demo;
