import { motion } from "framer-motion";

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

const encryptionStages = [
  "Kyber ML-KEM Key Generation",
  "Shared Secret Encapsulation",
  "AES-256 Key Derivation",
  "AES-GCM Encryption",
];

const EncryptionEngine = ({ encryptedData, loading }: EncryptionEngineProps) => {
  const fields = encryptedData
    ? [
        { label: "Ciphertext", value: encryptedData.ciphertext },
        { label: "IV", value: encryptedData.iv },
        { label: "Authentication Tag", value: encryptedData.tag },
        { label: "KEM Ciphertext", value: encryptedData.kem_ciphertext },
      ]
    : [
        { label: "Ciphertext", value: "Awaiting transmission…" },
        { label: "IV", value: "—" },
        { label: "Authentication Tag", value: "—" },
        { label: "KEM Ciphertext", value: "—" },
      ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">Post-Quantum Encryption Output</h2>

      {loading && (
        <div className="mb-4 space-y-2">
          {encryptionStages.map((stage, i) => (
            <motion.div
              key={stage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.4 }}
              className="flex items-center gap-2 text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">{stage}</span>
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-background rounded-lg border border-border p-4 max-h-[250px] overflow-auto">
        {fields.map((field) => (
          <div key={field.label} className="mb-3 last:mb-0">
            <div className="text-xs text-muted-foreground mb-1">{field.label}</div>
            <div className="font-mono text-xs text-green-400 bg-background rounded p-2 overflow-x-auto whitespace-nowrap border border-border">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default EncryptionEngine;
