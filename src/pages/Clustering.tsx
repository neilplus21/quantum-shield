import NavHeader from "@/components/dashboard/NavHeader";
import ClusterHeadSelection from "@/components/dashboard/ClusterHeadSelection";
import DataAggregation from "@/components/dashboard/DataAggregation";

const Clustering = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Clustering & Data Aggregation</h1>
          <p className="text-sm text-muted-foreground">
            Cluster heads are selected using weighted score metrics, then aggregate sensor data from member nodes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClusterHeadSelection />
          <DataAggregation />
        </div>
      </div>
    </div>
  );
};

export default Clustering;
