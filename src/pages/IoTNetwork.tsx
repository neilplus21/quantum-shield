import NavHeader from "@/components/dashboard/NavHeader";
import ScatteredDevices from "@/components/dashboard/ScatteredDevices";
import NeighborDiscovery from "@/components/dashboard/NeighborDiscovery";

const IoTNetwork = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-foreground mb-1">IoT Network Layer</h1>
          <p className="text-sm text-muted-foreground">
            Scattered IoT devices broadcast signals and discover neighboring nodes to build a connectivity mesh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScatteredDevices />
          <NeighborDiscovery />
        </div>
      </div>
    </div>
  );
};

export default IoTNetwork;
