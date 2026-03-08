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

const mockCiphertext = "a4f8e2c1d9b3f0e7a2c6d8f1b5e9a3c7d0f4b8e2a6c1d5f9b3e7a0c4d8f2b6e1a5c9d3f7b0e4a8c2d6f0b4e8a1c5d9f3b7e0a4c8d2f6b1e5a9c3d7f0b4e8";
const mockIV = "c3d9e5f1a7b2c8d4";
const mockAuthTag = "e7f3a9b5c1d7e3f9a5b1c7d3";
const mockKemCipher = "f2a8b4c0d6e2f8a4b0c6d2e8f4a0b6c2d8e4f0a6b2c8d4e0f6a2b8c4d0e6f2a8b4c0d6e2";

const EncryptionEngine = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [currentCipherIndex, setCurrentCipherIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (currentCipherIndex < mockCiphertext.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(mockCiphertext.slice(0, currentCipherIndex + 1));
        setCurrentCipherIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText("");
        setCurrentCipherIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentCipherIndex]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logIndex]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel neon-glow-purple p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground mb-4 neon-text-purple">
        Post-Quantum Encryption Engine
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
        {[
          { label: "Ciphertext", value: displayedText || "—", typing: true },
          { label: "IV", value: mockIV },
          { label: "Auth Tag", value: mockAuthTag },
          { label: "KEM Ciphertext", value: mockKemCipher },
        ].map((field) => (
          <div key={field.label} className="font-mono text-xs">
            <span className="text-secondary">{field.label}: </span>
            <span className={`text-neon-cyan break-all ${field.typing ? 'typing-cursor' : ''}`}>
              {field.value}
            </span>
          </div>
        ))}
      </div>

      <div className="terminal-panel p-4" ref={terminalRef}>
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
