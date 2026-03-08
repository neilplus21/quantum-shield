import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const encryptionStages = [
  "Generate Kyber ML-KEM keypair",
  "Encapsulate shared secret",
  "Derive AES-256 key",
  "AES-GCM encrypt IoT payload",
];

const logLines = [
  "[INFO] Generating Kyber keypair...",
  "[INFO] Shared secret derived",
  "[INFO] AES-256 key generated",
  "[INFO] Encrypting IoT payload",
  "[SUCCESS] Encryption complete",
];

interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
  kem_ciphertext: string;
}

interface EncryptionEngineProps {
  encryptedData: EncryptedData | null;
  loading: boolean;
}

const EncryptionEngine = ({ encryptedData, loading }: EncryptionEngineProps) => {
  const [activeStage, setActiveStage] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [displayedCipher, setDisplayedCipher] = useState("");
  const [cipherCharIdx, setCipherCharIdx] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const ciphertext = encryptedData?.ciphertext ?? "";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % (encryptionStages.length + 1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % (logLines.length + 2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter for real ciphertext
  useEffect(() => {
    if (!ciphertext) return;
    setCipherCharIdx(0);
    setDisplayedCipher("");
  }, [ciphertext]);

  useEffect(() => {
    if (!ciphertext) return;
    if (cipherCharIdx < ciphertext.length) {
      const timeout = setTimeout(() => {
        setDisplayedCipher(ciphertext.slice(0, cipherCharIdx + 1));
        setCipherCharIdx((prev) => prev + 1);
      }, 15);
      return () => clearTimeout(timeout);
    }
  }, [cipherCharIdx, ciphertext]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logIndex]);

  const fields = encryptedData
    ? [
        { label: "Ciphertext", value: displayedCipher || "—", typing: true },
        { label: "IV", value: encryptedData.iv },
        { label: "Auth Tag", value: encryptedData.tag },
        { label: "KEM Ciphertext", value: encryptedData.kem_ciphertext },
      ]
    : [
        { label: "Ciphertext", value: "Awaiting transmission…", typing: false },
        { label: "IV", value: "—" },
        { label: "Auth Tag", value: "—" },
        { label: "KEM Ciphertext", value: "—" },
      ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`glass-panel neon-glow-purple p-6 ${loading ? 'ring-2 ring-secondary/50' : ''}`}
    >
      <h2 className="font-display text-lg font-semibold text-foreground mb-4 neon-text-purple">
        Post-Quantum Encryption Output
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {encryptionStages.map((stage, i) => (
          <motion.div
            key={stage}
            animate={{
              borderColor: i === activeStage
                ? "hsl(270 70% 55% / 0.6)"
                : i < activeStage
                ? "hsl(145 80% 50% / 0.3)"
                : "hsl(220 30% 18%)",
            }}
            className={`p-3 rounded-lg border font-mono text-xs transition-colors ${
              i === activeStage
                ? 'bg-secondary/15 neon-glow-purple'
                : i < activeStage
                ? 'bg-neon-green/5'
                : 'bg-muted/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                i < activeStage
                  ? 'border-neon-green/50 text-neon-green'
                  : i === activeStage
                  ? 'border-secondary/50 text-secondary animate-pulse-neon'
                  : 'border-muted text-muted-foreground'
              }`}>
                {i < activeStage ? '✓' : i + 1}
              </span>
              <span className={i <= activeStage ? 'text-foreground' : 'text-muted-foreground'}>
                {stage}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-2 mb-5">
        {fields.map((field) => (
          <div key={field.label} className="font-mono text-xs">
            <span className="text-secondary">{field.label}: </span>
            <span className={`text-neon-cyan break-all ${field.typing ? 'typing-cursor' : ''}`}>
              {field.value}
            </span>
          </div>
        ))}
      </div>

      {/* Live Encryption Visualizer */}
      <div className="terminal-panel p-4 bg-background text-neon-green" ref={terminalRef}>
        <div className="text-xs text-muted-foreground mb-2 font-mono">
          — Live Encryption Visualizer —
        </div>
        {logLines.slice(0, logIndex).map((line, i) => (
          <motion.div
            key={`${line}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`font-mono text-xs ${
              line.includes("[SUCCESS]") ? 'text-neon-green' :
              line.includes("[ERROR]") ? 'text-neon-red' :
              'text-neon-cyan'
            }`}
          >
            {line}
          </motion.div>
        ))}
        {logIndex <= logLines.length && (
          <span className="font-mono text-xs text-neon-green animate-pulse-neon">▊</span>
        )}
      </div>
    </motion.section>
  );
};

export default EncryptionEngine;
