import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import IoTNetwork from "./pages/IoTNetwork";
import Clustering from "./pages/Clustering";
import Consensus from "./pages/Consensus";
import EncryptionBlockchain from "./pages/EncryptionBlockchain";
import ResearchOverview from "./pages/ResearchOverview";
import Architecture from "./pages/Architecture";
import Methodology from "./pages/Methodology";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/iot-network" element={<IoTNetwork />} />
          <Route path="/clustering" element={<Clustering />} />
          <Route path="/consensus" element={<Consensus />} />
          <Route path="/encryption" element={<EncryptionBlockchain />} />
          <Route path="/research" element={<ResearchOverview />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
