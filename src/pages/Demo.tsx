import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import NavHeader from "@/components/dashboard/NavHeader";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
  kem_ciphertext: string;
}

const stages = [
  { label: "IoT Devices Activated", delay: 1000 },
  { label: "Cluster Heads Selected", delay: 1500 },
  { label: "Consensus Achieved", delay: 1500 },
  { label: "Post-Quantum Encryption Running", delay: 0 },
  { label: "Blockchain Transaction Broadcast", delay: 1000 },
  { label: "Transaction Confirmed", delay: 0 },
];

const Demo = () => {
  const [currentStage, setCurrentStage] = useState(-1);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [encryptedData, setEncryptedData] = useState<EncryptedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    runPipeline();
  }, []);

  const runPipeline = async () => {
    setRunning(true);
    setError(null);
    setCurrentStage(-1);
    setTxHash(null);
    setEncryptedData(null);

    // Stages 0-2: animated delays
    for (let i = 0; i < 3; i++) {
      await wait(stages[i].delay);
      setCurrentStage(i);
    }

    // Stage 3: API call
    setCurrentStage(3);
    try {
      const res = await axios.post("http://127.0.0.1:8000/run-demo");
      const { encrypted_payload, tx_hash } = res.data;
      const parsed: EncryptedData = JSON.parse(encrypted_payload);
      setEncryptedData(parsed);

      // Stage 4
      await wait(stages[4].delay);
      setCurrentStage(4);
      setTxHash(tx_hash);

      // Stage 5
      await wait(1000);
      setCurrentStage(5);
    } catch {
      setError("Failed to execute secure IoT transmission.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Secure IoT Pipeline Demo
          </h1>
          <p className="text-sm text-muted-foreground">
            Automated post-quantum secure transmission pipeline
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm mb-6">
            {error}
          </div>
        )}

        {/* Progress stages */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
          <div className="space-y-4">
            {stages.map((stage, i) => (
              <AnimatePresence key={stage.label}>
                {i <= currentStage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    {i < currentStage ? (
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    ) : i === currentStage && running ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    )}
                    <span className={`text-sm ${i <= currentStage ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stage.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>

        {/* Encryption output */}
        {encryptedData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm"
          >
            <h2 className="text-base font-semibold text-foreground mb-4">Encryption Output</h2>
            <div className="bg-background rounded-lg border border-border p-4 max-h-[200px] overflow-auto">
              {[
                { label: "Ciphertext", value: encryptedData.ciphertext },
                { label: "IV", value: encryptedData.iv },
                { label: "Auth Tag", value: encryptedData.tag },
                { label: "KEM Ciphertext", value: encryptedData.kem_ciphertext },
              ].map((f) => (
                <div key={f.label} className="mb-2 last:mb-0">
                  <div className="text-xs text-muted-foreground mb-1">{f.label}</div>
                  <div className="font-mono text-xs text-green-400 overflow-x-auto whitespace-nowrap">
                    {f.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Blockchain */}
        {txHash && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold text-foreground mb-4">Blockchain Transaction</h2>
            <div className="text-xs text-muted-foreground mb-1">Transaction Hash</div>
            <div className="font-mono text-xs text-foreground bg-background rounded p-2 border border-border truncate mb-4">
              {txHash}
            </div>
            <div className="rounded-lg border border-border overflow-hidden mb-4">
              <iframe
                src={`https://sepolia.etherscan.io/tx/${txHash}`}
                title="Etherscan Transaction"
                className="w-full bg-background"
                style={{ height: "500px" }}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Open in Etherscan
            </a>
          </motion.div>
        )}

        {/* Rerun */}
        {!running && currentStage >= 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-8">
            <button
              onClick={runPipeline}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Run Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default Demo;
