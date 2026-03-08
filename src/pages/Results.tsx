import { motion } from "framer-motion";
import NavHeader from "@/components/dashboard/NavHeader";
import { BarChart3, Activity, Zap, CheckCircle } from "lucide-react";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.5 } });

const Section = ({ title, icon: Icon, children, delay = 0 }: { title: string; icon: React.ElementType; children: React.ReactNode; delay?: number }) => (
  <motion.section {...fade(delay)} className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-4">
    <div className="flex items-center gap-3 mb-2">
      <Icon className="w-5 h-5 text-foreground" />
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </div>
    {children}
  </motion.section>
);

const lifetimeData = [
  { algorithm: "LEACH", lifetime: "~120 rounds", notes: "Early node death due to random CH selection" },
  { algorithm: "CHEF", lifetime: "~135 rounds", notes: "Fuzzy logic improves over LEACH" },
  { algorithm: "HEED", lifetime: "~140 rounds", notes: "Better energy distribution" },
  { algorithm: "DEEC", lifetime: "~145 rounds", notes: "Heterogeneous energy awareness" },
  { algorithm: "K-Means", lifetime: "~165 rounds", notes: "Distance-optimized clusters" },
  { algorithm: "Custom MCDM/WSM", lifetime: "~175 rounds", notes: "Best balance of energy and fairness" },
];

const Results = () => (
  <div className="min-h-screen bg-background">
    <NavHeader />
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <motion.div {...fade(0)} className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Results & Analysis</h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Comparative evaluation of clustering algorithms, consensus performance, and security analysis.
        </p>
      </motion.div>

      {/* Network Lifetime */}
      <Section title="Network Lifetime Comparison" icon={Activity} delay={0.1}>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Network lifetime is measured as the number of rounds until the first node exhausts its energy (FND — First Node Dead).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-foreground font-medium">Algorithm</th>
                <th className="text-left py-2 text-foreground font-medium">Lifetime</th>
                <th className="text-left py-2 text-foreground font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {lifetimeData.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 font-mono text-xs text-foreground">{row.algorithm}</td>
                  <td className="py-2 text-muted-foreground">{row.lifetime}</td>
                  <td className="py-2 text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Simple bar visualization */}
        <div className="mt-6 space-y-2">
          {lifetimeData.map((row, i) => {
            const pct = parseInt(row.lifetime.replace(/\D/g, "")) / 200 * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground w-28 shrink-0">{row.algorithm}</span>
                <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                    className="h-full bg-foreground rounded-full"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">{row.lifetime.replace("~", "")}</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Fairness */}
      <Section title="Fairness Metrics" icon={BarChart3} delay={0.15}>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Fairness is evaluated using Jain's Fairness Index, measuring how evenly cluster head roles are distributed across nodes over the simulation period.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {[
              { alg: "LEACH", score: "0.72" },
              { alg: "CHEF", score: "0.78" },
              { alg: "HEED", score: "0.81" },
              { alg: "DEEC", score: "0.83" },
              { alg: "K-Means", score: "0.88" },
              { alg: "MCDM/WSM", score: "0.91" },
            ].map((item, i) => (
              <div key={i} className="bg-secondary rounded-lg p-3 text-center">
                <p className="font-mono text-xs text-muted-foreground">{item.alg}</p>
                <p className="text-lg font-bold text-foreground mt-1">{item.score}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Cluster Head Distribution */}
      <Section title="Cluster Head Distribution" icon={Zap} delay={0.2}>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>The custom MCDM/WSM approach achieves the most balanced cluster head distribution, preventing energy hotspots by considering residual energy, proximity to the base station, and neighbor density.</p>
          <p>K-Means produces geographically optimal clusters but does not account for node energy levels. LEACH suffers from random selection bias, leading to premature node failures.</p>
        </div>
      </Section>

      {/* Consensus Performance */}
      <Section title="Consensus Performance" icon={CheckCircle} delay={0.25}>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>The Extended DPoL consensus achieves block finality within milliseconds, significantly faster than PoW-based alternatives. The median-based proposer selection ensures fairness across rounds.</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Avg. Consensus Time</p>
              <p className="text-xl font-bold text-foreground mt-1 font-mono">&lt; 50 ms</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Delegate Count</p>
              <p className="text-xl font-bold text-foreground mt-1 font-mono">log(n)</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Proposer Selection</p>
              <p className="text-xl font-bold text-foreground mt-1 font-mono">Median</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Approval Threshold</p>
              <p className="text-xl font-bold text-foreground mt-1 font-mono">&gt; 50%</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Key Findings */}
      <motion.section {...fade(0.3)} className="bg-card border border-border rounded-lg p-6 md:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Key Findings</h2>
        <ul className="space-y-2">
          {[
            "K-Means and Custom MCDM/WSM clustering achieve the longest network lifetime and best energy distribution.",
            "The Extended DPoL consensus reduces computational overhead compared to PoW while maintaining decentralization.",
            "Kyber-512 + AES-GCM provides post-quantum security with minimal computational overhead suitable for IoT devices.",
            "The integrated framework demonstrates that clustering, consensus, and encryption can coexist efficiently in resource-constrained IoT networks.",
          ].map((finding, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-foreground mt-0.5 shrink-0">✓</span>
              <span className="text-muted-foreground leading-relaxed">{finding}</span>
            </li>
          ))}
        </ul>
      </motion.section>
    </div>
  </div>
);

export default Results;
