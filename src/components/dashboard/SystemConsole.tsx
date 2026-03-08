import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const logStream = [
  { type: "INFO", msg: "IoT nodes broadcasting data" },
  { type: "INFO", msg: "Cluster heads selected" },
  { type: "INFO", msg: "Consensus achieved" },
  { type: "INFO", msg: "Post-quantum encryption started" },
  { type: "INFO", msg: "Kyber ML-KEM keypair generated" },
  { type: "INFO", msg: "AES-256-GCM cipher initialized" },
  { type: "INFO", msg: "Payload encrypted successfully" },
  { type: "INFO", msg: "Transaction broadcast to Ethereum" },
  { type: "SUCCESS", msg: "Transaction confirmed on Sepolia" },
  { type: "INFO", msg: "Block finalized: #18432671" },
  { type: "INFO", msg: "Pipeline cycle complete" },
];

const SystemConsole = () => {
  const [logs, setLogs] = useState<typeof logStream>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev, logStream[index % logStream.length]];
        if (next.length > 30) next.shift();
        return next;
      });
      index++;
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const timestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour12: false });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-panel p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground mb-4 neon-text-cyan">
        System Log Console
      </h2>

      <div
        ref={containerRef}
        className="terminal-panel p-4 h-[280px] overflow-y-auto space-y-1"
      >
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-xs flex gap-2"
          >
            <span className="text-muted-foreground shrink-0">{timestamp()}</span>
            <span className={`shrink-0 ${
              log.type === "SUCCESS" ? "text-neon-green" :
              log.type === "ERROR" ? "text-neon-red" :
              "text-primary"
            }`}>
              [{log.type}]
            </span>
            <span className="text-foreground/80">{log.msg}</span>
          </motion.div>
        ))}
        <span className="font-mono text-xs text-neon-green animate-pulse-neon">▊</span>
      </div>
    </motion.section>
  );
};

export default SystemConsole;
