import { useState } from "react";
import axios from "axios";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IoTNetworkMap from "@/components/dashboard/IoTNetworkMap";
import ClusterHeadSelection from "@/components/dashboard/ClusterHeadSelection";
import ConsensusProtocol from "@/components/dashboard/ConsensusProtocol";
import EncryptionEngine from "@/components/dashboard/EncryptionEngine";
import BlockchainLog from "@/components/dashboard/BlockchainLog";
import SystemConsole from "@/components/dashboard/SystemConsole";
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
    <div className="min-h-screen bg-background grid-bg relative">
      <div className="scan-line fixed inset-0 pointer-events-none z-50 h-[200%]" />
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <DashboardHeader />

        {error && (
          <div className="glass-panel border-destructive/50 bg-destructive/10 p-4 text-destructive font-mono text-sm">
            {error}
          </div>
        )}

        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IoTNetworkMap />
          <ClusterHeadSelection />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConsensusProtocol />
          <EncryptionEngine encryptedData={encryptedData} loading={loading} />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemConsole />
          <BlockchainLog txHash={txHash} />
        </div>

        <ControlPanel onRun={runDemo} loading={loading} />
      </div>
    </div>
  );
};

export default Index;
