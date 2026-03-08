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
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Post-Quantum Encryption Output
      </h2>

      {loading && (
        <div className="flex items-center gap-2 mb-4 text-sm text-primary">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          Encrypting IoT Data...
        </div>
      )}

      <div className="bg-background rounded-lg border border-border p-4 max-h-[300px] overflow-auto">
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
