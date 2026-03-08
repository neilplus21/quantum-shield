import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IoTNetworkMap from "@/components/dashboard/IoTNetworkMap";
import ClusterHeadSelection from "@/components/dashboard/ClusterHeadSelection";
import ConsensusProtocol from "@/components/dashboard/ConsensusProtocol";
import EncryptionEngine from "@/components/dashboard/EncryptionEngine";
import BlockchainLog from "@/components/dashboard/BlockchainLog";
import SystemConsole from "@/components/dashboard/SystemConsole";
import ControlPanel from "@/components/dashboard/ControlPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background grid-bg relative">
      <div className="scan-line fixed inset-0 pointer-events-none z-50 h-[200%]" />
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IoTNetworkMap />
          <div className="space-y-6">
            <ClusterHeadSelection />
            <ConsensusProtocol />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EncryptionEngine />
          <BlockchainLog />
        </div>

        <SystemConsole />
        <ControlPanel />
      </div>
    </div>
  );
};

export default Index;
