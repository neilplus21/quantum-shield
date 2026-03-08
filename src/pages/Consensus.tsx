import NavHeader from "@/components/dashboard/NavHeader";
import ConsensusProtocol from "@/components/dashboard/ConsensusProtocol";

const Consensus = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Extended DPoL Consensus Protocol</h1>
          <p className="text-sm text-muted-foreground">
            Cluster heads generate random values, compute the median, elect a proposer, and delegates vote to achieve consensus.
          </p>
        </div>

        <ConsensusProtocol />
      </div>
    </div>
  );
};

export default Consensus;
