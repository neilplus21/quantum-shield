import { useState } from "react";
import axios from "axios";
import NavHeader from "@/components/dashboard/NavHeader";
import PipelineTracker from "@/components/dashboard/PipelineTracker";
import ScatteredDevices from "@/components/dashboard/ScatteredDevices";
import NeighborDiscovery from "@/components/dashboard/NeighborDiscovery";
import ClusterHeadSelection from "@/components/dashboard/ClusterHeadSelection";
import DataAggregation from "@/components/dashboard/DataAggregation";
import ConsensusProtocol from "@/components/dashboard/ConsensusProtocol";
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
  const [pipelineStage, setPipelineStage] = useState(-1);

  const runDemo = async () => {
    setLoading(true);
    setError(null);
    setTxHash(null);
    setEncryptedData(null);

    // Animate through stages
    for (let i = 0; i <= 4; i++) {
      setPipelineStage(i);
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Stage 5: Encryption (API call)
    setPipelineStage(5);
    try {
      const res = await axios.post("http://127.0.0.1:8000/run-demo");
      const { encrypted_payload, tx_hash } = res.data;
      const parsed: EncryptedData = JSON.parse(encrypted_payload);
      setEncryptedData(parsed);

      // Stage 6: Blockchain with delay
      setPipelineStage(6);
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
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        <PipelineTracker activeStage={pipelineStage} />
        <ControlPanel onRun={runDemo} loading={loading} />

        {/* Row 1: IoT Devices | Neighbor Discovery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScatteredDevices />
          <NeighborDiscovery />
        </div>

        {/* Row 2: Cluster Head Selection | Data Aggregation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClusterHeadSelection />
          <DataAggregation />
        </div>

        {/* Row 3: Consensus Protocol */}
        <ConsensusProtocol />

        {/* Row 4: Encryption | Blockchain */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EncryptionEngine encryptedData={encryptedData} loading={loading} />
          <BlockchainLog txHash={txHash} />
        </div>
      </div>
    </div>
  );
};

export default Index;
