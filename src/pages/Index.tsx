import { useState } from "react";
import axios from "axios";
import NavHeader from "@/components/dashboard/NavHeader";
import IoTNetworkMap from "@/components/dashboard/IoTNetworkMap";
import EncryptionEngine from "@/components/dashboard/EncryptionEngine";
import BlockchainLog from "@/components/dashboard/BlockchainLog";
import ControlPanel from "@/components/dashboard/ControlPanel";

interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
  kem_ciphertext: string;
}

const Index = () => {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [encryptedData, setEncryptedData] = useState<EncryptedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/run-demo");
      const { encrypted_payload, tx_hash } = res.data;
      const parsed: EncryptedData = JSON.parse(encrypted_payload);
      setEncryptedData(parsed);
      setTxHash(tx_hash);
    } catch {
      setError("Failed to run secure IoT transmission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        <ControlPanel onRun={runDemo} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IoTNetworkMap />
          <EncryptionEngine encryptedData={encryptedData} loading={loading} />
        </div>

        <BlockchainLog txHash={txHash} />
      </div>
    </div>
  );
};

export default Index;
