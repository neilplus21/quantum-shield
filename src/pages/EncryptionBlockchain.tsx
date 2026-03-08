import { useState } from "react";
import axios from "axios";
import NavHeader from "@/components/dashboard/NavHeader";
import EncryptionEngine from "@/components/dashboard/EncryptionEngine";
import BlockchainLog from "@/components/dashboard/BlockchainLog";
import { Zap } from "lucide-react";

interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
  kem_ciphertext: string;
}

const EncryptionBlockchain = () => {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [encryptedData, setEncryptedData] = useState<EncryptedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runEncryption = async () => {
    setLoading(true);
    setError(null);
    setTxHash(null);
    setEncryptedData(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/run-demo");
      const { encrypted_payload, tx_hash } = res.data;
      setEncryptedData(JSON.parse(encrypted_payload));

      // Simulate blockchain confirmation delay
      await new Promise((r) => setTimeout(r, 4000));
      setTxHash(tx_hash);
    } catch {
      setError("Failed to execute secure IoT transmission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Encryption & Blockchain</h1>
          <p className="text-sm text-muted-foreground">
            Post-quantum encryption using Kyber ML-KEM with AES-256-GCM, followed by blockchain transaction logging on Ethereum Sepolia.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={runEncryption}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
              loading
                ? "bg-secondary text-muted-foreground cursor-wait"
                : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            <Zap className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`} />
            {loading ? "Processing…" : "Run Secure Transmission"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EncryptionEngine encryptedData={encryptedData} loading={loading} />
          <BlockchainLog txHash={txHash} />
        </div>
      </div>
    </div>
  );
};

export default EncryptionBlockchain;
